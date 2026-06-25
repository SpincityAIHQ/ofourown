import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProductBySlug } from "@/lib/products.functions";
import { Section, Eyebrow } from "@/components/section";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Ben Gordon, NBA legend | OfOurOwn` },
          { name: "description", content: loaderData.tagline ?? loaderData.description ?? "" },
          { property: "og:title", content: `${loaderData.name} — Ben Gordon, NBA legend` },
          { property: "og:description", content: loaderData.tagline ?? "" },
          ...(loaderData.image_url ? [{ property: "og:image", content: loaderData.image_url } as const] : []),
        ]
      : [{ title: "Product — Ben Gordon, NBA legend | OfOurOwn" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <Section>
      <h1 className="font-display text-4xl font-semibold">Product not found.</h1>
      <p className="mt-4 text-muted-foreground">
        <Link to="/shop" className="underline">Back to the shop</Link>
      </p>
    </Section>
  ),
});

function formatPrice(cents: number | null, currency: string) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { add } = useCart();

  if (!product) return null;

  function addToCart() {
    if (!product) return;
    add({
      slug: product.slug,
      name: product.name,
      price_cents: product.price_cents,
      currency: product.currency,
      image_url: product.image_url,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <Section>
      <div className="grid gap-12 md:grid-cols-2">
        <div className="aspect-square w-full border border-border bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.tagline ? `${product.name} — ${product.tagline}` : `${product.name} from the OfOurOwn shop`}
              title={product.name}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <Eyebrow>Ben Gordon · NBA legend</Eyebrow>
          <h1 className="font-display text-5xl font-semibold">{product.name}</h1>
          {product.tagline ? (
            <p className="mt-3 text-lg text-muted-foreground">{product.tagline}</p>
          ) : null}
          <p className="mt-8 text-3xl font-medium">
            {formatPrice(product.price_cents, product.currency)}
          </p>
          {product.description ? (
            <p className="mt-6 whitespace-pre-wrap leading-relaxed">{product.description}</p>
          ) : null}
          <div className="mt-10">
            {product.stripe_price_id ? (
              <Button
                onClick={addToCart}
                className="h-12 rounded-none px-8 uppercase tracking-wider"
              >
                Add to cart
              </Button>
            ) : (
              <Button disabled className="h-12 rounded-none px-8 uppercase tracking-wider">
                Coming soon
              </Button>
            )}
          </div>
          <p className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">
            <Link to="/shop" className="underline">← Back to shop</Link>
          </p>
        </div>
      </div>
    </Section>
  );
}