"use client";

import { CountdownTimer, useSecondTick } from "@/components/CountdownTimer";

export function LiveCountdown({ target, name }: { target: number; name: string }) {
  const now = useSecondTick();

  if (now !== null && target <= now) {
    return <p className="festival-today">Happy {name}! The celebration is here.</p>;
  }

  return <CountdownTimer target={target} label={`Time until ${name}`} className="festival-timer" />;
}
