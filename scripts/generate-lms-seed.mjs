/**
 * Generates the NBA Elite LMS migration (DDL + RLS + full curriculum seed).
 *
 * The curriculum is the source of truth here; run this to (re)emit the seed so
 * slugs/sort_order stay deterministic. Hierarchy: pillar → course → module →
 * lesson. The plan's named groups map to COURSES; each course gets one module
 * ("Core Lessons") that holds its lessons (the model requires a module layer).
 *
 * Run: node scripts/generate-lms-seed.mjs > supabase/migrations/<ts>_nba_elite_lms.sql
 */

// slug helper — kebab-case, ASCII
function kebab(s) {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['".,/]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function sql(s) {
  return s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`;
}

// Compliance/framing notes live on the relevant course descriptions.
const NOTE_NUTRITION =
  "Educational content on general nutrition and fueling for performance (structure/function only). This is not medical advice and makes no claims to diagnose, treat, cure, or prevent any disease.";
const NOTE_INNER_GAME =
  "Shared as Ben's lived experience and mental-health advocacy — not clinical treatment or therapy. If you are struggling, you are not alone: in the US, call or text 988 for the Suicide & Crisis Lifeline, 24/7.";
const NOTE_NIL =
  "General education and guidance on NIL and brand-building — not legal or financial advice. Work with credentialed professionals for your specific situation.";
const NOTE_MONEY =
  "General financial education only — not financial, tax, or legal advice. Consult a qualified professional for your circumstances.";
const NOTE_RECRUITING =
  "Recruiting rules and timelines evolve and vary by association and level — always confirm current rules with your school, association, and the relevant governing bodies.";

const CURRICULUM = [
  {
    slug: "performance",
    title: "Performance",
    subtitle: "The Game",
    courses: [
      {
        title: "Elite Skill Development",
        lessons: [
          "Ball Handling Under Pressure",
          "Footwork Foundations",
          "Finishing Through Contact",
          "Creating Your Own Shot",
          "Reading Defenders",
        ],
      },
      {
        title: "Shooting Mechanics",
        lessons: [
          "Repeatable Stroke",
          "Range Expansion",
          "Off Catch vs Off Dribble",
          "Shooting Under Fatigue",
          "Threat From Anywhere",
        ],
      },
      {
        title: "Basketball IQ",
        lessons: [
          "Seeing the Floor",
          "Offensive Concepts & Spacing",
          "Defensive Reads",
          "Situational Basketball",
          "Playing Fast Without Rushing",
        ],
      },
      {
        title: "Mr. Fourth Quarter / Clutch",
        lessons: [
          "Performing Under Pressure",
          "The Mental Side of Scoring",
          "Closing Games",
          "Confidence When It Matters",
          "Ben's Clutch Philosophy",
        ],
      },
    ],
  },
  {
    slug: "the-body",
    title: "The Body",
    subtitle: "Health & Longevity",
    courses: [
      {
        title: "Strength & Conditioning",
        lessons: ["Explosive Base", "Speed & Agility", "Durability", "Training Smart"],
      },
      {
        title: "Recovery & Fascia (FST)",
        lessons: [
          "Why Recovery Is Performance",
          "FST Explained",
          "Mobility",
          "Injury-Resilient",
          "Recovery Routines",
        ],
      },
      {
        title: "Fuel & Nutrition",
        description: NOTE_NUTRITION,
        lessons: [
          "Eating to Perform",
          "Fueling",
          "Hydration",
          "Habits That Compound",
          "Supplementing Right",
        ],
      },
    ],
  },
  {
    slug: "the-mind",
    title: "The Mind",
    subtitle: "Mental Performance & Wellness",
    courses: [
      {
        title: "Mental Performance",
        lessons: [
          "Confidence as a Skill",
          "Focus Under Pressure",
          "Visualization & Routine",
          "Handling Failure",
        ],
      },
      {
        title: "The Inner Game",
        description: NOTE_INNER_GAME,
        lessons: [
          "The Mask",
          "Recognizing When Something's Wrong",
          "Asking for Help Is Strength",
          "The Way Back",
          "What He Wishes He'd Known",
        ],
      },
      {
        title: "Identity & Purpose",
        lessons: [
          "Who You Are Beyond the Game",
          "Life After the Final Buzzer",
          "Building Something of Your Own",
          "Faith, Discipline & Meaning",
        ],
      },
    ],
  },
  {
    slug: "the-wealth",
    title: "The Wealth",
    subtitle: "Business of the Athlete",
    courses: [
      {
        title: "NIL & Brand",
        description: NOTE_NIL,
        lessons: [
          "Understanding NIL",
          "Building Your Brand Young",
          "Social Media as an Asset",
          "Working With the Right People",
        ],
      },
      {
        title: "Money Fundamentals",
        description: NOTE_MONEY,
        lessons: [
          "Financial Literacy Basics",
          "Managing the First Check",
          "Avoiding the Traps",
          "Thinking Long-Term",
        ],
      },
      {
        title: "Life After Sport",
        lessons: [
          "Planning the Transition Early",
          "Turning a Career Into a Brand",
          "Entrepreneurship",
          "Legacy & Giving Back",
        ],
      },
    ],
  },
  {
    slug: "the-path",
    title: "The Path",
    subtitle: "Development & Recruiting",
    courses: [
      {
        title: "The Recruiting Journey",
        description: NOTE_RECRUITING,
        lessons: [
          "How Recruiting Works",
          "Getting Seen",
          "Exposure & Film",
          "Choosing the Right Fit",
        ],
      },
      {
        title: "Leadership",
        lessons: [
          "Leaders Teammates Trust",
          "Accountability",
          "Carrying a Team",
          "Leading by Example",
        ],
      },
      {
        title: "Guest Sessions",
        lessons: ["Guest Session — Coming Soon"],
      },
    ],
  },
];

const seenLesson = new Set();
function uniqueLessonSlug(title) {
  let base = kebab(title);
  let s = base;
  let n = 2;
  while (seenLesson.has(s)) s = `${base}-${n++}`;
  seenLesson.add(s);
  return s;
}

const pillarRows = [];
const courseRows = [];
const moduleRows = [];
const lessonRows = [];

CURRICULUM.forEach((p, pi) => {
  pillarRows.push(`  (${sql(p.slug)}, ${sql(p.title)}, ${sql(p.subtitle)}, ${pi + 1})`);
  p.courses.forEach((c, ci) => {
    const courseSlug = kebab(c.title);
    courseRows.push(
      `  ((SELECT id FROM public.pillars WHERE slug = ${sql(p.slug)}), ${sql(courseSlug)}, ${sql(c.title)}, ${sql(c.description ?? null)}, ${ci + 1})`,
    );
    const moduleSlug = `${courseSlug}-core`;
    moduleRows.push(
      `  ((SELECT id FROM public.courses WHERE slug = ${sql(courseSlug)}), ${sql(moduleSlug)}, ${sql("Core Lessons")}, 1)`,
    );
    c.lessons.forEach((title, li) => {
      const lessonSlug = uniqueLessonSlug(title);
      lessonRows.push(
        `  ((SELECT id FROM public.modules WHERE slug = ${sql(moduleSlug)}), ${sql(lessonSlug)}, ${sql(title)}, ${li + 1})`,
      );
    });
  });
});

const out = `-- NBA Elite LMS — content layer (Phase B).
-- Hierarchy: pillars -> courses -> modules -> lessons.
-- Content is publicly readable this phase; membership gating happens in Phase C
-- at the server-function layer (getLessonBySlug / canAccessLesson), not in RLS.

-- ============ PILLARS ============
CREATE TABLE public.pillars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pillars TO anon, authenticated;
GRANT ALL ON public.pillars TO service_role;
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pillars are public" ON public.pillars
  FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX pillars_sort_idx ON public.pillars (sort_order);

-- ============ COURSES ============
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id uuid NOT NULL REFERENCES public.pillars (id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses are public" ON public.courses
  FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX courses_pillar_sort_idx ON public.courses (pillar_id, sort_order);

-- ============ MODULES ============
CREATE TABLE public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses (id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.modules TO anon, authenticated;
GRANT ALL ON public.modules TO service_role;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modules are public" ON public.modules
  FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX modules_course_sort_idx ON public.modules (course_id, sort_order);

-- ============ LESSONS ============
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.modules (id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  video_url text,
  resource_url text,
  duration_minutes integer,
  sort_order integer NOT NULL DEFAULT 0,
  is_free boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'coming_soon',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lessons TO anon, authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons are public" ON public.lessons
  FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX lessons_module_sort_idx ON public.lessons (module_id, sort_order);

-- ============ SEED ============
INSERT INTO public.pillars (slug, title, subtitle, sort_order) VALUES
${pillarRows.join(",\n")};

INSERT INTO public.courses (pillar_id, slug, title, description, sort_order) VALUES
${courseRows.join(",\n")};

INSERT INTO public.modules (course_id, slug, title, sort_order) VALUES
${moduleRows.join(",\n")};

INSERT INTO public.lessons (module_id, slug, title, sort_order) VALUES
${lessonRows.join(",\n")};
`;

process.stdout.write(out);
