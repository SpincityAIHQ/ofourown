/**
 * Program capacity — the single source of truth for honest scarcity.
 *
 * IMPORTANT: Update manually to reflect REAL availability — never fake.
 * Do not add auto-decrementing counters or random numbers. If a program is
 * open with plenty of room, set a generous `spotsRemaining`; if it is truly
 * limited, lower it; if it is not enrollment-based, use status "invite".
 *
 * Later: compute spotsRemaining = totalSpots − confirmed bookings from
 * Supabase (booking_requests) so scarcity self-updates honestly. Until that
 * wiring exists, these values are edited by hand.
 */

export type CapacityStatus = "enrolling" | "few" | "invite" | "closed";

export type Capacity = {
  program: string;
  /** Key matching a program (group, private, private-plus, camp) or page slug. */
  key: string;
  season: string;
  spotsRemaining: number;
  totalSpots: number;
  status: CapacityStatus;
};

export const CAPACITY: Capacity[] = [
  {
    program: "Free Evaluation",
    key: "evaluation",
    season: "Current session",
    spotsRemaining: 0,
    totalSpots: 0,
    status: "enrolling",
  },
  {
    program: "Group Training",
    key: "group",
    season: "Current session",
    spotsRemaining: 0,
    totalSpots: 0,
    status: "enrolling",
  },
  {
    program: "Private Training",
    key: "private",
    season: "Current session",
    spotsRemaining: 0,
    totalSpots: 0,
    status: "enrolling",
  },
  {
    program: "Private Plus",
    key: "private-plus",
    season: "Current session",
    spotsRemaining: 0,
    totalSpots: 0,
    status: "enrolling",
  },
  {
    program: "One-Day Camp",
    key: "camp",
    season: "Current session",
    spotsRemaining: 0,
    totalSpots: 0,
    status: "enrolling",
  },
];

export function getCapacity(key: string): Capacity | undefined {
  return CAPACITY.find((c) => c.key === key);
}
