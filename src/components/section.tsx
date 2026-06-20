import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  bleed = false,
}: {
  children: ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <section className={cn("py-20 md:py-28", className)}>
      <div className={cn(bleed ? "px-6" : "mx-auto max-w-6xl px-6")}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">
      {children}
    </p>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
          {title}
        </h1>
        {lede ? (
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {lede}
          </p>
        ) : null}
      </div>
    </section>
  );
}