DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='pillars') THEN
    EXECUTE $mig$
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
CREATE POLICY "Pillars are public" ON public.pillars FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX pillars_sort_idx ON public.pillars (sort_order);

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
CREATE POLICY "Courses are public" ON public.courses FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX courses_pillar_sort_idx ON public.courses (pillar_id, sort_order);

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
CREATE POLICY "Modules are public" ON public.modules FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX modules_course_sort_idx ON public.modules (course_id, sort_order);

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
CREATE POLICY "Lessons are public" ON public.lessons FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX lessons_module_sort_idx ON public.lessons (module_id, sort_order);
    $mig$;
  END IF;
END $$;