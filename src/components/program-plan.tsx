import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Section, Eyebrow } from "@/components/section";
import { FadeIn } from "@/components/media";
import { EnrollmentBadge } from "@/components/urgency";
import {
  EVALUATION,
  PLACEMENT,
  POLICIES,
  PROGRAMS,
  PRICING_SUMMARY,
  COMMITMENT_NOTE,
  formatUSD,
  type Program,
} from "@/lib/pricing";

const CTA_LABEL = "Book Your Free Evaluation";

function EvalCTA({ apex = false }: { apex?: boolean }) {
  return (
    <Link
      to="/evaluation"
      className={`inline-flex h-12 items-center gap-2 px-6 text-sm uppercase tracking-wider transition ${
        apex
          ? "bg-background text-foreground hover:opacity-90"
          : "bg-foreground text-background hover:opacity-90"
      }`}
    >
      {CTA_LABEL} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

const MODEL_STEPS = [
  {
    step: "01",
    title: "Free evaluation",
    line: "Every athlete starts here. No cost, no commitment — the only way in.",
  },
  {
    step: "02",
    title: "Placed by skill",
    line: "We place players by skill level, not age — so everyone is challenged correctly.",
  },
  {
    step: "03",
    title: "Choose your track",
    line: "Group, Private, Private Plus, or a One-Day Camp. Packages only — no drop-ins.",
  },
];

function ProgramCard({ program }: { program: Program }) {
  const apex = !!program.apex;
  const meta = [program.duration, program.capacity, program.ages].filter(Boolean);
  return (
    <div
      className={`flex h-full flex-col justify-between gap-8 p-8 ${
        apex ? "bg-foreground text-background" : "bg-background"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-semibold">{program.name}</h3>
          {apex ? (
            <span className="border border-background/50 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-background/80">
              Flagship
            </span>
          ) : null}
        </div>
        <p className={`mt-2 text-sm ${apex ? "text-background/70" : "text-muted-foreground"}`}>
          {program.focus}
        </p>

        <ul className="mt-6 space-y-3">
          {program.tiers.map((t) => (
            <li
              key={t.label}
              className={`flex items-baseline justify-between border-b pb-3 ${
                apex ? "border-background/20" : "border-border"
              }`}
            >
              <span className="text-sm uppercase tracking-[0.15em]">{t.label}</span>
              <span className="text-right">
                <span className="font-display text-2xl font-semibold">{formatUSD(t.price)}</span>
                {t.perSession ? (
                  <span
                    className={`ml-2 text-xs ${apex ? "text-background/60" : "text-muted-foreground"}`}
                  >
                    {formatUSD(t.perSession)}/session
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>

        <div className={`mt-5 space-y-1 text-xs ${apex ? "text-background/70" : "text-muted-foreground"}`}>
          <p>{meta.join(" · ")}</p>
          <p>{program.ledBy}</p>
          {program.fstIntegrated ? (
            <p className={apex ? "text-background/90" : "text-foreground"}>
              Includes integrated performance &amp; recovery work —{" "}
              <Link
                to="/fst"
                className="underline underline-offset-2 hover:opacity-80"
              >
                see Fascia Stretch Therapy
              </Link>
              .
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <EnrollmentBadge
          programKey={program.id}
          className={apex ? "border-background/50 text-background/80" : undefined}
        />
      </div>
    </div>
  );
}

/**
 * The full training model per Ben's plan: how it works, the free evaluation
 * front door, skill-based placement, the package menu, policies, and an
 * at-a-glance pricing summary. Shared by /training and /programs.
 */
export function ProgramPlan({ withSummary = true }: { withSummary?: boolean }) {
  return (
    <>
      {/* The Model */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>The Model</Eyebrow>
          <h2 className="max-w-3xl font-display text-4xl font-semibold leading-tight md:text-6xl">
            How training works.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Package-only development, built around a free evaluation. No drop-ins,
            no hourly rates — just a clear path from first assessment to the right
            program.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
          {MODEL_STEPS.map((s, i) => (
            <FadeIn key={s.step} delay={i * 0.05} className="bg-background">
              <div className="h-full p-8">
                <span className="font-display text-4xl font-semibold opacity-30">{s.step}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.line}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Evaluation front door */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <Eyebrow>The Front Door</Eyebrow>
              <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
                Book your free evaluation.
              </h2>
              <p className="mt-6 max-w-xl text-lg text-background/70">
                {EVALUATION.note} We assess each player and place them at the right
                level before any package begins.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm uppercase tracking-[0.15em] text-background/80">
                <span>{EVALUATION.priceLabel}</span>
                <span>{EVALUATION.frequency}</span>
                <span>{EVALUATION.capacity}</span>
                <span>Resume-exempt</span>
              </div>
            </div>
            <div className="md:col-span-5 md:text-right">
              <EvalCTA apex />
            </div>
          </div>
        </div>
      </section>

      {/* Age & placement */}
      <Section className="border-b border-border">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>Age &amp; Placement</Eyebrow>
              <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
                {PLACEMENT.note}
              </h2>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.05}>
              <ul className="space-y-3">
                {PLACEMENT.ages.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-lg">
                    <Check className="mt-1 h-5 w-5 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Skill tiers
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PLACEMENT.skillTiers.map((t) => (
                  <span
                    key={t}
                    className="border border-border px-4 py-2 text-sm uppercase tracking-[0.15em]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>

      {/* Programs & pricing */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Programs</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-6xl">Choose your track.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">{COMMITMENT_NOTE}</p>
        </FadeIn>
        <div className="mt-12 grid gap-px bg-border md:grid-cols-2">
          {PROGRAMS.map((p, i) => (
            <FadeIn key={p.id} delay={(i % 2) * 0.05}>
              <ProgramCard program={p} />
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.1}>
          <div className="mt-10 flex flex-col items-start gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-muted-foreground">
              Not sure which fits? Start with a free evaluation and we'll place your athlete.
            </p>
            <EvalCTA />
          </div>
        </FadeIn>
      </Section>

      {/* Policies */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Policies</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">The fine print, up front.</h2>
        </FadeIn>
        <div className="mt-10 grid gap-px bg-border md:grid-cols-2">
          <div className="bg-background p-8">
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Package expiry</h3>
            <ul className="mt-4 space-y-3">
              {POLICIES.expiry.map((x) => (
                <li key={x} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-background p-8">
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Cancellation</h3>
            <ul className="mt-4 space-y-3">
              {POLICIES.cancellation.map((x) => (
                <li key={x} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Pricing summary */}
      {withSummary ? (
        <Section className="border-b border-border">
          <FadeIn>
            <Eyebrow>Pricing Summary</Eyebrow>
            <h2 className="font-display text-4xl font-semibold md:text-5xl">Everything at a glance.</h2>
          </FadeIn>
          <FadeIn delay={0.05}>
            <div className="mt-10 overflow-x-auto border border-border">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="px-5 py-4 font-medium">Program</th>
                    <th className="px-5 py-4 font-medium">Option</th>
                    <th className="px-5 py-4 font-medium">Price</th>
                    <th className="px-5 py-4 font-medium">Per session</th>
                    <th className="px-5 py-4 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING_SUMMARY.map((r, i) => (
                    <tr key={`${r.program}-${r.option}-${i}`} className="border-b border-border last:border-b-0">
                      <td className="px-5 py-4 font-medium">{r.program}</td>
                      <td className="px-5 py-4 uppercase tracking-[0.1em] text-muted-foreground">{r.option}</td>
                      <td className="px-5 py-4 font-display text-lg font-semibold">{r.price}</td>
                      <td className="px-5 py-4 text-muted-foreground">{r.perSession}</td>
                      <td className="px-5 py-4 text-muted-foreground">{r.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </Section>
      ) : null}
    </>
  );
}
