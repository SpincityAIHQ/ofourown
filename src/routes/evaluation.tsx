import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { BookingForm } from "@/components/booking-form";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Request Your Free Evaluation — OOO Performance" },
      {
        name: "description",
        content:
          "Request a free player evaluation with OOO Performance. Skill-based placement for basketball players ages 8 and up. The team confirms dates and location.",
      },
      { property: "og:title", content: "Your next step starts here — OOO Performance" },
      {
        property: "og:description",
        content:
          "Request a free basketball evaluation. Understand your game, find your level, and get a clear next step.",
      },
      { property: "og:url", content: `${SITE_ORIGIN}/evaluation` },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EvaluationPage,
});

const COVERS = [
  "An assessment of the player's skills, movement, and habits.",
  "Skill-based placement in the training format that fits.",
  "A clear package recommendation and next step.",
];

function EvaluationPage() {
  return (
    <section className="border-b border-border bg-[#f5f4f0]">
      <div className="mx-auto max-w-[1312px] px-6 py-10 sm:px-10 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to OOO Performance
        </Link>
        <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="ooo-eyebrow">Your next step / Free evaluation</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Know your game.
              <br />
              <span className="font-normal italic">Find your level.</span>
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Start with the player in front of us. Tell us a little about your goals, and the team
              will follow up about evaluation dates and location.
            </p>
            <ul className="mt-8 space-y-5">
              {COVERS.map((item) => (
                <li key={item} className="flex max-w-md items-start gap-3 text-sm leading-relaxed">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9 max-w-md border-y border-black/15 py-5">
              <p className="text-sm font-medium">Who can train?</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Group training starts at age 8. Private one-on-one starts at age 10. A parent or
                guardian should submit requests for players under 18.
              </p>
            </div>
            <Link to="/programs" className="ooo-text-link mt-6">
              See programs & pricing <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="h-fit border border-black/15 bg-background p-6 shadow-[0_12px_40px_-24px_#00000030] sm:p-9">
            <div className="mb-7 flex items-start justify-between gap-4 border-b border-border pb-6">
              <div>
                <h2 className="font-display text-2xl font-semibold">Request your evaluation</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  No payment required to send your request.
                </p>
              </div>
              <ShieldCheck
                className="mt-1 h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <BookingForm type="training" />
          </div>
        </div>
      </div>
    </section>
  );
}
