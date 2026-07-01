/**
 * Service-worker registration. Manual (injectRegister: null) and guarded so it
 * only runs in the browser, in production. autoUpdate behavior: when an updated
 * SW finishes installing while an old one still controls the page, reload once
 * to pick it up.
 */
let reloaded = false;

export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return;

  const register = () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller &&
              !reloaded
            ) {
              // An update is ready and an old SW controls the page → reload once.
              reloaded = true;
              window.location.reload();
            }
          });
        });
      })
      .catch(() => {
        /* registration failures must never break the app */
      });
  };

  // This runs from a post-hydration effect, so the window "load" event has
  // usually already fired — register immediately in that case.
  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}
