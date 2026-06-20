import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Ben Gordon" },
      { name: "description", content: "A short bio of Benjamin Gordon — training, wellness, and coaching." },
      { property: "og:title", content: "About Ben Gordon" },
      { property: "og:description", content: "A short bio of Benjamin Gordon." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Ben Gordon." />
      <Section>
        <div className="mx-auto max-w-2xl space-y-6 text-lg leading-relaxed text-foreground/90">
          <p>
            Ben has spent the last decade building a body of work around one
            simple question: how do we keep performing — and stay healthy —
            for the long haul?
          </p>
          <p>
            He works with a small group of private clients on training,
            wellness, and life strategy, and shares what he learns through
            programs, guides, and the occasional dispatch.
          </p>
          <p className="text-muted-foreground">
            Replace this copy with Ben's real bio when ready.
          </p>
        </div>
      </Section>
    </>
  );
}