import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { EmailCapture } from "@/components/email-capture";
import { Section, Eyebrow } from "@/components/section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OfOurOwn.com — Ben Gordon, NBA legend" },
      { name: "description", content: "OfOurOwn.com — the digital home of Ben Gordon, NBA legend. Training programs, wellness protocols, and 1:1 coaching to help you perform and recover." },
      { property: "og:title", content: "OfOurOwn.com — Ben Gordon, NBA legend" },
      { property: "og:description", content: "Training, wellness, and coaching with Ben Gordon, NBA legend." },
    ],
  }),
  component: Index,
});

const OFFERS = [
  {
    to: "/training",
    label: "Training",
    blurb: "1:1 sessions and programs built around strength, conditioning, and recovery.",
  },
  {
    to: "/wellness",
    label: "Wellness",
    blurb: "Sustainable habits for sleep, nutrition, and longevity — booked privately.",
  },
  {
    to: "/coaching",
    label: "Coaching",
    blurb: "Mentorship for athletes, founders, and operators serious about their craft.",
  },
  {
    to: "/shop",
    label: "Shop",
    blurb: "Programs, guides, and tools Ben Gordon uses with private clients.",
  },
] as const;

function Index() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-40">
          <Eyebrow>Ben Gordon · NBA legend</Eyebrow>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            Elite training and wellness for people who refuse to settle.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Train like a pro and build a body that lasts. Private coaching,
            personalized programming, and recovery-first wellness built on the
            methods Ben Gordon used through a 12-year NBA career.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/training"
              className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90"
            >
              Start training <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/wellness"
              className="inline-flex h-12 items-center gap-2 border border-foreground px-6 text-sm uppercase tracking-wider transition hover:bg-foreground hover:text-background"
            >
              Explore wellness
            </Link>
          </div>
        </div>
      </section>


      <Section className="border-b border-border">
        <Eyebrow>Work with Ben Gordon</Eyebrow>
        <h2 className="font-display text-4xl font-semibold md:text-5xl">
          Four ways in.
        </h2>
        <div className="mt-12 grid gap-px bg-border md:grid-cols-2">
          {OFFERS.map((o) => (
            <Link
              key={o.to}
              to={o.to}
              className="group flex flex-col justify-between gap-12 bg-background p-8 transition hover:bg-accent md:p-12"
            >
              <h3 className="font-display text-3xl font-semibold">{o.label}</h3>
              <div>
                <p className="text-muted-foreground">{o.blurb}</p>
                <p className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-wider">
                  Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>Stay close</Eyebrow>
            <h2 className="font-display text-4xl font-semibold md:text-5xl">
              Get Ben Gordon's notes.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Occasional dispatches on training, recovery, and the work behind
              performing at your best. No noise.
            </p>
          </div>
          <EmailCapture source="home_hero" cta="Subscribe" />
        </div>
      </Section>
    </>
  );
}
