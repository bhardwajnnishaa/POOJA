"use client";

import { useSecondTick } from "@/components/CountdownTimer";
import { useLang } from "@/lib/i18n";
import { NAVDURGA, navratriDay } from "@/lib/navratri";

const INDIA_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" });

// Today's form of Maa Durga during Sharad Navratri, and a preview on the day before it starts.
// Worked out in the browser from India time, so it moves to the next Devi at midnight by itself.
export function NavratriToday() {
  const now = useSecondTick();
  const hindi = useLang() === "hi";
  if (now === null) return null;
  const day = navratriDay(INDIA_DATE.format(now));
  if (day === null) return null;

  const devi = NAVDURGA[Math.max(day, 1) - 1];
  const next = day >= 1 && day < 9 ? NAVDURGA[day] : null;
  const kicker = day === 0
    ? (hindi ? "🪔 कल से शारदीय नवरात्रि" : "🪔 Sharad Navratri starts tomorrow")
    : (hindi ? `🪔 शारदीय नवरात्रि · दिन ${day} / 9` : `🪔 Sharad Navratri · Day ${day} of 9`);
  const lead = day === 0 ? (hindi ? "कल पहला दिन:" : "Day 1 tomorrow:") : (hindi ? "आज की देवी:" : "Today's Devi:");

  return (
    <section className="navratri-today" aria-labelledby="navratri-today-title">
      <span className="navratri-kicker">{kicker}</span>
      <h2 id="navratri-today-title"><small>{lead}</small> {hindi ? devi.hi : devi.en}</h2>
      <p>{hindi ? devi.detailHi : devi.detailEn}</p>
      {next ? <p className="navratri-next">{hindi ? `कल: ${next.hi}` : `Tomorrow: ${next.en}`}</p> : null}
      <p className="navratri-note">
        {hindi
          ? "दिन दिल्ली के पंचांग के अनुसार हैं। आपके स्थानीय पंचांग में अष्टमी या नवमी एक दिन आगे-पीछे हो सकती है।"
          : "Days follow the New Delhi panchang. Your local panchang may place Ashtami or Navami a day apart."}
      </p>
    </section>
  );
}
