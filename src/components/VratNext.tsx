"use client";

import { CountdownTimer, useSecondTick } from "@/components/CountdownTimer";
import { RemindMe } from "@/components/RemindMe";

export type VratItem = { kind: "ekadashi" | "purnima" | "amavasya"; name: string; popularName?: string; date: string; start: number; end: number };

const KINDS = [
  { kind: "ekadashi", label: "Next Ekadashi", emoji: "🙏" },
  { kind: "purnima", label: "Next Purnima", emoji: "🌕" },
  { kind: "amavasya", label: "Next Amavasya", emoji: "🌑" },
] as const;

const DAY = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const TIME = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

// Picks the next one of each kind in the browser, so the cards stay right even on a saved page.
export function VratNext({ items }: { items: VratItem[] }) {
  const now = useSecondTick() ?? 0;
  return (
    <div className="vrat-next">
      {KINDS.map(({ kind, label, emoji }) => {
        const item = items.find((entry) => entry.kind === kind && entry.end > now);
        if (!item) return null;
        const running = now >= item.start;
        return (
          <article className={`vrat-next-card vrat-${kind}`} key={kind}>
            <span className="vrat-next-label">{emoji} {label}</span>
            <h3>{item.name}</h3>
            {item.popularName ? <p className="vrat-popular">{item.popularName}</p> : null}
            <p className="vrat-next-date">{DAY.format(Date.parse(`${item.date}T00:00:00Z`))}</p>
            {running ? (
              <p className="vrat-running">Running now · ends {TIME.format(item.end)}</p>
            ) : (
              <CountdownTimer target={item.start} label={`Time until ${item.name} begins`} className="vrat-timer" />
            )}
            {!running ? (
              <RemindMe
                title={`${emoji} ${item.name}`}
                date={item.date}
                details={`${item.name}. Tithi: ${TIME.format(item.start)} to ${TIME.format(item.end)} IST. https://celebration-calendar-india.vercel.app/vrat`}
              />
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
