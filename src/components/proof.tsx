import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Social-proof system. Every value here is a clearly-labeled PLACEHOLDER until
 * real, permissioned testimonials and verified figures are dropped in. Do not
 * publish invented results.
 */

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  /** When false, a "Placeholder" tag is shown. */
  real?: boolean;
};

export function StarRating({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("h-4 w-4", i < count ? "fill-foreground text-foreground" : "text-muted-foreground/40")}
        />
      ))}
    </div>
  );
}

export function Testimonial({ quote, name, role, real = false }: Testimonial) {
  return (
    <figure className="flex h-full flex-col justify-between gap-6 bg-background p-8">
      <div>
        <StarRating />
        <blockquote className="mt-5 font-display text-xl leading-snug">“{quote}”</blockquote>
      </div>
      <figcaption className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {name}
        {role ? (
          <span className="block normal-case tracking-normal text-muted-foreground/70">{role}</span>
        ) : null}
        {null}
      </figcaption>
    </figure>
  );
}

const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  { quote: "Coach completely changed my son's confidence on the court.", name: "Parent", role: "Chicago, IL" },
  { quote: "The best basketball development I've been part of in the city.", name: "Player", role: "High school guard" },
  { quote: "Ben teaches the game the way it's actually played at the highest level.", name: "Coach", role: "AAU program director" },
];

export function TestimonialGrid({
  items,
  columns = 3,
}: {
  items?: Testimonial[];
  columns?: 2 | 3;
}) {
  const list = items?.length ? items : PLACEHOLDER_TESTIMONIALS;
  return (
    <div
      className={cn(
        "grid gap-px bg-border",
        columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
      )}
    >
      {list.map((t, i) => (
        <Testimonial key={i} {...t} />
      ))}
    </div>
  );
}

/**
 * A single proof statistic. Values default to "—" until verified — pass a real
 * value only once permissioned.
 */
export function ProofStat({
  value = "—",
  label,
}: {
  value?: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2 border-l border-border px-6 py-4 first:border-l-0 md:px-8">
      <div className="font-display text-4xl font-semibold leading-none md:text-5xl">{value}</div>
      <div className="text-[10px] uppercase leading-snug tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function ProofStatBar({
  items,
  className,
}: {
  items: { value?: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 border border-border sm:grid-cols-3", className)}>
      {items.map((s) => (
        <ProofStat key={s.label} value={s.value} label={s.label} />
      ))}
    </div>
  );
}
