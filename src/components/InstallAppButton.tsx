"use client";

import { useState } from "react";
import { InstallSteps } from "@/components/InstallSteps";
import { useInstallPrompt } from "@/lib/use-install-prompt";
import { useT } from "@/lib/i18n";

export function InstallAppButton() {
  const { device, canPrompt, promptInstall } = useInstallPrompt();
  const [showSteps, setShowSteps] = useState(false);
  const t = useT();

  // Only phones without a one-tap prompt (iPhone) get the steps from the header; others use the banner or /app.
  if (device === "installed" || device === "unknown" || (!canPrompt && device !== "apple")) return null;

  return (
    <span className="install-app">
      <button
        className="install-app-button"
        type="button"
        aria-expanded={canPrompt ? undefined : showSteps}
        onClick={() => (canPrompt ? void promptInstall() : setShowSteps(!showSteps))}
      >
        <span aria-hidden="true">📲</span> {t("Add to Home Screen")}
      </button>
      {showSteps ? <span className="install-app-hint" role="status"><InstallSteps device={device} /></span> : null}
    </span>
  );
}
