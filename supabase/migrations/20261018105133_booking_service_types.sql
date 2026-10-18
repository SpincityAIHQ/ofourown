-- Match the existing booking form/server contract; no new service is introduced.
ALTER TABLE public.booking_requests
  DROP CONSTRAINT booking_requests_type_check,
  ADD CONSTRAINT booking_requests_type_check
    CHECK (type IN ('training', 'wellness', 'fst', 'coaching'));
