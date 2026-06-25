
## Plan: Apply Ben Gordon reference photos to the site

You uploaded 6 reference photos of Ben Gordon. Here's how I'll use them.

### What I can do with these references

The `edit_image` tool accepts multiple input images and can blend/extend them into new scenes while keeping the subject's likeness. That means I can take these 6 references and produce all 36 site images with a recognizable Ben Gordon — not a generic athlete.

### Reference photo roles

- `Ben_Gordon.jpg` (gym, smiling, black tee) → **primary likeness anchor** for training/wellness/coaching action shots
- `images_3.jpeg` (charcoal check shirt, neutral) → wardrobe + lighting anchor for editorial portraits (About, Book cover, Speaking)
- `images_4.jpeg` / `images_5.jpeg` / `images_7.jpeg` (clean headshots, multiple angles) → likeness reinforcement for face-forward shots
- `images_6.jpeg` (moody studio portrait) → mood/grade reference for darker editorial pieces (Advocacy, Community)

### Build steps

1. **Save references** → upload all 6 to `src/assets/refs/` via `lovable-assets` so the edit tool can pull them by URL across multiple generations.
2. **Generate the 36 images** in batches by category, each call passing 2–3 of the reference photos plus the scene prompt from the asset list I already shared. Categories:
   - Brand (logo, favicon, OG defaults) — 3 images
   - Training funnel (VSL cover, drills, court stills) — 6
   - Wellness funnel (recovery, FST table, breathwork) — 6
   - Coaching (1:1, whiteboard, portrait) — 4
   - Speaking (stage, audience, podium portrait) — 4
   - Shop (book mockup, manuals, supplements, merch) — 6
   - Home / About / Community / Advocacy — 7
3. **Wire into the site** — replace every `MediaSlot`/`VideoEmbed` placeholder with the generated `.asset.json` imports across the 13 route files and shared components.
4. **QA pass** — visual check of each page to confirm likeness is consistent and grading reads as one cohesive editorial set (warm daylight, muted earth tones, as previously approved).

### What to expect

- Likeness will be **strong but not photographic** — it's AI-edited, not real photography. Faces will read as Ben from a distance; up close, fine features may drift between shots. That's the trade-off vs. a real photoshoot.
- I'll do the full set in one pass and you review. Anything off, I regenerate that single slot.

### Approve to proceed

Say "go" and I'll execute steps 1–4 in build mode. If you'd rather I generate a small test batch first (e.g. 3 hero shots) before committing to all 36, say "test batch first."
