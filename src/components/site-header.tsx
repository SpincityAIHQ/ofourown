import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { CartButton } from "./cart-drawer";
import { cn } from "@/lib/utils";

type Leaf = { to: string; label: string; blurb?: string };
type Item = Leaf | { label: string; children: Leaf[] };

const NAV: Item[] = [
  { to: "/", label: "Home" },
  {
    label: "Train",
    children: [
      { to: "/training", label: "Training", blurb: "Private 1:1 strength & conditioning." },
      { to: "/fst", label: "Fascia Stretch Therapy", blurb: "Mobility & recovery sessions." },
      { to: "/coaching", label: "Coaching", blurb: "Mentorship for athletes & operators." },
    ],
  },
  { to: "/wellness", label: "Wellness" },
  { to: "/speaking", label: "Speaking" },
  {
    label: "Shop",
    children: [
      { to: "/shop", label: "Shop home", blurb: "All books, merch, and programs." },
      { to: "/book", label: "Book" },
      { to: "/manuals", label: "Manuals" },
      { to: "/supplements", label: "Supplements" },
      { to: "/merch", label: "Merch" },
    ],
  },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function isGroup(item: Item): item is { label: string; children: Leaf[] } {
  return "children" in item;
}

function DesktopGroup({ label, children }: { label: string; children: Leaf[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground data-[state=open]:text-foreground"
        data-state={open ? "open" : "closed"}
      >
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3">
          <div className="border border-border bg-background shadow-sm">
            <ul className="flex flex-col">
              {children.map((c) => (
                <li key={c.to}>
                  <Link
                    to={c.to}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border px-5 py-4 last:border-b-0 hover:bg-accent"
                  >
                    <div className="text-sm font-medium">{c.label}</div>
                    {c.blurb ? (
                      <div className="mt-0.5 text-xs text-muted-foreground">{c.blurb}</div>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const [mobile, setMobile] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          OfOurOwn
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) =>
            isGroup(item) ? (
              <DesktopGroup key={item.label} label={item.label} children={item.children} />
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={item.to === "/" ? { exact: true } : undefined}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2">
          <CartButton />
          <button
            type="button"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobile((v) => !v)}
          >
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobile ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-6 py-2">
            {NAV.map((item) =>
              isGroup(item) ? (
                <div key={item.label} className="border-b border-border py-3 last:border-b-0">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {item.label}
                  </div>
                  <div className="mt-2 flex flex-col">
                    {item.children.map((c) => (
                      <Link
                        key={c.to}
                        to={c.to}
                        onClick={() => setMobile(false)}
                        className="py-2 text-sm text-muted-foreground hover:text-foreground"
                        activeProps={{ className: "text-foreground" }}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobile(false)}
                  className="border-b border-border py-3 text-sm tracking-wide text-muted-foreground last:border-b-0 hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                  activeOptions={item.to === "/" ? { exact: true } : undefined}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}