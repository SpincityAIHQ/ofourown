import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { Section, Eyebrow, PageHero } from "@/components/section";
import { FadeIn, MediaSlot, ConfirmNote } from "@/components/media";
import { EmailCapture } from "@/components/email-capture";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/music")({
  head: () => ({
    meta: [
      { title: "Music — Ben Gordon | OOO Performance" },
      {
        name: "description",
        content:
          "The other side of the work. Stream previews of Ben Gordon's music and own the records — MP3s available directly from the site.",
      },
      { property: "og:title", content: "Music — Ben Gordon" },
      {
        property: "og:description",
        content: "Stream the previews. Own the records. Support the craft.",
      },
      { property: "og:url", content: `${SITE_ORIGIN}/music` },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MusicPage,
});

const TRACKS = [
  { n: "01", title: "Track One — Title TBD" },
  { n: "02", title: "Track Two — Title TBD" },
  { n: "03", title: "Track Three — Title TBD" },
];

function MusicPage() {
  return (
    <>
      <PageHero
        eyebrow="Music"
        title="The other side of the work."
        lede="Basketball was never the whole story. Stream the previews, own the records, and support the craft — MP3s direct from the artist, no middleman."
      />

      <Section className="border-b border-border">
        <Eyebrow>The records</Eyebrow>
        <div className="mt-8 grid gap-px bg-border md:grid-cols-3">
          {TRACKS.map((t, i) => (
            <FadeIn key={t.n} delay={i * 0.05}>
              <div className="flex h-full flex-col bg-background p-6">
                <MediaSlot label={`Cover art ${t.n} · 1:1 · paste`} aspect="1:1" />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {t.n}
                    </div>
                    <div className="mt-1 font-display text-xl font-semibold leading-tight">
                      {t.title}
                    </div>
                  </div>
                </div>

                {/* Disabled preview player — goes live when audio lands */}
                <div className="mt-5 flex items-center gap-3 border border-border px-4 py-3 opacity-60">
                  <Play className="h-4 w-4" />
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Preview coming soon
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <div className="font-display text-xl font-semibold">$—</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      MP3 · price TBD
                    </div>
                  </div>
                  <span className="border border-border px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Coming soon
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>First listen</Eyebrow>
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            Be there when it drops.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Leave your email for first access to previews and releases — direct from Ben.
          </p>
          <div className="mt-8">
            <EmailCapture source="music_waitlist" cta="Get first access" />
          </div>
        </div>
        <ConfirmNote
          items={[
            "Artist name for the page (Ben Gordon / Ashkamyael / other)",
            "Track list + audio files: full MP3s, 30–60s preview clips, cover art",
            "Per-track price",
            "Confirm ownership of masters and beats on every track before selling",
          ]}
        />
      </Section>
    </>
  );
}
