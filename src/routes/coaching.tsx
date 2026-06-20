import { createFileRoute } from "@tanstack/react-router";
import { EmailCapture } from "@/components/email-capture";
import { PageHero, Section, Eyebrow } from "@/components/section";

export const Route = createFileRoute("/coaching")({
  head: () => ({
    meta: [
      { title: "Coaching with Ben Gordon — NBA legend | OfOurOwn.com" },
      { name: "description", content: "1:1 coaching with Ben Gordon, NBA legend — for athletes, founders, and operators serious about their craft." },
      { property: "og:title", content: "Coaching with Ben Gordon — NBA legend" },
      { property: "og:description", content: "1:1 coaching with Ben Gordon, NBA legend." },
    ],
  }),
  component: CoachingPage,
});

function CoachingPage() {
  return (
    <>
      <PageHero
        eyebrow="Coaching"
        title="A second set of eyes."
        lede="A private, ongoing engagement for people whose job is to perform — athletes, founders, operators. Ben Gordon works with a small roster at a time."
      />
      <Section className="border-b border-border">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>How it works</Eyebrow>
          <ol className="mt-6 space-y-8 text-lg">
            <li><span className="font-display text-2xl">01 — Intake.</span> A 60-minute deep dive on where you are, what you're chasing, and what's in the way.</li>
            <li><span className="font-display text-2xl">02 — Weekly cadence.</span> Async check-ins and a scheduled call. Ben Gordon sees the full picture: training, recovery, work, life.</li>
            <li><span className="font-display text-2xl">03 — Adjust.</span> Programs and protocols change as you do. Nothing on autopilot.</li>
          </ol>
        </div>
      </Section>
      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>Roster is small</Eyebrow>
            <h2 className="font-display text-4xl font-semibold md:text-5xl">Get on the waitlist.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Coaching slots open a few times a year. Leave your email and we'll reach out when one opens up.
            </p>
          </div>
          <EmailCapture source="coaching_waitlist" cta="Join waitlist" />
        </div>
      </Section>
    </>
  );
}