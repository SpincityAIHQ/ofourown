import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";
import type { Database } from "@/integrations/supabase/types";

/**
 * OOO Elite LMS — read-only content layer (Phase B).
 *
 * Content is public this phase. Membership gating lands in Phase C: it happens
 * HERE (see canAccessLesson + getLessonBySlug), never in the components, so
 * video_url can be withheld from non-members in exactly one place.
 */

function getServerClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    },
  );
}

function getEnvName(): "sandbox" | "live" {
  return process.env.NODE_ENV === "production" ? "live" : "sandbox";
}

/**
 * Reads the bearer token off the incoming request (if any) and returns the
 * viewer's membership state. Public callers get { isMember: false }; signed-in
 * OOO Elite members get { isMember: true }. This is the ONLY place membership
 * is decided — never in components.
 */
async function getViewerAccess(): Promise<{ userId: string | null; isMember: boolean }> {
  try {
    const req = getRequest();
    const authHeader = req?.headers.get("authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return { userId: null, isMember: false };
    const token = authHeader.slice(7);
    if (!token) return { userId: null, isMember: false };

    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      },
    );
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes?.user?.id ?? null;
    if (!userId) return { userId: null, isMember: false };

    const { data: hasSub } = await supabase.rpc("has_active_subscription", {
      user_uuid: userId,
      check_env: getEnvName(),
    });
    return { userId, isMember: !!hasSub };
  } catch {
    return { userId: null, isMember: false };
  }
}

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  video_url: string | null;
  resource_url: string | null;
  duration_minutes: number | null;
  sort_order: number;
  is_free: boolean;
  status: string;
};

export type Module = {
  id: string;
  slug: string;
  title: string;
  sort_order: number;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  modules: Module[];
};

export type Pillar = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  sort_order: number;
  courses: Course[];
};

export type LessonRef = { slug: string; title: string };

export type LessonContext = {
  lesson: Lesson;
  pillar: { slug: string; title: string; subtitle: string | null };
  course: { slug: string; title: string };
  module: { slug: string; title: string };
  prev: LessonRef | null;
  next: LessonRef | null;
};

const LESSON_COLS =
  "id, slug, title, description, video_url, resource_url, duration_minutes, sort_order, is_free, status";
const TREE_SELECT = `id, slug, title, subtitle, sort_order, courses(id, slug, title, description, sort_order, modules(id, slug, title, sort_order, lessons(${LESSON_COLS})))`;

const byOrder = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;

function sortTree(pillars: Pillar[]): Pillar[] {
  const list = [...pillars].sort(byOrder);
  for (const p of list) {
    p.courses = [...(p.courses ?? [])].sort(byOrder);
    for (const c of p.courses) {
      c.modules = [...(c.modules ?? [])].sort(byOrder);
      for (const m of c.modules) m.lessons = [...(m.lessons ?? [])].sort(byOrder);
    }
  }
  return list;
}

/**
 * Phase C seam. Returns whether the current visitor may access this lesson's
 * gated content (video). For now everyone can; Phase C swaps in the real
 * membership check. This is the ONLY place access should be decided.
 */
export function canAccessLesson(
  lesson: Pick<Lesson, "is_free" | "status">,
  isMember: boolean,
): boolean {
  if (lesson.is_free) return true;
  return isMember;
}

/** Strip gated media URLs (video, downloadable resource) for non-members. */
function gateLesson<T extends Pick<Lesson, "is_free" | "status" | "video_url" | "resource_url">>(
  lesson: T,
  isMember: boolean,
): T {
  if (canAccessLesson(lesson, isMember)) return lesson;
  return { ...lesson, video_url: null, resource_url: null };
}

function gateTree(pillars: Pillar[], isMember: boolean): Pillar[] {
  for (const p of pillars) {
    for (const c of p.courses) {
      for (const m of c.modules) {
        m.lessons = m.lessons.map((l) => gateLesson(l, isMember));
      }
    }
  }
  return pillars;
}

/** Full catalog tree: pillars → courses → modules → lessons. */
export const listPillars = createServerFn({ method: "GET" }).handler(
  async (): Promise<Pillar[]> => {
    const supabase = getServerClient();
    const { data, error } = await supabase
      .from("pillars")
      .select(TREE_SELECT)
      .returns<Pillar[]>();
    if (error) {
      console.error("[listPillars]", error);
      return [];
    }
    const { isMember } = await getViewerAccess();
    return gateTree(sortTree(data ?? []), isMember);
  },
);

const slugSchema = z.object({ slug: z.string().trim().min(1).max(160) });

export const getPillarBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data }): Promise<Pillar | null> => {
    const supabase = getServerClient();
    const { data: row, error } = await supabase
      .from("pillars")
      .select(TREE_SELECT)
      .eq("slug", data.slug)
      .maybeSingle()
      .returns<Pillar | null>();
    if (error) {
      console.error("[getPillarBySlug]", error);
      return null;
    }
    if (!row) return null;
    const { isMember } = await getViewerAccess();
    return gateTree(sortTree([row]), isMember)[0];
  });

export type CourseWithContext = Course & {
  pillar: { slug: string; title: string; subtitle: string | null };
};

export const getCourseBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data }): Promise<CourseWithContext | null> => {
    const supabase = getServerClient();
    const { data: row, error } = await supabase
      .from("courses")
      .select(
        `id, slug, title, description, sort_order, pillar:pillars(slug, title, subtitle), modules(id, slug, title, sort_order, lessons(${LESSON_COLS}))`,
      )
      .eq("slug", data.slug)
      .maybeSingle()
      .returns<CourseWithContext | null>();
    if (error) {
      console.error("[getCourseBySlug]", error);
      return null;
    }
    if (!row) return null;
    row.modules = [...(row.modules ?? [])].sort(byOrder);
    const { isMember } = await getViewerAccess();
    for (const m of row.modules) {
      m.lessons = [...(m.lessons ?? [])].sort(byOrder).map((l) => gateLesson(l, isMember));
    }
    return row;
  });

type LessonWithContextRow = Lesson & {
  module: {
    slug: string;
    title: string;
    sort_order: number;
    course: {
      id: string;
      slug: string;
      title: string;
      pillar: { slug: string; title: string; subtitle: string | null };
    };
  };
};

export const getLessonBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data }): Promise<LessonContext | null> => {
    const supabase = getServerClient();
    const { data: row, error } = await supabase
      .from("lessons")
      .select(
        `${LESSON_COLS}, module:modules(slug, title, sort_order, course:courses(id, slug, title, pillar:pillars(slug, title, subtitle)))`,
      )
      .eq("slug", data.slug)
      .maybeSingle()
      .returns<LessonWithContextRow | null>();
    if (error) {
      console.error("[getLessonBySlug]", error);
      return null;
    }
    if (!row) return null;

    const { module: mod, ...lessonFields } = row;
    const course = mod.course;
    const { isMember } = await getViewerAccess();
    const lesson: Lesson = gateLesson({ ...lessonFields }, isMember);

    // prev/next across the whole course, in module→lesson order.
    const { data: mods } = await supabase
      .from("modules")
      .select("sort_order, lessons(slug, title, sort_order)")
      .eq("course_id", course.id)
      .returns<{ sort_order: number; lessons: (LessonRef & { sort_order: number })[] }[]>();

    const ordered: LessonRef[] = (mods ?? [])
      .slice()
      .sort(byOrder)
      .flatMap((m) =>
        (m.lessons ?? [])
          .slice()
          .sort(byOrder)
          .map((l) => ({ slug: l.slug, title: l.title })),
      );
    const idx = ordered.findIndex((l) => l.slug === lesson.slug);

    return {
      lesson,
      pillar: course.pillar,
      course: { slug: course.slug, title: course.title },
      module: { slug: mod.slug, title: mod.title },
      prev: idx > 0 ? ordered[idx - 1] : null,
      next: idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null,
    };
  });
