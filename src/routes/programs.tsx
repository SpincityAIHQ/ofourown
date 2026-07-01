import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/section";
import { SpotsBanner } from "@/components/urgency";
import { ProgramPlan } from "@/components/program-plan";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs & Pricing — OOO Performance" },
      { name: "description", content: "OOO Performance training programs and pricing. Package-only development — free evaluation, then Group, Private, Private Plus, and camps. Placed by skill, not age." },
      { property: "og:title", content: "Programs & Pricing — OOO Performance" },
      { property: "og:description", content: "Package-only development. Free evaluation, then Group, Private, Private Plus, and camps." },
      { property: "og:url", content: `${SITE_ORIGIN}/programs` },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Eyebrow>Programs &amp; Pricing</Eyebrow>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.0] tracking-tight md:text-7xl">
            Find your level.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            One standard, four ways to train. Every athlete starts with a free
            evaluation, then trains in the package that fits — placed by skill,
            not age.
          </p>
          <div className="mt-10">
            <Link
              to="/evaluation"
              className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90"
            >
              Book Your Free Evaluation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SpotsBanner programKey="evaluation" />

      <ProgramPlan />
    </>
  );
}
