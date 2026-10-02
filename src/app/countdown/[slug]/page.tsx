import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ShoppingBag, Sparkles, WandSparkles } from "lucide-react";
import { LiveCountdown } from "@/components/LiveCountdown";
import { QuoteMaker } from "@/components/QuoteMaker";
import { ShareOptions } from "@/components/ShareOptions";
import { SiteHeader } from "@/components/SiteHeader";
import { AFFILIATE_LINKS } from "@/config/affiliates";
import { getCalendarData } from "@/lib/calendar-data";
import {
  FESTIVAL_INFO,
  eventTimestamp,
  festivalBySlug,
  festivalPath,
  hasKnownDate,
  indiaYear,
  nextEventTimestamp,
  type CalendarDates,
  type FestivalInfo,
} from "@/lib/festivals";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 21600;
export const dynamicParams = false;

const LONG_DATE = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});
const ISO_DATE = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Kolkata",
});
const UPCOMING_YEARS = 5;

type PageProps = { params: Promise<{ slug: string }> };

async function loadCalendarDates(): Promise<CalendarDates> {
  try {
    return (await getCalendarData()).dates;
  } catch {
    return {};
  }
}

function upcomingDates(festival: FestivalInfo, target: number, calendarDates: CalendarDates) {
  const firstYear = indiaYear(target);
  return Array.from({ length: UPCOMING_YEARS }, (_, index) => firstYear + index)
    .filter((year) => hasKnownDate(festival, year, calendarDates))
    .map((year) => ({ year, timestamp: eventTimestamp(festival, year, calendarDates) }));
}

export function generateStaticParams() {
  return FESTIVAL_INFO.map((festival) => ({ slug: festival.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const festival = festivalBySlug((await params).slug);
  if (!festival) return {};

  const target = nextEventTimestamp(festival, Date.now(), await loadCalendarDates());
  const year = indiaYear(target);
  const title = `${festival.name} ${year} Countdown: How Many Days Left?`;
  const description = `Live countdown to ${festival.name} ${year} on ${LONG_DATE.format(target)}. See the days, hours and minutes left, and upcoming ${festival.name} dates in India.`;

  return {
    title,
    description,
    alternates: { canonical: festivalPath(festival) },
    openGraph: {
      title,
      description,
      url: festivalPath(festival),
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME}: ${festival.name} countdown` }],
    },
  };
}

export default async function FestivalPage({ params }: PageProps) {
  const festival = festivalBySlug((await params).slug);
  if (!festival) notFound();

  const calendarDates = await loadCalendarDates();
  const target = nextEventTimestamp(festival, Date.now(), calendarDates);
  const year = indiaYear(target);
  const dateLabel = LONG_DATE.format(target);
  const otherFestivals = FESTIVAL_INFO.filter((other) => other.id !== festival.id);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${festival.name} ${year}`,
    description: festival.about.join(" "),
    startDate: ISO_DATE.format(target),
    endDate: ISO_DATE.format(target),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: "India", address: { "@type": "PostalAddress", addressCountry: "IN" } },
    url: `${SITE_URL}${festivalPath(festival)}`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <SiteHeader active="countdown" />

      <section className={`festival-hero event-card-${festival.theme}`}>
        <div className="eyebrow"><span className="eyebrow-line" /> {festival.subtitle.toUpperCase()}</div>
        <h1>{festival.name} {year} Countdown</h1>
        <p className="festival-date">
          {festival.name} {year} {festival.moonDependent ? "is expected on" : "falls on"} <b>{dateLabel}</b> in India.
        </p>
        <LiveCountdown target={target} name={festival.name} />
        <div className="festival-share">
          <ShareOptions message={`Counting down to ${festival.name} on ${dateLabel}!`} />
        </div>
        <a className="write-quote-link festival-quote-link" href="#quote-studio">
          <WandSparkles aria-hidden="true" />
          Write a {festival.name} quote
        </a>
      </section>

      <section className="festival-shop" aria-labelledby="festival-shop-heading">
        <div className="festival-shop-heading">
          <span className="event-icon"><ShoppingBag aria-hidden="true" /></span>
          <div>
            <h2 id="festival-shop-heading">Shop for {festival.name}</h2>
            <p>Searches on popular Indian stores, picked for {festival.name}.</p>
          </div>
        </div>
        <nav className="festival-shop-list" aria-label={`Stores for ${festival.name}`}>
          {AFFILIATE_LINKS[festival.id].map((link) => (
            <a
              className={`shopping-retailer marketplace-${link.id}`}
              href={link.href}
              key={link.id}
              rel="sponsored noopener noreferrer"
              target="_blank"
            >
              <span>{link.label}</span><ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </nav>
      </section>

      <section className="festival-details">
        <article>
          <h2>About {festival.name}</h2>
          {festival.about.map((line) => <p key={line}>{line}</p>)}
        </article>
        <article>
          <h2>Upcoming {festival.name} dates</h2>
          <table className="festival-dates">
            <thead><tr><th scope="col">Year</th><th scope="col">Date</th></tr></thead>
            <tbody>
              {upcomingDates(festival, target, calendarDates).map((entry) => (
                <tr key={entry.year}><td>{entry.year}</td><td>{LONG_DATE.format(entry.timestamp)}</td></tr>
              ))}
            </tbody>
          </table>
          {festival.moonDependent ? <p className="festival-note">Dates are expected dates. The final date depends on the moon sighting.</p> : null}
        </article>
      </section>

      <QuoteMaker selectedEvent={festival.name} />

      <nav className="festival-more" aria-label="Other festival countdowns">
        <h2>More festival countdowns</h2>
        <ul>
          {otherFestivals.map((other) => (
            <li key={other.id}>
              <Link href={festivalPath(other)}>{other.name} countdown <ArrowUpRight aria-hidden="true" /></Link>
            </li>
          ))}
          <li><Link href="/">All countdowns <ArrowUpRight aria-hidden="true" /></Link></li>
        </ul>
      </nav>

      <footer className="site-footer">
        <Link className="brand footer-brand" href="/"><span className="brand-mark"><Sparkles aria-hidden="true" /></span><span>Festive <b>Clock</b></span></Link>
        <p>Made for the moments that bring us together.</p>
        <Link href="/calendar" className="back-to-top">Festival calendar →</Link>
      </footer>
    </main>
  );
}
