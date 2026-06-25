import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const inputSchema = z.object({ slug: z.string().trim().min(1).max(120) });

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
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      throw new Error("Checkout is not yet configured. Please try again soon.");
    }

    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const { data: product, error } = await supabase
      .from("products")
      .select("stripe_price_id, name")
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !product) throw new Error("Product not found.");
    if (!product.stripe_price_id) {
      throw new Error(`${product.name} is coming soon.`);
    }

    const siteUrl = process.env.SITE_URL ?? "https://bengordon.com";

    const body = new URLSearchParams({
      mode: "payment",
      "line_items[0][price]": product.stripe_price_id,
      "line_items[0][quantity]": "1",
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      "metadata[product_slug]": data.slug,
      allow_promotion_codes: "true",
      billing_address_collection: "auto",
    });

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[createCheckoutSession] stripe error", res.status, text);
      throw new Error("Could not start checkout. Please try again.");
    }

    const session = (await res.json()) as { id: string; url: string };
    return { url: session.url };
  });

export const createCartCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => cartInputSchema.parse(input))
  .handler(async ({ data }) => {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      throw new Error("Checkout is not yet configured. Please try again soon.");
    }

    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const slugs = data.items.map((i) => i.slug);
    const { data: products, error } = await supabase
      .from("products")
      .select("slug, name, stripe_price_id")
      .in("slug", slugs)
      .eq("is_active", true);

    if (error || !products?.length) throw new Error("Products not found.");

    const bySlug = new Map(products.map((p) => [p.slug, p]));
    const body = new URLSearchParams({ mode: "payment" });
    data.items.forEach((item, idx) => {
      const p = bySlug.get(item.slug);
      if (!p) throw new Error(`Product ${item.slug} not found.`);
      if (!p.stripe_price_id) throw new Error(`${p.name} is coming soon.`);
      body.append(`line_items[${idx}][price]`, p.stripe_price_id);
      body.append(`line_items[${idx}][quantity]`, String(item.quantity));
    });

    const siteUrl = process.env.SITE_URL ?? "https://bengordon.com";
    body.append("success_url", `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`);
    body.append("cancel_url", `${siteUrl}/cancel`);
    body.append("allow_promotion_codes", "true");
    body.append("billing_address_collection", "auto");

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[createCartCheckoutSession] stripe error", res.status, text);
      throw new Error("Could not start checkout. Please try again.");
    }

    const session = (await res.json()) as { id: string; url: string };
    return { url: session.url };
  });