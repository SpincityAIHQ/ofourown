import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { EmailCapture } from "@/components/email-capture";
import { FadeIn, MediaSlot } from "@/components/media";
import { SKOOL_URL } from "@/lib/config";
import communityPhoto from "@/assets/community-photo.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — OOO Performance" },
      { name: "description", content: "OOO Performance develops people, not just players. A development community: guest speakers, film study, recruiting and NIL education, nutrition guidance, and mental performance." },
      { property: "og:title", content: "OOO Performance — Community" },
      { property: "og:description", content: "We don't just develop players. We develop people." },
      { property: "og:image", content: `${SITE_ORIGIN}${communityPhoto}` },
      { property: "og:image:alt", content: "Ben Gordon talking with a young player courtside in a community gym, the two of them mid-conversation." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_ORIGIN}${communityPhoto}` },
    ],
  }),
  component: CommunityPage,
});

const WHO = [
  { title: "Leaders", line: "Players who set the standard for the room." },
  { title: "Students", line: "Athletes who study the game and the classroom." },
  { title: "Athletes", line: "Competitors building bodies and skills that last." },
  { title: "Professionals", line: "People preparing for life on and off the court." },
];

const PILLARS = [
  { title: "Guest Speakers", line: "Voices from across the game and beyond it." },
  { title: "Nutrition", line: "Education and guidance for fueling development — credentialed partners handle individual plans." },
  { title: "Film Study", line: "Learning to read the game frame by frame." },
  { title: "College Recruiting", line: "Education on the recruiting process and pathways — not a guarantee of placement." },
  { title: "NIL Education", line: "General education on name, image, and likeness — credentialed advisors handle individual deals." },
  { title: "Mental Performance", line: "Building the mindset that holds up under pressure." },
];

function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="We don't just develop players. We develop people."
        lede="OOO is a development community — a place where athletes grow as leaders, students, competitors, and professionals."
      />

      {/* Who OOO Develops */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>Who OOO Develops</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">More than athletes.</h2>
        </FadeIn>
        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {WHO.map((w, i) => (
            <FadeIn key={w.title} delay={(i % 4) * 0.04} className="bg-background">
              <div className="h-full p-8">
                <h3 className="font-display text-2xl font-semibold">{w.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{w.line}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* What's Inside */}
      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>What's Inside</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Six pillars of development.</h2>
        </FadeIn>
        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <FadeIn key={p.title} delay={(i % 3) * 0.04} className="bg-background">
              <div className="h-full p-8">
                <h3 className="font-display text-2xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.line}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground/70">
          Nutrition, recruiting, and NIL content is general education and guidance only — not individualized
          professional, medical, financial, or legal advice. For technical or personal specifics we connect
          members with credentialed partners.
        </p>
      </Section>

      {/* Photo */}
      <Section className="border-b border-border">
        <FadeIn>
          <MediaSlot
            label="OOO community"
            aspect="16:9"
            src={communityPhoto}
            alt="Ben Gordon courtside in a community gym, leaning in to talk with a young player."
          />
        </FadeIn>
      </Section>

      {/* Membership band */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Eyebrow>Membership</Eyebrow>
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight md:text-6xl">
            Join the community.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-background/70">
            A recurring membership for athletes and families in the OOO ecosystem.
            Get on the list for what's next.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            {SKOOL_URL ? (
              <a
                href={SKOOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 bg-background px-6 text-sm uppercase tracking-wider text-foreground transition hover:opacity-90"
              >
                Join the Community <ArrowRight className="h-4 w-4" />
              </a>
            ) : null}
            <div className="max-w-md">
              <EmailCapture source="community_interest" cta="Notify me" />
            </div>
          </div>
          <div className="mt-12 border-t border-background/20 pt-6 text-[10px] uppercase tracking-[0.2em] text-background/60">
            <div>Confirm before publish</div>
            <ul className="mt-2 space-y-1">
              <li>· Real Skool community URL</li>
              <li>· Membership tiers and price</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
