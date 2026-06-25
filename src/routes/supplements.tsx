import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot } from "@/components/media";

export const Route = createFileRoute("/supplements")({
  head: () => ({
    meta: [
      { title: "Supplements — OfOurOwn | Ben Gordon, NBA legend" },
      { name: "description", content: "Daily supplement protocols from Ben Gordon, NBA legend — coming soon to the shop." },
      { property: "og:title", content: "Supplements — Ben Gordon" },
      { property: "og:description", content: "Daily supplement protocols — coming soon." },
    ],
  }),
  component: SupplementsPage,
});

function SupplementsPage() {
  return (
    <>
      <PageHero
        eyebrow="Supplements"
        title="What Ben actually takes."
        lede="Daily protocols, sourcing notes, and stack guidance. Product drops will land here and ship from the shop."
      />
      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>Coming soon</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">Stacks, not noise.</h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                The first supplement drops will be added to the shop as they clear. This page does not provide medical or nutrition advice — always consult a qualified professional.
              </p>
              <div className="mt-8">
                <Link to="/shop" className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90">
                  Visit the shop <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
          <div className="md:col-span-7"><FadeIn delay={0.1}><MediaSlot label="SUPPLEMENT · product · placeholder" aspect="4:3" /></FadeIn></div>
        </div>
      </Section>
    </>
  );
}