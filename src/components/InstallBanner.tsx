"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { InstallSteps } from "@/components/InstallSteps";
import { useInstallPrompt } from "@/lib/use-install-prompt";
import { useLang, useT } from "@/lib/i18n";

const DISMISS_KEY = "festive-clock-install-dismissed";
// After "close", the card stays away for a week, then may come back once.
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;
// A short pause first, so the countdowns are seen before the card slides up.
const SHOW_AFTER_MS = 6000;

// A friendly "Add to Home Screen" card that slides up from the bottom. Links ending in ?install open it at once, with the steps.
export function InstallBanner() {
  const { device, canPrompt, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(true);
  const [showSteps, setShowSteps] = useState(false);
  const t = useT();
  const lang = useLang();

  useEffect(() => {
    const invited = new URLSearchParams(window.location.search).has("install");
    let snoozed = false;
    try {
      const saved = window.localStorage.getItem(DISMISS_KEY);
      // Older versions saved "1" (closed for good); treat that as closed today.
      const closedAt = saved === "1" ? Date.now() : Number(saved);
      if (saved === "1") window.localStorage.setItem(DISMISS_KEY, String(closedAt));
      snoozed = Boolean(saved) && Date.now() - closedAt < SNOOZE_MS;
    } catch {
      snoozed = false;
    }
    if (invited) {
      setShowSteps(true);
      setDismissed(false);
      return;
    }
    if (snoozed) return;
    const timer = window.setTimeout(() => setDismissed(false), SHOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (dismissed || device === "installed" || device === "unknown") return null;

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Dismissal only lasts for this visit when storage is blocked.
    }
  }

  return (
    <aside className="install-banner install-popup" aria-labelledby="install-banner-title">
      <button className="install-banner-close" type="button" aria-label={t("Close")} onClick={dismiss}><X aria-hidden="true" /></button>
      <BrandMark />
      <h2 id="install-banner-title" className="install-banner-title">{lang === "hi" ? <>कोई त्योहार <em>न छूटे!</em> 🪔</> : <>Never miss a <em>festival!</em> 🪔</>}</h2>
      <p className="install-banner-sub">{t("Add Festive Clock to your Home Screen. Free · no download ·")} <span className="nowrap">{t("one tap ✨")}</span></p>
      <button
        className="install-banner-button add-home-button"
        type="button"
        aria-expanded={canPrompt ? undefined : showSteps}
        onClick={() => (canPrompt ? void promptInstall() : setShowSteps(!showSteps))}
      >
        <span aria-hidden="true">📲</span> {t("Add to Home Screen")}
      </button>
      {showSteps && !canPrompt ? <InstallSteps device={device} /> : null}
    </aside>
  );
}
