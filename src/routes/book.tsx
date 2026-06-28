import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, Eyebrow } from "@/components/section";
import { FadeIn, MediaSlot } from "@/components/media";
import bookCover from "@/assets/book-cover.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book — Ben Gordon, NBA Veteran | OfOurOwn" },
      { name: "description", content: "The forthcoming book from Ben Gordon, NBA Veteran — on training, recovery, and the long game." },
      { property: "og:title", content: "Book — Ben Gordon" },
      { property: "og:description", content: "The forthcoming book from Ben Gordon, NBA Veteran." },
      { property: "og:image", content: `${SITE_ORIGIN}${bookCover}` },
      { property: "og:image:alt", content: "Cover of the forthcoming book Of Our Own by Ben Gordon — minimal editorial design with the title in a refined serif." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_ORIGIN}${bookCover}` },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book"
        title="The book."
        lede="A long-form work from Ben Gordon, NBA Veteran — on training, recovery, identity, and the long game. Cover, title, and release window to come."
      />
      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5"><FadeIn><MediaSlot label="BOOK · cover · 3:4 placeholder" aspect="3:4" src={bookCover} alt="Cover of the forthcoming book Of Our Own by Ben Gordon — minimalist editorial design with the title set in a refined serif over a textured neutral ground." /></FadeIn></div>
          <div className="md:col-span-7">
            <FadeIn delay={0.05}>
              <Eyebrow>About the book</Eyebrow>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">The story behind the work.</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Synopsis coming soon. The book will live in the shop once it's ready to ship; signed copies and special editions will be added there.
              </p>
              <div className="mt-8">
                <Link to="/shop" className="inline-flex h-12 items-center gap-2 bg-foreground px-6 text-sm uppercase tracking-wider text-background transition hover:opacity-90">
                  Visit the shop <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>
    </>
  );
}