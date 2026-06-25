import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot } from "@/components/media";

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merch — OfOurOwn | Ben Gordon, NBA legend" },
      { name: "description", content: "Apparel and goods from OfOurOwn — Ben Gordon, NBA legend." },
      { property: "og:title", content: "Merch — OfOurOwn" },
      { property: "og:description", content: "Apparel and goods from OfOurOwn." },
    ],
  }),
  component: MerchPage,
});

function MerchPage() {
  return (
    <>
      <PageHero
        eyebrow="Merch"
        title="Wear the work."
        lede="Apparel and goods from OfOurOwn — quiet, well-made, built for everyday."
      />
      <Section className="border-b border-border">
        <div className="grid gap-px bg-border md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <FadeIn key={i} delay={(i % 3) * 0.04} className="bg-background">
              <div className="flex h-full flex-col gap-4 p-6">
                <MediaSlot label={`MERCH · product ${i + 1}`} aspect="1:1" />
                <p className="text-sm text-muted-foreground">Product name · placeholder</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>
      <Section>
        <FadeIn>
          <Eyebrow>Buy</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Pieces ship from the shop.</h2>
          <div className="mt-8">
            <Link to="/shop" className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90">
              Visit the shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}