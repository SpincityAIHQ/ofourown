import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listProducts } from "@/lib/products.functions";
import { Section, Eyebrow } from "@/components/section";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Ben Gordon, NBA Veteran | OfOurOwn" },
      { name: "description", content: "Programs, guides, and tools from Ben Gordon, NBA Veteran." },
      { property: "og:title", content: "Shop — Ben Gordon, NBA Veteran" },
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
  const { add } = useCart();
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>Shop</Eyebrow>
        <h1 className="font-display text-4xl font-semibold leading-[1.05] md:text-6xl">
          Books, merch, and programs.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Pick something up — signed books, training merch, and the playbooks
          Ben Gordon runs with private clients.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-muted-foreground">New products coming soon.</p>
      ) : (
        <div className="mt-12 -mx-2 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="flex flex-col gap-6 bg-background p-6">
              <Link
                to="/shop/$slug"
                params={{ slug: p.slug }}
                className="group block"
              >
                <div className="aspect-square w-full border border-border bg-muted">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.tagline ? `${p.name} — ${p.tagline}` : `${p.name} from the OfOurOwn shop`}
                      title={p.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition group-hover:opacity-90"
                    />
                  ) : null}
                </div>
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to="/shop/$slug" params={{ slug: p.slug }}>
                  <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                </Link>
                {p.tagline ? (
                  <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                ) : null}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm">{formatPrice(p.price_cents, p.currency)}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  {p.stripe_price_id ? (
                    <Button
                      onClick={() => {
                        add({
                          slug: p.slug,
                          name: p.name,
                          price_cents: p.price_cents,
                          currency: p.currency,
                          image_url: p.image_url,
                        });
                        toast.success(`${p.name} added to cart`);
                      }}
                      className="h-10 flex-1 rounded-none text-xs uppercase tracking-wider"
                    >
                      Add to cart
                    </Button>
                  ) : (
                    <Button disabled className="h-10 flex-1 rounded-none text-xs uppercase tracking-wider">
                      Coming soon
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}