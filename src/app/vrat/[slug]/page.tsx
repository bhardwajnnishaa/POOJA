import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdUnit } from "@/components/AdUnit";
import { BrandMark } from "@/components/BrandMark";
import { RenderedDay } from "@/components/DayRefresh";
import { FooterLinks } from "@/components/FooterLinks";
import { SiteHeader } from "@/components/SiteHeader";
import { AD_SLOT_BANNER } from "@/lib/ads";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { VratDay } from "@/lib/tithi";
import { vratPages, type VratPage } from "@/lib/vrat-pages";

// Dates are worked out on the server and refreshed every hour.
export const revalidate = 3600;
export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

const INDIA_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" });
const LONG_DATE = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const TIME = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

const ABOUT = {
  ekadashi: [
    "Ekadashi is the 11th day (tithi) of each half of the lunar month, so it comes twice a month.",
    "It is dedicated to Lord Vishnu. Many people fast, avoid grains and rice, and break the fast (parana) on the next morning.",
  ],
  purnima: [
    "Purnima is the full moon day, the 15th tithi of the Shukla paksha.",
    "Many people keep a fast, take a holy bath, perform Satyanarayan puja and give charity on this day.",
  ],
  amavasya: [
    "Amavasya is the new moon day, the last tithi of the Krishna paksha.",
    "It is a day for prayers and offerings (tarpan) for ancestors, holy baths and charity.",
  ],
} as const;

function dateLabel(day: VratDay) {
  return LONG_DATE.format(Date.parse(`${day.date}T00:00:00Z`));
}

/** The next observance: the first one whose tithi has not ended yet. */
function nextDate(page: VratPage) {
  const now = Date.now();
  return page.dates.find((day) => day.end > now) ?? page.dates[page.dates.length - 1];
}

function pageFor(slug: string) {
  const page = vratPages().get(slug);
  return page && page.dates.length > 0 ? page : undefined;
}

export function generateStaticParams() {
  return [...vratPages().keys()].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = pageFor((await params).slug);
  if (!page) return {};
  const next = nextDate(page);
  const year = next.date.slice(0, 4);
  const also = page.popularName ? ` (${page.popularName})` : "";
  const title = `${page.name} ${year} Date and Tithi Time`;
  const description = `${page.name}${also} ${year} is on ${dateLabel(next)}. Tithi starts ${TIME.format(next.start)} and ends ${TIME.format(next.end)} IST. Upcoming dates for the next years.`;
  return {
    title,
    description,
    alternates: { canonical: `/vrat/${page.slug}` },
    openGraph: { title, description, url: `/vrat/${page.slug}`, siteName: SITE_NAME, type: "website", locale: "en_IN" },
  };
}

export default async function VratDetailPage({ params }: PageProps) {
  const page = pageFor((await params).slug);
  if (!page) notFound();

  const next = nextDate(page);
  const year = next.date.slice(0, 4);
  const today = INDIA_DATE.format(Date.now());
  const upcoming = page.dates.filter((day) => day.end > Date.now());
  const faqs = [
    {
      question: `When is ${page.name} in ${year}?`,
      answer: `${page.name} ${year} is on ${dateLabel(next)}. The ${next.paksha} paksha tithi runs from ${TIME.format(next.start)} to ${TIME.format(next.end)} IST.`,
    },
    {
      question: `Which Hindu month is ${page.name} in?`,
      answer: `It falls in the ${next.paksha} paksha of ${next.month}, in the amanta (new moon to new moon) calendar.`,
    },
    {
      question: "Why does my local panchang show a different day?",
      answer: "The day is the one on which the tithi is running at sunrise in New Delhi. Sunrise differs by city, and some traditions follow extra rules, so please confirm with your local panchang or temple.",
    },
  ];
  const eventData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${page.name} ${year}`,
    description: ABOUT[page.kind].join(" "),
    startDate: next.date,
    endDate: next.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: "India", address: { "@type": "PostalAddress", addressCountry: "IN" } },
    url: `${SITE_URL}/vrat/${page.slug}`,
  };
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
  const others = [...vratPages().values()]
    .filter((other) => other.kind === page.kind && other.slug !== page.slug)
    .sort((first, second) => nextDate(first).start - nextDate(second).start)
    .slice(0, 8);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventData).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <RenderedDay day={today} />

      <section className="vrat-hero">
        <div className="eyebrow"><span className="eyebrow-line" /> {next.month.toUpperCase()} · {next.paksha.toUpperCase()} PAKSHA</div>
        <h1>{page.name} {year}</h1>
        {page.popularName ? <p><b>{page.popularName}</b></p> : null}
        <p>{page.name} {year} is on <b>{dateLabel(next)}</b>.</p>
        <p>Tithi: {TIME.format(next.start)} → {TIME.format(next.end)} IST</p>
      </section>

      <section className="festival-details">
        <article>
          <h2>About {page.name}</h2>
          {ABOUT[page.kind].map((line) => <p key={line}>{line}</p>)}
        </article>
        <article>
          <h2>Upcoming {page.name} dates</h2>
          <table className="festival-dates">
            <thead><tr><th scope="col">Date</th><th scope="col">Tithi (IST)</th></tr></thead>
            <tbody>
              {upcoming.map((day) => (
                <tr key={day.start}>
                  <td>{dateLabel(day)}</td>
                  <td>{TIME.format(day.start)} → {TIME.format(day.end)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="festival-note">Dates follow sunrise in New Delhi. In your city or tradition, the fast can fall a day earlier or later.</p>
        </article>
      </section>

      <AdUnit slot={AD_SLOT_BANNER} />

      <section className="festival-faq vrat-section" aria-labelledby="vrat-faq-heading">
        <h2 id="vrat-faq-heading">{page.name} {year}: questions and answers</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {others.length > 0 ? (
        <nav className="festival-more" aria-label="More vrat dates">
          <h2>More {page.kind === "ekadashi" ? "Ekadashi" : page.kind === "purnima" ? "Purnima" : "Amavasya"} dates</h2>
          <ul>
            {others.map((other) => (
              <li key={other.slug}><Link href={`/vrat/${other.slug}`}>{other.name}</Link></li>
            ))}
            <li><Link href="/vrat">All vrat dates</Link></li>
          </ul>
        </nav>
      ) : null}

      <footer className="site-footer">
        <Link className="brand footer-brand" href="/"><BrandMark /><span>Festive <b>Clock</b></span></Link>
        <p>Made with 💛 for every celebration.</p>
        <Link href="/vrat" className="back-to-top">All Ekadashi &amp; vrat dates →</Link>
      </footer>
      <FooterLinks />
    </main>
  );
}
