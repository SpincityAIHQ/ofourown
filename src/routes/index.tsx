import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { EmailCapture } from "@/components/email-capture";
import { Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot, VideoEmbed } from "@/components/media";
import { TestimonialGrid, ProofStatBar } from "@/components/proof";
import { SpotsBanner, EnrollmentBadge } from "@/components/urgency";
import homeReel from "@/assets/home-reel.jpg";
import trainingCover from "@/assets/training-vsl-cover.jpg";
import speakingReel from "@/assets/speaking-reel.jpg";
import communityPhoto from "@/assets/community-photo.jpg";
import fstSession from "@/assets/fst-session.jpg";
import merch1 from "@/assets/merch-1.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OOO Performance — Elite Basketball Development" },
      { name: "description", content: "OOO Performance — elite basketball development built by NBA Veteran Ben Gordon. Training, apparel, media, and community for athletes building something that lasts." },
      { property: "og:title", content: "OOO Performance — Elite Basketball Development" },
      { property: "og:description", content: "Elite basketball development built by NBA Veteran Ben Gordon. Training, apparel, media, and community." },
      { property: "og:image", content: `${SITE_ORIGIN}${homeReel}` },
      { property: "og:image:alt", content: "Ben Gordon walking out onto an empty hardwood court at golden hour, lit by long warm light through the arena windows." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_ORIGIN}${homeReel}` },
    ],
  }),
  component: Index,
});

const VALUE_PROPS = [
  "Train with elite coaches",
  "Built by NBA experience",
  "Develop NBA-level habits",
] as const;

const CREDENTIALS = [
  { value: "11-Year", label: "NBA Career" },
  { value: "Sixth Man", label: "of the Year" },
  { value: "NCAA", label: "Champion" },
  { value: "Pro", label: "Development System" },
] as const;

const CRED_PHOTOS = [
  "Bulls",
  "Great Britain (Team GB)",
  "Coaching kids",
  "Speaking to players",
] as const;

const BUILD = [
  { title: "Decision-Making", line: "Reading the game a beat faster." },
  { title: "Confidence", line: "Belief that holds up under pressure." },
  { title: "Footwork", line: "The foundation under everything." },
  { title: "Conditioning", line: "A body that lasts the full game." },
  { title: "Shooting Mechanics", line: "Repeatable form that travels." },
  { title: "Leadership", line: "Setting the standard for the room." },
  { title: "Basketball IQ", line: "Understanding the why, not just the what." },
] as const;

const PROGRAMS = [
  { age: "Ages 6–10", name: "Youth Development", focus: "Fundamentals", hash: "#youth", key: "youth", apex: false },
  { age: "Ages 11–14", name: "Elite Academy", focus: "Skill Development", hash: "#academy", key: "academy", apex: false },
  { age: "Ages 15–18", name: "High School Elite", focus: "Position Training", hash: "#highschool", key: "highschool", apex: false },
  { age: "Invite Only", name: "College / Pro", focus: "Pro Preparation", hash: "#collegepro", key: "collegepro", apex: true },
] as const;

const ECOSYSTEM = [
  { to: "/training", label: "Training", blurb: "Elite development, youth through pro.", image: trainingCover, soon: false },
  { to: "/collection", label: "Apparel", blurb: "The OOO Performance Collection.", image: merch1, soon: true },
  { to: "/speaking", label: "Media", blurb: "Talks, film, and the OOO voice.", image: speakingReel, soon: false },
  { to: "/community", label: "Recruiting", blurb: "College & pro pathway guidance.", image: communityPhoto, soon: true },
  { to: "/training", label: "Events", blurb: "Camps, clinics, and showcases.", image: fstSession, soon: true },
  { to: "/community", label: "Community", blurb: "Where OOO athletes grow together.", image: communityPhoto, soon: false },
] as const;

const RESULTS: { quote: string; name: string; role: string }[] = [
  { quote: "Coach completely changed my son's confidence.", name: "Parent name", role: "Parent of athlete" },
  { quote: "Best basketball training in Chicago.", name: "Athlete name", role: "High school player" },
  { quote: "Placeholder — replace with a real, permissioned quote tied to a result.", name: "Client name", role: "Role / org" },
];

const COLLECTION_PIECES = [
  { name: "Hoodie", label: "HOODIE · 3:4" },
  { name: "Compression", label: "COMPRESSION · 3:4" },
  { name: "Shorts", label: "SHORTS · 3:4" },
] as const;

function Index() {
  return (
    <>
      {/* PHASE 1/2/8 — Brand hero, full-bleed video, positioning */}
      <section className="relative isolate overflow-hidden border-b border-border bg-foreground text-background">
        <VideoEmbed
          label="45-SEC HYPE VIDEO · 21:9 · full-bleed"
          aspect="21:9"
          poster={homeReel}
          posterAlt="Ben Gordon walking onto an empty hardwood court at golden hour."
          priority
          className="absolute inset-0 h-full w-full border-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/45" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-end px-6 py-20 md:py-28">
          <p className="font-display text-sm uppercase tracking-[0.4em] text-background/70">
            OOO Performance
          </p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl lg:text-8xl">
            Elite Basketball Development.
          </h1>
          <p className="mt-4 font-display text-2xl text-background/90 md:text-4xl">
            Built by NBA Veteran Ben Gordon.
          </p>
          <p className="mt-6 max-w-xl text-lg text-background/70 md:text-xl">
            Developing complete players from youth through professional.
          </p>
          <div className="pointer-events-auto mt-10 flex flex-wrap gap-3">
            <Link
              to="/evaluation"
              className="inline-flex h-12 items-center gap-2 bg-background px-6 text-sm uppercase tracking-wider text-foreground transition hover:opacity-90"
            >
              Book Evaluation <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#programs"
              className="inline-flex h-12 items-center gap-2 border border-background/60 px-6 text-sm uppercase tracking-wider text-background transition hover:bg-background hover:text-foreground"
            >
              View Programs
            </a>
          </div>
        </div>
      </section>

      {/* PHASE 9 — honest urgency under hero */}
      <SpotsBanner programKey="evaluation" />

      {/* PHASE 2 — value-prop row */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-3">
          {VALUE_PROPS.map((v, i) => (
            <div
              key={v}
              className={`border-border px-6 py-10 text-center md:py-12 ${i > 0 ? "border-t md:border-l md:border-t-0" : ""}`}
            >
              <p className="font-display text-xl font-semibold md:text-2xl">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHASE 3 — Lean into Ben: The Standard */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>The Standard</Eyebrow>
          <h2 className="max-w-3xl font-display text-4xl font-semibold leading-tight md:text-6xl">
            Train under the philosophy of NBA veteran Ben Gordon.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            An 11-year NBA guard, NCAA champion, and NBA Sixth Man of the Year —
            Ben built a professional development system and now puts it to work
            for the next generation of players.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-12 grid grid-cols-2 border border-border md:grid-cols-4">
            {CREDENTIALS.map((c) => (
              <div key={c.label} className="border-l border-border px-6 py-6 first:border-l-0">
                <div className="font-display text-3xl font-semibold leading-none md:text-4xl">{c.value}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-px grid grid-cols-2 gap-px bg-border md:grid-cols-4">
            {CRED_PHOTOS.map((label) => (
              <MediaSlot key={label} label={label} aspect="4:3" />
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* PHASE 4 — Training philosophy */}
      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>The Philosophy</Eyebrow>
              <h2 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
                We don't just teach basketball.
              </h2>
              <p className="mt-6 max-w-md text-lg text-muted-foreground">
                We develop the whole athlete — the decision-maker, the
                competitor, the teammate, and the person. Skills are the surface.
                We build what's underneath.
              </p>
              <Link
                to="/philosophy"
                className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-wider"
              >
                Read our philosophy <ArrowRight className="h-4 w-4" />
              </Link>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.05}>
              <div className="grid gap-px bg-border sm:grid-cols-2">
                {BUILD.map((b) => (
                  <div key={b.title} className="bg-background p-6">
                    <h3 className="font-display text-lg font-semibold">{b.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{b.line}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 font-display text-2xl font-semibold md:text-3xl">That's the difference.</p>
            </FadeIn>
          </div>
        </div>
      </Section>

      {/* PHASE 5 — Program ladder */}
      <section id="programs" className="scroll-mt-20 border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <FadeIn>
            <Eyebrow>Programs</Eyebrow>
            <h2 className="font-display text-4xl font-semibold md:text-6xl">Find your level.</h2>
          </FadeIn>
          <div className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
            {PROGRAMS.map((p, i) => (
              <FadeIn key={p.name} delay={(i % 4) * 0.04}>
                <Link
                  to="/training"
                  hash={p.hash.slice(1)}
                  className={`group flex h-full flex-col justify-between gap-10 p-8 transition ${
                    p.apex
                      ? "bg-foreground text-background hover:opacity-90"
                      : "bg-background hover:bg-accent"
                  }`}
                >
                  <div>
                    <span
                      className={`inline-block border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                        p.apex ? "border-background/50 text-background/80" : "border-border text-muted-foreground"
                      }`}
                    >
                      {p.age}
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold">{p.name}</h3>
                    <p className={`mt-2 text-sm ${p.apex ? "text-background/70" : "text-muted-foreground"}`}>
                      {p.focus}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <EnrollmentBadge
                      programKey={p.key}
                      className={p.apex ? "border-background/50 text-background/80" : undefined}
                    />
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.1}>
            <div className="mt-10 flex flex-col items-start gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
              <p className="text-muted-foreground">
                Not sure which fits? Book an evaluation and we'll place your athlete.
              </p>
              <Link
                to="/evaluation"
                className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90"
              >
                Book Evaluation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PHASE 1 — The Ecosystem */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>The Ecosystem</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-6xl">One brand. Many ways in.</h2>
        </FadeIn>
        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM.map((e, i) => (
            <FadeIn key={`${e.label}-${i}`} delay={(i % 3) * 0.04} className="bg-background">
              <Link to={e.to} className="group flex h-full flex-col">
                <div className="relative overflow-hidden">
                  <MediaSlot
                    label={e.label}
                    aspect="4:3"
                    src={e.image}
                    alt={e.label}
                    className="border-0 transition duration-500 group-hover:scale-[1.02]"
                  />
                  {e.soon ? (
                    <span className="absolute left-4 top-4 bg-background px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground">
                      Coming Soon
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 items-end justify-between p-6">
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{e.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{e.blurb}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* PHASE 8 — In Motion video strip */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>In Motion</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-6xl">See the work.</h2>
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {["Slow-motion workout", "Ben coaching", "Kids celebrating"].map((label, i) => (
            <FadeIn key={label} delay={i * 0.05}>
              <VideoEmbed label={label} aspect="16:9" />
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* PHASE 7 — Results / social proof */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Results</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-6xl">What players and parents say.</h2>
        </FadeIn>
        <div className="mt-10">
          <FadeIn delay={0.05}>
            <TestimonialGrid items={RESULTS} />
          </FadeIn>
        </div>
        <FadeIn delay={0.1}>
          <ProofStatBar
            className="mt-10"
            items={[
              { value: "—", label: "College Commitments" },
              { value: "—", label: "Players Trained" },
              { value: "—", label: "Years Experience" },
            ]}
          />
        </FadeIn>
      </Section>

      {/* PHASE 10 — OOO Performance Collection teaser */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>OOO Performance Collection</Eyebrow>
          <h2 className="font-display text-5xl font-semibold leading-[0.95] md:text-7xl">Coming Soon.</h2>
          <p className="mt-8 max-w-md text-lg text-muted-foreground">
            Performance apparel, built to the same standard as the training.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
          {COLLECTION_PIECES.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.05} className="bg-background">
              <div className="flex h-full flex-col gap-5 p-6">
                <MediaSlot label={p.label} aspect="3:4" />
                <p className="font-display text-xl font-semibold">{p.name}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.1}>
          <div className="mt-10 max-w-md">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Get early access</p>
            <EmailCapture source="ooo_collection_waitlist" cta="Get Early Access" />
          </div>
        </FadeIn>
      </Section>

      {/* PHASE 1 — Brand statement band */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-32 md:py-40">
          {/* Placeholder for Ben's ethos — replace with his words. */}
          <p className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            An elite performance brand. Training, apparel, media, and community —
            for athletes building something that lasts.
          </p>
        </div>
      </section>

      {/* PHASE 2 — email capture thin band */}
      <Section>
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>Stay close</Eyebrow>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Get Ben Gordon's notes.</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Occasional dispatches on development, the game, and the long road. No noise.
            </p>
          </div>
          <EmailCapture source="home_newsletter" cta="Subscribe" />
        </div>
      </Section>
    </>
  );
}
