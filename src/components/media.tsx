import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
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

type VideoAspect = "16:9" | "21:9";

const VIDEO_ASPECT_CLASS: Record<VideoAspect, string> = {
  "16:9": "aspect-video",
  "21:9": "aspect-[21/9]",
};

/**
 * Responsive video. With a `url`, shows a poster + play button and lazy-loads
 * the iframe only on click (no autoplay-with-sound). Without one, renders a
 * labeled placeholder so editors can see where video belongs.
 */
export function VideoEmbed({
  label = "VIDEO · paste YouTube or Vimeo URL",
  url,
  poster,
  posterAlt,
  aspect = "16:9",
  className,
  priority = false,
}: {
  label?: string;
  url?: string;
  poster?: string;
  posterAlt?: string;
  aspect?: VideoAspect;
  className?: string;
  priority?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const embed = url ? toEmbedUrl(url) : null;
  const aspectClass = VIDEO_ASPECT_CLASS[aspect];

  if (embed && playing) {
    return (
      <div className={cn(aspectClass, "w-full overflow-hidden border border-foreground bg-foreground", className)}>
        <iframe
          src={`${embed}${embed.includes("?") ? "&" : "?"}autoplay=1`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  if (embed) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play video: ${label}`}
        className={cn(
          "group relative grid w-full place-items-center overflow-hidden border border-foreground bg-foreground text-background transition",
          aspectClass,
          className,
        )}
      >
        {poster ? (
          <>
            <img
              src={poster}
              alt={posterAlt ?? label}
              title={posterAlt ?? label}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
          </>
        ) : null}
        <div className="relative z-10 grid h-16 w-16 place-items-center rounded-full border border-background/40 bg-black/30 transition group-hover:scale-110 md:h-20 md:w-20">
          <Play className="h-7 w-7 translate-x-0.5 fill-background" />
        </div>
      </button>
    );
  }

  // No URL yet — labeled placeholder with a play affordance.
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "group relative grid w-full place-items-center overflow-hidden border border-foreground bg-foreground text-background",
        aspectClass,
        className,
      )}
    >
      {poster ? (
        <>
          <img
            src={poster}
            alt={posterAlt ?? label}
            title={posterAlt ?? label}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
        </>
      ) : null}
      <div className="relative z-10 grid h-16 w-16 place-items-center rounded-full border border-background/40 bg-black/30 md:h-20 md:w-20">
        <Play className="h-7 w-7 translate-x-0.5 fill-background" />
      </div>
      <span className="absolute bottom-3 right-4 z-10 text-[10px] uppercase tracking-[0.2em] text-background/75">
        {label}
      </span>
    </div>
  );
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

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { quote: "Ben brings the standard of an NBA locker room into every session.", name: "Player", role: "Collegiate guard" },
  { quote: "The most detailed player development I've been around.", name: "Coach", role: "High school program" },
  { quote: "My son left the court sharper, calmer, and more confident.", name: "Parent", role: "Chicago, IL" },
];

export function TestimonialRow({ items }: { items?: Testimonial[] }) {
  const list = items?.length ? items : DEFAULT_TESTIMONIALS;
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