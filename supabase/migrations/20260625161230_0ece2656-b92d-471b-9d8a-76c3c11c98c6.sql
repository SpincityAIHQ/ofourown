CREATE TABLE public.speaking_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  organization text,
  engagement_type text,
  event_date text,
  audience_size text,
  budget_range text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.speaking_inquiries TO anon, authenticated;
GRANT ALL ON public.speaking_inquiries TO service_role;
ALTER TABLE public.speaking_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a speaking inquiry" ON public.speaking_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Deny client reads" ON public.speaking_inquiries
  FOR SELECT TO anon, authenticated USING (false);
CREATE INDEX speaking_inquiries_created_at_idx ON public.speaking_inquiries (created_at DESC);