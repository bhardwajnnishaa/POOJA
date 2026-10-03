import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { FooterLinks } from "@/components/FooterLinks";
import { SiteHeader } from "@/components/SiteHeader";

// Shared layout for About, Contact and Privacy.
export function InfoPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main>
      <SiteHeader />
      <article className="info-page">
        <h1>{title}</h1>
        <p className="info-page-intro">{intro}</p>
        {children}
      </article>
      <footer className="site-footer">
        <Link className="brand footer-brand" href="/"><BrandMark /><span>Festive <b>Clock</b></span></Link>
        <p>Made with 💛 for every celebration.</p>
        <Link href="/" className="back-to-top">All countdowns →</Link>
      </footer>
      <FooterLinks />
    </main>
  );
}
