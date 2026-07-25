import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, Eyebrow, PageHero } from "@/components/section";
import { FadeIn, ConfirmNote } from "@/components/media";
import { EmailCapture } from "@/components/email-capture";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Consultation — Direct Time With Ben Gordon | OOO Performance" },
      {
        name: "description",
        content:
          "One-on-one video consultations with 12-Year NBA Veteran Ben Gordon — for parents guiding an athlete and coaches building them.",
      },
      { property: "og:title", content: "Consultation — Direct Time With Ben Gordon" },
      {
        property: "og:description",
        content:
          "Direct sessions with an NBA veteran for parents and coaches. Elite knowledge, one-on-one.",
      },
      { property: "og:url", content: `${SITE_ORIGIN}/consultation` },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ConsultationPage,
});

const OFFERS = [
  {
    audience: "For Parents",
    name: "Athlete Development Session",
    length: "60 minutes · video call",
    covers: [
      "An honest read on where your athlete actually stands",
      "What to prioritize at their age and level",
      "How to evaluate trainers, programs, and AAU situations",
      "The recruiting landscape ahead — and how to prepare early",
    ],
  },
  {
    audience: "For Coaches",
    name: "Coach's Clinic Session",
    length: "90 minutes · video call",
    covers: [
      "Elite skill-teaching methodology, from an NBA lens",
      "Practice design that develops complete players",
      "Player development systems that scale beyond one season",
      "How NBA-level habits get built at any level",
    ],
  },
];

const STEPS = [
  { n: "01", title: "Request your session", line: "Tell us who you are and what you want to cover." },
  { n: "02", title: "We schedule it", line: "Ben's team reaches out within 24 hours to lock a time." },
  { n: "03", title: "Meet Ben", line: "One-on-one on a video call. Come with questions." },
];

function ConsultationPage() {
  return (
    <>
      <PageHero
        eyebrow="Consultation"
        title="Direct time with Ben."
        lede="One-on-one video sessions with a 12-Year NBA Veteran — for the parents guiding an athlete and the coaches building them. Not a workout. A transfer of knowledge."
      />

      <Section className="border-b border-border">
        <div className="mb-10 max-w-2xl">
          <p className="text-muted-foreground">
            Looking for on-court training for your athlete instead?{" "}
            <Link to="/evaluation" className="underline underline-offset-4 hover:text-foreground">
              Start with the free evaluation
            </Link>
            .
          </p>
        </div>

        <div className="grid gap-px bg-border md:grid-cols-2">
          {OFFERS.map((o, i) => (
            <FadeIn key={o.name} delay={i * 0.05}>
              <div className="flex h-full flex-col bg-background p-8 md:p-10">
                <Eyebrow>{o.audience}</Eyebrow>
                <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
                  {o.name}
                </h2>
                <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  {o.length}
                </div>

                <ul className="mt-8 space-y-3 text-muted-foreground">
                  {o.covers.map((c) => (
                    <li key={c} className="border-l border-border pl-4">
                      {c}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 border-t border-border pt-6">
                  <div className="font-display text-3xl font-semibold">$—</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Pricing being finalized
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-foreground px-8 py-4 text-sm font-semibold uppercase tracking-wider text-background transition-opacity hover:opacity-90"
                  >
                    Request a session <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section className="border-b border-border">
        <Eyebrow>How it works</Eyebrow>
        <div className="mt-8 grid gap-px bg-border md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-background p-8">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.n}</div>
              <div className="mt-3 font-display text-2xl font-semibold">{s.title}</div>
              <p className="mt-2 text-muted-foreground">{s.line}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
          Sessions are virtual by default; in-person available by arrangement. Reschedule with 24+
          hours&rsquo; notice — inside 24 hours, the session is forfeited, matching our training
          policy.
        </p>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Be first</Eyebrow>
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            Booking opens soon.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Leave your email and Ben&rsquo;s team will reach out the moment consultation slots go
            live.
          </p>
          <div className="mt-8">
            <EmailCapture source="consultation_interest" cta="Get notified" />
          </div>
        </div>
        <ConfirmNote
          items={[
            "Final session pricing (parent + coach tiers)",
            "Stripe products + pay-first booking flow once prices are confirmed",
            "Scheduling link (Calendly/Cal.com) or keep 24-hour outreach flow",
          ]}
        />
      </Section>
    </>
  );
}
