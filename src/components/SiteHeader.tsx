import Link from "next/link";
import { Clock3 } from "lucide-react";
import { InstallAppButton } from "@/components/InstallAppButton";
import { ThemePicker } from "@/components/ThemePicker";
import { BrandMark } from "@/components/BrandMark";
import { HeaderNav } from "@/components/HeaderNav";
import { LanguageToggle } from "@/lib/i18n";

export function SiteHeader({ active }: { active?: "countdown" | "calendar" }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Festive Clock home">
        <BrandMark />
        <span>Festive <b>Clock</b></span>
      </Link>
      <HeaderNav active={active} />
      <span className="header-end">
        <LanguageToggle />
        <ThemePicker />
        <InstallAppButton />
        <span className="header-date"><Clock3 aria-hidden="true" /> Live in India</span>
      </span>
    </header>
  );
}