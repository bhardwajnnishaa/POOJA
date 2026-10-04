"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

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

export function CountdownTimer({ target, label, className = "" }: { target: number; label: string; className?: string }) {
  const now = useSecondTick();
  const t = useT();
  const remaining = now === null ? null : Math.max(0, Math.floor((target - now) / 1000));
  const units = remaining === null
    ? ["--", "--", "--", "--"]
    : [
      Math.floor(remaining / 86400),
      Math.floor((remaining % 86400) / 3600),
      Math.floor((remaining % 3600) / 60),
      remaining % 60,
    ].map((value) => String(value).padStart(2, "0"));

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
