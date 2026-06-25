import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { EmailCapture } from "@/components/email-capture";
import { FadeIn, MediaSlot } from "@/components/media";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — OfOurOwn | Ben Gordon, NBA legend" },
      { name: "description", content: "Of Our Own — a growing community for people training, recovering, and building lives that last, with Ben Gordon, NBA legend." },
      { property: "og:title", content: "Of Our Own — Community" },
      { property: "og:description", content: "A community for people doing the work." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="Of Our Own."
        lede="A growing community for people training hard, recovering well, and building lives — and bodies — that last. Mission first; details soon."
      />
      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <FadeIn>
              <Eyebrow>The mission</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">For people doing the work.</h2>
              <div className="mt-6 space-y-4 text-lg text-muted-foreground">
                <p>
                  Of Our Own is a space for honest conversation about training, recovery, mental health, and the long game. No noise, no performance — just people showing up for themselves and each other.
                </p>
                <p>
                  Programming, format, and home will be announced as the community takes shape. Get on the list to be first in.
                </p>
              </div>
              <div className="mt-10 max-w-xl">
                <EmailCapture source="community_waitlist" cta="Join the list" />
              </div>
            </FadeIn>
          </div>
          <div className="md:col-span-5"><FadeIn delay={0.1}><MediaSlot label="COMMUNITY · placeholder" aspect="4:3" /></FadeIn></div>
        </div>
      </Section>
      <Section>
        <FadeIn>
          <Eyebrow>While you wait</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Other ways to plug in.</h2>
        </FadeIn>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/advocacy" className="inline-flex h-12 items-center gap-2 border border-foreground px-6 text-sm uppercase tracking-wider transition hover:bg-foreground hover:text-background">
            Advocacy <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/shop" className="inline-flex h-12 items-center gap-2 border border-foreground px-6 text-sm uppercase tracking-wider transition hover:bg-foreground hover:text-background">Shop</Link>
          <Link to="/contact" className="inline-flex h-12 items-center gap-2 border border-foreground px-6 text-sm uppercase tracking-wider transition hover:bg-foreground hover:text-background">Contact</Link>
        </div>
      </Section>
    </>
  );
}