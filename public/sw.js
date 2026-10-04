// Festive Clock service worker: opens the app instantly and works offline.
// Pages show the saved copy at once and refresh it in the background, so updates appear on the next open.
const CACHE = "festive-clock-v1";
const START_PAGES = ["/", "/calendar"];
const HERO_HOST = "images.unsplash.com";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(START_PAGES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function saveCopy(request, response) {
  if (response && (response.ok || response.type === "opaque")) {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
}

// Build files never change once published, so the saved copy is always right.
async function savedFirst(request) {
  const saved = await caches.match(request);
  return saved ?? fetch(request).then((response) => saveCopy(request, response));
}

// Show the saved page now and fetch a fresh one for next time.
async function savedThenRefresh(event) {
  const request = event.request;
  const saved = await caches.match(request, { ignoreSearch: true });
  const fresh = fetch(request).then((response) => saveCopy(request, response));
  if (saved) {
    event.waitUntil(fresh.catch(() => undefined));
    return saved;
  }
  return fresh.catch(async () => (await caches.match("/")) ?? Response.error());
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.host === HERO_HOST) {
    event.respondWith(savedFirst(request));
    return;
  }
  if (url.origin !== self.location.origin) return;
  // Live data and in-app page data always come from the network.
  if (url.pathname.startsWith("/api/") || request.headers.get("RSC") || url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(savedThenRefresh(event));
    return;
  }
  if (url.pathname.startsWith("/_next/static/") || /\.(png|svg|ico|woff2|webmanifest)$/.test(url.pathname)) {
    event.respondWith(savedFirst(request));
  }
});
