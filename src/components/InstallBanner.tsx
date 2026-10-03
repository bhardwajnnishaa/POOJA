"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { InstallSteps } from "@/components/InstallSteps";
import { useInstallPrompt } from "@/lib/use-install-prompt";

const DISMISS_KEY = "festive-clock-install-dismissed";

// A friendly "Add to Home Screen" card at the top of the home page. Links ending in ?install open the steps.
export function InstallBanner() {
  const { device, canPrompt, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(true);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    const invited = new URLSearchParams(window.location.search).has("install");
    let wasDismissed = false;
    try {
      wasDismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      wasDismissed = false;
    }
    setDismissed(wasDismissed && !invited);
    if (invited) setShowSteps(true);
  }, []);

  if (dismissed || device === "installed" || device === "unknown") return null;

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Dismissal only lasts for this visit when storage is blocked.
    }
  }

  return (
    <aside className="install-banner" aria-labelledby="install-banner-title">
      <button className="install-banner-close" type="button" aria-label="Close" onClick={dismiss}><X aria-hidden="true" /></button>
      <BrandMark />
      <h2 id="install-banner-title" className="install-banner-title">Add to Home Screen</h2>
      <p className="install-banner-sub">Get Festive Clock on your phone like an app. Free, nothing to download from a store.</p>
      {canPrompt ? (
        <button className="install-banner-button" type="button" onClick={() => void promptInstall()}>
          <Download aria-hidden="true" /> Add to Home Screen
        </button>
      ) : (
        <button className="install-banner-button" type="button" aria-expanded={showSteps} onClick={() => setShowSteps(!showSteps)}>
          <Download aria-hidden="true" /> {showSteps ? "Hide steps" : "Show me how"}
        </button>
      )}
      {showSteps && !canPrompt ? <InstallSteps device={device} /> : null}
    </aside>
  );
}
