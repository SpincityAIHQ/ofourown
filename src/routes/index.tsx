import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { EmailCapture } from "@/components/email-capture";
import { Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot, Stat, TestimonialRow } from "@/components/media";
import homeReel from "@/assets/home-reel.jpg";
import teaserSpeaking from "@/assets/teaser-speaking.jpg";
import teaserCommunity from "@/assets/teaser-community.jpg";
import teaserAdvocacy from "@/assets/teaser-advocacy.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OfOurOwn — Ben Gordon, NBA legend" },
      { name: "description", content: "OfOurOwn — the digital home of Ben Gordon, NBA legend. Training programs, wellness protocols, and 1:1 coaching to help you perform and recover." },
      { property: "og:title", content: "OfOurOwn — Ben Gordon, NBA legend" },
      { property: "og:description", content: "Training, wellness, and coaching with Ben Gordon, NBA legend." },
      { property: "og:image", content: `${SITE_ORIGIN}${homeReel}` },
      { property: "og:image:alt", content: "Ben Gordon walking out onto an empty hardwood court at golden hour, lit by long warm light through the arena windows." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_ORIGIN}${homeReel}` },
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

const ACCOLADES = [
  { value: "12", label: "NBA seasons" },
  { value: "1st rd.", label: "2004 NBA Draft pick" },
  { value: "6th Man", label: "of the Year, 2004–05" },
  { value: "UConn", label: "2004 NCAA champion" },
] as const;

const TEASERS = [
  {
    to: "/speaking",
    eyebrow: "Speaking",
    title: "Bring Ben in.",
    blurb: "Keynotes, team talks, and intimate room work for organizations doing real work.",
    label: "Speaking · placeholder",
    alt: "Ben Gordon on stage under warm spotlights, addressing a seated audience during a keynote.",
    image: teaserSpeaking,
  },
  {
    to: "/community",
    eyebrow: "Community",
    title: "Of Our Own — together.",
    blurb: "A growing community for people training, recovering, and building lives that last.",
    label: "Community · placeholder",
    alt: "Members of the Of Our Own community working out together in a sunlit gym, mid-set and mid-conversation.",
    image: teaserCommunity,
  },
  {
    to: "/advocacy",
    eyebrow: "Advocacy",
    title: "Mental health, on the record.",
    blurb: "Ben's ongoing advocacy work in mental health, mens' wellbeing, and athlete aftercare.",
    label: "Advocacy · placeholder",
    alt: "Ben Gordon in a quiet panel setting, mid-conversation about mental health and athlete aftercare.",
    image: teaserAdvocacy,
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
          <div className="mt-14 border-t border-border pt-10">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Get Ben Gordon's notes
            </p>
            <EmailCapture source="home_hero" placeholder="you@example.com" cta="Subscribe" />
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

      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Accolades</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            A career built on the long game.
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-10 grid grid-cols-2 border border-border md:grid-cols-4">
            {ACCOLADES.map((a) => (
              <Stat key={a.label} value={a.value} label={a.label} />
            ))}
          </div>
        </FadeIn>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          Confirm exact figures before publish
        </p>
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>Watch</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">
                A minute with Ben.
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Short film coming soon. Drop in a YouTube or Vimeo URL when ready.
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.1}>
              <MediaSlot
                label="VIDEO · home reel · 16:9"
                aspect="16:9"
                src={homeReel}
                alt="Ben Gordon walking out onto an empty hardwood basketball court at golden hour, lit by long warm light through the arena windows — opening still of the home reel."
                priority
              />
            </FadeIn>
          </div>
        </div>
      </Section>

      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>What people say</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            On the record.
          </h2>
        </FadeIn>
        <div className="mt-10">
          <FadeIn delay={0.1}>
            <TestimonialRow />
          </FadeIn>
        </div>
      </Section>

      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>More from OfOurOwn</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            Beyond the training floor.
          </h2>
        </FadeIn>
        <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
          {TEASERS.map((t, i) => (
            <FadeIn key={t.to} delay={i * 0.05} className="bg-background">
              <Link
                to={t.to}
                className="group flex h-full flex-col gap-6 p-8 transition hover:bg-accent"
              >
                 <MediaSlot label={t.label} aspect="4:3" src={t.image} alt={t.alt} />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {t.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
                  <p className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                    Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            </FadeIn>
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
