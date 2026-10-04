"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export function HeaderNav({ active }: { active?: "countdown" | "calendar" }) {
  const t = useT();
  return (
    <nav aria-label="Main navigation">
      <Link className={`nav-link ${active === "countdown" ? "nav-link-active" : ""}`} href="/">{t("Countdowns")}</Link>
      <Link className={`nav-link ${active === "calendar" ? "nav-link-active" : ""}`} href="/calendar">{t("Calendar")}</Link>
    </nav>
  );
}
