import { Link } from "@tanstack/react-router";

const COLUMNS = [
  {
    title: "Work with Ben",
    links: [
      { to: "/training", label: "Training" },
      { to: "/fst", label: "Fascia Stretch Therapy" },
      { to: "/wellness", label: "Wellness" },
      { to: "/coaching", label: "Coaching" },
      { to: "/speaking", label: "Speaking" },
    ],
  },
  {
    title: "Shop",
    links: [
      { to: "/shop", label: "Shop home" },
      { to: "/book", label: "Book" },
      { to: "/manuals", label: "Manuals" },
      { to: "/supplements", label: "Supplements" },
      { to: "/merch", label: "Merch" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/community", label: "Community" },
      { to: "/advocacy", label: "Advocacy" },
      { to: "/contact", label: "Contact" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="border-b border-border bg-foreground text-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-xs uppercase tracking-[0.2em] md:flex-row md:items-center md:justify-between">
          <span>In crisis? You're not alone.</span>
          <span>
            Call or text{" "}
            <a href="tel:988" className="underline underline-offset-4">
              988
            </a>{" "}
            · Suicide & Crisis Lifeline (US)
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-display text-2xl font-semibold">OfOurOwn</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            The home of Ben Gordon, NBA legend. Training, wellness, coaching, speaking, and a community for people doing the work.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="md:col-span-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Stay close
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Social & community links coming soon.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} OfOurOwn. All rights reserved.</p>
          <p className="max-w-2xl text-muted-foreground/70">
            Information on this site is for general education only and is not medical, mental-health, financial, or legal advice. Always consult a qualified professional for your situation.
          </p>
        </div>
      </div>
    </footer>
  );
}