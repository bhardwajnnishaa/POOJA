"use client";

import { CountdownTimer, useSecondTick } from "@/components/CountdownTimer";
import { celebrationDay } from "@/lib/festivals";

export function LiveCountdown({ target, name, days = 1 }: { target: number; name: string; days?: number }) {
  const now = useSecondTick();
  const day = now === null ? null : celebrationDay(target, days, now);

  if (day !== null) {
    return (
      <p className="festival-today">
        Happy {name}! {days > 1 ? `Day ${day} of ${days} is going on now.` : "The celebration is here."}
      </p>
    );
  }

  return <CountdownTimer target={target} label={`Time until ${name}`} className="festival-timer" />;
}
