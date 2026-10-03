import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, CalendarDays, ChevronRight, Clock3 } from "lucide-react";
import { QuoteMaker } from "@/components/QuoteMaker";
import { SiteHeader } from "@/components/SiteHeader";
import { getCalendarData, rollingWindowEnd, type CalendarData } from "@/lib/calendar-data";
import { FESTIVAL_INFO, eventTimestamp, hasKnownDate } from "@/lib/festivals";
import type { CalendarEntry } from "@/types/calendar";
import { BrandMark } from "@/components/BrandMark";
import { FooterLinks } from "@/components/FooterLinks";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Indian Festival Calendar",
  description: "See upcoming Indian festivals and public holidays month by month, and write a greeting for each celebration.",
  alternates: { canonical: "/calendar" },
};

const INDIA_DATE_PARTS = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Kolkata",
});
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-IN", { month: "long", timeZone: "UTC" });
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const FALLBACK_EVENT_NAMES: Record<string, string> = {
  diwali: "Diwali",
  eid: "Eid al-Fitr",
  newYear: "New Year",
  rakhi: "Rakhi",
  holi: "Holi",
  independenceDay: "Independence Day",
};

function indiaDateParts(timestamp: number) {
  const parts = INDIA_DATE_PARTS.formatToParts(timestamp);
  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
    date: INDIA_DATE_PARTS.format(timestamp),
  };
}

// Add our own festival dates to the calendar wherever the public feed does not already list them.
function withFestivalDates(data: CalendarData, todayDate: string, windowEnd: string): CalendarEntry[] {
  const startYear = Number(todayDate.slice(0, 4));
  const added: CalendarEntry[] = [];
  for (const festival of FESTIVAL_INFO) {
    for (const year of [startYear, startYear + 1]) {
      if (!hasKnownDate(festival, year, data.dates)) continue;
      const date = INDIA_DATE_PARTS.format(eventTimestamp(festival, year, data.dates));
      const listed = data.events.some((event) => event.festivalId === festival.id && event.date.slice(0, 4) === String(year));
      if (date >= todayDate && date < windowEnd && !listed) {
        added.push({ date, name: festival.name, category: "festival", source: "Festive Clock", tentative: festival.moonDependent, festivalId: festival.id });
      }
    }
  }
  return [...data.events, ...added].sort((first, second) => first.date.localeCompare(second.date));
}

function eventDay(event: CalendarEntry) {
  return Number(event.date.slice(8, 10));
}

function eventHref(event: CalendarEntry) {
  return `/calendar?event=${encodeURIComponent(event.name)}#quote-studio`;
}

function monthLabel(year: number, month: number) {
  return `${MONTH_FORMATTER.format(new Date(Date.UTC(year, month - 1, 1)))} ${year}`;
}

function MonthCard({
  year,
  month,
  today,
  events,
}: {
  year: number;
  month: number;
  today: string;
  events: CalendarEntry[];
}) {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const dayEvents = new Map<number, CalendarEntry[]>();

  for (const event of events) {
    const day = eventDay(event);
    dayEvents.set(day, [...(dayEvents.get(day) ?? []), event]);
  }

  const calendarCells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, day) => day + 1),
  ];
  const monthEvents = events.filter((event) => Number(event.date.slice(5, 7)) === month);

  return (
    <article className="month-card">
      <div className="month-card-heading">
        <div>
          <span className="month-card-kicker">{String(month).padStart(2, "0")} / {year}</span>
          <h3>{monthLabel(year, month)}</h3>
        </div>
        <CalendarDays aria-hidden="true" />
      </div>
      <div className="month-weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday, index) => <span key={`${weekday}-${index}`}>{weekday}</span>)}
      </div>
      <div className="month-day-grid">
        {calendarCells.map((day, index) => {
          if (day === null) return <span aria-hidden="true" className="month-day-empty" key={`empty-${index}`} />;
          const markedEvents = dayEvents.get(day) ?? [];
          const isToday = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` === today;
          const dayClass = [
            "month-day",
            isToday ? "month-day-today" : "",
            markedEvents.length ? "month-day-marked" : "",
            markedEvents.some((event) => event.category === "public-holiday") ? "month-day-official" : "",
          ].filter(Boolean).join(" ");

          if (markedEvents.length === 0) {
            return <span className={dayClass} key={`day-${day}`}>{day}</span>;
          }

          return (
            <Link
              aria-label={`${day} ${monthLabel(year, month)}: ${markedEvents.map((event) => event.name).join(", ")}`}
              className={dayClass}
              key={`day-${day}`}
              href={eventHref(markedEvents[0])}
              title={markedEvents.map((event) => event.name).join(", ")}
            >
              {day}<span className="month-day-dot" />
            </Link>
          );
        })}
      </div>
      <div className="month-events">
        {monthEvents.length === 0 ? (
          <p className="month-empty">No marked holidays this month.</p>
        ) : monthEvents.map((event) => (
          <Link className="month-event-row" href={eventHref(event)} key={`${event.date}-${event.name}`}>
            <time dateTime={event.date}>{eventDay(event)} <span>{MONTH_FORMATTER.format(new Date(Date.UTC(year, month - 1, 1))).slice(0, 3)}</span></time>
            <span className="month-event-name">{event.name}</span>
            <span className={`event-category event-category-${event.category}`}>
              {event.category === "public-holiday" ? "Public holiday" : event.category === "festival" ? "Festival" : "Observance"}
            </span>
            {event.tentative && <span className="event-tentative">Expected</span>}
            <ChevronRight aria-hidden="true" />
          </Link>
        ))}
      </div>
    </article>
  );
}

// Hidden until real ads are set up, matching the home page.
function AdBanner() {
  if (process.env.NEXT_PUBLIC_SHOW_AD_SLOTS !== "true") return null;
  return (
    <div className="top-ad-wrap">
      <aside aria-label="Advertisement" className="ad-slot ad-slot-banner">
        <span className="ad-slot-label">GOOGLE-ADSENSE-BANNER</span>
        <span className="ad-slot-note">Advertisement</span>
      </aside>
    </div>
  );
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  let calendarData: CalendarData = { dates: {}, events: [] };
  let calendarAvailable = true;
  try {
    calendarData = await getCalendarData();
  } catch {
    calendarAvailable = false;
  }

  const { event: requestedEvent } = await searchParams;
  const selectedEvent = requestedEvent ? FALLBACK_EVENT_NAMES[requestedEvent] ?? requestedEvent : null;
  const now = Date.now();
  const todayDate = INDIA_DATE_PARTS.format(now);
  const windowEnd = rollingWindowEnd(todayDate);
  const events = withFestivalDates(calendarData, todayDate, windowEnd);
  const calendarStatus = calendarAvailable ? "ready" : "unavailable";
  const today = indiaDateParts(now);
  // A rolling 12 months: past months drop off and new ones appear on their own.
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(today.year, today.month - 1 + index, 1));
    return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
  });
  const first = months[0];
  const last = months[months.length - 1];
  const yearLabel = first.year === last.year ? String(first.year) : `${first.year}–${String(last.year).slice(2)}`;
  const todayString = today.date;
  const eventNames = Array.from(new Set(events.map((event) => event.name)));

  return (
    <main>
      <AdBanner />
      <SiteHeader active="calendar" />

      <section className="calendar-intro">
        <div className="eyebrow"><span className="eyebrow-line" /> INDIA · PUBLIC HOLIDAYS & FESTIVALS</div>
        <div className="calendar-intro-row">
          <div>
            <h1>The months <em>ahead.</em></h1>
            <p>Find the dates that mean something to you. Choose any marked day to make it yours.</p>
          </div>
          <div className="calendar-year-stamp"><span>INDIA</span><strong suppressHydrationWarning>{yearLabel}</strong><span>NEXT 12 MONTHS</span></div>
        </div>
      </section>

      <section aria-label="Next 12 months calendar" className="calendar-section" id="month-calendar">
        <div className="calendar-heading-row">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> THE YEAR, MONTH BY MONTH</div>
            <h2 suppressHydrationWarning>{`${monthLabel(first.year, first.month)} — ${monthLabel(last.year, last.month)}`}</h2>
          </div>
          <span className={`calendar-sync-state ${calendarStatus}`}><span />{calendarStatus === "ready" ? "Dates refreshed automatically" : "Showing available dates"}</span>
        </div>
        <div className="calendar-legend" aria-label="Calendar markers">
          <span><i className="legend-dot legend-dot-holiday" /> Public holiday</span>
          <span><i className="legend-dot legend-dot-festival" /> Festival</span>
          <span><i className="legend-dot legend-dot-observance" /> Observance</span>
          <span><i className="legend-dot legend-dot-today" /> Today</span>
        </div>
        <div className="month-grid">
          {months.map(({ year, month }) => (
            <MonthCard
              events={events.filter((event) => event.date.startsWith(`${year}-${String(month).padStart(2, "0")}-`))}
              key={`${year}-${month}`}
              month={month}
              today={todayString}
              year={year}
            />
          ))}
        </div>
        {calendarStatus === "unavailable" && <p className="calendar-source-note">The public calendar feed could not be reached. Try again in a little while.</p>}
        {calendarStatus === "ready" && <p className="calendar-source-note">Dates are drawn from the India and Islamic public-holiday calendars. Lunar observances marked “Expected” may vary by local moon sighting.</p>}
      </section>

      <QuoteMaker eventNames={eventNames} selectedEvent={selectedEvent} />

      <footer className="site-footer calendar-footer">
        <Link className="brand footer-brand" href="/"><BrandMark /><span>Festive <b>Clock</b></span></Link>
        <p><Clock3 aria-hidden="true" /> India Standard Time · Updated every six hours</p>
        <a href="#month-calendar" className="back-to-top"><ArrowDownRight aria-hidden="true" /> Back to months</a>
      </footer>
      <FooterLinks />
    </main>
  );
}