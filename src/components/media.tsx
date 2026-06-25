import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Aspect = "16:9" | "1:1" | "4:3" | "3:4";

const ASPECT_CLASS: Record<Aspect, string> = {
  "16:9": "aspect-video",
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "3:4": "aspect-[3/4]",
};

export function MediaSlot({
  label,
  aspect = "16:9",
  src,
  alt,
  className,
  priority = false,
}: {
  label: string;
  aspect?: Aspect;
  src?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div
        className={cn(
          "overflow-hidden border border-border bg-muted",
          ASPECT_CLASS[aspect],
          className,
        )}
      >
        <img
          src={src}
          alt={alt ?? label}
          title={alt ?? label}
          className="h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? { fetchPriority: "high" as const } : {})}
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "grid place-items-center border border-border bg-muted text-center",
        ASPECT_CLASS[aspect],
        className,
      )}
    >
      <span className="px-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return null;
  }
}

export function VideoEmbed({
  label = "VIDEO · paste YouTube or Vimeo URL",
  url,
  className,
}: {
  label?: string;
  url?: string;
  className?: string;
}) {
  const embed = url ? toEmbedUrl(url) : null;
  if (embed) {
    return (
      <div className={cn("aspect-video w-full overflow-hidden border border-foreground bg-foreground", className)}>
        <iframe
          src={embed}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }
  return <MediaSlot label={label} aspect="16:9" className={className} />;
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-start gap-2 border-l border-border px-6 py-4 first:border-l-0 md:px-8">
      <div className="font-display text-4xl font-semibold leading-none md:text-5xl">
        {value}
      </div>
      <div className="text-[10px] uppercase leading-snug tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export type Testimonial = { quote: string; name: string; role?: string };

const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Placeholder testimonial — drop in a real quote from a client, athlete, or organizer.",
    name: "Client name",
    role: "Role / org",
  },
  {
    quote:
      "Placeholder testimonial — short, specific, and ideally tied to a result or moment.",
    name: "Client name",
    role: "Role / org",
  },
  {
    quote:
      "Placeholder testimonial — keep it human; one or two sentences max.",
    name: "Client name",
    role: "Role / org",
  },
];

export function TestimonialRow({ items }: { items?: Testimonial[] }) {
  const list = items?.length ? items : PLACEHOLDER_TESTIMONIALS;
  const isPlaceholder = !items?.length;
  return (
    <div className="grid gap-px bg-border md:grid-cols-3">
      {list.slice(0, 3).map((t, i) => (
        <figure key={i} className="flex flex-col justify-between gap-6 bg-background p-8">
          <blockquote className="font-display text-xl leading-snug">
            “{t.quote}”
          </blockquote>
          <figcaption className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t.name}
            {t.role ? <span className="block normal-case tracking-normal text-muted-foreground/70">{t.role}</span> : null}
            {isPlaceholder ? (
              <span className="mt-2 block text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
                Placeholder
              </span>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function ConfirmNote({ items }: { items: string[] }) {
  return (
    <div className="mt-16 border-t border-border pt-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
      <div>Confirm before publish</div>
      <ul className="mt-2 space-y-1">
        {items.map((x) => (
          <li key={x}>· {x}</li>
        ))}
      </ul>
    </div>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}