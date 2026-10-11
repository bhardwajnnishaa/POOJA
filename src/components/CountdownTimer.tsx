"use client";

import { useEffect, useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import { celebrationDay } from "@/lib/festivals";

const UNIT_LABELS = ["Days", "Hours", "Minutes", "Seconds"];

// One shared interval for every timer on the page, so only the digits re-render each second.
const listeners = new Set<(now: number) => void>();
let interval: number | undefined;

function subscribe(listener: (now: number) => void) {
  listeners.add(listener);
  if (interval === undefined) {
    interval = window.setInterval(() => {
      const now = Date.now();
      listeners.forEach((notify) => notify(now));
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.clearInterval(interval);
      interval = undefined;
    }
  };
}

// Null until the page is running in the browser, so a prebuilt page never shows an old countdown.
export function useSecondTick() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    return subscribe(setNow);
  }, []);
  return now;
}

// Shown in place of the digits while the celebration is on.
function LiveNow({ day, days, className }: { day: number; days: number; className: string }) {
  const hindi = useLang() === "hi";
  const text = days > 1
    ? (hindi ? `🎉 चल रहा है · दिन ${day} / ${days}` : `🎉 Going on now · Day ${day} of ${days}`)
    : (hindi ? "🎉 आज है! शुभकामनाएँ" : "🎉 It's today! Celebrate");
  return <div className={`timer timer-live ${className}`.trim()} role="status">{text}</div>;
}

export function CountdownTimer({ target, label, className = "", days = 1 }: { target: number; label: string; className?: string; days?: number }) {
  const now = useSecondTick();
  const t = useT();
  const liveDay = now === null ? null : celebrationDay(target, days, now);
  const remaining = now === null ? null : Math.max(0, Math.floor((target - now) / 1000));
  const units = remaining === null
    ? ["--", "--", "--", "--"]
    : [
      Math.floor(remaining / 86400),
      Math.floor((remaining % 86400) / 3600),
      Math.floor((remaining % 3600) / 60),
      remaining % 60,
    ].map((value) => String(value).padStart(2, "0"));

  if (liveDay !== null) return <LiveNow day={liveDay} days={days} className={className} />;

  return (
    <div className={`timer ${className}`.trim()} aria-label={label}>
      {units.map((value, index) => (
        <div className="timer-unit" key={UNIT_LABELS[index]}>
          <span className="timer-value">{value}</span>
          <span className="timer-label">{t(UNIT_LABELS[index])}</span>
        </div>
      ))}
    </div>
  );
}
