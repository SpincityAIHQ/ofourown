/*
 * OOO Performance — service worker.
 *
 * Hand-written and shipped as a static asset so it is served at /sw.js by Nitro
 * and is fully SSR-safe (it never runs on the server and never intercepts server
 * functions). Bump SW_VERSION to ship an update (clients auto-reload — see
 * src/lib/pwa.ts).
 *
 * Caching strategy:
 *   - navigations (HTML): network-first → fresh SSR, fall back to cache, then /offline.html
 *   - static assets (js/css/fonts/images): cache-first
 *   - server functions / APIs / non-GET: never cached, always network
 */
const SW_VERSION = "v1";
const PRECACHE = "ooo-precache-" + SW_VERSION;
const PAGES = "ooo-pages-" + SW_VERSION;
const ASSETS = "ooo-assets-" + SW_VERSION;
const OFFLINE_URL = "/offline.html";

// Static app shell. Hashed JS/CSS bundles are picked up at runtime (cache-first)
// on first visit, so we keep precache to the always-present shell.
const SHELL = [
  "/",
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/favicon-32.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      // Add individually so one failed fetch can't abort the whole install.
      await Promise.all(
        SHELL.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => undefined),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([PRECACHE, PAGES, ASSETS]);
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function isServerRequest(url) {
  // Server functions / APIs / auth — always go to the network, never cache.
  return (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_serverFn") ||
    url.pathname.includes("/_server") ||
    url.searchParams.has("_serverFn") ||
    url.pathname.startsWith("/auth")
  );
}

const ASSET_DESTINATIONS = new Set(["style", "script", "worker", "font", "image"]);

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // server functions are POST — passthrough

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return; // cross-origin — passthrough
  if (isServerRequest(url)) return; // never cache server/API responses

  // Navigations: network-first, fall back to cache, then the offline page.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(PAGES);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(req);
          if (cached) return cached;
          const offline = await caches.match(OFFLINE_URL);
          return (
            offline ||
            new Response("You're offline.", {
              status: 503,
              headers: { "Content-Type": "text/plain" },
            })
          );
        }
      })(),
    );
    return;
  }

  // Static assets: cache-first.
  if (ASSET_DESTINATIONS.has(req.destination)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
          const fresh = await fetch(req);
          if (fresh.ok && fresh.type === "basic") {
            const cache = await caches.open(ASSETS);
            cache.put(req, fresh.clone());
          }
          return fresh;
        } catch {
          return cached || Response.error();
        }
      })(),
    );
  }
});
