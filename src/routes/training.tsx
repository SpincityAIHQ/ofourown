import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/section";
import { FadeIn, VideoEmbed } from "@/components/media";
import { TestimonialGrid, ProofStatBar } from "@/components/proof";
import { SpotsBanner } from "@/components/urgency";
import { ProgramPlan } from "@/components/program-plan";
import { BookingForm } from "@/components/booking-form";
import trainingVslCover from "@/assets/training-vsl-cover.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Training — OOO Performance | Elite Basketball Development" },
      { name: "description", content: "Package-only basketball development with OOO Performance. Start with a free evaluation, then train in Group, Private, Private Plus, or camps — placed by skill, not age." },
      { property: "og:title", content: "Training — OOO Performance" },
      { property: "og:description", content: "Package-only basketball development. Free evaluation, then Group, Private, Private Plus, and camps. Built by 12-Year NBA Veteran Ben Gordon." },
      { property: "og:image", content: `${SITE_ORIGIN}${trainingVslCover}` },
      { property: "og:image:alt", content: "Ben Gordon on a hardwood basketball court holding a ball, lit by warm afternoon sunlight." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_ORIGIN}${trainingVslCover}` },
    ],
  }),
  component: TrainingPage,
});

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
            Package-only development built by 12-Year NBA Veteran Ben Gordon.
            Every athlete starts with a free evaluation — no drop-ins, no hourly
            rates. We place players by skill, not age.
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
              Book Your Free Evaluation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/programs"
              className="inline-flex h-12 items-center gap-2 border border-foreground px-6 text-sm uppercase tracking-wider transition hover:bg-foreground hover:text-background"
            >
              Programs &amp; Pricing
            </Link>
          </div>
        </div>
      </section>

      <SpotsBanner programKey="evaluation" />

      {/* Ben's plan: model → free evaluation → placement → packages → policies → summary */}
      <ProgramPlan />

      {/* Achievements (labeled, permissioned) */}
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

      {/* Before / After */}
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

      {/* Testimonials */}
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

      {/* Booking — the free evaluation is the only entry point */}
      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>Get started</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">Book your free evaluation.</h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                The free evaluation is the only way in. Tell us about your
                athlete — we'll assess, place them by skill, and map out the
                right package.
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
