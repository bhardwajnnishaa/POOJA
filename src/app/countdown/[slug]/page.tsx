import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ShoppingBag, WandSparkles } from "lucide-react";
import { GiftIdeas } from "@/components/GiftIdeas";
import { LiveCountdown } from "@/components/LiveCountdown";
import { QuoteMaker } from "@/components/QuoteMaker";
import { ShareButton } from "@/components/ShareButton";
import { RemindMe } from "@/components/RemindMe";
import { ShareOptions } from "@/components/ShareOptions";
import { SiteHeader } from "@/components/SiteHeader";
import { AFFILIATE_LINKS, DELIVERY_LINKS, retailerSearch } from "@/config/affiliates";
import { DeliveryLinks } from "@/components/DeliveryLinks";
import { BUDGETS, GIFT_IDEAS } from "@/config/gift-ideas";
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
import { BrandMark } from "@/components/BrandMark";
import { FooterLinks } from "@/components/FooterLinks";

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
const SHORT_DATE = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Asia/Kolkata",
});
const UPCOMING_YEARS = 5;
const ORDER_AHEAD_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

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

function faqsFor(festival: FestivalInfo, year: number, dateLabel: string, daysLeft: number) {
  const { name, otherName, moonDependent } = festival;
  const verb = moonDependent ? "is expected on" : "falls on";
  const moonNote = moonDependent ? " The final date depends on the moon sighting." : "";
  const moonNoteHinglish = moonDependent ? " Sahi taareekh chaand dikhne par tay hoti hai." : "";
  const faqs = [
    { question: `When is ${name} ${year}?`, answer: `${name} ${year} ${verb} ${dateLabel} in India.${moonNote}` },
    { question: `${name} ${year} kab hai?`, answer: `${name} ${year} ${dateLabel} ko hai.${moonNoteHinglish}` },
    {
      question: `How many days are left for ${name}?`,
      answer: daysLeft > 0
        ? `About ${daysLeft} ${daysLeft === 1 ? "day is" : "days are"} left until ${name} ${year}. The live countdown above shows the exact time.`
        : `${name} ${year} is less than a day away. The live countdown above shows the exact time.`,
    },
    {
      question: `${name} mein kitne din baki hain?`,
      answer: daysLeft > 0
        ? `${name} ${year} mein lagbhag ${daysLeft} din baki hain. Upar diya live countdown sahi samay dikhata hai.`
        : `${name} ${year} mein ek din se bhi kam samay baki hai. Upar diya live countdown sahi samay dikhata hai.`,
    },
    { question: `Why is ${name} celebrated?`, answer: festival.about.join(" ") },
    { question: `${name} kyon manate hain?`, answer: festival.aboutHinglish },
  ];
  if (otherName) {
    faqs.splice(2, 0, { question: `When is ${otherName} ${year}?`, answer: `${otherName} (${name}) ${year} ${verb} ${dateLabel} in India.${moonNote}` });
  }
  return faqs;
}

export function generateStaticParams() {
  return FESTIVAL_INFO.map((festival) => ({ slug: festival.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const festival = festivalBySlug((await params).slug);
  if (!festival) return {};

  const calendarDates = await loadCalendarDates();
  const target = nextEventTimestamp(festival, Date.now(), calendarDates);
  const year = indiaYear(target);
  const title = `${festival.name} ${year} Date & Countdown: How Many Days Left?`;
  const alsoCalled = festival.otherName ? ` (${festival.otherName})` : "";
  const dateText = hasKnownDate(festival, year, calendarDates) ? ` date: ${LONG_DATE.format(target)}.` : ".";
  const description = `${festival.name}${alsoCalled} ${year}${dateText} Live countdown of days left, ${festival.name} wishes and quotes, gift ideas and upcoming dates in India.`;

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
  // Without a known date for this year, show no countdown rather than a wrong one.
  const dateKnown = hasKnownDate(festival, year, calendarDates);
  const orderBy = target - ORDER_AHEAD_DAYS * DAY_MS;
  const faqs = dateKnown ? faqsFor(festival, year, dateLabel, Math.floor((target - Date.now()) / DAY_MS)) : [];
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
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main>
      {dateKnown ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData).replace(/</g, "\\u003c") }}
          />
        </>
      ) : null}
      <SiteHeader active="countdown" />

      <section className={`festival-hero event-card-${festival.theme}`}>
        <div className="eyebrow"><span className="eyebrow-line" /> {festival.subtitle.toUpperCase()}</div>
        <h1>{festival.name} {year} Countdown</h1>
        {dateKnown ? (
          <>
            <p className="festival-date">
              {festival.name} {year} {festival.moonDependent ? "is expected on" : "falls on"} <b>{dateLabel}</b> in India.
            </p>
            <LiveCountdown target={target} name={festival.name} />
          </>
        ) : (
          <p className="festival-date">The {festival.name} {year} date will be added here soon.</p>
        )}
        <div className="festival-share">
          {dateKnown ? (
            <ShareButton
              message={`${festival.emoji} ${festival.name} ${year} is on ${dateLabel}! Who's ready? Counting down on Festive Clock 👇`}
              story={{ title: festival.name, emoji: festival.emoji, target, dateLabel }}
            />
          ) : (
            <ShareOptions message={`Getting ready for ${festival.name} ${year}! ${festival.emoji}`} />
          )}
        </div>
        {dateKnown ? (
          <RemindMe
            className="festival-remind"
            title={`${festival.emoji} ${festival.name}`}
            date={new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(target)}
            details={`${festival.name} ${year}: ${festival.subtitle}. Countdown: https://celebration-calendar-india.vercel.app/countdown/${festival.slug}`}
          />
        ) : null}
        <a className="write-quote-link festival-quote-link" href="#quote-studio">
          <WandSparkles aria-hidden="true" />
          Write {festival.name} wishes
        </a>
      </section>

      <section className="festival-shop" aria-labelledby="festival-shop-heading">
        <div className="festival-shop-heading">
          <span className="event-icon"><ShoppingBag aria-hidden="true" /></span>
          <div>
            <h2 id="festival-shop-heading">{festival.name} gift ideas</h2>
            <p>Gift ideas for every budget. Zero stress 🎁</p>
          </div>
        </div>
        {dateKnown && orderBy > Date.now() ? (
          <p className="gift-order-note">
            <b>Order by {SHORT_DATE.format(orderBy)}</b> to have gifts arrive before {festival.name}. Delivery times vary by seller and pin code.
          </p>
        ) : null}
        <GiftIdeas
          festivalName={festival.name}
          budgets={BUDGETS.map((budget) => ({
            id: budget.id,
            label: budget.label,
            ideas: GIFT_IDEAS[festival.id][budget.id].map((idea) => {
              const link = retailerSearch(idea.store, idea.term, budget.price);
              return { name: idea.name, why: idea.why, href: link.href, storeLabel: link.label };
            }),
          }))}
        />
        <p className="gift-pair-note">
          Found a gift? <a href="#quote-studio">Write a {festival.name} wish</a> to send with it.
        </p>
        <h3 className="gift-more-heading">Browse more {festival.name} shopping</h3>
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
        <DeliveryLinks links={DELIVERY_LINKS[festival.id]} eventName={festival.name} />
        <p className="gift-disclosure">
          Amazon links open with your budget already applied. On other stores, sort by price. Delivery apps show what is available near you. We may earn a small commission when you buy through these links, at no extra cost to you.
        </p>
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

      {faqs.length > 0 ? <section className="festival-faq" aria-labelledby="festival-faq-heading">
        <h2 id="festival-faq-heading">{festival.name} {year}: questions and answers</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section> : null}

      <div className="festival-wishes-heading">
        <h2>{festival.name} wishes and quotes</h2>
        <p>Wishes in English, Hindi or Hinglish. Copy, share, done ✅</p>
      </div>
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
        <Link className="brand footer-brand" href="/"><BrandMark /><span>Festive <b>Clock</b></span></Link>
        <p>Made with 💛 for every celebration.</p>
        <Link href="/calendar" className="back-to-top">Festival calendar →</Link>
      </footer>
      <FooterLinks />
    </main>
  );
}
