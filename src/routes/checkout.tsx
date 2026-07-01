import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Section, Eyebrow } from "@/components/section";
import { useCart, formatPrice } from "@/lib/cart";
import { getStripe, getStripeEnvironment, isPaymentsConfigured } from "@/lib/stripe";
import { createCartCheckoutSession } from "@/lib/checkout.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — OfOurOwn" },
      { name: "description", content: "Complete your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotalCents, currency } = useCart();
  const navigate = useNavigate();
  const createSession = useServerFn(createCartCheckoutSession);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!items.length) return;
    if (!isPaymentsConfigured()) {
      setError("Payments are not configured for this build yet.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const returnUrl = `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`;
        const result = await createSession({
          data: {
            items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
            returnUrl,
            environment: getStripeEnvironment(),
          },
        });
        if (cancelled) return;
        if ("error" in result) setError(result.error);
        else if (result.clientSecret) setClientSecret(result.clientSecret);
        else setError("Could not start checkout.");
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not start checkout.");
      }
    })();
    return () => {
      cancelled = true;
    };
    // Recreate the session only when the cart contents change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => `${i.slug}:${i.quantity}`).join(",")]);

  if (!items.length) {
    return (
      <Section>
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow>Cart empty</Eyebrow>
          <h1 className="font-display text-4xl font-semibold">Nothing to check out.</h1>
          <p className="mt-6 text-muted-foreground">
            <Link to="/shop" className="underline">Browse the shop</Link>
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <aside>
          <Eyebrow>Order</Eyebrow>
          <h1 className="font-display text-3xl font-semibold">Your cart</h1>
          <ul className="mt-8 divide-y divide-border">
            {items.map((item) => (
              <li key={item.slug} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm tabular-nums">
                  {formatPrice((item.price_cents ?? 0) * item.quantity, item.currency)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotalCents, currency)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Shipping and tax calculated in checkout.
          </p>
          <Button
            onClick={() => navigate({ to: "/shop" })}
            variant="outline"
            className="mt-6 h-11 w-full rounded-none uppercase tracking-wider"
          >
            Keep shopping
          </Button>
        </aside>
        <div className="min-h-[600px] border border-border bg-background p-1">
          {error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Link to="/shop" className="mt-4 inline-block text-sm underline">
                Back to shop
              </Link>
            </div>
          ) : !clientSecret ? (
            <div className="flex h-full min-h-[600px] items-center justify-center text-sm text-muted-foreground">
              Preparing secure checkout…
            </div>
          ) : (
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </div>
    </Section>
  );
}