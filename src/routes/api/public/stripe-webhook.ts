import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhook, type StripeEnv } from "@/lib/stripe.server";
import { sendInternalTransactionalEmail } from "@/lib/email/send-internal.server";

// Product base slugs (before any `--variant` suffix) that represent 1:1
// services rather than shippable merch. Paid service purchases also file a
// booking_request so Ben can follow up to schedule.
const SERVICE_SLUGS = new Set(["coaching-call"]);

type StripeSubscription = {
  id: string;
  customer: string;
  status: string;
  cancel_at_period_end?: boolean;
  current_period_start?: number | null;
  current_period_end?: number | null;
  metadata?: { userId?: string } | null;
  items?: {
    data?: Array<{
      current_period_start?: number | null;
      current_period_end?: number | null;
      price?: {
        id?: string;
        lookup_key?: string | null;
        product?: string;
        metadata?: { lovable_external_id?: string } | null;
      };
    }>;
  };
};

async function handleSubscription(
  type: string,
  subRaw: Record<string, unknown>,
  env: StripeEnv,
) {
  const sub = subRaw as unknown as StripeSubscription;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  if (type === "customer.subscription.deleted") {
    await supabaseAdmin
      .from("subscriptions")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("stripe_subscription_id", sub.id)
      .eq("environment", env);
    return;
  }

  const userId = sub.metadata?.userId;
  if (!userId) {
    console.error("[stripe-webhook] subscription without userId metadata", sub.id);
    return;
  }

  const item = sub.items?.data?.[0];
  const priceId =
    item?.price?.lookup_key ||
    item?.price?.metadata?.lovable_external_id ||
    item?.price?.id ||
    "";
  const productId = (item?.price?.product as string) || "";
  const periodStart = item?.current_period_start ?? sub.current_period_start ?? null;
  const periodEnd = item?.current_period_end ?? sub.current_period_end ?? null;

  const row = {
    user_id: userId,
    stripe_subscription_id: sub.id,
    stripe_customer_id: sub.customer,
    product_id: productId,
    price_id: priceId,
    status: sub.status,
    current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
    environment: env,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(row, { onConflict: "stripe_subscription_id" });
  if (error) console.error("[stripe-webhook] subscription upsert error", error);
}

function formatMoney(
  amountCents: number | null | undefined,
  currency: string | null | undefined,
): string | undefined {
  if (amountCents == null) return undefined;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency ?? "usd").toUpperCase(),
    }).format(amountCents / 100);
  } catch {
    return `$${(amountCents / 100).toFixed(2)}`;
  }
}

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const envParam = (url.searchParams.get("env") ?? "sandbox") as StripeEnv;
        const env: StripeEnv = envParam === "live" ? "live" : "sandbox";

        let event: { type: string; data: { object: Record<string, unknown> } };
        try {
          event = await verifyWebhook(request, env);
        } catch (err) {
          console.error("[stripe-webhook] verify failed", err);
          return new Response("Invalid signature", { status: 401 });
        }

        if (event.type !== "checkout.session.completed") {
          if (
            event.type === "customer.subscription.created" ||
            event.type === "customer.subscription.updated" ||
            event.type === "customer.subscription.deleted"
          ) {
            await handleSubscription(event.type, event.data.object, env);
            return new Response("ok", { status: 200 });
          }
          return new Response("ignored", { status: 200 });
        }

        const session = event.data.object as {
          id: string;
          customer?: string | null;
          customer_details?: { email?: string; name?: string } | null;
          customer_email?: string | null;
          amount_total?: number | null;
          currency?: string | null;
          metadata?: { product_slug?: string } | null;
        };

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        let productId: string | null = null;
        let productName: string | null = null;
        const slug = session.metadata?.product_slug;
        const baseSlug = slug ? slug.split("--")[0] : null;
        if (slug) {
          const { data: p } = await supabaseAdmin
            .from("products")
            .select("id, name")
            .eq("slug", baseSlug ?? slug)
            .maybeSingle();
          productId = p?.id ?? null;
          productName = p?.name ?? null;
        }

        const customerEmail =
          session.customer_details?.email ?? session.customer_email ?? null;
        const customerName = session.customer_details?.name ?? "Athlete";

        const { error } = await supabaseAdmin.from("orders").upsert(
          {
            stripe_session_id: session.id,
            stripe_customer_id: session.customer ?? null,
            email: customerEmail,
            product_id: productId,
            amount_total: session.amount_total ?? null,
            currency: session.currency ?? null,
            status: "paid",
            raw: JSON.parse(JSON.stringify(session)),
          },
          { onConflict: "stripe_session_id" },
        );

        if (error) {
          console.error("[stripe-webhook] insert error", error);
          return new Response("DB error", { status: 500 });
        }

        const isService = !!baseSlug && SERVICE_SLUGS.has(baseSlug);

        if (isService && customerEmail) {
          const { error: bookingError } = await supabaseAdmin
            .from("booking_requests")
            .insert({
              type: baseSlug ?? "coaching",
              name: customerName,
              email: customerEmail,
              notes: `Paid via Stripe. Product: ${productName ?? slug}. Session: ${session.id}`,
              status: "paid",
            });
          if (bookingError) {
            console.error("[stripe-webhook] booking insert error", bookingError);
          }

          const notifyEmail = process.env.NOTIFY_EMAIL;
          if (notifyEmail) {
            try {
              await sendInternalTransactionalEmail({
                templateName: "booking-confirmation",
                recipientEmail: notifyEmail,
                templateData: {
                  type: baseSlug ?? "coaching",
                  name: customerName,
                  email: customerEmail,
                  notes: `PAID · ${formatMoney(session.amount_total, session.currency) ?? ""} · ${productName ?? slug}`,
                  submittedAt: new Date().toUTCString(),
                },
                idempotencyKey: `booking-${session.id}`,
              });
            } catch (e) {
              console.error("[stripe-webhook] notify email failed", e);
            }
          }
        }

        if (customerEmail) {
          try {
            await sendInternalTransactionalEmail({
              templateName: "order-confirmation",
              recipientEmail: customerEmail,
              templateData: {
                customerName,
                productName: productName ?? "your order",
                amountFormatted: formatMoney(session.amount_total, session.currency),
                orderId: session.id,
                isService,
              },
              idempotencyKey: `order-${session.id}`,
            });
          } catch (e) {
            console.error("[stripe-webhook] customer email failed", e);
          }
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});