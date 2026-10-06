// Festive Clock service worker: opens the app instantly and works offline.
// Pages show the saved copy at once and refresh it in the background, so updates appear on the next open.
const CACHE = "festive-clock-v3";
const START_PAGES = ["/", "/calendar"];
const HERO_HOST = "images.unsplash.com";
const SAVED_AT = "/__offline-saved-at";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(START_PAGES)).then(() => self.skipWaiting()));
});

// Save every page in the sitemap, with its scripts and styles, so all festivals open offline.
// New festivals added to the sitemap are picked up automatically.
async function saveAllPages() {
  const cache = await caches.open(CACHE);
  const sitemap = await fetch("/sitemap.xml").then((response) => response.text());
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  const assets = new Set();
  let allSaved = true;
  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (!response.ok || response.redirected) { allSaved = false; continue; }
      const html = await response.clone().text();
      await cache.put(path, response);
      for (const match of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) assets.add(match[1]);
    } catch {
      // Skip a page that fails; the rest still get saved.
      allSaved = false;
    }
  }
  for (const asset of assets) {
    if (await cache.match(asset)) continue;
    try {
      const response = await fetch(asset);
      if (response.ok) await cache.put(asset, response);
    } catch {
      // Skip a file that fails.
    }
  }
  // Once every page is fresh, drop build files from older versions to save space.
  if (allSaved) {
    for (const request of await cache.keys()) {
      const path = new URL(request.url).pathname;
      // Fonts are kept: some are only named inside stylesheets.
      if (path.startsWith("/_next/static/") && !path.startsWith("/_next/static/media/") && !assets.has(path)) await cache.delete(request);
    }
  }
  await cache.put(SAVED_AT, new Response(String(Date.now())));
}

// Re-save everything at most once a day, so offline pages stay current after updates.
async function saveAllPagesDaily() {
  const saved = await caches.match(SAVED_AT);
  const last = saved ? Number(await saved.text()) : 0;
  if (Date.now() - last > 24 * 60 * 60 * 1000) await saveAllPages();
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => saveAllPages())
      .catch(() => undefined),
  );
});

// A redirected copy is never saved: Safari refuses to open a page the worker answers with one,
// which leaves the Home Screen app on a blank error screen.
function saveCopy(request, response) {
  if (response && !response.redirected && (response.ok || response.type === "opaque")) {
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
  event.waitUntil(fresh.then(() => saveAllPagesDaily()).catch(() => undefined));
  if (saved) {
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

// Reminders sent by Festive Clock (Remind me → Set reminder).
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: event.data ? event.data.text() : "Festive Clock" };
  }
  event.waitUntil(self.registration.showNotification(data.title || "Festive Clock", {
    body: data.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: data.title || "festive-clock",
    renotify: true,
    vibrate: [300, 150, 300, 150, 300],
    data: { url: data.url || "/" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
