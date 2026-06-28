import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot, Stat } from "@/components/media";
import aboutPortrait from "@/assets/about-portrait.jpg";
import aboutVideo from "@/assets/about-video.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Ben Gordon — NBA Veteran | OfOurOwn" },
      { name: "description", content: "About Ben Gordon, NBA Veteran — training, wellness, and coaching." },
      { property: "og:title", content: "About Ben Gordon — NBA Veteran" },
      { property: "og:description", content: "About Ben Gordon, NBA Veteran." },
      { property: "og:image", content: `${SITE_ORIGIN}${aboutPortrait}` },
      { property: "og:image:alt", content: "Editorial portrait of Ben Gordon seated on a stool in soft daylight, wearing a charcoal crewneck." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_ORIGIN}${aboutPortrait}` },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Ben Gordon — NBA Veteran." />
      <Section className="border-b border-border">
        <div className="mx-auto max-w-2xl space-y-6 text-lg leading-relaxed text-foreground/90">
          <p>
            Ben Gordon, NBA Veteran, has spent the last decade building a body
            of work around one simple question: how do we keep performing —
            and stay healthy — for the long haul?
          </p>
          <p>
            Ben Gordon works with a small group of private clients on
            training, wellness, and life strategy, and shares what he learns
            through programs, guides, and the occasional dispatch.
          </p>
          <p className="text-muted-foreground">
            Replace this copy with Ben Gordon's real bio when ready.
          </p>
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>Portrait</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">
                The man, on his own terms.
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Ben Gordon, framed with the same restraint the rest of the site carries.
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.1}>
              <MediaSlot
                label="PORTRAIT · 4:3 · placeholder"
                aspect="4:3"
                src={aboutPortrait}
                alt="Editorial portrait of Ben Gordon seated on a wooden stool against a warm neutral backdrop, dressed in a charcoal crewneck, calm and direct gaze."
              />
            </FadeIn>
          </div>
        </div>
      </Section>

      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>By the numbers</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            The career, in pieces.
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-10 grid grid-cols-2 border border-border md:grid-cols-4">
            <Stat value="11" label="NBA seasons" />
            <Stat value="6th Man" label="of the Year, 2004–05" />
            <Stat value="2004" label="UConn national champion" />
            <Stat value="#3 overall" label="2004 NBA Draft pick" />
          </div>
        </FadeIn>
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>In his words</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">
                A conversation.
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Long-form interview still while the feature conversation is being finalized.
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.1}>
              <MediaSlot
                label="VIDEO · feature interview · 16:9"
                aspect="16:9"
                src={aboutVideo}
                alt="Ben Gordon mid-thought during a filmed long-form interview, lit from one side in a quiet studio — still from the upcoming feature conversation."
              />
            </FadeIn>
          </div>
        </div>
      </Section>

      <Section>
        <FadeIn>
          <Eyebrow>Next</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            Want to work with Ben?
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/training"
              className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90"
            >
              Training <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/speaking"
              className="inline-flex h-12 items-center gap-2 border border-foreground px-6 text-sm uppercase tracking-wider transition hover:bg-foreground hover:text-background"
            >
              Book Ben to speak
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-12 items-center gap-2 border border-foreground px-6 text-sm uppercase tracking-wider transition hover:bg-foreground hover:text-background"
            >
              Press & partnerships
            </Link>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}