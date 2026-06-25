import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold">OfOurOwn</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ben Gordon, NBA legend — Training. Wellness. Coaching.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/training" className="hover:text-foreground">Training</Link>
          <Link to="/wellness" className="hover:text-foreground">Wellness</Link>
          <Link to="/coaching" className="hover:text-foreground">Coaching</Link>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} OfOurOwn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}