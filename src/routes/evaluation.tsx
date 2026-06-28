import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Section, Eyebrow } from "@/components/section";
import { FadeIn } from "@/components/media";
import { SpotsBanner } from "@/components/urgency";
import { BookingForm } from "@/components/booking-form";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Book Your Evaluation — OOO Performance" },
      { name: "description", content: "Book a player evaluation with OOO Performance. We assess your athlete's game and place them at the right level for elite basketball development." },
      { property: "og:title", content: "Book Your Evaluation — OOO Performance" },
      { property: "og:description", content: "Book a player evaluation. We assess and place your athlete at the right level." },
      { property: "og:url", content: `${SITE_ORIGIN}/evaluation` },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EvaluationPage,
});

const COVERS = [
  "A full skills and movement assessment — strengths, gaps, and habits.",
  "An honest read on where your athlete fits in our program ladder.",
  "A clear next step and development plan, with no pressure to commit.",
];

function EvaluationPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <Eyebrow>Evaluation</Eyebrow>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            Book Your Evaluation.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
            Every athlete starts here. We assess the player in front of us and
            place them at the right level — youth through professional.
          </p>
        </div>
      </section>

      <SpotsBanner programKey="evaluation" />

      <Section>
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>What it covers</Eyebrow>
              <ul className="mt-8 space-y-5">
                {COVERS.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-lg">
                    <Check className="mt-1 h-5 w-5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
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
