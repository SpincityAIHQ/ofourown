
-- Explicit deny-SELECT policies for sensitive tables. service_role bypasses RLS.
CREATE POLICY "Deny client reads" ON public.booking_requests FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "Deny client reads" ON public.inquiries FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "Deny client reads" ON public.leads FOR SELECT TO anon, authenticated USING (false);

-- orders table: also lock down all client mutations; only service role (Stripe webhook) writes.
CREATE POLICY "Deny client reads" ON public.orders FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "Deny client inserts" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "Deny client updates" ON public.orders FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny client deletes" ON public.orders FOR DELETE TO anon, authenticated USING (false);
