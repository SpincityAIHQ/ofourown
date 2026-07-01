/**
 * OOO Performance — training pricing & structure.
 *
 * Source of truth: Ben Gordon's official OOO Performance program plan. Training
 * is PACKAGE-ONLY — there is no drop-in and no hourly rate. The free evaluation
 * is the only entry point. Where the site and the plan differ, the plan wins;
 * update the numbers here and every page follows.
 *
 * (FST and speaking pricing live with their own pages and are unchanged.)
 */

export type PriceTier = {
  label: string; // e.g. "4-Pack", "Single", "Per child"
  price: number; // total price in USD
  perSession?: number; // effective per-session price
};

export type Program = {
  id: "group" | "private" | "private-plus" | "camp";
  name: string;
  duration: string;
  focus: string;
  ledBy: string;
  ages?: string;
  capacity?: string;
  tiers: PriceTier[];
  /** Flagship offer — styled as the apex tier. */
  apex?: boolean;
  /** Performance & recovery (FST) work is built into this program. */
  fstIntegrated?: boolean;
};

export const EVALUATION = {
  name: "Free Evaluation",
  priceLabel: "Free",
  frequency: "",
  capacity: "",
  note: "The free evaluation is the only entry point to training.",
} as const;

export const PROGRAMS: Program[] = [
  {
    id: "group",
    name: "Group Training",
    duration: "1 hour",
    focus: "Skill development in a competitive group setting.",
    ledBy: "Led by Ben Gordon",
    capacity: "Up to 10 players",
    tiers: [
      { label: "4-Pack", price: 320, perSession: 80 },
      { label: "8-Pack", price: 560, perSession: 70 },
    ],
  },
  {
    id: "private",
    name: "Private Training",
    duration: "1 hour",
    focus: "Focused 1-on-1 skill work.",
    ledBy: "1-on-1 coaching",
    ages: "Ages 10+",
    tiers: [
      { label: "Single", price: 350 },
      { label: "4-Pack", price: 1000, perSession: 250 },
    ],
  },
  {
    id: "private-plus",
    name: "Private Plus",
    duration: "90 minutes",
    focus: "Skills + performance & recovery — our most complete session.",
    ledBy: "1-on-1 coaching",
    ages: "Ages 10+",
    apex: true,
    fstIntegrated: true,
    tiers: [
      { label: "Single", price: 500 },
      { label: "4-Pack", price: 1600, perSession: 400 },
    ],
  },
  {
    id: "camp",
    name: "One-Day Camp",
    duration: "3 hours",
    focus: "A high-energy day of development.",
    ledBy: "Staffed by Ben Gordon + team",
    tiers: [{ label: "Per child", price: 200 }],
  },
];

export const PLACEMENT = {
  note: "Players are placed by skill, not age.",
  ages: [
    "Training starts at age 8.",
    "Private training from age 10 (ages 8–9 train in groups).",
  ],
  skillTiers: ["Beginner 1", "Beginner 2", "Intermediate", "Experienced"],
} as const;

export const POLICIES = {
  expiry: [
    "8-Pack expires 90 days from purchase.",
    "All other packages expire 60 days from purchase.",
  ],
  cancellation: [
    "Cancel 24+ hours in advance — the session is returned to your package.",
    "Cancel inside 24 hours, or no-show — the session is forfeited.",
  ],
} as const;

/** "larger commitment = lower per-session rate" */
export const COMMITMENT_NOTE =
  "The larger the commitment, the lower the per-session rate.";

export const formatUSD = (n: number): string =>
  n === 0 ? "Free" : `$${n.toLocaleString("en-US")}`;

/** Flat rows for the at-a-glance Pricing Summary table. */
export type SummaryRow = {
  program: string;
  option: string;
  price: string;
  perSession: string;
  details: string;
};

export const PRICING_SUMMARY: SummaryRow[] = [
  {
    program: "Evaluation",
    option: "Free",
    price: "Free",
    perSession: "—",
    details: "The only entry point to training",
  },
  ...PROGRAMS.flatMap((p) =>
    p.tiers.map((t) => ({
      program: p.name,
      option: t.label,
      price: formatUSD(t.price),
      perSession: t.perSession ? `${formatUSD(t.perSession)}/session` : "—",
      details: [p.duration, p.capacity, p.ages].filter(Boolean).join(" · "),
    })),
  ),
];
