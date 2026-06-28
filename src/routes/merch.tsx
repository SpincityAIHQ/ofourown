import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot } from "@/components/media";
import merch1 from "@/assets/merch-1.jpg";
import merch2 from "@/assets/merch-2.jpg";
import merch3 from "@/assets/merch-3.jpg";
import merch4 from "@/assets/merch-4.jpg";
import merch5 from "@/assets/merch-5.jpg";
import merch6 from "@/assets/merch-6.jpg";

const ITEMS = [
  { name: "Signature tee", image: merch1, alt: "OfOurOwn signature tee in soft black cotton, folded on a neutral linen backdrop with the embroidered OOO mark visible." },
  { name: "Black cap", image: merch2, alt: "OfOurOwn six-panel black cap with low-profile crown and tonal OOO embroidery, shot from a three-quarter angle." },
  { name: "Heavyweight hoodie", image: merch3, alt: "OfOurOwn heavyweight pullover hoodie in washed charcoal, laid flat under warm window light." },
  { name: "Insulated bottle", image: merch4, alt: "OfOurOwn insulated steel water bottle in matte black with subtle OOO wordmark, standing on a stone surface." },
  { name: "Training shorts", image: merch5, alt: "OfOurOwn training shorts in oat-toned technical fabric, folded next to a gym towel on a wooden bench." },
  { name: "Gym towel", image: merch6, alt: "OfOurOwn ribbed cotton gym towel in walnut brown, rolled tight beside a kettlebell." },
];

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merch — OfOurOwn | Ben Gordon, NBA Veteran" },
      { name: "description", content: "Apparel and goods from OfOurOwn — Ben Gordon, NBA Veteran." },
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
          {ITEMS.map((item, i) => (
            <FadeIn key={item.name} delay={(i % 3) * 0.04} className="bg-background">
              <div className="flex h-full flex-col gap-4 p-6">
                <MediaSlot label={`MERCH · product ${i + 1}`} aspect="1:1" src={item.image} alt={item.alt} />
                <p className="text-sm text-muted-foreground">{item.name}</p>
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