import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Eyebrow } from "@/components/section";
import { FadeIn } from "@/components/media";
import { SpotsBanner } from "@/components/urgency";
import { BookingForm } from "@/components/booking-form";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Book Your Free Evaluation — OOO Performance" },
      { name: "description", content: "Book a player evaluation with OOO Performance. We assess your athlete's game and place them at the right level for elite basketball development." },
      { property: "og:title", content: "Book Your Free Evaluation — OOO Performance" },
      { property: "og:description", content: "Book a player evaluation. We assess and place your athlete at the right level." },
      { property: "og:url", content: `${SITE_ORIGIN}/evaluation` },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EvaluationPage,
});

const COVERS = [
  "A full skills and movement assessment — strengths, gaps, and habits.",
  "Skill-based placement — the right group, private, or Private Plus track (we place by skill, not age).",
  "A clear next step and package recommendation, with no pressure to commit.",
];

function EvaluationPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
          <div className="grid gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-5">
              <Eyebrow>Evaluation · Free</Eyebrow>
              <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
                Book Your Free Evaluation.
              </h1>
              <p className="mt-5 text-base text-muted-foreground md:text-lg">
                Every athlete starts here. We assess the player in front of us and place them by skill, not age.
              </p>
              <ul className="mt-6 space-y-3">
                {COVERS.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm md:text-base">
                    <Check className="mt-1 h-4 w-4 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-7">
              <FadeIn>
                <BookingForm type="training" />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <SpotsBanner programKey="evaluation" />
    </>
  );
}
