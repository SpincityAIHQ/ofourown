
-- ============ LEADS ============
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);

-- ============ BOOKING REQUESTS ============
CREATE TABLE public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('training','wellness')),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  goals text,
  preferred_time text,
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.booking_requests TO anon, authenticated;
GRANT ALL ON public.booking_requests TO service_role;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request a booking" ON public.booking_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE INDEX booking_requests_created_at_idx ON public.booking_requests (created_at DESC);

-- ============ INQUIRIES ============
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  reason text NOT NULL DEFAULT 'general'
    CHECK (reason IN ('general','press','partnership','support','other')),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE INDEX inquiries_created_at_idx ON public.inquiries (created_at DESC);

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text,
  price_cents integer,
  currency text NOT NULL DEFAULT 'usd',
  stripe_price_id text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active products are public" ON public.products
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE INDEX products_active_sort_idx ON public.products (is_active, sort_order);

-- ============ ORDERS ============
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text NOT NULL UNIQUE,
  stripe_customer_id text,
  email text,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  amount_total integer,
  currency text,
  status text NOT NULL DEFAULT 'paid',
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- no anon/authenticated policies: orders are managed entirely by the webhook (service_role)
CREATE INDEX orders_created_at_idx ON public.orders (created_at DESC);

-- ============ updated_at trigger for products ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Seed placeholder products ============
INSERT INTO public.products (slug, name, tagline, description, price_cents, sort_order, is_active) VALUES
  ('training-program', 'Signature Training Program', '12-week strength + conditioning', 'A complete 12-week program combining strength, conditioning, and recovery protocols developed by Ben.', 19900, 1, true),
  ('wellness-guide', 'Wellness Protocol Guide', 'Daily habits for sustainable performance', 'Ben''s personal stack of nutrition, sleep, and recovery practices, formatted as a downloadable PDF.', 4900, 2, true),
  ('coaching-call', '1:1 Strategy Call', '45-minute private session with Ben', 'A focused private session to map your training, recovery, and lifestyle goals.', 29900, 3, true);
