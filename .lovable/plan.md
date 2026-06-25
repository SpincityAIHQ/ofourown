
## Ground rule

**Add-on only. No rebuilds.** Existing pages (`/`, `/training`, `/wellness`, `/coaching`, `/shop`, `/shop/$slug`, `/about`, `/contact`, `/success`, `/cancel`), existing components (`VSLHero`, `FunnelSection`, `FunnelGate`, `BulletList`, `PageHero`/`Section`/`Eyebrow`, `BookingForm`, `EmailCapture`, `ContactForm`, `CartButton`, `CartDrawer`, `ChatWidget`, `SiteHeader`, `SiteFooter`), the cart, Stripe checkout, Stripe webhook, intake server functions, AI chat, and DB schema all stay as-is unless a step explicitly says "insert" or "extend".

Every video/image/link is a labeled `MediaSlot` / `VideoEmbed` / `TODO` placeholder so you can drop content in later. No real URLs invented.

---

## Step 1 — Add shared building blocks (new file)

Create `src/components/media.tsx`:
- `MediaSlot({ label, aspect, src?, alt? })` — image when `src`; otherwise labeled aspect placeholder (`border border-border bg-muted rounded-none`, centered uppercase muted label). Aspects: `16:9 | 1:1 | 4:3 | 3:4`.
- `VideoEmbed({ label, url? })` — responsive 16:9 YouTube/Vimeo iframe when `url`; otherwise placeholder labeled `VIDEO · paste YouTube or Vimeo URL`.
- `Stat({ value, label })` — Fraunces number + small uppercase label.
- `TestimonialRow({ items? })` — 2–3 placeholder quote cards clearly marked as placeholders.
- `ConfirmNote({ items })` — muted "Confirm before publish" bullets used at page bottoms.
- `FadeIn` — Framer Motion section fade-in wrapper.

If `framer-motion` isn't installed, `bun add framer-motion`. No other deps.

## Step 2 — Insert into Home + extend About (no rebuild)

**`src/routes/index.tsx`** — insert one new block between hero/CTA and the existing email capture:
- `<VideoEmbed label="HIGHLIGHT REEL · paste YouTube/Vimeo URL" />`
- Accolades `<Stat>` bar (horizontal desktop, 2-col mobile):
  - `1` — Only rookie ever to win NBA Sixth Man of the Year
  - `#3` — Overall pick, 2004 NBA Draft
  - `2004` — NCAA National Champion (UConn)
  - `11` — Seasons in the NBA
  - `14.9` — Career points per game
- Short "About Ben" teaser (2–3 sentences) + button → `/about`.
- Existing copy, hero CTAs, and email capture stay untouched.

**`src/routes/about.tsx`** — append below current content (do not delete what's there):
- Career-highlights grid: 4–6 `<MediaSlot aspect="4:3" label="Career photo · 4:3" />`
- "Beyond the game" teaser (2–3 sentences) + button → `/advocacy`
- `<VideoEmbed label="INTERVIEW / STORY VIDEO · paste URL" />`
- `<TestimonialRow />` (placeholders)
- Primary CTA button → `/training`
- `<ConfirmNote items={["Final bio wording approved by Ben"]} />`

## Step 3 — Speaking vertical (new only)

- Migration `supabase/migrations/<ts>_speaking_inquiries.sql`: `public.speaking_inquiries` (id, created_at, name, email, organization, engagement_type, event_date, audience_size, budget_range, message) with the same RLS+GRANT pattern as `booking_requests` (anon insert; deny client SELECT; service_role full; created_at desc index). Types regenerate.
- Add `submitSpeakingInquiry` to existing `src/lib/intake.functions.ts` (do not touch existing handlers), modeled on `submitBooking` (zod → insert → reuse existing `notify()` + `forwardToGhl()` helpers).
- New `src/components/speaking-inquiry-form.tsx` (modeled on `booking-form.tsx`). Fields: name*, email*, organization, engagement_type (Keynote / Team / College / Corporate / Men's Group / Youth / Advisory / Other), event_date, audience_size, budget_range, message.
- New `src/routes/speaking.tsx` in VSL style — Hero "I almost didn't make it back." with `<VideoEmbed label="SPEAKING REEL · paste URL" />`, Problem, The Keynote (six named frameworks, draft), Audiences, Advisory (scoped + clinical-partner note + disclaimer), `<SpeakingInquiryForm />` (NOT email-gated), `<TestimonialRow />`, Players' Tribune link only (`href="#"` placeholder + TODO comment, new tab when set), `<ConfirmNote>`. Speaker/advocate framing — never therapist.

## Step 4 — FST page (+ minimal extension)

- `src/components/booking-form.tsx`: widen `type` union to `"training" | "wellness" | "fst" | "coaching"`. No other changes.
- `src/lib/intake.functions.ts`: widen `submitBooking`'s zod `type` enum to include `"fst"` and `"coaching"`. No other changes.
- New `src/routes/fst.tsx` in VSL style with draft copy: Hero, Problem, Solution with `<VideoEmbed label="FST SESSION VIDEO · paste URL" />`, Session with `<MediaSlot aspect="4:3" label="FST session photo · 4:3" />`, closing section rendering `<BookingForm type="fst" />`. Include the "this is not medical care" line. `<ConfirmNote items={["FST credential", "Session length", "Pricing", "Location / virtual"]} />`.

## Step 5 — Commerce landers (new routes, link into existing /shop)

All new, no checkout work. `PageHero` + `Section`, draft copy in existing voice.

- `src/routes/supplements.tsx` — product card grid of `<MediaSlot aspect="1:1" label="Product · 1:1" />`, FDA structure/function disclaimer box, primary CTA → `/shop` ("Shop supplements"), `<EmailCapture source="supplements_waitlist" cta="Notify me when it drops" />`, `<TestimonialRow />`, `<ConfirmNote>`.
- `src/routes/merch.tsx` — `MediaSlot 1:1` grid + a `MediaSlot 16:9` lifestyle, primary CTA → `/shop` ("Shop the drop"), `<ConfirmNote>`.
- `src/routes/book.tsx` — working title "QUIET STORM", `<MediaSlot aspect="3:4" label="Book cover · 3:4" />`, proposed arc + author bio (draft), `<EmailCapture source="book_waitlist" cta="Get notified" />`, `<ConfirmNote>`.
- `src/routes/manuals.tsx` — `MediaSlot 3:4` grid, primary CTA → `/shop` ("Get the manuals"), `<TestimonialRow />`, `<ConfirmNote>`.

## Step 6 — Community + Advocacy (new routes)

- `src/routes/community.tsx` — "What's inside" + "Who it's for", `<MediaSlot aspect="16:9" label="Community / lifestyle · 16:9" />`, primary CTA "Join the community" with `href="#"` + `TODO: Skool URL` comment (new tab when set), `<EmailCapture source="community_interest" cta="Keep me posted" />`, `<ConfirmNote>`.
- `src/routes/advocacy.tsx` — **mission only**, no 501(c)(3) / tax-deductible / donate language. "The mission" + "Hear his story" card linking to Players' Tribune (`href="#"` + TODO, new tab when set, link only — no essay text reproduced) + button → `/speaking`. `<VideoEmbed label="ADVOCACY / STORY VIDEO · paste URL" />`. 988 crisis line (`tel:988`, `sms:988`). `<ConfirmNote>`.

## Step 7 — Header nav + footer sitemap (in-place edits)

**`src/components/site-header.tsx`** — replace the nav array with a Radix `NavigationMenu` (already installed). Keep logo, `CartButton`, mobile toggle, active styling intact.

```
Home
Train ▾ → Basketball Training (/training), Fascia Stretch Therapy (/fst),
          Coaching (/coaching), Wellness (/wellness), Manuals (/manuals)
Shop  ▾ → Supplements (/supplements), Merch (/merch), Book (/book),
          All Products (/shop)
Speaking (/speaking)
Community (/community)
About (/about)
Contact (/contact)
```

Mobile menu: same items as a flat scrollable list with "Train" and "Shop" as section headers.

**`src/components/site-footer.tsx`** — keep brand block, 988 strip, scope disclaimer; replace single nav row with a 3-column grouped sitemap (stacks on mobile):
- Train: Basketball Training, FST, Coaching, Wellness, Manuals
- Shop: Supplements, Merch, Book, All Products
- Connect: Speaking, Advocacy, Community, About, Contact

## Step 8 — Polish & QA pass (no new pages)

- Wrap sections on new pages in `<FadeIn>`; enable `scroll-behavior: smooth` in `src/styles.css`.
- Each new route's `head()` sets unique `title`, `description`, `og:title`, `og:description`.
- Mobile sanity check: 16px inputs, 44px tap targets, no horizontal scroll, touch dropdowns work.
- Final checklist:
  - Routes resolve: `/fst /supplements /merch /book /manuals /community /advocacy /speaking`
  - Every page reachable from grouped header + footer (desktop + mobile)
  - MediaSlot/VideoEmbed placeholders render labeled and look intentional
  - FST booking submits (`type="fst"`), speaking inquiry submits, email captures submit
  - Commerce pages link to `/shop` — no duplicate checkout
  - Supplements shows FDA disclaimer; FST shows "not medical care"; Advocacy has no nonprofit/donation language
  - 988 present in footer + advocacy
  - No Players' Tribune text reproduced
  - Every new page shows a `<ConfirmNote>`
  - Styling unchanged: Fraunces, oklch tokens, rounded-none uppercase buttons

---

## What is NOT touched

- `/training`, `/wellness`, `/coaching`, `/shop`, `/shop/$slug`, `/contact`, `/success`, `/cancel` page bodies
- Existing VSL/booking/email/contact/cart/chat components
- Stripe checkout function, Stripe webhook, products table
- Existing migrations, RLS policies, intake handlers (only additive edits noted in Steps 3 & 4)
- Design tokens, fonts, theme

## Deferred (you'll provide later)

Real videos, images, Skool URL, Players' Tribune link, final pricing, final bio/copy, real testimonials, AI knowledge-base content.
