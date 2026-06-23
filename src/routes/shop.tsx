import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listProducts } from "@/lib/products.functions";
import {
  VSLHero,
  FunnelSection,
  FunnelGate,
  BulletList,
} from "@/components/vsl-funnel";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Ben Gordon, NBA legend | OfOurOwn.com" },
      { name: "description", content: "Programs, guides, and tools from Ben Gordon, NBA legend." },
      { property: "og:title", content: "Shop — Ben Gordon, NBA legend" },
      { property: "og:description", content: "Programs, guides, and tools from Ben Gordon." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: ShopPage,
});

function formatPrice(cents: number | null, currency: string) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function ShopPage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  return (
    <>
      <VSLHero
        eyebrow="Shop"
        headline="Run Ben Gordon's playbook on your own."
        subhead="Programs, guides, and tools used with private clients — packaged so you can run them solo, on your schedule."
        nextLabel="See what's inside"
      />

      <FunnelSection
        id="problem"
        step="01"
        eyebrow="The Problem"
        title="You don't need more information. You need a playbook."
        nextHref="#solution"
        nextLabel="See the fix"
      >
        <p>
          The internet has buried you in routines, splits, and protocols.
          None of it is structured, sequenced, or tested against real life.
          You bounce between programs and lose the compounding.
        </p>
      </FunnelSection>

      <FunnelSection
        id="solution"
        step="02"
        eyebrow="The Solution"
        title="Programs built in the room, packaged for the road."
        nextHref="#proof"
        nextLabel="See the proof"
        tone="invert"
      >
        <BulletList
          items={[
            "Programmed week-by-week — no guessing what's next",
            "Built from work done with private clients",
            "Designed to run on your schedule, your equipment, your life",
            "Updated as Ben learns more in the room",
          ]}
        />
      </FunnelSection>

      <FunnelSection
        id="proof"
        step="03"
        eyebrow="The Proof"
        title="The same frameworks Ben uses 1:1."
        nextHref="#offer"
        nextLabel="See the catalog"
      >
        <p>
          These aren't repackaged content. They're the actual playbooks Ben
          runs with paying clients — minus the personalized week-to-week
          adjustments, plus enough structure to run them solo.
        </p>
      </FunnelSection>

      <FunnelSection
        id="offer"
        step="04"
        eyebrow="The Catalog"
        title="Pick your starting point."
        nextHref="#cta"
        nextLabel="Unlock the shop"
      >
        {products.length === 0 ? (
          <p className="text-muted-foreground">New products coming soon.</p>
        ) : (
          <div className="-mx-2 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.id}
                to="/shop/$slug"
                params={{ slug: p.slug }}
                className="group flex flex-col gap-6 bg-background p-8 transition hover:bg-accent"
              >
                <div className="aspect-square w-full border border-border bg-muted">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                  {p.tagline ? (
                    <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                  ) : null}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm">{formatPrice(p.price_cents, p.currency)}</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {p.stripe_price_id ? "View" : "Coming soon"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </FunnelSection>

      <FunnelGate
        id="cta"
        source="shop_funnel"
        eyebrow="Step 05 — Get the drops"
        title="Save 10% on your first program."
        pitch="Drop your email — we send a one-time discount code plus first access when new programs ship."
        ctaLabel="Send my code"
      >
        <p className="text-base">
          You're on the list. Browse the catalog above and use the code we
          just emailed you at checkout.
        </p>
      </FunnelGate>
    </>
  );
}