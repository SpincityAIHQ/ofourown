import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function getServerClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_cents: number | null;
  currency: string;
  stripe_price_id: string | null;
  image_url: string | null;
  sort_order: number;
};

const COLUMNS =
  "id, slug, name, tagline, description, price_cents, currency, stripe_price_id, image_url, sort_order";

export const listProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => {
    const supabase = getServerClient();
    const { data, error } = await supabase
      .from("products")
      .select(COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[listProducts]", error);
      return [];
    }
    return (data ?? []) as Product[];
  },
);

const slugSchema = z.object({ slug: z.string().trim().min(1).max(120) });

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data }): Promise<Product | null> => {
    const supabase = getServerClient();
    const { data: row, error } = await supabase
      .from("products")
      .select(COLUMNS)
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) {
      console.error("[getProductBySlug]", error);
      return null;
    }
    return (row as Product | null) ?? null;
  });