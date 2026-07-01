import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — OOO Elite" },
      { name: "description", content: "Sign in or create your account to join OOO Elite." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function safeRedirect(target: string | undefined): string {
  if (!target) return "/elite";
  try {
    const url = new URL(target, window.location.origin);
    if (url.origin !== window.location.origin) return "/elite";
    return url.pathname + url.search + url.hash;
  } catch {
    return target.startsWith("/") ? target : "/elite";
  }
}

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // If already signed in, bounce away.
  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (alive && data.user) navigate({ to: safeRedirect(redirect), replace: true });
    });
    return () => { alive = false; };
  }, [navigate, redirect]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
        navigate({ to: safeRedirect(redirect), replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return; // browser is navigating
      navigate({ to: safeRedirect(redirect), replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
          OOO Elite
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          {mode === "signin" ? "Sign in." : "Create your account."}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Access the academy — five pillars of complete-athlete development."
            : "One account for membership, orders, and updates."}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11"
        onClick={onGoogle}
        disabled={busy}
      >
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or email
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button type="submit" className="h-11 w-full" disabled={busy}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
        className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
      >
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
        <Link to="/">← Back to OfOurOwn</Link>
      </p>
    </div>
  );
}