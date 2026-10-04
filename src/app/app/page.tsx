import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Gift, Heart, WandSparkles } from "lucide-react";
import { AppInstallPanel } from "@/components/AppInstallPanel";
import { BrandMark } from "@/components/BrandMark";
import { CountdownTimer } from "@/components/CountdownTimer";
import { FooterLinks } from "@/components/FooterLinks";
import { SiteHeader } from "@/components/SiteHeader";
import { FESTIVAL_INFO, festivalPath, hasKnownDate, indiaYear, nextEventTimestamp } from "@/lib/festivals";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Add to Home Screen",
  description: `Add ${SITE_NAME} to your phone's Home Screen for live festival countdowns, gift ideas, wishes and your own special dates.`,
  alternates: { canonical: "/app" },
};

const DATE_LABEL = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

const FEATURES = [
  { icon: CalendarDays, title: `${FESTIVAL_INFO.length} festival countdowns`, text: "Diwali, Ganesh Chaturthi, Holi, Eid, Rakhi and more, in India time." },
  { icon: Heart, title: "Your own dates", text: "Birthdays and anniversaries, saved only on your phone." },
  { icon: Gift, title: "Gift ideas by budget", text: "Under ₹500, ₹500 to ₹1,000, and above." },
  { icon: WandSparkles, title: "Wishes in 3 languages", text: "English, Hindi and Hinglish, ready to share." },
];

export default function AppPage() {
  const now = Date.now();
  const upcoming = FESTIVAL_INFO
    .map((festival) => ({ festival, target: nextEventTimestamp(festival, now, {}) }))
    .filter(({ festival, target }) => hasKnownDate(festival, indiaYear(target), {}))
    .sort((first, second) => first.target - second.target)
    .slice(0, 3);

  return (
    <main>
      <SiteHeader />
      <section className="app-page">
        <div className="app-page-mark"><BrandMark /></div>
        <h1>Add {SITE_NAME} to your Home Screen</h1>
        <p className="app-page-lead">Every festival and special day, one tap away. It is the same {SITE_NAME} website, saved as an app on your phone.</p>
        <AppInstallPanel />
      </section>

      <section className="app-preview" aria-labelledby="app-preview-heading">
        <h2 id="app-preview-heading">Coming up next</h2>
        <div className="app-preview-grid">
          {upcoming.map(({ festival, target }) => (
            <Link className={`app-preview-card event-card-${festival.theme}`} href={festivalPath(festival)} key={festival.id}>
              <b>{festival.name}</b>
              <span>{DATE_LABEL.format(target)}</span>
              <CountdownTimer target={target} label={`Time until ${festival.name}`} />
            </Link>
          ))}
        </div>
        <Link className="app-preview-all" href="/">See all countdowns →</Link>
      </section>

      <section className="app-features" aria-label="What you get">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div className="app-feature" key={title}>
            <span className="app-feature-icon"><Icon aria-hidden="true" /></span>
            <b>{title}</b>
            <span>{text}</span>
          </div>
        ))}
      </section>

      <footer className="site-footer">
        <Link className="brand footer-brand" href="/"><BrandMark /><span>Festive <b>Clock</b></span></Link>
        <p>Made with 💛 for every celebration.</p>
        <Link href="/" className="back-to-top">Open Festive Clock →</Link>
      </footer>
      <FooterLinks />
    </main>
  );
}
