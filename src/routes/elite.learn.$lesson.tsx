import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Download, ChevronRight } from "lucide-react";
import { getLessonBySlug } from "@/lib/lms.functions";
import { VideoEmbed } from "@/components/media";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

const lessonQuery = (slug: string) =>
  queryOptions({
    queryKey: ["lms", "lesson", slug],
    queryFn: () => getLessonBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/elite/learn/$lesson")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(lessonQuery(params.lesson));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.lesson.title} — OOO Elite | OOO Performance` },
          { name: "description", content: loaderData.lesson.description ?? `${loaderData.course.title} · ${loaderData.pillar.title} — OOO Elite academy lesson.` },
          { property: "og:title", content: `${loaderData.lesson.title} — OOO Elite` },
          { property: "og:url", content: `${SITE_ORIGIN}/elite/learn/${loaderData.lesson.slug}` },
          { name: "twitter:card", content: "summary" },
        ]
      : [{ title: "Lesson — OOO Elite | OOO Performance" }],
  }),
  component: LessonPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl font-semibold">Lesson not found.</h1>
      <p className="mt-4 text-muted-foreground">
        <Link to="/elite/learn" className="underline underline-offset-4">Back to the academy</Link>
      </p>
    </div>
  ),
});

function LessonPage() {
  const { lesson } = Route.useParams() as unknown as { lesson: string };
  const { data } = useSuspenseQuery(lessonQuery(lesson));
  const [complete, setComplete] = useState(false);

  if (!data) return null;
  const { lesson: l, pillar, course, module: mod, prev, next } = data;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:py-14">
      {/* Breadcrumb — Pillar › Course › Module › Lesson */}
      <nav className="flex flex-wrap items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        <Link to="/elite/learn" hash={pillar.slug} className="hover:text-foreground">{pillar.title}</Link>
        <ChevronRight className="h-3 w-3" />
        <span>{course.title}</span>
        <ChevronRight className="h-3 w-3" />
        <span>{mod.title}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{l.title}</span>
      </nav>

      <div className="mt-8">
        {l.video_url ? (
          <VideoEmbed label={l.title} url={l.video_url} aspect="16:9" />
        ) : (
          <VideoEmbed label="COMING SOON · video in production" aspect="16:9" />
        )}
      </div>

      <div className="mt-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{course.title}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight md:text-5xl">{l.title}</h1>
        {l.description ? (
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{l.description}</p>
        ) : (
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Lesson content is in production. Join OOO Elite to get it the moment it drops.
          </p>
        )}

        {l.resource_url ? (
          <a
            href={l.resource_url}
            className="mt-6 inline-flex h-11 items-center gap-2 border border-foreground px-5 text-sm uppercase tracking-wider transition hover:bg-foreground hover:text-background"
          >
            <Download className="h-4 w-4" /> Download resource
          </a>
        ) : null}

        {/* Mark complete — visual only for now (no persistence until Phase C) */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setComplete((v) => !v)}
            aria-pressed={complete}
            className={`inline-flex h-11 items-center gap-2 px-5 text-sm uppercase tracking-wider transition ${
              complete
                ? "bg-foreground text-background"
                : "border border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            <Check className="h-4 w-4" /> {complete ? "Completed" : "Mark complete"}
          </button>
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Progress saving comes with membership.
          </p>
        </div>
      </div>

      {/* Prev / next */}
      <div className="mt-12 grid gap-px border-t border-border pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            to="/elite/learn/$lesson"
            params={{ lesson: prev.slug }}
            className="group flex items-center gap-3 py-3 text-left"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 transition group-hover:-translate-x-1" />
            <span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Previous</span>
              <span className="text-sm">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/elite/learn/$lesson"
            params={{ lesson: next.slug }}
            className="group flex items-center justify-end gap-3 py-3 text-right sm:justify-self-end"
          >
            <span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Next</span>
              <span className="text-sm">{next.title}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
          </Link>
        ) : null}
      </div>

      <div className="mt-10">
        <Link to="/elite/learn" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          ← All lessons
        </Link>
      </div>
    </div>
  );
}
