import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot, VideoEmbed, TestimonialRow } from "@/components/media";
import { SpeakingInquiryForm } from "@/components/speaking-inquiry-form";
import speakingReel from "@/assets/speaking-reel.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/speaking")({
  head: () => ({
    meta: [
      { title: "Speaking — Ben Gordon, NBA Veteran | OfOurOwn" },
      { name: "description", content: "Book Ben Gordon, NBA Veteran, for keynotes, team talks, college visits, and corporate events." },
      { property: "og:title", content: "Book Ben Gordon to speak" },
      { property: "og:description", content: "Keynotes, team talks, and intimate room work with Ben Gordon, NBA Veteran." },
      { property: "og:image", content: `${SITE_ORIGIN}${speakingReel}` },
      { property: "og:image:alt", content: "Ben Gordon on stage under warm spotlights, mid-keynote, addressing a seated audience." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_ORIGIN}${speakingReel}` },
    ],
  }),
  component: SpeakingPage,
});

const FORMATS = [
  { title: "Keynote", blurb: "Headline talk on resilience, longevity, and life after the highest level." },
  { title: "Team / Locker room", blurb: "Closed-door work with athletes — performance, mindset, and the long career." },
  { title: "College / Youth", blurb: "Honest talks for young athletes on identity, pressure, and what nobody tells you." },
  { title: "Corporate / Leadership", blurb: "Pressure, performance, and team dynamics — borrowed from the league, used at work." },
  { title: "Men's Group", blurb: "Intimate room work on mental health, fatherhood, and brotherhood." },
  { title: "Advisory", blurb: "Ongoing advisory engagements for organizations Ben believes in." },
];

function SpeakingPage() {
  return (
    <>
      <PageHero
        eyebrow="Speaking"
        title="Book Ben Gordon to speak."
        lede="Keynotes, team talks, college visits, corporate events, and intimate room work — built around your audience and the moment you're trying to create."
      />

      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>Watch</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">A look at the room.</h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                A quiet frame from the stage — keynotes, team talks, and the room work behind them.
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.1}><VideoEmbed label="SPEAKER REEL · 16:9" aspect="16:9" poster={speakingReel} posterAlt="Ben Gordon on stage under warm spotlights, microphone in hand, mid-keynote in front of a seated audience — still from the speaker reel." priority /></FadeIn>
          </div>
        </div>
      </Section>

      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Formats</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Built around your audience.</h2>
        </FadeIn>
        <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
          {FORMATS.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.04} className="bg-background">
              <div className="h-full p-8">
                <h3 className="font-display text-2xl font-semibold">{f.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{f.blurb}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Said in the room</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">What organizers say.</h2>
        </FadeIn>
        <div className="mt-10"><FadeIn delay={0.1}><TestimonialRow /></FadeIn></div>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>Inquire</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">Tell us about the event.</h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Share the basics and Ben's team will follow up to confirm fit, date, and scope.
              </p>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                Speaking engagements start at $5,000; corporate events are priced on request.
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.05}><SpeakingInquiryForm /></FadeIn>
          </div>
        </div>
      </Section>
    </>
  );
}