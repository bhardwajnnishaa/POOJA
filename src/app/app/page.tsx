import type { Metadata } from "next";
import { AppInstallPanel } from "@/components/AppInstallPanel";
import { BrandMark } from "@/components/BrandMark";
import { FooterLinks } from "@/components/FooterLinks";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get the app",
  description: `Install ${SITE_NAME} on your phone for live festival countdowns, gift ideas, wishes and your own special dates.`,
  alternates: { canonical: "/app" },
};

const FEATURES = [
  "Live countdowns to 14 Indian festivals",
  "Your own birthdays and anniversaries",
  "Gift ideas by budget",
  "Wishes in English, Hindi and Hinglish",
];

export default function AppPage() {
  return (
    <main>
      <SiteHeader />
      <section className="app-page">
        <div className="app-page-mark"><BrandMark /></div>
        <h1>Get the {SITE_NAME} app</h1>
        <p className="app-page-lead">Every festival and every special day, one tap away on your home screen.</p>
        <ul className="app-page-features">
          {FEATURES.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
        <AppInstallPanel />
      </section>
      <FooterLinks />
    </main>
  );
}
