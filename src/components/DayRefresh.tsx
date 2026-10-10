"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const INDIA_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" });
const DAY_MS = 24 * 60 * 60 * 1000;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const TRIES_KEY = "festive-clock-fresh-day";

// The India day this tab opened on. Kept for the whole visit, across in-app page changes.
let openedOn: string | undefined;

function msToIndiaMidnight(now: number) {
  return (Math.floor((now + IST_OFFSET_MS) / DAY_MS) + 1) * DAY_MS - IST_OFFSET_MS - now;
}

// Drop the saved copy of this page, so the service worker fetches today's, then reload.
async function reloadFresh() {
  if (!navigator.onLine) return;
  try {
    for (const key of await caches.keys()) await (await caches.open(key)).delete(location.pathname, { ignoreSearch: true });
  } catch {
    // No saved copies to drop.
  }
  location.reload();
}

// Marks a page whose dates were worked out on the server, with the India day they are for.
export function RenderedDay({ day }: { day: string }) {
  return <span hidden data-rendered-day={day} />;
}

// Keeps dates current without a manual refresh. The page reloads when the India day changes:
// at midnight, or when the app comes back to the screen on a new day.
// A page built on the server for an earlier day is also reloaded, at most twice a day.
export function DayRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    openedOn ??= INDIA_DATE.format(Date.now());
    let midnightTimer: number | undefined;
    let retryTimer: number | undefined;

    function check() {
      const today = INDIA_DATE.format(Date.now());
      if (today !== openedOn) {
        void reloadFresh();
        return;
      }
      const rendered = document.querySelector<HTMLElement>("[data-rendered-day]")?.dataset.renderedDay;
      if (!rendered || rendered >= today || retryTimer !== undefined) return;
      const key = `${TRIES_KEY}:${pathname}:${today}`;
      let tries = 2;
      try {
        tries = Number(window.sessionStorage.getItem(key) ?? 0);
        window.sessionStorage.setItem(key, String(tries + 1));
      } catch {
        // Without storage, never retry, so the page cannot keep reloading.
      }
      // A short wait gives the server time to rebuild the page for today.
      if (tries < 2) retryTimer = window.setTimeout(() => void reloadFresh(), 3000);
    }

    function scheduleMidnight() {
      window.clearTimeout(midnightTimer);
      midnightTimer = window.setTimeout(() => { check(); scheduleMidnight(); }, msToIndiaMidnight(Date.now()) + 2000);
    }

    // Timers sleep while the phone is locked, so check again whenever the page is shown.
    function onShow() {
      if (document.visibilityState !== "visible") return;
      check();
      scheduleMidnight();
    }

    onShow();
    document.addEventListener("visibilitychange", onShow);
    window.addEventListener("pageshow", onShow);
    window.addEventListener("focus", onShow);
    return () => {
      window.clearTimeout(midnightTimer);
      window.clearTimeout(retryTimer);
      document.removeEventListener("visibilitychange", onShow);
      window.removeEventListener("pageshow", onShow);
      window.removeEventListener("focus", onShow);
    };
  }, [pathname]);

  return null;
}
