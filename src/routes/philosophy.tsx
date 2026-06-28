import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/section";
import { FadeIn } from "@/components/media";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/philosophy")({
  head: () => ({
    meta: [
      { title: "Our Philosophy — OOO Performance" },
      { name: "description", content: "We don't just teach basketball. The OOO Performance philosophy develops complete players — decision-making, confidence, footwork, IQ, and leadership — from youth through professional." },
      { property: "og:title", content: "Our Philosophy — OOO Performance" },
      { property: "og:description", content: "Developing complete players, not just better basketball players." },
      { property: "og:url", content: `${SITE_ORIGIN}/philosophy` },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PhilosophyPage,
});

const BUILD = [
  { title: "Decision-Making", line: "Reading the game a beat faster than the play." },
  { title: "Confidence", line: "Belief that holds up under pressure, not just in drills." },
  { title: "Footwork", line: "The quiet foundation under everything that looks effortless." },
  { title: "Conditioning", line: "A body that lasts a full game — and a full career." },
  { title: "Shooting Mechanics", line: "Repeatable form that travels from the gym to the moment." },
  { title: "Leadership", line: "Setting the standard for the players around you." },
  { title: "Basketball IQ", line: "Understanding the why, not just the what." },
];

function PhilosophyPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-28 md:py-40">
          <Eyebrow>The Philosophy</Eyebrow>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">
            We develop complete players.
          </h1>
          {/* One-line slot for Ben's personal conviction — replace with his words. */}
          <p className="mt-10 max-w-2xl border-l border-border pl-6 font-display text-2xl leading-snug text-muted-foreground md:text-3xl">
            “Placeholder — Ben's personal conviction about what it means to
            develop a complete player goes here.”
          </p>
        </div>
      </section>

      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>The thesis</Eyebrow>
              <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
                We don't just teach basketball.
              </h2>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.05}>
              <div className="space-y-5 text-lg leading-relaxed text-muted-foreground md:text-xl">
                <p>
                  Most training stops at the skill. A better crossover, a
                  cleaner jumper, a faster first step. Those matter — but they're
                  the surface. The players who last are the ones who think the
                  game, lead the room, and keep their bodies under them when it
                  counts.
                </p>
                <p>
                  Our work develops the whole athlete: the decision-maker, the
                  competitor, the teammate, and the person. We build players who
                  are still getting better when everyone else has plateaued —
                  because the foundation underneath them is real.
                </p>
                <p className="font-display text-2xl text-foreground">
                  That's the difference.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>

      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>What we build</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            The complete player, piece by piece.
          </h2>
        </FadeIn>
        <div className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {BUILD.map((b, i) => (
            <FadeIn key={b.title} delay={(i % 3) * 0.04} className="bg-background">
              <div className="h-full p-8">
                <h3 className="font-display text-2xl font-semibold">{b.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{b.line}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-start gap-8">
          <h2 className="max-w-3xl font-display text-4xl font-semibold leading-tight md:text-6xl">
            Ready to develop the complete player?
          </h2>
          <Link
            to="/evaluation"
            className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90"
          >
            Book Evaluation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
