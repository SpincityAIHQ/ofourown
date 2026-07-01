# Launch & Monetize Plan

Site is built. To flip it live and start making money, we need three things: **payments live, traffic in, leads out**. Here's the order.

## Phase 1 — Money can actually move (Day 1)

1. **Enable Stripe payments (seamless)**
   - Currently `checkout.functions.ts` exists but no live Stripe connection is wired through Lovable's built-in payments.
   - Run `enable_stripe_payments` → user completes the short form (email, business name).
   - Test mode works instantly; live mode after account claim.

2. **Load real products into Stripe**
   - Push the 9 merch SKUs (jerseys, tracksuits, hoodies, fleeces, sweatsuit) from the DB into Stripe with correct prices + size variants.
   - Add the Book ($TBD), Manuals, Supplements as products.
   - Wire checkout button on `/shop/$slug` to real Stripe price IDs.

3. **Verify the webhook**
   - `src/routes/api/public/stripe-webhook.ts` → confirm `orders` table writes on `checkout.session.completed`.
   - Test end-to-end with a $1 product in test mode.

4. **Publish the site**
   - Deploy to `oooelitebasketballtraining.com`.
   - Confirm all forms hit the DB + email `ooollc@icloud.com`.

## Phase 2 — Turn on the front door (Week 1)

5. **SEO scan + fixes**
   - Run SEO review, fix findings (titles, meta, sitemap, schema.org LocalBusiness + Person for Ben).
   - Submit sitemap to Google Search Console.

6. **Analytics + pixels**
   - GA4 + Meta Pixel + TikTok Pixel on all routes.
   - Track: lead form submit, booking submit, add-to-cart, purchase.

7. **Lead magnet on `/`**
   - Free "3 Guard Finishing Drills" PDF → email capture → auto-adds to `leads` → triggers welcome email + GHL sync.
   - This is the top of every funnel.

## Phase 3 — First dollars in (Week 2)

8. **Launch the two highest-margin offers first**
   - **$250/hr Training** (Chicago local) → Google Search + Meta local radius ads.
   - **Merch drop** → IG/TikTok organic + $30/day Meta Advantage+ Shopping.
   - Skip Speaking ads (inbound only, PR-driven).

9. **Booking confirmation → payment link**
   - When a training booking is approved, auto-send a Stripe payment link for the deposit. Right now bookings notify Ben but don't collect money.

10. **FST prepay flow**
    - Add "Book & Pay" buttons on `/fst` (30/60/90/+30 min) → Stripe checkout → confirmed slot.
    - Highest-conversion offer because it's transactional, not application-gated.

## Phase 4 — Compound (Weeks 3–4)

11. **Email nurture** — 5-email welcome sequence for new leads (already have infra).
12. **Testimonials capture** — post-service email asking for a video review, feeds `/proof` and ad creative.
13. **Retargeting** — Meta + Google retarget everyone who hit a funnel but didn't convert.

## What I need from you to start

Pick which of these I do **right now**:
- **A.** Enable Stripe + wire real checkout on merch (fastest path to revenue).
- **B.** SEO pass + publish + analytics (fastest path to traffic).
- **C.** Lead magnet + email nurture (fastest path to a list).
- **D.** All three in order (A → B → C), one plan per phase.

Also need from you (I can't do these):
- Confirm Stripe business details (email, legal name) when the form pops up.
- The lead-magnet PDF file (or approve me generating a placeholder).
- Ad budget/month so I size the campaigns correctly.
