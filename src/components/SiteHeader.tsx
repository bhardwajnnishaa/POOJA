import Link from "next/link";
import { Clock3 } from "lucide-react";
import { InstallAppButton } from "@/components/InstallAppButton";
import { ThemePicker } from "@/components/ThemePicker";
import { BrandMark } from "@/components/BrandMark";

export function SiteHeader({ active }: { active?: "countdown" | "calendar" }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Festive Clock home">
        <BrandMark />
        <span>Festive <b>Clock</b></span>
      </Link>
      <nav aria-label="Main navigation">
        <Link className={`nav-link ${active === "countdown" ? "nav-link-active" : ""}`} href="/">Countdowns</Link>
        <Link className={`nav-link ${active === "calendar" ? "nav-link-active" : ""}`} href="/calendar">Calendar</Link>
      </nav>
      <span className="header-end">
        <ThemePicker />
        <InstallAppButton />
        <span className="header-date"><Clock3 aria-hidden="true" /> Live in India</span>
      </span>
    </header>
  );
}