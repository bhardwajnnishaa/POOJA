"use client";

import { useEffect, useState } from "react";

const UNIT_LABELS = ["Days", "Hours", "Minutes", "Seconds"];

export function LiveCountdown({ target, name }: { target: number; name: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const remaining = Math.max(0, Math.floor((target - now) / 1000));
  const units = [
    Math.floor(remaining / 86400),
    Math.floor((remaining % 86400) / 3600),
    Math.floor((remaining % 3600) / 60),
    remaining % 60,
  ].map((value) => String(value).padStart(2, "0"));

  if (remaining === 0) {
    return <p className="festival-today" suppressHydrationWarning>Happy {name}! The celebration is here.</p>;
  }

  return (
    <div className="timer festival-timer" aria-label={`Time until ${name}`}>
      {units.map((value, index) => (
        <div className="timer-unit" key={UNIT_LABELS[index]}>
          <span className="timer-value" suppressHydrationWarning>{value}</span>
          <span className="timer-label">{UNIT_LABELS[index]}</span>
        </div>
      ))}
    </div>
  );
}
