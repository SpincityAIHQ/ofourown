import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot } from "@/components/media";

export const Route = createFileRoute("/advocacy")({
  head: () => ({
    meta: [
      { title: "Advocacy — Ben Gordon, NBA legend | OfOurOwn" },
      { name: "description", content: "Ben Gordon's ongoing advocacy work in mental health, men's wellbeing, and athlete aftercare." },
      { property: "og:title", content: "Advocacy — Ben Gordon" },
      { property: "og:description", content: "Mental health and athlete-aftercare advocacy." },
    ],
  }),
  component: AdvocacyPage,
});

const PILLARS = [
  { title: "Mental health", blurb: "Open, on-the-record conversation about pressure, identity, and getting help — without the gloss." },
  { title: "Men's wellbeing", blurb: "Real talk for men on emotional health, fatherhood, and the long road through middle life." },
  { title: "Athlete aftercare", blurb: "What happens to athletes after the cheering stops — and what we owe them." },
];

function AdvocacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Advocacy"
        title="On the record."
        lede="Ben's ongoing public work in mental health, men's wellbeing, and athlete aftercare. Mission-first. No donation claims here — anything fundraising-related will live on dedicated, vetted pages."
      />
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Pillars</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Three places to push.</h2>
        </FadeIn>
        <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.04} className="bg-background">
              <div className="h-full p-8">
                <h3 className="font-display text-2xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.blurb}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Press & features</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Where the work has shown up.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Press logos and links will populate here as features clear.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-10 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (<MediaSlot key={i} label={`PRESS ${i + 1}`} aspect="1:1" />))}
          </div>
        </FadeIn>
      </Section>
      <Section>
        <div className="border border-foreground p-8 md:p-12">
          <Eyebrow>If you're in crisis</Eyebrow>
          <p className="font-display text-2xl font-semibold md:text-3xl">You're not alone. Help is available right now.</p>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            In the US, call or text <a href="tel:988" className="font-medium underline underline-offset-4">988</a> to reach the Suicide & Crisis Lifeline, 24/7.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            This page does not provide medical or mental-health advice. For partnerships or press, use <Link to="/contact" className="underline underline-offset-4">the contact page</Link>.
          </p>
        </div>
      </Section>
    </>
  );
}