import { createFileRoute, Link } from "@tanstack/react-router";
import { BookingForm } from "@/components/booking-form";
import { FadeIn, MediaSlot } from "@/components/media";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { TestimonialGrid } from "@/components/proof";
import { SpotsBanner } from "@/components/urgency";
import fstOverview from "@/assets/fst-overview.jpg";
import fstSession from "@/assets/fst-session.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/fst")({
  head: () => ({
    meta: [
      { title: "Fascia Stretch Therapy — with Ben Gordon | OfOurOwn" },
      { name: "description", content: "Private Fascia Stretch Therapy (FST) sessions for mobility, recovery, and pain — with Ben Gordon, NBA Veteran." },
      { property: "og:title", content: "Fascia Stretch Therapy with Ben Gordon" },
      { property: "og:description", content: "Mobility, recovery, and pain work — booked privately." },
      { property: "og:image", content: `${SITE_ORIGIN}${fstOverview}` },
      { property: "og:image:alt", content: "Ben Gordon holding a deep self-guided fascia stretch on a mat in a quiet, sunlit studio." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_ORIGIN}${fstOverview}` },
    ],
  }),
  component: FSTPage,
});

function FSTPage() {
  return (
    <>
      <PageHero
        eyebrow="Fascia Stretch Therapy"
        title="Move better. Recover faster. Hurt less."
        lede="Private FST sessions for athletes and everyday people — to restore range, calm the nervous system, and get out of pain."
      />

      <SpotsBanner programKey="evaluation" message="Limited in-person FST availability — reserve your session" />

      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>What it is</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">Assisted stretch, end-to-end.</h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Ben's FST work focuses on guided self-stretch positions that restore range, ease tension, and improve how you move and recover without turning recovery into another performance.
              </p>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                Training with us? This same performance &amp; recovery work is built
                into{" "}
                <Link to="/programs" className="text-foreground underline underline-offset-2 hover:opacity-80">
                  Private Plus
                </Link>
                {" "}sessions.
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-7"><FadeIn delay={0.1}><MediaSlot label="VIDEO · FST overview · 16:9" aspect="16:9" src={fstOverview} alt="Ben Gordon holding a deep self-guided fascia stretch on a mat in a sunlit studio — overview still for the FST methodology." priority /></FadeIn></div>
        </div>
      </Section>

      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Who it's for</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">For your body, not just your sport.</h2>
        </FadeIn>
        <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
          {[
            { title: "Athletes in-season", blurb: "Stay loose, recover between sessions, protect your joints." },
            { title: "Coming back from injury", blurb: "Restore range and rebuild confidence in the movement." },
            { title: "Desk-bound, stiff, stressed", blurb: "Hips, low back, shoulders — get the kinks out and breathe again." },
          ].map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.04} className="bg-background">
              <div className="h-full p-8">
                <h3 className="font-display text-2xl font-semibold">{c.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{c.blurb}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>What a session looks like</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">60–90 minutes, table-based.</h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Quick intake, full-body assessment, then progressive self-stretch work with coaching on position, breath, and control. You leave with a short reset routine to keep the gains.
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-7"><FadeIn delay={0.1}><MediaSlot label="FST session with Ben Gordon" aspect="4:3" src={fstSession} alt="Ben Gordon mid-session, seated on a stretch table working a hip-opener with controlled breath and quiet focus." /></FadeIn></div>
        </div>
      </Section>

      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>What people say</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">In their words.</h2>
        </FadeIn>
        <div className="mt-10"><FadeIn delay={0.05}><TestimonialGrid /></FadeIn></div>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>Book a session</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">Request your slot.</h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                In-person availability is limited. Ben's team confirms timing within 48 hours.
              </p>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                Pricing: 30 min = $100, 60 min = $150, 90 min = $225. Each additional 30 min = $300.
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-7"><FadeIn delay={0.05}><BookingForm type="fst" /></FadeIn></div>
        </div>
        <p className="mt-12 max-w-3xl border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground/70">
          Fascia Stretch Therapy sessions are for mobility, recovery, and general
          well-being. They are not medical care and are not a substitute for
          diagnosis or treatment from a licensed healthcare provider. If you have
          pain, an injury, or a medical condition, consult a qualified professional.
        </p>
      </Section>
    </>
  );
}