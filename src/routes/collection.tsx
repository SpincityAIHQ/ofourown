import { createFileRoute } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot } from "@/components/media";
import { EmailCapture } from "@/components/email-capture";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "OOO Performance Collection — Coming Soon" },
      { name: "description", content: "The OOO Performance Collection — apparel built for athletes. Coming soon. Get early access." },
      { property: "og:title", content: "OOO Performance Collection — Coming Soon" },
      { property: "og:description", content: "Apparel built for athletes. Coming soon." },
      { property: "og:url", content: `${SITE_ORIGIN}/collection` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionPage,
});

const PIECES = [
  { name: "The Hoodie", label: "HOODIE · campaign · 3:4" },
  { name: "Compression", label: "COMPRESSION · campaign · 3:4" },
  { name: "The Shorts", label: "SHORTS · campaign · 3:4" },
];

function CollectionPage() {
  return (
    <>
      {/* Full-bleed campaign image */}
      <section className="border-b border-border">
        <MediaSlot
          label="OOO PERFORMANCE COLLECTION · CAMPAIGN · full-bleed"
          aspect="16:9"
          className="h-[60vh] w-full border-0 md:h-[80vh]"
        />
      </section>

      <Section className="border-b border-border">
        <FadeIn>
          <Eyebrow>OOO Performance Collection</Eyebrow>
          <h1 className="font-display text-6xl font-semibold leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
            Coming Soon.
          </h1>
          <p className="mt-10 max-w-xl text-lg text-muted-foreground md:text-xl">
            Performance apparel, built to the same standard as the training.
            Restrained, considered, made to be worn on and off the floor.
          </p>
        </FadeIn>
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-px bg-border md:grid-cols-3">
          {PIECES.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.05} className="bg-background">
              <div className="flex h-full flex-col gap-5 p-6 md:p-8">
                <MediaSlot label={p.label} aspect="3:4" />
                <p className="font-display text-2xl font-semibold">{p.name}</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  No prices yet — early access only
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Brand-statement block */}
      <Section className="border-b border-border">
        <FadeIn>
          <p className="mx-auto max-w-4xl text-center font-display text-3xl font-semibold leading-tight md:text-5xl">
            For athletes building something that lasts.
          </p>
        </FadeIn>
      </Section>

      <Section>
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow>Waitlist</Eyebrow>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Get early access.</h2>
          <p className="mt-4 text-muted-foreground">
            Be first to know when the collection drops. No spam — just the launch.
          </p>
          <div className="mt-8 flex justify-center">
            <EmailCapture source="ooo_collection_waitlist" cta="Get Early Access" />
          </div>
        </div>
      </Section>
    </>
  );
}
