import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { FadeIn } from "@/components/media";
import { listProducts } from "@/lib/products.functions";

const MERCH_SLUGS = new Set([
  "ooo-jersey-8",
  "ooo-tracksuit-ivory",
  "ooo-track-jacket-onyx",
  "ooo-hoodie-black-ivory",
  "ooo-hoodie-ivory-black",
  "ooo-hoodie-split-hood",
  "ooo-fleece-track-jacket",
  "ooo-fleece-snap-pullover",
  "ooo-zip-sweatsuit-black",
]);

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

function formatPrice(cents: number | null, currency: string) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merch — OfOurOwn | Ben Gordon, NBA Veteran" },
      { name: "description", content: "Apparel and goods from OfOurOwn — Ben Gordon, NBA Veteran." },
      { property: "og:title", content: "Merch — OfOurOwn" },
      { property: "og:description", content: "Apparel and goods from OfOurOwn." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: MerchPage,
});

function MerchPage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const merch = products.filter((p) => MERCH_SLUGS.has(p.slug));
  return (
    <>
      <PageHero
        eyebrow="Merch"
        title="Wear the work."
        lede="Apparel and goods from OfOurOwn — quiet, well-made, built for everyday."
      />
      <Section className="border-b border-border">
        {merch.length === 0 ? (
          <p className="text-muted-foreground">New pieces coming soon.</p>
        ) : (
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {merch.map((p, i) => (
              <FadeIn key={p.id} delay={(i % 3) * 0.04} className="bg-background">
                <Link
                  to="/shop/$slug"
                  params={{ slug: p.slug }}
                  className="group flex h-full flex-col gap-4 p-6"
                >
                  <div className="aspect-square w-full overflow-hidden border border-border bg-muted">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.tagline ? `${p.name} — ${p.tagline}` : p.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition group-hover:opacity-90"
                      />
                    ) : null}
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-xl font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(p.price_cents, p.currency)}</p>
                  </div>
                  {p.tagline ? (
                    <p className="text-sm text-muted-foreground">{p.tagline}</p>
                  ) : null}
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </Section>
      <Section>
        <FadeIn>
          <Eyebrow>Buy</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Pieces ship from the shop.</h2>
          <div className="mt-8">
            <Link to="/shop" className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90">
              Visit the shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}