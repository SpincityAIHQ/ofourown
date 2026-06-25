import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Ben Gordon — NBA legend | OfOurOwn" },
      { name: "description", content: "About Ben Gordon, NBA legend — training, wellness, and coaching." },
      { property: "og:title", content: "About Ben Gordon — NBA legend" },
      { property: "og:description", content: "About Ben Gordon, NBA legend." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Ben Gordon — NBA legend." />
      <Section>
        <div className="mx-auto max-w-2xl space-y-6 text-lg leading-relaxed text-foreground/90">
          <p>
            Ben Gordon, NBA legend, has spent the last decade building a body
            of work around one simple question: how do we keep performing —
            and stay healthy — for the long haul?
          </p>
          <p>
            Ben Gordon works with a small group of private clients on
            training, wellness, and life strategy, and shares what he learns
            through programs, guides, and the occasional dispatch.
          </p>
          <p className="text-muted-foreground">
            Replace this copy with Ben Gordon's real bio when ready.
          </p>
        </div>
      </Section>
    </>
  );
}