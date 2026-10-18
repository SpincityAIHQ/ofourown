import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, User } from "lucide-react";
import { CartButton } from "./cart-drawer";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type Leaf = { to: string; label: string; blurb?: string };
type Item = Leaf | { label: string; children: Leaf[] };

const NAV: Item[] = [
  {
    label: "Train",
    children: [
      {
        to: "/evaluation",
        label: "Free Evaluation",
        blurb: "Find the right starting point for your player.",
      },
      {
        to: "/programs",
        label: "Programs & Pricing",
        blurb: "Group, private, Private Plus, and camps.",
      },
      { to: "/training", label: "Training", blurb: "Purposeful basketball development." },
      { to: "/philosophy", label: "Our Philosophy", blurb: "How we develop complete players." },
      { to: "/elite", label: "OOO Elite", blurb: "Explore the basketball academy." },
    ],
  },
  { to: "/about", label: "Ben Gordon" },
  {
    label: "Explore",
    children: [
      { to: "/community", label: "Community" },
      { to: "/speaking", label: "Media & Speaking" },
      { to: "/consultation", label: "Consultation" },
      { to: "/music", label: "Music" },
      { to: "/coaching", label: "Coaching" },
      { to: "/fst", label: "Fascia Stretch Therapy" },
      { to: "/wellness", label: "Wellness" },
    ],
  },
  { to: "/shop", label: "Shop" },
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
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
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
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (alive) setEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleSignOut() {
    setMenuOpen(false);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
    router.invalidate();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-20 max-w-[1312px] items-center justify-between gap-4 px-6 sm:px-10">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="OOO Performance — home"
        >
          <span className="text-3xl font-semibold tracking-[-0.12em]">OOO</span>
          <span className="border-l border-border pl-3 text-[9px] font-medium uppercase leading-relaxed tracking-[0.22em]">
            Performance
            <br />
            By Ben Gordon
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 xl:gap-8 lg:flex">
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
        <div className="flex items-center gap-3">
          {email ? (
            <div ref={menuRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex h-9 items-center gap-1.5 border border-border px-3 text-xs uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
                aria-expanded={menuOpen}
              >
                <User className="h-3.5 w-3.5" />
                Account
              </button>
              {menuOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 border border-border bg-background shadow-sm">
                  <div className="border-b border-border px-4 py-3 text-xs text-muted-foreground">
                    {email}
                  </div>
                  <Link
                    to="/elite/learn"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm hover:bg-accent"
                  >
                    My academy
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full border-t border-border px-4 py-3 text-left text-sm hover:bg-accent"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              to="/auth"
              search={{ redirect: undefined }}
              className="hidden h-9 items-center px-3 text-xs uppercase tracking-wider text-muted-foreground transition hover:text-foreground lg:inline-flex"
            >
              Sign in
            </Link>
          )}
          <Link
            to="/evaluation"
            className="hidden h-9 items-center bg-foreground px-4 text-xs uppercase tracking-wider text-background transition hover:opacity-90 lg:inline-flex"
          >
            Free evaluation
          </Link>
          <CartButton />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            aria-label={mobile ? "Close navigation" : "Open navigation"}
            aria-expanded={mobile}
            aria-controls="mobile-navigation"
            onClick={() => setMobile((v) => !v)}
          >
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobile ? (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-background lg:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape") setMobile(false);
          }}
        >
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-6xl flex-col px-6 py-2">
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
            <Link
              to="/evaluation"
              onClick={() => setMobile(false)}
              className="mt-3 inline-flex h-11 items-center justify-center bg-foreground px-6 text-xs uppercase tracking-wider text-background"
            >
              Request a free evaluation
            </Link>
            {email ? (
              <button
                type="button"
                onClick={() => {
                  setMobile(false);
                  void handleSignOut();
                }}
                className="mt-2 inline-flex h-11 items-center justify-center border border-border px-6 text-xs uppercase tracking-wider text-muted-foreground"
              >
                Sign out ({email})
              </button>
            ) : (
              <Link
                to="/auth"
                search={{ redirect: undefined }}
                onClick={() => setMobile(false)}
                className="mt-2 inline-flex h-11 items-center justify-center border border-border px-6 text-xs uppercase tracking-wider text-muted-foreground"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
