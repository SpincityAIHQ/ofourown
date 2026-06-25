import { createFileRoute } from "@tanstack/react-router";
import { BookingForm } from "@/components/booking-form";
import {
  VSLHero,
  FunnelSection,
  FunnelGate,
  BulletList,
} from "@/components/vsl-funnel";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Training with Ben Gordon — NBA legend | OfOurOwn" },
      { name: "description", content: "Private 1:1 strength and conditioning. Request a session with Ben Gordon, NBA legend." },
      { property: "og:title", content: "Training with Ben Gordon — NBA legend" },
      { property: "og:description", content: "Private 1:1 strength and conditioning with Ben Gordon, NBA legend." },
    ],
  }),
  component: TrainingPage,
});

function TrainingPage() {
  return (
    <>
      <VSLHero
        eyebrow="Training"
        headline="Train like your career depends on it. Because it does."
        subhead="Private 1:1 strength, conditioning, and recovery built on the same methods Ben Gordon used through 12 years in the NBA."
        nextLabel="See why most programs fail"
      />

      <FunnelSection
        id="problem"
        step="01"
        eyebrow="The Problem"
        title="Most training plans were never built for your real life."
        nextHref="#solution"
        nextLabel="See the fix"
      >
        <p>
          You don't have an off-season. You have meetings, flights, kids,
          recovery debt, and a body that's quietly compensating in twenty
          places. Generic templates make that worse.
        </p>
        <p>
          The result: you train hard for six weeks, get injured, fall off, and
          start over. Again.
        </p>
      </FunnelSection>

      <FunnelSection
        id="solution"
        step="02"
        eyebrow="The Solution"
        title="A program built around you, recalibrated every week."
        nextHref="#proof"
        nextLabel="See it work"
        tone="invert"
      >
        <p>
          Three steps, repeated until the work is dialed in:
        </p>
        <BulletList
          items={[
            "Assess — movement screen, history, and a clean baseline.",
            "Program — strength, conditioning, and recovery in one block.",
            "Adjust — weekly recalibration based on what your body says.",
          ]}
        />
      </FunnelSection>

      <FunnelSection
        id="proof"
        step="03"
        eyebrow="The Proof"
        title="Twelve NBA seasons. One reason."
        nextHref="#offer"
        nextLabel="See what you get"
      >
        <p>
          Ben Gordon played 12 seasons at the highest level of basketball —
          and the back half of that career was bought with the exact training
          and recovery system you'll run.
        </p>
        <p className="text-muted-foreground">
          Private clients now use the same framework to come back from
          injury, add years to their athletic life, and feel sharp on Monday
          morning.
        </p>
      </FunnelSection>

      <FunnelSection
        id="offer"
        step="04"
        eyebrow="The Offer"
        title="Private 1:1 sessions with Ben Gordon."
        nextHref="#cta"
        nextLabel="Claim your slot"
      >
        <BulletList
          items={[
            "60–90 minute private sessions, in-person or remote",
            "Custom program updated weekly to match your load",
            "Direct line to Ben for questions between sessions",
            "Movement assessment + return-to-play roadmap if you're coming back from injury",
          ]}
        />
      </FunnelSection>

      <FunnelGate
        id="cta"
        source="training_funnel"
        eyebrow="Step 05 — Apply"
        title="Slots are limited. Start with your email."
        pitch="Drop your email to unlock the application form. Ben's team replies within 48 hours to confirm fit and timing."
        ctaLabel="Unlock application"
      >
        <BookingForm type="training" />
      </FunnelGate>
    </>
  );
}