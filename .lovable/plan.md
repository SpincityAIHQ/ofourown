
# BenGordon.com — Digital Hub Build Plan

A marketing + commerce hub for Benjamin Gordon. Backend uses **Lovable Cloud** (replaces the spec's own Supabase project) and **seamless Stripe Payments** (replaces BYO Stripe). Visual direction: minimal **black & white** editorial.

## Site map

- `/` — Home (hero, who-it's-for, offer cards, email capture, social proof)
- `/training` — 1:1 training offer + booking request form
- `/wellness` — Wellness offer + booking request form
- `/coaching` — Coaching offer + email capture / inquiry
- `/shop` — Product grid (Stripe-backed; "Coming soon" when no price linked)
- `/shop/$slug` — Product detail + Buy button (Stripe Checkout)
- `/about` — Bio
- `/contact` — Contact form (reason-tagged)
- `/success` — Post-checkout thank-you (reads `?session_id=`)
- `/cancel` — Checkout cancelled

Each route gets its own `head()` (title, description, og:title, og:description).

## Data model (Lovable Cloud / Postgres)

Tables, all with RLS, `public` grants per house rules:

- `leads` — id, email, source, utm fields, created_at. Insert: anon allowed. Select: authenticated admin only.
- `booking_requests` — id, type ('training'|'wellness'), name, email, phone, goals, preferred_time, notes, status, created_at. Insert: anon. Select: admin.
- `inquiries` — id, name, email, reason ('general'|'press'|'partnership'|'support'|'other'), message, status, created_at. Insert: anon. Select: admin.
- `products` — id, slug (unique), name, tagline, description, price_cents, currency, stripe_price_id (nullable → "Coming soon"), image_url, sort_order, is_active. Select: anon (active only). Write: admin.
- `orders` — id, stripe_session_id (unique), stripe_customer_id, email, product_id, amount_total, currency, status, raw jsonb, created_at. Writes by service role only (webhook). Select: admin / owner-by-email.
- `user_roles` + `app_role` enum + `has_role()` security-definer fn (per house rules) for the admin role.

## Server functions & routes (TanStack Start)

Replaces the spec's three Supabase edge functions:

- `src/lib/intake.functions.ts` — `submitLead`, `submitBooking`, `submitInquiry` (all `createServerFn`, Zod-validated, insert via publishable client; optional Resend notify + GHL forward inside handler).
- `src/lib/checkout.functions.ts` — `createCheckoutSession({ productSlug })`: looks up product, calls Stripe via the seamless integration helper, returns `{ url }`.
- `src/routes/api/public/stripe-webhook.ts` — server route. Verifies Stripe signature (raw body, timing-safe), handles `checkout.session.completed`, upserts into `orders`, sends confirmation email.
- `src/lib/products.functions.ts` — public read of active products for `/shop` and `/shop/$slug` (publishable key + narrow anon SELECT policy).

Secrets (added via `add_secret` after Stripe + integrations chosen): `STRIPE_WEBHOOK_SECRET`, plus optional `RESEND_API_KEY`, `NOTIFY_EMAIL`, `GHL_API_KEY`, `GHL_LOCATION_ID`, `SITE_URL`. Stripe secret key is managed by seamless Stripe — not a user-supplied secret.

## Frontend stack & design

- TanStack Start (existing), Tailwind v4, shadcn/ui, react-hook-form + Zod.
- Black & white tokens in `src/styles.css` (`--background` near-white / pure black for dark, foreground inverted; single accent = foreground). Type pair: Fraunces (display) + Inter (body) via `@fontsource`.
- Shared layout: thin top nav, generous whitespace, full-width hero with single oversized headline, hairline rules, no color accents.
- Forms: inline validation, optimistic submit, toast confirmation, server insert + optional email/GHL forward.

## Build order

1. **Foundation** — install fonts, set B&W tokens, build `__root.tsx` nav/footer, add `errorComponent`/`notFoundComponent` everywhere.
2. **Enable Lovable Cloud**, run migration (tables + RLS + grants + seed products + roles), generate typed client.
3. **Marketing pages** — Home, About, Coaching with their own `head()` and email-capture form wired to `submitLead`.
4. **Booking pages** — Training & Wellness with booking form → `submitBooking`. Contact page → `submitInquiry`.
5. **Commerce** — Enable seamless Stripe Payments. Build `/shop` + `/shop/$slug` from `products`. Implement `createCheckoutSession` and `/api/public/stripe-webhook`. Success/cancel pages.
6. **Polish & QA** — SEO meta on every route, sitemap, 404, lead/booking/inquiry/checkout end-to-end test, admin role seed.

## Out of scope (per your package)

Skool, funnels, email automation, AI features, social, CTV — separate workstreams.

## Open items I'll need from you during build

- Real copy for hero, bio, and each offer (placeholder lorem until you replace).
- Stripe product details (name, price, description, image) when we hit Phase 5 — I'll create them via Stripe and link `stripe_price_id` in `products`.
- Your admin email so I can grant the `admin` role for viewing leads/bookings/inquiries.
