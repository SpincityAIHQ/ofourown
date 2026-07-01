import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import {
  createStripeClient,
  getStripeErrorMessage,
  type StripeEnv,
} from "@/lib/stripe.server";

type CheckoutResult = { clientSecret: string } | { error: string };

const envSchema = z.enum(["sandbox", "live"]);

const singleInputSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  returnUrl: z.string().url(),
  environment: envSchema,
});

const cartInputSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().trim().min(1).max(120),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(50),
  returnUrl: z.string().url(),
  environment: envSchema,
});

const membershipInputSchema = z.object({
  returnUrl: z.string().url(),
  environment: envSchema,
});

function baseSlug(s: string) {
  return s.split("--")[0];
}

function getPublicSupabase() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => singleInputSchema.parse(input))
  .handler(async ({ data }): Promise<CheckoutResult> => {
    try {
      const supabase = getPublicSupabase();
      const { data: product, error } = await supabase
        .from("products")
        .select("slug, name, stripe_price_id")
        .eq("slug", baseSlug(data.slug))
        .eq("is_active", true)
        .maybeSingle();
      if (error || !product) return { error: "Product not found." };
      if (!product.stripe_price_id) return { error: `${product.name} is coming soon.` };

      const stripe = createStripeClient(data.environment);
      const prices = await stripe.prices.list({ lookup_keys: [product.stripe_price_id] });
      if (!prices.data.length) return { error: "Price not found in payment provider." };
      const price = prices.data[0];

      const variant = data.slug.includes("--") ? data.slug.split("--").slice(1).join("--") : "";

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: price.id, quantity: 1 }],
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        automatic_tax: { enabled: true },
        billing_address_collection: "auto",
        shipping_address_collection: { allowed_countries: ["US"] },
        payment_intent_data: { description: product.name },
        metadata: {
          product_slug: product.slug,
          ...(variant && { variant }),
        },
      } as Parameters<typeof stripe.checkout.sessions.create>[0]);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      console.error("[createCheckoutSession] error", error);
      return { error: getStripeErrorMessage(error) };
    }
  });

export const createCartCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => cartInputSchema.parse(input))
  .handler(async ({ data }): Promise<CheckoutResult> => {
    try {
      const supabase = getPublicSupabase();
      const baseSlugs = Array.from(new Set(data.items.map((i) => baseSlug(i.slug))));
      const { data: products, error } = await supabase
        .from("products")
        .select("slug, name, stripe_price_id")
        .in("slug", baseSlugs)
        .eq("is_active", true);
      if (error || !products?.length) return { error: "Products not found." };

      const bySlug = new Map(products.map((p) => [p.slug, p]));
      const lookupKeys = Array.from(
        new Set(products.map((p) => p.stripe_price_id).filter((x): x is string => !!x)),
      );
      if (!lookupKeys.length) return { error: "Prices not set up yet." };

      const stripe = createStripeClient(data.environment);
      const prices = await stripe.prices.list({ lookup_keys: lookupKeys });
      const priceByLookup = new Map(prices.data.map((p) => [p.lookup_key ?? "", p]));

      const lineItems: Array<{ price: string; quantity: number }> = [];
      const metadata: Record<string, string> = {};
      for (const [idx, item] of data.items.entries()) {
        const product = bySlug.get(baseSlug(item.slug));
        if (!product?.stripe_price_id) return { error: `${item.slug} is unavailable.` };
        const price = priceByLookup.get(product.stripe_price_id);
        if (!price) return { error: `Price for ${product.name} not found.` };
        lineItems.push({ price: price.id, quantity: item.quantity });
        if (item.slug.includes("--")) {
          metadata[`line_${idx}_variant`] = item.slug.split("--").slice(1).join("--");
          metadata[`line_${idx}_slug`] = product.slug;
        }
      }

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        automatic_tax: { enabled: true },
        billing_address_collection: "auto",
        shipping_address_collection: { allowed_countries: ["US"] },
        metadata,
      } as Parameters<typeof stripe.checkout.sessions.create>[0]);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      console.error("[createCartCheckoutSession] error", error);
      return { error: getStripeErrorMessage(error) };
    }
  });
const ELITE_PRICE_LOOKUP = "ooo_elite_monthly";

/**
 * Resolves or creates a Stripe Customer for this user (searchable by metadata.userId),
 * then opens an embedded Checkout Session in subscription mode for OOO Elite.
 * Requires the user to be signed in — subscriptions must belong to a real user.
 */
export const createEliteMembershipCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => membershipInputSchema.parse(input))
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    try {
      const { userId, claims } = context as { userId: string; claims: { email?: string } };
      if (!/^[a-zA-Z0-9_-]+$/.test(userId)) return { error: "Invalid session." };

      const stripe = createStripeClient(data.environment);

      const prices = await stripe.prices.list({ lookup_keys: [ELITE_PRICE_LOOKUP] });
      if (!prices.data.length) return { error: "Membership price not found." };
      const price = prices.data[0];

      // Resolve/create the Stripe Customer with metadata.userId so future lookups work.
      let customerId: string | undefined;
      const found = await stripe.customers.search({
        query: `metadata['userId']:'${userId}'`,
        limit: 1,
      });
      if (found.data.length) {
        customerId = found.data[0].id;
      } else if (claims?.email) {
        const existing = await stripe.customers.list({ email: claims.email, limit: 1 });
        if (existing.data.length) {
          customerId = existing.data[0].id;
          await stripe.customers.update(customerId, {
            metadata: { ...existing.data[0].metadata, userId },
          });
        }
      }
      if (!customerId) {
        const created = await stripe.customers.create({
          ...(claims?.email && { email: claims.email }),
          metadata: { userId },
        });
        customerId = created.id;
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        ui_mode: "embedded_page",
        line_items: [{ price: price.id, quantity: 1 }],
        customer: customerId,
        return_url: data.returnUrl,
        metadata: { userId, product_slug: "ooo_elite_membership" },
        subscription_data: { metadata: { userId } },
      } as Parameters<typeof stripe.checkout.sessions.create>[0]);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      console.error("[createEliteMembershipCheckout] error", error);
      return { error: getStripeErrorMessage(error) };
    }
  });
