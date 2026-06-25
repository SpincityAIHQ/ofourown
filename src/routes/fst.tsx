import { createFileRoute } from "@tanstack/react-router";
import { BookingForm } from "@/components/booking-form";
import { FadeIn, MediaSlot, VideoEmbed } from "@/components/media";
import { PageHero, Section, Eyebrow } from "@/components/section";

export const Route = createFileRoute("/fst")({
  head: () => ({
    meta: [
      { title: "Fascia Stretch Therapy — with Ben Gordon | OfOurOwn" },
      { name: "description", content: "Private Fascia Stretch Therapy (FST) sessions for mobility, recovery, and pain — with Ben Gordon, NBA legend." },
      { property: "og:title", content: "Fascia Stretch Therapy with Ben Gordon" },
      { property: "og:description", content: "Mobility, recovery, and pain work — booked privately." },
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

      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <FadeIn>
              <Eyebrow>What it is</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">Assisted stretch, end-to-end.</h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                FST is a table-based, assisted stretching method that works the whole fascial chain — joint by joint — to restore range, ease tension, and improve how you move and recover.
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-7"><FadeIn delay={0.1}><VideoEmbed label="VIDEO · FST overview · 16:9" /></FadeIn></div>
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
                Quick intake, full-body assessment, then progressive, joint-by-joint stretch work. You leave with a short reset routine to keep the gains.
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-7"><FadeIn delay={0.1}><MediaSlot label="PHOTO · session · placeholder" aspect="4:3" /></FadeIn></div>
        </div>
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
            </FadeIn>
          </div>
          <div className="md:col-span-7"><FadeIn delay={0.05}><BookingForm type="fst" /></FadeIn></div>
        </div>
      </Section>
    </>
  );
}