import { createFileRoute } from "@tanstack/react-router";
import { BookingForm } from "@/components/booking-form";
import {
  VSLHero,
  FunnelSection,
  FunnelGate,
  BulletList,
} from "@/components/vsl-funnel";
import wellnessVslCover from "@/assets/wellness-vsl-cover.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/wellness")({
  head: () => ({
    meta: [
      { title: "Wellness with Ben Gordon — NBA Veteran | OfOurOwn" },
      { name: "description", content: "Private wellness consults — sleep, nutrition, and recovery protocols with Ben Gordon, NBA Veteran." },
      { property: "og:title", content: "Wellness with Ben Gordon — NBA Veteran" },
      { property: "og:description", content: "Private wellness consults and protocols with Ben Gordon, NBA Veteran." },
      { property: "og:image", content: `${SITE_ORIGIN}${wellnessVslCover}` },
      { property: "og:image:alt", content: "Ben Gordon mid-stretch on a mat in a sunlit recovery studio, eyes closed and breathing through the position." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_ORIGIN}${wellnessVslCover}` },
    ],
  }),
  component: WellnessPage,
});

function WellnessPage() {
  return (
    <>
      <VSLHero
        eyebrow="Wellness"
        headline="Performance is what you recover from."
        subhead="Private wellness consults built around the unglamorous work — sleep, nutrition, stress, and daily protocols that compound for decades."
        nextLabel="See why you're tired"
        mediaSrc={wellnessVslCover}
        mediaAlt="Ben Gordon stretching alone on a yoga mat in a quiet sunlit studio, sleeves rolled, focused on breath and position — cover for the private wellness consult."
        primaryCta={{ label: "Apply now", href: "#cta" }}
        secondaryCta={{ label: "See the offer", href: "#offer" }}
      />

      <FunnelSection
        id="problem"
        step="01"
        eyebrow="The Problem"
        title="You're not undertrained. You're underrecovered."
        nextHref="#solution"
        nextLabel="See the protocol"
      >
        <p>
          Bad sleep, blood sugar swings, and a nervous system stuck on high
          have a cost. You feel it as soft mornings, flat workouts, and a
          fuse that's a little too short by 4pm.
        </p>
        <p>
          More effort won't fix any of that. Better infrastructure will.
        </p>
      </FunnelSection>

      <FunnelSection
        id="solution"
        step="02"
        eyebrow="The Solution"
        title="A protocol you'll actually run."
        nextHref="#proof"
        nextLabel="See what we look at"
        tone="invert"
      >
        <BulletList
          items={[
            "Sleep architecture and wind-down that actually fires",
            "Nutrition that supports the training you're doing",
            "Stress and nervous-system load — measured and managed",
            "Recovery modalities that move the needle (and a list of the ones that don't)",
          ]}
        />
      </FunnelSection>

      <FunnelSection
        id="proof"
        step="03"
        eyebrow="The Proof"
        title="What private clients walk away with."
        nextHref="#offer"
        nextLabel="See the consult"
      >
        <BulletList
          items={[
            "A written protocol you can actually run in your real life",
            "Clear morning and evening anchors",
            "A short list of metrics worth tracking — and the ones to ignore",
            "A direct line back to Ben Gordon for adjustments",
          ]}
        />
      </FunnelSection>

      <FunnelSection
        id="offer"
        step="04"
        eyebrow="The Offer"
        title="A private wellness consult, built for your life."
        nextHref="#cta"
        nextLabel="Apply now"
      >
        <p>
          A focused engagement: intake call, written protocol, and follow-up
          to make sure the protocol survives contact with your week.
        </p>
      </FunnelSection>

      <FunnelGate
        id="cta"
        source="wellness_funnel"
        eyebrow="Step 05 — Apply"
        title="Drop your email to open the consult application."
        pitch="Ben's team confirms fit and timing within 48 hours. Spots are intentionally limited."
        ctaLabel="Unlock application"
      >
        <BookingForm type="wellness" />
      </FunnelGate>
    </>
  );
}