## Goal
Every offer page (Training, Wellness, FST, Coaching, Speaking, plus existing Shop items) has a price and a Buy button that takes the visitor straight to Stripe Checkout. No more booking-only services.

## Step 1 — Enable seamless Stripe
Call `enable_stripe_payments`. This sets up test-mode Stripe instantly (no account or API key needed). Live payments come later once you verify.

## Step 2 — Create products for each offer
Using the built-in product tool, create a Stripe + DB record for each service:

| Slug | Offer | Suggested price (editable) |
|---|---|---|
| `training-session` | 1-on-1 Elite Training | $X |
| `wellness-session` | Wellness Session | $X |
| `fst-session` | Fascia Stretch Therapy | $X |
| `coaching-program` | Coaching Program | $X |
| `speaking-engagement` | Speaking — deposit/booking fee | $X |

You'll be prompted for the actual prices when we create them. Each gets a `stripe_price_id` and lands in the existing `products` table, so the same checkout pipeline already used by the Shop handles them.

## Step 3 — Add inline Buy buttons to each offer page
On `/training`, `/wellness`, `/fst`, `/coaching`, `/speaking`:

- Keep the current VSL funnel layout (hero, problem/solution/proof).
- Replace the booking-form gate at the bottom with a **Price + "Buy now"** block that calls the existing `createCheckoutSession({ slug })` server function and redirects to Stripe.
- Keep a small secondary link: *"Have questions first? Contact Ben"* → `/contact`. (Booking forms move to post-purchase: after Stripe success, the `/success` page collects scheduling info via the existing booking form, tagged to the order.)

For Speaking, the Buy button reserves an engagement slot (deposit); the full speaking inquiry form still shows post-purchase on `/success`.

## Step 4 — Post-purchase scheduling on `/success`
Update `/success` to:
- Read `session_id` from the URL.
- Show "Payment received" + the matching offer name.
- Render the appropriate booking form (training/wellness/fst/coaching) or speaking form, pre-filled with the Stripe email, so the buyer can pick a time immediately.

## Step 5 — Shop unchanged
Shop products keep the cart flow. Services bypass the cart (single-item buy) since they're one-at-a-time bookings.

## Technical notes
- Reuses existing `createCheckoutSession` server fn, `products` table, and `stripe-webhook` route — no new infra.
- New small component `BuyButton` in `src/components/buy-button.tsx` (price + CTA), used by every offer page.
- `/success` extended to fetch order by `session_id` (new lightweight server fn returning offer slug + email) and conditionally render the right booking form.
- No schema changes required. Optionally add a `booking_requests.order_id` column later to link bookings to paid orders.

## What I need from you before building
1. Confirm I should call `enable_stripe_payments` now.
2. Prices for each of the 5 services (or say "use placeholders $X and I'll edit later").