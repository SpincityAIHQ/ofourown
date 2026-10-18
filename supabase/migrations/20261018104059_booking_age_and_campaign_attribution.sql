-- Nullable additions preserve existing requests and the previously deployed form.
ALTER TABLE public.booking_requests
  ADD COLUMN athlete_age_band text,
  ADD COLUMN utm_source text,
  ADD COLUMN utm_medium text,
  ADD COLUMN utm_campaign text,
  ADD COLUMN utm_term text,
  ADD COLUMN utm_content text,
  ADD COLUMN landing_path text,
  ADD CONSTRAINT booking_requests_age_band_check
    CHECK (athlete_age_band IS NULL OR athlete_age_band IN ('8-9', '10-13', '14-17', '18+')),
  ADD CONSTRAINT booking_requests_campaign_length_check
    CHECK (
      coalesce(length(utm_source), 0) <= 120 AND
      coalesce(length(utm_medium), 0) <= 120 AND
      coalesce(length(utm_campaign), 0) <= 120 AND
      coalesce(length(utm_term), 0) <= 120 AND
      coalesce(length(utm_content), 0) <= 120 AND
      (landing_path IS NULL OR (landing_path LIKE '/%' AND length(landing_path) <= 300))
    );

COMMENT ON COLUMN public.booking_requests.athlete_age_band IS 'Broad athlete age group; no date of birth is collected.';
COMMENT ON COLUMN public.booking_requests.landing_path IS 'Campaign landing pathname only; no query string or referrer.';
