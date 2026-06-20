import { createFileRoute } from "@tanstack/react-router";
import { BookingForm } from "@/components/booking-form";
import { PageHero, Section, Eyebrow } from "@/components/section";

export const Route = createFileRoute("/wellness")({
  head: () => ({
    meta: [
      { title: "Wellness with Ben Gordon" },
      { name: "description", content: "Private wellness consults — sleep, nutrition, and recovery protocols with Ben Gordon." },
      { property: "og:title", content: "Wellness with Ben Gordon" },
      { property: "og:description", content: "Private wellness consults and protocols with Ben Gordon." },
    ],
  }),
  component: WellnessPage,
});

function WellnessPage() {
  return (
    <>
      <PageHero
        eyebrow="Wellness"
        title="Recover like it matters."
        lede="Private consults focused on the unglamorous side of performance — sleep, nutrition, stress, and the daily protocols that compound over years."
      />
      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>What we look at</Eyebrow>
            <ul className="space-y-3 text-lg">
              {["Sleep architecture & wind-down", "Nutrition that supports your training", "Stress & nervous-system load", "Recovery modalities that actually move the needle"].map((x) => (
                <li key={x} className="border-b border-border pb-3">{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>What you walk away with</Eyebrow>
            <ul className="space-y-3 text-lg">
              {["A protocol you can actually run", "Clear morning and evening anchors", "A short list of metrics worth tracking", "A direct line back to Ben for adjustments"].map((x) => (
                <li key={x} className="border-b border-border pb-3">{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <Eyebrow>Request a consult</Eyebrow>
            <h2 className="font-display text-4xl font-semibold md:text-5xl">Tell us where you are.</h2>
            <p className="mt-4 text-muted-foreground">
              Share what you're working on and what isn't working. Ben's team will confirm fit and timing.
            </p>
          </div>
          <BookingForm type="wellness" />
        </div>
      </Section>
    </>
  );
}