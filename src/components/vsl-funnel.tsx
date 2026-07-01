import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Play, ArrowDown, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { submitLead } from "@/lib/intake.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eyebrow } from "@/components/section";
import { cn } from "@/lib/utils";

export function VSLHero({
  eyebrow,
  headline,
  subhead,
  nextHref = "#problem",
  nextLabel = "Watch why",
  mediaSrc,
  mediaAlt,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  headline: string;
  subhead: string;
  nextHref?: string;
  nextLabel?: string;
  mediaSrc?: string;
  mediaAlt?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.05] md:text-6xl">
            {headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {subhead}
          </p>
          {primaryCta || secondaryCta ? (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {primaryCta ? (
                <a
                  href={primaryCta.href}
                  className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90"
                >
                  {primaryCta.label} <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
              {secondaryCta ? (
                <a
                  href={secondaryCta.href}
                  className="inline-flex h-12 items-center gap-2 border border-foreground px-6 text-sm uppercase tracking-wider transition hover:bg-foreground hover:text-background"
                >
                  {secondaryCta.label}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="mt-10 aspect-video w-full overflow-hidden border border-foreground bg-foreground">
          <button
            type="button"
            aria-label="Play video"
            className="group relative grid h-full w-full place-items-center bg-foreground text-background transition hover:opacity-90"
          >
            {mediaSrc ? (
              <>
                <img
                  src={mediaSrc}
                  alt={mediaAlt ?? headline}
                  title={mediaAlt ?? headline}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />
              </>
            ) : null}
            <div className="relative z-10 grid h-20 w-20 place-items-center rounded-full border border-background/40 bg-black/20 transition group-hover:scale-110 md:h-24 md:w-24">
              <Play className="h-8 w-8 translate-x-0.5 fill-background" />
            </div>
          </button>
        </div>
        <div className="mt-8 flex justify-center">
          <a
            href={nextHref}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
          >
            {nextLabel} <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function FunnelSection({
  id,
  step,
  eyebrow,
  title,
  children,
  nextHref,
  nextLabel,
  tone = "default",
}: {
  id: string;
  step: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  nextHref?: string;
  nextLabel?: string;
  tone?: "default" | "invert";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 border-b border-border",
        tone === "invert" && "bg-foreground text-background",
      )}
    >
      <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
        <div className="flex items-baseline gap-6">
          <span
            className={cn(
              "font-display text-5xl font-semibold opacity-30 md:text-6xl",
            )}
          >
            {step}
          </span>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl">
          {title}
        </h2>
        <div className="mt-8 space-y-5 text-lg leading-relaxed md:text-xl">
          {children}
        </div>
        {nextHref ? (
          <div className="mt-12">
            <a
              href={nextHref}
              className={cn(
                "inline-flex h-12 items-center gap-2 px-6 text-sm uppercase tracking-wider transition",
                tone === "invert"
                  ? "bg-background text-foreground hover:opacity-90"
                  : "bg-foreground text-background hover:opacity-90",
              )}
            >
              {nextLabel ?? "Keep going"} <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((x) => (
        <li key={x} className="flex items-start gap-3">
          <Check className="mt-1 h-5 w-5 shrink-0" />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Email capture that, once submitted, reveals the next step (booking form,
 * checkout link, etc.). Classic VSL gate: lead first, offer second.
 */
export function FunnelGate({
  id,
  source,
  eyebrow,
  title,
  pitch,
  ctaLabel = "Unlock next step",
  children,
}: {
  id: string;
  source: string;
  eyebrow: string;
  title: string;
  pitch: string;
  ctaLabel?: string;
  children: ReactNode;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const submit = useServerFn(submitLead);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await submit({ data: { email, source } });
      setUnlocked(true);
      toast.success("You're in. Next step unlocked.");
      setTimeout(() => {
        document.getElementById(`${id}-next`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id={id} className="scroll-mt-20 border-b border-border bg-foreground text-background">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl">
          {title}
        </h2>
        <p className="mt-6 text-lg text-background/70 md:text-xl">{pitch}</p>

        {unlocked ? (
          <div className="mt-10 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-background/70">
            <Check className="h-4 w-4" /> Email confirmed — scroll for the next step
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 flex w-full max-w-xl gap-2">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 rounded-none border-background bg-transparent text-background placeholder:text-background/50"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-none bg-background px-6 uppercase tracking-wider text-foreground hover:opacity-90"
            >
              {loading ? "..." : ctaLabel}
            </Button>
          </form>
        )}

        <div
          id={`${id}-next`}
          className={cn(
            "scroll-mt-20 overflow-hidden transition-all duration-500",
            unlocked ? "mt-16 max-h-[4000px] opacity-100" : "mt-0 max-h-0 opacity-0 pointer-events-none",
          )}
        >
          <div className="border-t border-background/20 pt-12">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function FunnelLinkCTA({
  to,
  params,
  href,
  children,
}: {
  to?: string;
  params?: Record<string, string>;
  href?: string;
  children: ReactNode;
}) {
  const className =
    "inline-flex h-12 items-center gap-2 bg-background px-6 text-sm uppercase tracking-wider text-foreground transition hover:opacity-90";
  if (href) {
    return (
      <a href={href} className={className}>
        {children} <ArrowRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <Link to={to as never} params={params as never} className={className}>
      {children} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}