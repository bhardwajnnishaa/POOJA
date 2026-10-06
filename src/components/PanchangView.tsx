"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useSecondTick } from "@/components/CountdownTimer";
import { useLang, useT } from "@/lib/i18n";
import type { CityId, Named, PanchangDay, Span } from "@/lib/panchang";

export type DayEvents = Record<string, Named[]>;
type City = { id: CityId; name: string; nameHi: string };

const CITY_KEY = "festive-clock-city";
const INDIA_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" });
const TIME = { en: new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }), hi: new Intl.DateTimeFormat("hi-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }) };
const DAY_TIME = { en: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }), hi: new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }) };
const LONG_DATE = { en: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }), hi: new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) };

export function PanchangView({ days, events, cities }: { days: Record<CityId, PanchangDay[]>; events: DayEvents; cities: City[] }) {
  const t = useT();
  const lang = useLang();
  const now = useSecondTick();
  const [cityId, setCityId] = useState<CityId>("delhi");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CITY_KEY) as CityId | null;
      if (saved && cities.some((city) => city.id === saved)) setCityId(saved);
    } catch {
      // Delhi stays the default.
    }
  }, [cities]);

  function chooseCity(id: CityId) {
    setCityId(id);
    try { window.localStorage.setItem(CITY_KEY, id); } catch { /* Only for this visit. */ }
  }

  const list = days[cityId];
  // Today in India, worked out in the browser so a saved page still opens on the right day.
  const today = INDIA_DATE.format(now ?? Date.now());
  const todayIndex = Math.max(0, list.findIndex((day) => day.date === today));
  const index = Math.min(list.length - 1, Math.max(0, todayIndex + offset));
  const day = list[index];
  const name = (value: Named) => (lang === "hi" ? value.hi : value.en);
  const time = (ms: number | null) => (ms === null ? "—" : TIME[lang].format(ms));
  const till = (ms: number) => (INDIA_DATE.format(ms) === day.date ? time(ms) : DAY_TIME[lang].format(ms));
  const range = (value: Span) => `${time(value.start)} – ${time(value.end)}`;
  const isNow = (value: Span) => now !== null && now >= value.start && now < value.end;
  const dayLabel = index === todayIndex ? t("Today") : index === todayIndex + 1 ? t("Tomorrow") : index === todayIndex - 1 ? t("Yesterday") : name(day.weekday);
  const dayEvents = events[day.date] ?? [];

  const row = (label: string, value: Span | null, tone: "avoid" | "good", note?: string) => (
    <li className={`panchang-time panchang-${tone} ${value && isNow(value) ? "panchang-now" : ""}`}>
      <span>{label}{note ? <small>{note}</small> : null}</span>
      <b>{value ? range(value) : t("Not today")}</b>
      {value && isNow(value) ? <em>{t("Now")}</em> : null}
    </li>
  );

  return (
    <section className="panchang" aria-labelledby="panchang-title">
      <div className="panchang-hero">
        <div className="eyebrow"><span className="eyebrow-line" /> {t("TODAY'S PANCHANG")}</div>
        <h1 id="panchang-title">{lang === "hi" ? <>आज का <em>पंचांग</em></> : <>Today&apos;s <em>Panchang</em></>}</h1>
        <label className="panchang-city">
          <MapPin aria-hidden="true" />
          <span className="sr-only">{t("City")}</span>
          <select value={cityId} onChange={(event) => chooseCity(event.target.value as CityId)}>
            {cities.map((city) => <option key={city.id} value={city.id}>{lang === "hi" ? city.nameHi : city.name}</option>)}
          </select>
        </label>
      </div>

      <div className="panchang-daynav">
        <button type="button" onClick={() => setOffset(offset - 1)} disabled={index === 0} aria-label={t("Previous day")}><ChevronLeft aria-hidden="true" /></button>
        <div suppressHydrationWarning>
          <strong>{dayLabel}</strong>
          <span>{name(day.weekday)} · {LONG_DATE[lang].format(Date.parse(`${day.date}T00:00:00Z`))}</span>
        </div>
        <button type="button" onClick={() => setOffset(offset + 1)} disabled={index === list.length - 1} aria-label={t("Next day")}><ChevronRight aria-hidden="true" /></button>
      </div>

      <div className="panchang-summary" suppressHydrationWarning>
        <p className="panchang-tithi">{name(day.tithi.paksha)} · <b>{name(day.tithi)}</b></p>
        <p className="panchang-month">{t("Month")}: {name(day.purnimantaMonth)} ({t("North India")}) · {name(day.amantaMonth)} ({t("South & West")})</p>
        {dayEvents.length ? <p className="panchang-events">🎉 {dayEvents.map(name).join(" · ")}</p> : null}
      </div>

      <div className="panchang-grid" suppressHydrationWarning>
        <div className="panchang-card"><span>🌅 {t("Sunrise")}</span><b>{time(day.sunrise)}</b><span>🌇 {t("Sunset")}</span><b>{time(day.sunset)}</b></div>
        <div className="panchang-card"><span>🌙 {t("Moonrise")}</span><b>{time(day.moonrise)}</b><span>🌘 {t("Moonset")}</span><b>{time(day.moonset)}</b></div>
        <div className="panchang-card"><span>{t("Tithi")}</span><b>{name(day.tithi)}</b><small>{t("till")} {till(day.tithi.end)}, {t("then")} {name(day.tithi.next)}</small></div>
        <div className="panchang-card"><span>{t("Nakshatra")}</span><b>{name(day.nakshatra)}</b><small>{t("till")} {till(day.nakshatra.end)}, {t("then")} {name(day.nakshatra.next)}</small></div>
        <div className="panchang-card"><span>{t("Yoga")}</span><b>{name(day.yoga)}</b><small>{t("till")} {till(day.yoga.end)}, {t("then")} {name(day.yoga.next)}</small></div>
      </div>

      <div className="panchang-times" suppressHydrationWarning>
        <div>
          <h2>⛔ {t("Avoid for new work")}</h2>
          <ul>
            {row(t("Rahu Kaal"), day.rahuKaal, "avoid")}
            {row(t("Yamaganda"), day.yamaganda, "avoid")}
            {row(t("Gulika Kaal"), day.gulika, "avoid")}
          </ul>
        </div>
        <div>
          <h2>✨ {t("Good times")}</h2>
          <ul>
            {row(t("Abhijit Muhurat"), day.abhijit, "good", day.abhijit ? undefined : t("Not observed on Wednesday"))}
            {row(t("Brahma Muhurat"), day.brahmaMuhurat, "good")}
          </ul>
        </div>
      </div>

      <p className="panchang-note">{t("Times are for the city you choose, worked out from the Sun and Moon. Tithi, nakshatra and yoga are those running at sunrise. Your local panchang may differ by a minute or two.")}</p>
    </section>
  );
}
