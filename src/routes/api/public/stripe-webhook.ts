import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

function verifyStripeSignature(payload: string, header: string, secret: string): boolean {
  // header is e.g. "t=12345,v1=hex,v1=hex"
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const [k, ...rest] = kv.split("=");
      return [k, rest.join("=")];
    }),
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;
  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", secret).update(signedPayload).digest("hex");
  const sig = Buffer.from(signature, "hex");
  const exp = Buffer.from(expected, "hex");
  if (sig.length !== exp.length) return false;
  return timingSafeEqual(sig, exp);
}

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret) {
          return new Response("Webhook secret not configured", { status: 500 });
        }
        const sigHeader = request.headers.get("stripe-signature");
        if (!sigHeader) return new Response("Missing signature", { status: 401 });

        const rawBody = await request.text();
        if (!verifyStripeSignature(rawBody, sigHeader, secret)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: { type: string; data: { object: Record<string, unknown> } };
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response("Bad JSON", { status: 400 });
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
            raw: session as unknown as Record<string, unknown>,
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