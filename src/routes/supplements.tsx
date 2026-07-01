import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot } from "@/components/media";
import supplementProduct from "@/assets/supplement-product.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/supplements")({
  head: () => ({
    meta: [
      { title: "Supplements — OfOurOwn | Ben Gordon, NBA Veteran" },
      { name: "description", content: "Daily supplement protocols from Ben Gordon, NBA Veteran — coming soon to the shop." },
      { property: "og:title", content: "Supplements — Ben Gordon" },
      { property: "og:description", content: "Daily supplement protocols — coming soon." },
      { property: "og:image", content: `${SITE_ORIGIN}${supplementProduct}` },
      { property: "og:image:alt", content: "OfOurOwn daily recovery supplement bottle in matte amber glass, photographed against a warm neutral backdrop." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_ORIGIN}${supplementProduct}` },
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
          <div className="md:col-span-7"><FadeIn delay={0.1}><MediaSlot label="OfOurOwn recovery supplement" aspect="4:3" src={supplementProduct} alt="OfOurOwn daily recovery supplement bottle in matte amber glass, lit by warm window light against a soft neutral backdrop." /></FadeIn></div>
        </div>
        <p className="mt-12 max-w-3xl border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground/70">
          These statements have not been evaluated by the Food and Drug
          Administration. Any products mentioned are not intended to diagnose,
          treat, cure, or prevent any disease. Information here is for general
          education only and is not medical or nutrition advice — consult a
          qualified healthcare professional before starting any supplement.
        </p>
      </Section>
    </>
  );
}