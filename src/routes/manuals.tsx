import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot } from "@/components/media";

export const Route = createFileRoute("/manuals")({
  head: () => ({
    meta: [
      { title: "Manuals — training & wellness | OfOurOwn" },
      { name: "description", content: "Programmed training and wellness manuals from Ben Gordon, NBA legend." },
      { property: "og:title", content: "Manuals — Ben Gordon" },
      { property: "og:description", content: "Programmed training and wellness manuals." },
    ],
  }),
  component: ManualsPage,
});

const ITEMS = [
  { title: "Training manual", blurb: "Strength, conditioning, and recovery — programmed." },
  { title: "Wellness manual", blurb: "Sleep, nutrition, and habits for the long game." },
  { title: "Return-to-play", blurb: "A roadmap for getting back from injury, intelligently." },
];

function ManualsPage() {
  return (
    <>
      <PageHero
        eyebrow="Manuals"
        title="Programmed work, on paper."
        lede="Step-by-step manuals based on the systems Ben Gordon runs with private clients. Drops as each title is finalized."
      />
      <Section className="border-b border-border">
        <div className="grid gap-px bg-border md:grid-cols-3">
          {ITEMS.map((m, i) => (
            <FadeIn key={m.title} delay={i * 0.04} className="bg-background">
              <div className="flex h-full flex-col gap-6 p-8">
                <MediaSlot label={`MANUAL · ${m.title}`} aspect="3:4" />
                <div>
                  <h3 className="font-display text-2xl font-semibold">{m.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{m.blurb}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>
      <Section>
        <FadeIn>
          <Eyebrow>Get them</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Manuals live in the shop.</h2>
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