import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment, isPaymentsConfigured } from "@/lib/stripe";
import { createEliteMembershipCheckout } from "@/lib/checkout.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/elite/subscribe")({
  head: () => ({
    meta: [
      { title: "Join OOO Elite — $29.99/month" },
      { name: "description", content: "Complete your OOO Elite membership signup." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SubscribePage,
});

function SubscribePage() {
  const navigate = useNavigate();
  const createSession = useServerFn(createEliteMembershipCheckout);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPaymentsConfigured()) {
      setError("Payments are not configured for this build yet.");
      return;
    }
    let cancelled = false;
    (async () => {
      // Belt-and-suspenders: gate is already enforced by _authenticated layout,
      // but confirm we have a session before we call the server fn.
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/auth", search: { redirect: "/elite/subscribe" }, replace: true });
        return;
      }
      try {
        const result = await createSession({
          data: {
            returnUrl: `${window.location.origin}/elite/learn?welcome=1`,
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
    return () => { cancelled = true; };
  }, [createSession, navigate]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
        OOO Elite Membership
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
        $29.99 / month — all-access.
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Five pillars — Performance, Body, Mind, Wealth, Path. Cancel anytime.
      </p>

      <div className="mt-10 border border-border p-4 md:p-6">
        {error ? (
          <div className="space-y-3">
            <p className="text-sm text-red-600">{error}</p>
            <Link to="/elite" className="text-xs uppercase tracking-[0.2em] underline">
              ← Back to OOO Elite
            </Link>
          </div>
        ) : clientSecret ? (
          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <p className="text-sm text-muted-foreground">Preparing secure checkout…</p>
        )}
      </div>
    </div>
  );
}