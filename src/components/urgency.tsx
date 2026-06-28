import { cn } from "@/lib/utils";
import { getCapacity, type CapacityStatus } from "@/data/capacity";

/**
 * Honest urgency primitives. Everything renders from src/data/capacity.ts,
 * which is edited by hand to reflect REAL availability — never faked, never
 * auto-decremented.
 */

function statusLabel(status: CapacityStatus, spotsRemaining: number): string {
  switch (status) {
    case "few":
      return spotsRemaining > 0 ? `Only ${spotsRemaining} spots left` : "Few spots left";
    case "invite":
      return "Invite only";
    case "closed":
      return "Enrollment closed";
    case "enrolling":
    default:
      return "Now enrolling";
  }
}

/**
 * Full-width banner stating real availability for a program. Pass a capacity
 * `key` (matching src/data/capacity.ts) or an explicit message.
 */
export function SpotsBanner({
  programKey,
  message,
  className,
}: {
  programKey?: string;
  message?: string;
  className?: string;
}) {
  const cap = programKey ? getCapacity(programKey) : undefined;
  const text =
    message ??
    (cap
      ? `${cap.program} · ${cap.season} — ${statusLabel(cap.status, cap.spotsRemaining)}`
      : "Now enrolling — limited spots each session");

  return (
    <div
      className={cn(
        "border-y border-border bg-foreground text-background",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-1 px-6 py-3 text-center text-xs uppercase tracking-[0.2em] md:flex-row md:gap-3">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-background/70" aria-hidden />
        <span>{text}</span>
        <span className="text-background/50">· availability updated manually</span>
      </div>
    </div>
  );
}

/**
 * Small inline badge for program cards. Reflects the capacity status for the
 * given tier; defaults to "Enrolling".
 */
export function EnrollmentBadge({
  programKey,
  status,
  className,
}: {
  programKey?: string;
  status?: CapacityStatus;
  className?: string;
}) {
  const cap = programKey ? getCapacity(programKey) : undefined;
  const resolved: CapacityStatus = status ?? cap?.status ?? "enrolling";
  const label = statusLabel(resolved, cap?.spotsRemaining ?? 0);

  const tone =
    resolved === "invite"
      ? "border-border text-muted-foreground"
      : resolved === "closed"
        ? "border-border text-muted-foreground line-through"
        : "border-foreground text-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-3 py-1 text-[10px] uppercase tracking-[0.2em]",
        tone,
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex h-1.5 w-1.5 rounded-full",
          resolved === "invite" || resolved === "closed" ? "bg-muted-foreground" : "bg-foreground",
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}
