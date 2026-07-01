import { useEffect, useState } from "react";
import { Share, X } from "lucide-react";

/**
 * Subtle, dismissible "Add OOO to your home screen" affordance.
 *  - Android/Chrome: captures `beforeinstallprompt` and triggers the native
 *    install dialog.
 *  - iOS Safari: shows brief "Share → Add to Home Screen" instructions
 *    (no native prompt exists there).
 * Dismissal is persisted via cookie (localStorage may be restricted on iOS /
 * in standalone), so it never nags. Hidden entirely once installed.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const COOKIE = "ooo_pwa_dismissed";

function hasDismissed(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`));
}

function setDismissed() {
  // ~60 days
  document.cookie = `${COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 60}; samesite=lax`;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent);
}

export function InstallPrompt() {
  const [mode, setMode] = useState<"android" | "ios" | null>(null);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || hasDismissed()) return;

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setMode("android");
    }
    function onInstalled() {
      setMode(null);
      setDismissed();
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // iOS has no beforeinstallprompt — offer instructions after a short, quiet delay.
    let t: ReturnType<typeof setTimeout> | undefined;
    if (isIos()) {
      t = setTimeout(() => {
        if (!hasDismissed() && !isStandalone()) setMode((m) => m ?? "ios");
      }, 2500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      if (t) clearTimeout(t);
    };
  }, []);

  if (!mode) return null;

  function dismiss() {
    setDismissed();
    setMode(null);
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice.catch(() => undefined);
    setDeferred(null);
    setDismissed();
    setMode(null);
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-sm">
      <div className="flex items-start gap-3 border border-border bg-background/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="grid h-9 w-9 shrink-0 place-items-center bg-foreground text-[10px] font-semibold tracking-[0.15em] text-background">
          OOO
        </div>
        <div className="min-w-0 flex-1">
          {mode === "android" ? (
            <>
              <p className="text-sm font-medium">Add OOO to your home screen</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Install the app for full-screen, one-tap access.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={install}
                  className="inline-flex h-8 items-center bg-foreground px-3 text-[11px] uppercase tracking-wider text-background transition hover:opacity-90"
                >
                  Install
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="inline-flex h-8 items-center px-3 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Not now
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">Add OOO to your home screen</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                Tap
                <Share className="inline h-3.5 w-3.5" aria-label="the Share icon" />
                then <span className="font-medium text-foreground">Add to Home Screen</span>.
              </p>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 shrink-0 p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
