import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowRight, Lock, PlayCircle, Clock } from "lucide-react";
import { listPillars, type Lesson } from "@/lib/lms.functions";
import { Eyebrow } from "@/components/section";
import { FadeIn } from "@/components/media";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

const pillarsQuery = queryOptions({
  queryKey: ["lms", "pillars"],
  queryFn: () => listPillars(),
});

export const Route = createFileRoute("/elite/learn/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(pillarsQuery),
  head: () => ({
    meta: [
      { title: "OOO Elite Academy — OOO Performance" },
      { name: "description", content: "Browse the OOO Elite academy — five pillars of complete-athlete development across performance, body, mind, wealth, and path." },
      { property: "og:title", content: "OOO Elite Academy" },
      { property: "og:description", content: "Five pillars of complete-athlete development." },
      { property: "og:url", content: `${SITE_ORIGIN}/elite/learn` },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LearnPage,
});

type LessonState = "open" | "coming_soon" | "locked";

function lessonState(lesson: Pick<Lesson, "status" | "is_free">): LessonState {
  if (lesson.status === "published") return "open";
  // Phase C: non-free lessons become "locked" for non-members. For now the
  // seam (canAccessLesson) is open, so unpublished content reads as coming soon.
  return "coming_soon";
}

function LessonRow({ lesson }: { lesson: Lesson }) {
  const state = lessonState(lesson);
  const label =
    state === "open" ? (lesson.is_free ? "Free" : "Open") : state === "locked" ? "Members" : "Coming Soon";
  const Icon = state === "locked" ? Lock : PlayCircle;

  return (
    <Link
      to="/elite/learn/$lesson"
      params={{ lesson: lesson.slug }}
      className="group flex items-center justify-between gap-4 border-b border-border px-4 py-4 transition last:border-b-0 hover:bg-accent"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon className={`h-4 w-4 shrink-0 ${state === "open" ? "text-foreground" : "text-muted-foreground"}`} />
        <span className={`truncate text-sm ${state === "open" ? "" : "text-muted-foreground"}`}>{lesson.title}</span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {lesson.duration_minutes ? (
          <span className="hidden items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground sm:inline-flex">
            <Clock className="h-3 w-3" /> {lesson.duration_minutes}m
          </span>
        ) : null}
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      </div>
    </Link>
  );
}

function LearnPage() {
  const { data: pillars } = useSuspenseQuery(pillarsQuery);

  return (
    <>
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-display text-sm uppercase tracking-[0.4em] text-background/60">OOO Elite</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            The Academy.
          </h1>
          <p className="mt-4 max-w-xl text-background/70">
            Five pillars, {pillars.reduce((n, p) => n + p.courses.length, 0)} courses. New lessons
            release continuously — everything below is included with membership.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/* pillar quick-nav */}
        <div className="mb-12 flex flex-wrap gap-2">
          {pillars.map((p) => (
            <a
              key={p.id}
              href={`#${p.slug}`}
              className="border border-border px-4 py-2 text-xs uppercase tracking-[0.15em] text-muted-foreground transition hover:bg-foreground hover:text-background"
            >
              {p.title}
            </a>
          ))}
        </div>

        <div className="space-y-20">
          {pillars.map((p) => (
            <section key={p.id} id={p.slug} className="scroll-mt-24">
              <FadeIn>
                <Eyebrow>{p.subtitle ?? "Pillar"}</Eyebrow>
                <h2 className="font-display text-3xl font-semibold md:text-5xl">{p.title}</h2>
              </FadeIn>

              <div className="mt-10 grid gap-px bg-border lg:grid-cols-2">
                {p.courses.map((course) => (
                  <FadeIn key={course.id} className="bg-background">
                    <div className="flex h-full flex-col p-6 md:p-8">
                      <h3 className="font-display text-xl font-semibold">{course.title}</h3>
                      {course.description ? (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{course.description}</p>
                      ) : null}
                      <div className="mt-5 border-t border-border">
                        {course.modules.map((mod) => (
                          <div key={mod.id}>
                            {course.modules.length > 1 ? (
                              <p className="border-b border-border px-4 pt-4 pb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                {mod.title}
                              </p>
                            ) : null}
                            {mod.lessons.map((lesson) => (
                              <LessonRow key={lesson.id} lesson={lesson} />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start gap-4 border-t border-border pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-muted-foreground">All-access membership · $29.99/month.</p>
          <Link
            to="/elite/subscribe"
            className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90"
          >
            Join OOO Elite <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
