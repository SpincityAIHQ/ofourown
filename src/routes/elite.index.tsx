import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { listPillars } from "@/lib/lms.functions";
import { Section, Eyebrow } from "@/components/section";
import { FadeIn, VideoEmbed } from "@/components/media";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

const pillarsQuery = queryOptions({
  queryKey: ["lms", "pillars"],
  queryFn: () => listPillars(),
});

export const Route = createFileRoute("/elite/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(pillarsQuery),
  head: () => ({
    meta: [
      { title: "OOO Elite — The Complete Athlete | OOO Performance" },
      { name: "description", content: "OOO Elite: the complete-athlete membership from OOO Performance. Five pillars — Performance, Body, Mind, Wealth, Path — for $29.99/month, all-access." },
      { property: "og:title", content: "OOO Elite — The Complete Athlete" },
      { property: "og:description", content: "The complete-athlete membership. Five pillars, all-access, $29.99/month." },
      { property: "og:url", content: `${SITE_ORIGIN}/elite` },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ElitePage,
});

const WHATS_INSIDE = [
  "Five pillars: Performance, Body, Mind, Wealth, Path.",
  "Skill, shooting, and IQ breakdowns from Ben's game.",
  "Health, recovery, and fascia work for longevity.",
  "Mental performance and the honest inner game.",
  "NIL, money, and life-after-sport education.",
  "Recruiting, leadership, and guest sessions.",
];

function ElitePage() {
  const { data: pillars } = useSuspenseQuery(pillarsQuery);

  return (
    <>
      {/* Hero — premium, dark */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
          <p className="font-display text-sm uppercase tracking-[0.4em] text-background/60">
            OOO Elite
          </p>
          <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.95] tracking-tight md:text-8xl">
            The Complete Athlete.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-background/70 md:text-xl">
            The all-access membership that develops every part of the athlete —
            game, body, mind, wealth, and path — guided by 12-Year NBA Veteran
            Ben Gordon.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold md:text-6xl">$29.99</span>
              <span className="text-sm uppercase tracking-[0.2em] text-background/60">/ month</span>
            </div>
            <Link
              to="/elite/learn"
              className="inline-flex h-12 items-center gap-2 bg-background px-6 text-sm uppercase tracking-wider text-foreground transition hover:opacity-90"
            >
              Join OOO Elite <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-background/50">
            Flat, all-access · a digital membership — separate from in-person OOO Performance training.
          </p>
        </div>
      </section>

      {/* Five pillars */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>The Curriculum</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-6xl">Five pillars.</h2>
        </FadeIn>
        <div className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => {
            const courses = p.courses.length;
            const lessons = p.courses.reduce(
              (n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0),
              0,
            );
            return (
              <FadeIn key={p.id} delay={(i % 3) * 0.04} className="bg-background">
                <Link to="/elite/learn" hash={p.slug} className="group flex h-full flex-col justify-between gap-10 p-8 transition hover:bg-accent">
                  <div>
                    <span className="font-display text-4xl font-semibold opacity-20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.subtitle}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <span>{courses} courses · {lessons} lessons</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* What's inside */}
      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>What's Inside</Eyebrow>
              <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
                Everything, in one membership.
              </h2>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.05}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {WHATS_INSIDE.map((x) => (
                  <li key={x} className="flex items-start gap-3 border-l border-border py-1 pl-4 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </Section>

      {/* Trailer */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Watch</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Membership trailer.</h2>
        </FadeIn>
        <div className="mt-10">
          <FadeIn delay={0.05}>
            <VideoEmbed label="MEMBERSHIP TRAILER · paste URL" aspect="16:9" />
          </FadeIn>
        </div>
      </Section>

      {/* Closing CTA */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-tight md:text-6xl">
            Become the complete athlete.
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link
              to="/elite/learn"
              className="inline-flex h-12 items-center gap-2 bg-background px-6 text-sm uppercase tracking-wider text-foreground transition hover:opacity-90"
            >
              Join OOO Elite — $29.99/mo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/elite/learn" className="text-xs uppercase tracking-[0.2em] text-background/60 hover:text-background">
              Browse the academy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
