import Link from "next/link";
import { Clock3, Sparkles } from "lucide-react";
import { InstallAppButton } from "@/components/InstallAppButton";

export function SiteHeader({ active }: { active: "countdown" | "calendar" }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Festive Clock home">
        <span className="brand-mark"><Sparkles aria-hidden="true" /></span>
        <span>Festive <b>Clock</b></span>
      </Link>
      <nav aria-label="Main navigation">
        <Link className={`nav-link ${active === "countdown" ? "nav-link-active" : ""}`} href="/">Countdowns</Link>
        <Link className={`nav-link ${active === "calendar" ? "nav-link-active" : ""}`} href="/calendar">Calendar</Link>
      </nav>
      <span className="header-end">
        <InstallAppButton />
        <span className="header-date"><Clock3 aria-hidden="true" /> Live in India</span>
      </span>
    </header>
  );
}