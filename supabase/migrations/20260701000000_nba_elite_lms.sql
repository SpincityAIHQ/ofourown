-- NBA Elite LMS — content layer (Phase B).
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
  ('performance', 'Performance', 'The Game', 1),
  ('the-body', 'The Body', 'Health & Longevity', 2),
  ('the-mind', 'The Mind', 'Mental Performance & Wellness', 3),
  ('the-wealth', 'The Wealth', 'Business of the Athlete', 4),
  ('the-path', 'The Path', 'Development & Recruiting', 5);

INSERT INTO public.courses (pillar_id, slug, title, description, sort_order) VALUES
  ((SELECT id FROM public.pillars WHERE slug = 'performance'), 'elite-skill-development', 'Elite Skill Development', NULL, 1),
  ((SELECT id FROM public.pillars WHERE slug = 'performance'), 'shooting-mechanics', 'Shooting Mechanics', NULL, 2),
  ((SELECT id FROM public.pillars WHERE slug = 'performance'), 'basketball-iq', 'Basketball IQ', NULL, 3),
  ((SELECT id FROM public.pillars WHERE slug = 'performance'), 'mr-fourth-quarter-clutch', 'Mr. Fourth Quarter / Clutch', NULL, 4),
  ((SELECT id FROM public.pillars WHERE slug = 'the-body'), 'strength-and-conditioning', 'Strength & Conditioning', NULL, 1),
  ((SELECT id FROM public.pillars WHERE slug = 'the-body'), 'recovery-and-fascia-fst', 'Recovery & Fascia (FST)', NULL, 2),
  ((SELECT id FROM public.pillars WHERE slug = 'the-body'), 'fuel-and-nutrition', 'Fuel & Nutrition', 'Educational content on general nutrition and fueling for performance (structure/function only). This is not medical advice and makes no claims to diagnose, treat, cure, or prevent any disease.', 3),
  ((SELECT id FROM public.pillars WHERE slug = 'the-mind'), 'mental-performance', 'Mental Performance', NULL, 1),
  ((SELECT id FROM public.pillars WHERE slug = 'the-mind'), 'the-inner-game', 'The Inner Game', 'Shared as Ben''s lived experience and mental-health advocacy — not clinical treatment or therapy. If you are struggling, you are not alone: in the US, call or text 988 for the Suicide & Crisis Lifeline, 24/7.', 2),
  ((SELECT id FROM public.pillars WHERE slug = 'the-mind'), 'identity-and-purpose', 'Identity & Purpose', NULL, 3),
  ((SELECT id FROM public.pillars WHERE slug = 'the-wealth'), 'nil-and-brand', 'NIL & Brand', 'General education and guidance on NIL and brand-building — not legal or financial advice. Work with credentialed professionals for your specific situation.', 1),
  ((SELECT id FROM public.pillars WHERE slug = 'the-wealth'), 'money-fundamentals', 'Money Fundamentals', 'General financial education only — not financial, tax, or legal advice. Consult a qualified professional for your circumstances.', 2),
  ((SELECT id FROM public.pillars WHERE slug = 'the-wealth'), 'life-after-sport', 'Life After Sport', NULL, 3),
  ((SELECT id FROM public.pillars WHERE slug = 'the-path'), 'the-recruiting-journey', 'The Recruiting Journey', 'Recruiting rules and timelines evolve and vary by association and level — always confirm current rules with your school, association, and the relevant governing bodies.', 1),
  ((SELECT id FROM public.pillars WHERE slug = 'the-path'), 'leadership', 'Leadership', NULL, 2),
  ((SELECT id FROM public.pillars WHERE slug = 'the-path'), 'guest-sessions', 'Guest Sessions', NULL, 3);

INSERT INTO public.modules (course_id, slug, title, sort_order) VALUES
  ((SELECT id FROM public.courses WHERE slug = 'elite-skill-development'), 'elite-skill-development-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'shooting-mechanics'), 'shooting-mechanics-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'basketball-iq'), 'basketball-iq-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'mr-fourth-quarter-clutch'), 'mr-fourth-quarter-clutch-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'strength-and-conditioning'), 'strength-and-conditioning-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'recovery-and-fascia-fst'), 'recovery-and-fascia-fst-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'fuel-and-nutrition'), 'fuel-and-nutrition-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'mental-performance'), 'mental-performance-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'the-inner-game'), 'the-inner-game-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'identity-and-purpose'), 'identity-and-purpose-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'nil-and-brand'), 'nil-and-brand-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'money-fundamentals'), 'money-fundamentals-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'life-after-sport'), 'life-after-sport-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'the-recruiting-journey'), 'the-recruiting-journey-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'leadership'), 'leadership-core', 'Core Lessons', 1),
  ((SELECT id FROM public.courses WHERE slug = 'guest-sessions'), 'guest-sessions-core', 'Core Lessons', 1);

INSERT INTO public.lessons (module_id, slug, title, sort_order) VALUES
  ((SELECT id FROM public.modules WHERE slug = 'elite-skill-development-core'), 'ball-handling-under-pressure', 'Ball Handling Under Pressure', 1),
  ((SELECT id FROM public.modules WHERE slug = 'elite-skill-development-core'), 'footwork-foundations', 'Footwork Foundations', 2),
  ((SELECT id FROM public.modules WHERE slug = 'elite-skill-development-core'), 'finishing-through-contact', 'Finishing Through Contact', 3),
  ((SELECT id FROM public.modules WHERE slug = 'elite-skill-development-core'), 'creating-your-own-shot', 'Creating Your Own Shot', 4),
  ((SELECT id FROM public.modules WHERE slug = 'elite-skill-development-core'), 'reading-defenders', 'Reading Defenders', 5),
  ((SELECT id FROM public.modules WHERE slug = 'shooting-mechanics-core'), 'repeatable-stroke', 'Repeatable Stroke', 1),
  ((SELECT id FROM public.modules WHERE slug = 'shooting-mechanics-core'), 'range-expansion', 'Range Expansion', 2),
  ((SELECT id FROM public.modules WHERE slug = 'shooting-mechanics-core'), 'off-catch-vs-off-dribble', 'Off Catch vs Off Dribble', 3),
  ((SELECT id FROM public.modules WHERE slug = 'shooting-mechanics-core'), 'shooting-under-fatigue', 'Shooting Under Fatigue', 4),
  ((SELECT id FROM public.modules WHERE slug = 'shooting-mechanics-core'), 'threat-from-anywhere', 'Threat From Anywhere', 5),
  ((SELECT id FROM public.modules WHERE slug = 'basketball-iq-core'), 'seeing-the-floor', 'Seeing the Floor', 1),
  ((SELECT id FROM public.modules WHERE slug = 'basketball-iq-core'), 'offensive-concepts-and-spacing', 'Offensive Concepts & Spacing', 2),
  ((SELECT id FROM public.modules WHERE slug = 'basketball-iq-core'), 'defensive-reads', 'Defensive Reads', 3),
  ((SELECT id FROM public.modules WHERE slug = 'basketball-iq-core'), 'situational-basketball', 'Situational Basketball', 4),
  ((SELECT id FROM public.modules WHERE slug = 'basketball-iq-core'), 'playing-fast-without-rushing', 'Playing Fast Without Rushing', 5),
  ((SELECT id FROM public.modules WHERE slug = 'mr-fourth-quarter-clutch-core'), 'performing-under-pressure', 'Performing Under Pressure', 1),
  ((SELECT id FROM public.modules WHERE slug = 'mr-fourth-quarter-clutch-core'), 'the-mental-side-of-scoring', 'The Mental Side of Scoring', 2),
  ((SELECT id FROM public.modules WHERE slug = 'mr-fourth-quarter-clutch-core'), 'closing-games', 'Closing Games', 3),
  ((SELECT id FROM public.modules WHERE slug = 'mr-fourth-quarter-clutch-core'), 'confidence-when-it-matters', 'Confidence When It Matters', 4),
  ((SELECT id FROM public.modules WHERE slug = 'mr-fourth-quarter-clutch-core'), 'bens-clutch-philosophy', 'Ben''s Clutch Philosophy', 5),
  ((SELECT id FROM public.modules WHERE slug = 'strength-and-conditioning-core'), 'explosive-base', 'Explosive Base', 1),
  ((SELECT id FROM public.modules WHERE slug = 'strength-and-conditioning-core'), 'speed-and-agility', 'Speed & Agility', 2),
  ((SELECT id FROM public.modules WHERE slug = 'strength-and-conditioning-core'), 'durability', 'Durability', 3),
  ((SELECT id FROM public.modules WHERE slug = 'strength-and-conditioning-core'), 'training-smart', 'Training Smart', 4),
  ((SELECT id FROM public.modules WHERE slug = 'recovery-and-fascia-fst-core'), 'why-recovery-is-performance', 'Why Recovery Is Performance', 1),
  ((SELECT id FROM public.modules WHERE slug = 'recovery-and-fascia-fst-core'), 'fst-explained', 'FST Explained', 2),
  ((SELECT id FROM public.modules WHERE slug = 'recovery-and-fascia-fst-core'), 'mobility', 'Mobility', 3),
  ((SELECT id FROM public.modules WHERE slug = 'recovery-and-fascia-fst-core'), 'injury-resilient', 'Injury-Resilient', 4),
  ((SELECT id FROM public.modules WHERE slug = 'recovery-and-fascia-fst-core'), 'recovery-routines', 'Recovery Routines', 5),
  ((SELECT id FROM public.modules WHERE slug = 'fuel-and-nutrition-core'), 'eating-to-perform', 'Eating to Perform', 1),
  ((SELECT id FROM public.modules WHERE slug = 'fuel-and-nutrition-core'), 'fueling', 'Fueling', 2),
  ((SELECT id FROM public.modules WHERE slug = 'fuel-and-nutrition-core'), 'hydration', 'Hydration', 3),
  ((SELECT id FROM public.modules WHERE slug = 'fuel-and-nutrition-core'), 'habits-that-compound', 'Habits That Compound', 4),
  ((SELECT id FROM public.modules WHERE slug = 'fuel-and-nutrition-core'), 'supplementing-right', 'Supplementing Right', 5),
  ((SELECT id FROM public.modules WHERE slug = 'mental-performance-core'), 'confidence-as-a-skill', 'Confidence as a Skill', 1),
  ((SELECT id FROM public.modules WHERE slug = 'mental-performance-core'), 'focus-under-pressure', 'Focus Under Pressure', 2),
  ((SELECT id FROM public.modules WHERE slug = 'mental-performance-core'), 'visualization-and-routine', 'Visualization & Routine', 3),
  ((SELECT id FROM public.modules WHERE slug = 'mental-performance-core'), 'handling-failure', 'Handling Failure', 4),
  ((SELECT id FROM public.modules WHERE slug = 'the-inner-game-core'), 'the-mask', 'The Mask', 1),
  ((SELECT id FROM public.modules WHERE slug = 'the-inner-game-core'), 'recognizing-when-somethings-wrong', 'Recognizing When Something''s Wrong', 2),
  ((SELECT id FROM public.modules WHERE slug = 'the-inner-game-core'), 'asking-for-help-is-strength', 'Asking for Help Is Strength', 3),
  ((SELECT id FROM public.modules WHERE slug = 'the-inner-game-core'), 'the-way-back', 'The Way Back', 4),
  ((SELECT id FROM public.modules WHERE slug = 'the-inner-game-core'), 'what-he-wishes-hed-known', 'What He Wishes He''d Known', 5),
  ((SELECT id FROM public.modules WHERE slug = 'identity-and-purpose-core'), 'who-you-are-beyond-the-game', 'Who You Are Beyond the Game', 1),
  ((SELECT id FROM public.modules WHERE slug = 'identity-and-purpose-core'), 'life-after-the-final-buzzer', 'Life After the Final Buzzer', 2),
  ((SELECT id FROM public.modules WHERE slug = 'identity-and-purpose-core'), 'building-something-of-your-own', 'Building Something of Your Own', 3),
  ((SELECT id FROM public.modules WHERE slug = 'identity-and-purpose-core'), 'faith-discipline-and-meaning', 'Faith, Discipline & Meaning', 4),
  ((SELECT id FROM public.modules WHERE slug = 'nil-and-brand-core'), 'understanding-nil', 'Understanding NIL', 1),
  ((SELECT id FROM public.modules WHERE slug = 'nil-and-brand-core'), 'building-your-brand-young', 'Building Your Brand Young', 2),
  ((SELECT id FROM public.modules WHERE slug = 'nil-and-brand-core'), 'social-media-as-an-asset', 'Social Media as an Asset', 3),
  ((SELECT id FROM public.modules WHERE slug = 'nil-and-brand-core'), 'working-with-the-right-people', 'Working With the Right People', 4),
  ((SELECT id FROM public.modules WHERE slug = 'money-fundamentals-core'), 'financial-literacy-basics', 'Financial Literacy Basics', 1),
  ((SELECT id FROM public.modules WHERE slug = 'money-fundamentals-core'), 'managing-the-first-check', 'Managing the First Check', 2),
  ((SELECT id FROM public.modules WHERE slug = 'money-fundamentals-core'), 'avoiding-the-traps', 'Avoiding the Traps', 3),
  ((SELECT id FROM public.modules WHERE slug = 'money-fundamentals-core'), 'thinking-long-term', 'Thinking Long-Term', 4),
  ((SELECT id FROM public.modules WHERE slug = 'life-after-sport-core'), 'planning-the-transition-early', 'Planning the Transition Early', 1),
  ((SELECT id FROM public.modules WHERE slug = 'life-after-sport-core'), 'turning-a-career-into-a-brand', 'Turning a Career Into a Brand', 2),
  ((SELECT id FROM public.modules WHERE slug = 'life-after-sport-core'), 'entrepreneurship', 'Entrepreneurship', 3),
  ((SELECT id FROM public.modules WHERE slug = 'life-after-sport-core'), 'legacy-and-giving-back', 'Legacy & Giving Back', 4),
  ((SELECT id FROM public.modules WHERE slug = 'the-recruiting-journey-core'), 'how-recruiting-works', 'How Recruiting Works', 1),
  ((SELECT id FROM public.modules WHERE slug = 'the-recruiting-journey-core'), 'getting-seen', 'Getting Seen', 2),
  ((SELECT id FROM public.modules WHERE slug = 'the-recruiting-journey-core'), 'exposure-and-film', 'Exposure & Film', 3),
  ((SELECT id FROM public.modules WHERE slug = 'the-recruiting-journey-core'), 'choosing-the-right-fit', 'Choosing the Right Fit', 4),
  ((SELECT id FROM public.modules WHERE slug = 'leadership-core'), 'leaders-teammates-trust', 'Leaders Teammates Trust', 1),
  ((SELECT id FROM public.modules WHERE slug = 'leadership-core'), 'accountability', 'Accountability', 2),
  ((SELECT id FROM public.modules WHERE slug = 'leadership-core'), 'carrying-a-team', 'Carrying a Team', 3),
  ((SELECT id FROM public.modules WHERE slug = 'leadership-core'), 'leading-by-example', 'Leading by Example', 4),
  ((SELECT id FROM public.modules WHERE slug = 'guest-sessions-core'), 'guest-session-coming-soon', 'Guest Session — Coming Soon', 1);
