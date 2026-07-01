import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhook, type StripeEnv } from "@/lib/stripe.server";

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
          return new Response("ignored", { status: 200 });
        }

        const session = event.data.object as {
          id: string;
          customer?: string | null;
          customer_details?: { email?: string } | null;
          customer_email?: string | null;
          amount_total?: number | null;
          currency?: string | null;
          metadata?: { product_slug?: string } | null;
        };

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        let productId: string | null = null;
        const slug = session.metadata?.product_slug;
        if (slug) {
          const { data: p } = await supabaseAdmin
            .from("products")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();
          productId = p?.id ?? null;
        }

        const { error } = await supabaseAdmin.from("orders").upsert(
          {
            stripe_session_id: session.id,
            stripe_customer_id: session.customer ?? null,
            email: session.customer_details?.email ?? session.customer_email ?? null,
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

        return new Response("ok", { status: 200 });
      },
    },
  },
});