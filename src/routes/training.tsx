import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/section";
import { FadeIn, VideoEmbed } from "@/components/media";
import { TestimonialGrid, ProofStatBar } from "@/components/proof";
import { SpotsBanner, EnrollmentBadge } from "@/components/urgency";
import { BookingForm } from "@/components/booking-form";
import trainingVslCover from "@/assets/training-vsl-cover.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Training — OOO Performance | Elite Basketball Development" },
      { name: "description", content: "Elite basketball development with OOO Performance — youth through professional. Find your level and book an evaluation." },
      { property: "og:title", content: "Training — OOO Performance" },
      { property: "og:description", content: "Elite basketball development, youth through professional. Built by NBA Veteran Ben Gordon." },
      { property: "og:image", content: `${SITE_ORIGIN}${trainingVslCover}` },
      { property: "og:image:alt", content: "Ben Gordon on a hardwood basketball court holding a ball, lit by warm afternoon sunlight." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_ORIGIN}${trainingVslCover}` },
    ],
  }),
  component: TrainingPage,
});

const TIERS = [
  {
    id: "youth",
    age: "Ages 6–10",
    name: "Youth Development",
    focus: "Fundamentals",
    key: "youth",
    apex: false,
    blurb:
      "First touches done right. Ballhandling, footwork, and a love for the game — built on real fundamentals, not bad habits.",
    points: ["Ballhandling & footwork", "Coordination & athleticism", "Confidence and a love for the game"],
  },
  {
    id: "academy",
    age: "Ages 11–14",
    name: "Elite Academy",
    focus: "Skill Development",
    key: "academy",
    apex: false,
    blurb:
      "The skill-building years. Shooting mechanics, finishing, and decision-making that scale with the athlete.",
    points: ["Shooting mechanics", "Finishing & scoring", "Decision-making & IQ"],
  },
  {
    id: "highschool",
    age: "Ages 15–18",
    name: "High School Elite",
    focus: "Position Training",
    key: "highschool",
    apex: false,
    blurb:
      "Position-specific training for players competing for varsity minutes, recruitment, and the next level.",
    points: ["Position-specific skill work", "Strength & conditioning", "Recruiting readiness"],
  },
  {
    id: "collegepro",
    age: "Invite Only",
    name: "College / Pro",
    focus: "Pro Preparation",
    key: "collegepro",
    apex: true,
    blurb:
      "Invite-only preparation for college and professional athletes — the same standard Ben held across an 11-year NBA career.",
    points: ["Pro-level skill refinement", "Performance & recovery system", "Film, IQ, and the mental game"],
  },
] as const;

function TrainingPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Eyebrow>Training</Eyebrow>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.0] tracking-tight md:text-7xl">
            Elite basketball development.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            From a child's first dribble to a pro's pre-season — one standard,
            built by NBA Veteran Ben Gordon. Find your level below.
          </p>
          <div className="mt-10">
            <FadeIn>
              <VideoEmbed
                label="FEATURE VIDEO · training · 16:9"
                aspect="16:9"
                poster={trainingVslCover}
                posterAlt="Ben Gordon center-court holding a basketball in warm afternoon light."
                priority
              />
            </FadeIn>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/evaluation"
              className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90"
            >
              Book Evaluation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SpotsBanner programKey="evaluation" />

      {/* Tier sections — anchored from the homepage program ladder */}
      {TIERS.map((t) => (
        <section
          key={t.id}
          id={t.id}
          className={`scroll-mt-20 border-b border-border ${t.apex ? "bg-foreground text-background" : ""}`}
        >
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <span
                  className={`inline-block border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                    t.apex ? "border-background/50 text-background/80" : "border-border text-muted-foreground"
                  }`}
                >
                  {t.age}
                </span>
                <h2 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-5xl">
                  {t.name}
                </h2>
                <p className={`mt-2 text-sm uppercase tracking-[0.2em] ${t.apex ? "text-background/60" : "text-muted-foreground"}`}>
                  {t.focus}
                </p>
                <div className="mt-6">
                  <EnrollmentBadge
                    programKey={t.key}
                    className={t.apex ? "border-background/50 text-background/80" : undefined}
                  />
                </div>
              </div>
              <div className="md:col-span-7">
                <p className={`text-lg ${t.apex ? "text-background/80" : "text-muted-foreground"}`}>{t.blurb}</p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {t.points.map((p) => (
                    <li
                      key={p}
                      className={`border-l px-4 py-2 text-sm ${
                        t.apex ? "border-background/30 text-background/80" : "border-border text-muted-foreground"
                      }`}
                    >
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/evaluation"
                  className={`mt-8 inline-flex h-12 items-center gap-2 px-6 text-sm uppercase tracking-wider transition ${
                    t.apex
                      ? "bg-background text-foreground hover:opacity-90"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  Reserve Your Spot <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* PHASE 7 — Achievements (labeled, permissioned) */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Achievements</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">The standard, by the numbers.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Figures publish here once verified and permissioned — never invented.
          </p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <ProofStatBar
            className="mt-10"
            items={[
              { value: "—", label: "College Commitments" },
              { value: "—", label: "Pro Players Developed" },
              { value: "—", label: "High School Achievements" },
            ]}
          />
        </FadeIn>
      </Section>

      {/* PHASE 7/8 — Before / After */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Before / After</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Watch the development.</h2>
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <FadeIn>
            <VideoEmbed label="BEFORE · athlete intake · 16:9" aspect="16:9" />
          </FadeIn>
          <FadeIn delay={0.05}>
            <VideoEmbed label="AFTER · same athlete, months later · 16:9" aspect="16:9" />
          </FadeIn>
        </div>
      </Section>

      {/* PHASE 7 — Testimonials */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Results</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">What players and parents say.</h2>
        </FadeIn>
        <div className="mt-10">
          <FadeIn delay={0.05}>
            <TestimonialGrid />
          </FadeIn>
        </div>
      </Section>

      {/* Booking */}
      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>Get started</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">Book your evaluation.</h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Tell us about your athlete. We'll assess, place them at the right
                level, and map out next steps.
              </p>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                1-on-1 basketball training: $250/hour (1-hour minimum).
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.05}>
              <BookingForm type="training" />
            </FadeIn>
          </div>
        </div>
      </Section>
    </>
  );
}
