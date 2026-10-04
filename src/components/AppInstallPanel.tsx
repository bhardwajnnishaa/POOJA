"use client";

import { Check } from "lucide-react";
import { InstallSteps } from "@/components/InstallSteps";
import { ShareOptions } from "@/components/ShareOptions";
import { useInstallPrompt } from "@/lib/use-install-prompt";

export function AppInstallPanel() {
  const { device, canPrompt, promptInstall } = useInstallPrompt();

  return (
    <div className="app-install">
      {device === "installed" ? (
        <p className="app-install-done"><Check aria-hidden="true" /> Festive Clock is already on your Home Screen.</p>
      ) : (
        <>
          {canPrompt ? (
            <button className="app-install-button add-home-button" type="button" onClick={() => void promptInstall()}>
              <span aria-hidden="true">📲</span> Add to Home Screen
            </button>
          ) : null}
          {device !== "unknown" ? (
            <div className="app-install-how">
              <h3>{canPrompt ? "Or add it yourself" : "How to add it"}</h3>
              <InstallSteps device={device} />
            </div>
          ) : null}
          <p className="app-install-note">Free. No download. No sign-up. It opens straight from your Home Screen, like an app.</p>
        </>
      )}

      <div className="app-install-share">
        <h2>Share with family and friends</h2>
        <ShareOptions message="Festive Clock 🪔 Live countdowns, gift ideas and wishes for every Indian festival, plus your own birthdays and anniversaries. Add it to your Home Screen:" />
      </div>
    </div>
  );
}
