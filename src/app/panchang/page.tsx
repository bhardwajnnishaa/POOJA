import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { FooterLinks } from "@/components/FooterLinks";
import { PanchangView, type DayEvents } from "@/components/PanchangView";
import { SiteHeader } from "@/components/SiteHeader";
import { RenderedDay } from "@/components/DayRefresh";
import { NavratriToday } from "@/components/NavratriToday";
import { FESTIVAL_INFO, eventTimestamp, hasKnownDate } from "@/lib/festivals";
import { FESTIVAL_HI } from "@/lib/i18n-data";
import { PANCHANG_CITIES, panchangFor, type CityId, type PanchangDay } from "@/lib/panchang";
import { NAVDURGA, navratriDay } from "@/lib/navratri";
import { pitruPaksha, vratDays } from "@/lib/tithi";

// Worked out on the server and refreshed every hour; the browser picks today's page.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Today's Panchang: Rahu Kaal, Tithi, Nakshatra",
  description: "Aaj ka Panchang for your city: tithi, nakshatra, yoga, sunrise, sunset, Rahu Kaal, Yamaganda, Gulika, Abhijit and Brahma Muhurat, in English and Hindi.",
  alternates: { canonical: "/panchang" },
};

const INDIA_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" });
const DAYS_BEFORE = 1;
const DAYS_AFTER = 6;

function addDays(date: string, days: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
}

export default function PanchangPage() {
  const today = INDIA_DATE.format(Date.now());
  const dates = Array.from({ length: DAYS_BEFORE + DAYS_AFTER + 1 }, (_, index) => addDays(today, index - DAYS_BEFORE));
  const days = Object.fromEntries(
    PANCHANG_CITIES.map((city) => [city.id, dates.map((date) => panchangFor(city.id, date))]),
  ) as Record<CityId, PanchangDay[]>;

  // Festivals, vrats and Shraddh on these days.
  const events: DayEvents = {};
  const add = (date: string, en: string, hi: string) => { (events[date] ??= []).push({ en, hi }); };
  const first = dates[0];
  const last = dates[dates.length - 1];
  for (const day of vratDays(first, addDays(last, 1))) add(day.date, day.popularName ? `${day.name} (${day.popularName})` : day.name, day.name);
  const year = Number(today.slice(0, 4));
  for (const festival of FESTIVAL_INFO) {
    for (const y of [year, year + 1]) {
      if (!hasKnownDate(festival, y, {})) continue;
      const date = INDIA_DATE.format(eventTimestamp(festival, y, {}));
      if (date >= first && date <= last) add(date, `${festival.emoji} ${festival.name}`, `${festival.emoji} ${FESTIVAL_HI[festival.id].name}`);
    }
  }
  for (const day of [...pitruPaksha(year), ...pitruPaksha(year + 1)]) if (day.date >= first && day.date <= last) add(day.date, day.name, day.nameHi);
  for (const date of dates) {
    const day = navratriDay(date);
    if (day) add(date, `🪔 ${NAVDURGA[day - 1].en} (Navratri Day ${day})`, `🪔 ${NAVDURGA[day - 1].hi} (नवरात्रि दिन ${day})`);
  }

  return (
    <main>
      <SiteHeader />
      <RenderedDay day={today} />
      <NavratriToday />
      <PanchangView days={days} events={events} cities={PANCHANG_CITIES.map(({ id, name, nameHi }) => ({ id, name, nameHi }))} />
      <footer className="site-footer">
        <Link className="brand footer-brand" href="/"><BrandMark /><span>Festive <b>Clock</b></span></Link>
        <p>Made with 💛 for every celebration.</p>
        <Link href="/vrat" className="back-to-top">Ekadashi &amp; vrat dates →</Link>
      </footer>
      <FooterLinks />
    </main>
  );
}
