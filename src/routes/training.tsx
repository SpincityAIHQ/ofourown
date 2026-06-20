import { createFileRoute } from "@tanstack/react-router";
import { BookingForm } from "@/components/booking-form";
import { PageHero, Section, Eyebrow } from "@/components/section";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Training with Ben Gordon" },
      { name: "description", content: "Private 1:1 strength and conditioning. Request a session with Ben Gordon." },
      { property: "og:title", content: "Training with Ben Gordon" },
      { property: "og:description", content: "Private 1:1 strength and conditioning sessions and programs." },
    ],
  }),
  component: TrainingPage,
});

function TrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Training"
        title="Built for output."
        lede="Private 1:1 sessions and structured programs combining strength, conditioning, and recovery — designed for athletes and operators who need their body to keep up with their ambitions."
      />
      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            { h: "Assess", p: "Movement screen, history, and a clear baseline before any program starts." },
            { h: "Program", p: "A focused block — strength, work capacity, and recovery — calibrated weekly." },
            { h: "Adjust", p: "Continuous iteration based on what your body tells us, not a template." },
          ].map((s, i) => (
            <div key={s.h}>
              <p className="font-display text-5xl font-semibold">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 font-display text-2xl font-semibold">{s.h}</h3>
              <p className="mt-2 text-muted-foreground">{s.p}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <Eyebrow>Request a session</Eyebrow>
            <h2 className="font-display text-4xl font-semibold md:text-5xl">Tell Ben about you.</h2>
            <p className="mt-4 text-muted-foreground">
              Sessions are limited. Share a few details and someone from Ben's team will be in touch within 48 hours to confirm fit and next steps.
            </p>
          </div>
          <BookingForm type="training" />
        </div>
      </Section>
    </>
  );
}