import { createFileRoute } from "@tanstack/react-router";
import { EmailCapture } from "@/components/email-capture";
import {
  VSLHero,
  FunnelSection,
  FunnelGate,
  BulletList,
} from "@/components/vsl-funnel";

export const Route = createFileRoute("/coaching")({
  head: () => ({
    meta: [
      { title: "Coaching with Ben Gordon — NBA legend | OfOurOwn" },
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
      <VSLHero
        eyebrow="Coaching"
        headline="The second set of eyes you've been missing."
        subhead="A private ongoing engagement for people whose job is to perform — athletes, founders, operators. Ben Gordon works with a small roster at a time."
        nextLabel="See why most coaches miss"
      />

      <FunnelSection
        id="problem"
        step="01"
        eyebrow="The Problem"
        title="You're operating alone at the level that matters."
        nextHref="#solution"
        nextLabel="See the fix"
      >
        <p>
          The higher you go, the fewer people can give you honest, useful
          feedback. You're making decisions about your body, your work, and
          your week with no one watching the full picture.
        </p>
        <p>
          That's how plateaus and burnout get built.
        </p>
      </FunnelSection>

      <FunnelSection
        id="solution"
        step="02"
        eyebrow="The Solution"
        title="One coach. The full picture."
        nextHref="#proof"
        nextLabel="See how it runs"
        tone="invert"
      >
        <BulletList
          items={[
            "Intake — a 60-minute deep dive on where you are and what's in the way",
            "Weekly cadence — async check-ins plus a scheduled call",
            "Full-stack view — training, recovery, work, life all on the same dashboard",
            "Adjust — programs and protocols change as you do; nothing on autopilot",
          ]}
        />
      </FunnelSection>

      <FunnelSection
        id="proof"
        step="03"
        eyebrow="The Proof"
        title="A small roster, by design."
        nextHref="#offer"
        nextLabel="See the engagement"
      >
        <p>
          Ben Gordon coaches a deliberately small group at a time. The clients
          who fit this room are the ones whose results compound for years —
          not the ones chasing a six-week win.
        </p>
      </FunnelSection>

      <FunnelSection
        id="offer"
        step="04"
        eyebrow="The Offer"
        title="Ongoing 1:1 coaching with Ben Gordon."
        nextHref="#cta"
        nextLabel="Apply for the waitlist"
      >
        <p>
          A multi-month engagement. Onboarding intake, weekly cadence, and a
          direct line to Ben between calls. Built for people who treat their
          career as a long game.
        </p>
      </FunnelSection>

      <FunnelGate
        id="cta"
        source="coaching_funnel"
        eyebrow="Step 05 — Apply"
        title="Slots open a few times a year. Get on the list."
        pitch="Drop your email to join the coaching waitlist. We reach out the moment a slot opens."
        ctaLabel="Join waitlist"
      >
        <div className="text-base">
          <p className="mb-4">You're on the list. Want to give us more context now? Subscribe to Ben's notes so you stay close while you wait:</p>
          <EmailCapture source="coaching_notes" cta="Subscribe" />
        </div>
      </FunnelGate>
    </>
  );
}