import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { FooterLinks } from "@/components/FooterLinks";
import { SiteHeader } from "@/components/SiteHeader";
import { RenderedDay } from "@/components/DayRefresh";
import { VratNext } from "@/components/VratNext";
import { rollingWindowEnd } from "@/lib/calendar-data";
import { vratDays, type VratDay } from "@/lib/tithi";

// Worked out on the server and refreshed every hour; nothing to update by hand.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ekadashi, Purnima & Amavasya Dates",
  description: "Every Ekadashi, Purnima and Amavasya for the next 12 months, with tithi start and end times in IST and a live countdown to the next one.",
  alternates: { canonical: "/vrat" },
};

const INDIA_DATE = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Kolkata" });
const DAY = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const MONTH = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
const TIME = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
const KIND_LABEL = { ekadashi: "Ekadashi", purnima: "Purnima", amavasya: "Amavasya" } as const;

const FAQS = [
  { question: "What is Ekadashi?", answer: "Ekadashi is the 11th day of each half of the lunar month. It comes twice a month. Many people fast on this day and worship Lord Vishnu." },
  { question: "What are Purnima and Amavasya?", answer: "Purnima is the full moon day. Amavasya is the new moon day. Both are used for fasts, pujas, holy baths and prayers for ancestors." },
  { question: "How are these dates worked out?", answer: "From the positions of the Sun and Moon. A tithi is the time the Moon takes to move 12° ahead of the Sun. The day is the one on which the tithi is running at sunrise in New Delhi." },
  { question: "Why does my panchang show a different day?", answer: "Sunrise changes by city, so a tithi can fall on a different day where you live. Some traditions, such as Vaishnava Ekadashi, follow extra rules. Please confirm with your local panchang or temple." },
];

function byMonth(days: VratDay[]) {
  const groups = new Map<string, VratDay[]>();
  for (const day of days) groups.set(day.date.slice(0, 7), [...(groups.get(day.date.slice(0, 7)) ?? []), day]);
  return [...groups.entries()];
}

export default function VratPage() {
  const today = INDIA_DATE.format(Date.now());
  const days = vratDays(today, rollingWindowEnd(today));
  // Yesterday's entry is kept for the countdown cards, in case a tithi is still running.
  const nextItems = vratDays(INDIA_DATE.format(Date.now() - 2 * 24 * 60 * 60 * 1000), rollingWindowEnd(today))
    .slice(0, 12)
    .map(({ kind, name, popularName, date, start, end }) => ({ kind, name, popularName, date, start, end }));

  return (
    <main>
      <SiteHeader />
      <RenderedDay day={today} />
      <section className="vrat-hero">
        <div className="eyebrow"><span className="eyebrow-line" /> VRAT & TITHI DATES</div>
        <h1>Ekadashi, Purnima <em>&amp; Amavasya</em></h1>
        <p>Every fasting day for the next 12 months 🌙 Worked out from the moon itself, in India time.</p>
      </section>

      <section className="vrat-section" aria-label="Coming up next">
        <VratNext items={nextItems} />
      </section>

      <section className="vrat-section" aria-labelledby="vrat-list-heading">
        <h2 id="vrat-list-heading">All dates, month by month</h2>
        <p className="vrat-legend">
          <span className="vrat-tag vrat-tag-ekadashi">Ekadashi</span>
          <span className="vrat-tag vrat-tag-purnima">Purnima</span>
          <span className="vrat-tag vrat-tag-amavasya">Amavasya</span>
        </p>
        {byMonth(days).map(([month, entries]) => (
          <div className="vrat-month" key={month}>
            <h3>{MONTH.format(Date.parse(`${month}-01T00:00:00Z`))}</h3>
            <ul>
              {entries.map((entry) => (
                <li className={`vrat-row vrat-${entry.kind}`} key={`${entry.date}-${entry.kind}`}>
                  <time dateTime={entry.date}>{DAY.format(Date.parse(`${entry.date}T00:00:00Z`))}</time>
                  <div>
                    <b>{entry.name}</b>
                    {entry.popularName ? <span className="vrat-popular">{entry.popularName}</span> : null}
                    <small>Tithi: {TIME.format(entry.start)} → {TIME.format(entry.end)}</small>
                  </div>
                  <span className={`vrat-tag vrat-tag-${entry.kind}`}>{KIND_LABEL[entry.kind]}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="vrat-note">Dates follow sunrise in New Delhi. In your city, or in your tradition, a fast can fall a day earlier or later. Evening festivals such as Diwali can be on the day before. Please confirm with your local panchang.</p>
      </section>

      <section className="festival-faq vrat-section" aria-labelledby="vrat-faq-heading">
        <h2 id="vrat-faq-heading">Questions and answers</h2>
        <div className="faq-list">
          {FAQS.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <Link className="brand footer-brand" href="/"><BrandMark /><span>Festive <b>Clock</b></span></Link>
        <p>Made with 💛 for every celebration.</p>
        <Link href="/calendar" className="back-to-top">See the calendar →</Link>
      </footer>
      <FooterLinks />
    </main>
  );
}
