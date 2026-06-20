import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listProducts } from "@/lib/products.functions";
import { PageHero, Section } from "@/components/section";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Ben Gordon" },
      { name: "description", content: "Programs, guides, and tools from Ben Gordon's private practice." },
      { property: "og:title", content: "Shop — Ben Gordon" },
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
      <PageHero
        eyebrow="Shop"
        title="Tools of the trade."
        lede="Programs, guides, and tools Ben uses with private clients — packaged for you to run on your own."
      />
      <Section>
        {products.length === 0 ? (
          <p className="text-muted-foreground">New products coming soon.</p>
        ) : (
          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
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
      </Section>
    </>
  );
}