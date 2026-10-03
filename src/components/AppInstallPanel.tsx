"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Download } from "lucide-react";
import { ShareOptions } from "@/components/ShareOptions";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
type Device = "unknown" | "installed" | "apple" | "android" | "desktop";

function detectDevice(): Device {
  const standalone = window.matchMedia("(display-mode: standalone)").matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return "installed";
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return "apple";
  if (/android/i.test(navigator.userAgent)) return "android";
  return "desktop";
}

export function AppInstallPanel() {
  const [device, setDevice] = useState<Device>("unknown");
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setDevice(detectDevice());
    function handlePrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    }
    function handleInstalled() {
      setInstallEvent(null);
      setInstalled(true);
    }
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    if (choice.outcome === "accepted") setInstalled(true);
  }

  return (
    <div className="app-install">
      {installed || device === "installed" ? (
        <p className="app-install-done"><Check aria-hidden="true" /> Festive Clock is installed on this device.</p>
      ) : installEvent ? (
        <button className="app-install-button" type="button" onClick={install}>
          <Download aria-hidden="true" /> Install Festive Clock
        </button>
      ) : device === "apple" ? (
        <ol className="app-install-steps">
          <li>Open this page in <b>Safari</b>.</li>
          <li>Tap the <b>Share</b> button (the square with an arrow).</li>
          <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
          <li>Tap <b>Add</b>. Festive Clock appears on your home screen.</li>
        </ol>
      ) : device === "android" ? (
        <ol className="app-install-steps">
          <li>Open this page in <b>Chrome</b>.</li>
          <li>Tap the <b>⋮</b> menu at the top right.</li>
          <li>Tap <b>Install app</b> or <b>Add to Home screen</b>.</li>
          <li>Tap <b>Install</b>. Festive Clock appears on your home screen.</li>
        </ol>
      ) : device === "desktop" ? (
        <ol className="app-install-steps">
          <li>Open this page in <b>Chrome</b> or <b>Edge</b>.</li>
          <li>Click the <b>install icon</b> at the right end of the address bar.</li>
          <li>Click <b>Install</b>.</li>
        </ol>
      ) : null}

      <p className="app-install-note">Free. No sign-up. Takes less than a minute and uses almost no storage.</p>
      <Link className="app-install-open" href="/">Open Festive Clock now →</Link>

      <div className="app-install-share">
        <h2>Share the app</h2>
        <p>Send this page to friends and family so they can install it too.</p>
        <ShareOptions message="Get the Festive Clock app: live countdowns, gift ideas and wishes for every Indian festival, plus your own birthdays and anniversaries 🎉" />
      </div>
    </div>
  );
}
