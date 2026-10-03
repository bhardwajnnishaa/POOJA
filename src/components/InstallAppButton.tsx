"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

// iPhones and iPads have no install prompt; Safari users add the app from the Share menu.
function isAppleMobile() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallAppButton() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [showAppleHint, setShowAppleHint] = useState(false);
  const [mode, setMode] = useState<"hidden" | "prompt" | "apple">("hidden");

  useEffect(() => {
    if (isInstalled()) return;
    if (isAppleMobile()) setMode("apple");

    function handlePrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
      setMode("prompt");
    }
    function handleInstalled() {
      setInstallEvent(null);
      setMode("hidden");
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (mode === "hidden") return null;

  async function install() {
    if (mode === "apple") {
      setShowAppleHint(!showAppleHint);
      return;
    }
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setMode("hidden");
  }

  return (
    <span className="install-app">
      <button className="install-app-button" type="button" onClick={install} aria-expanded={mode === "apple" ? showAppleHint : undefined}>
        <Download aria-hidden="true" /> Install app
      </button>
      {showAppleHint ? (
        <span className="install-app-hint" role="status">
          Tap the Share button, then &ldquo;Add to Home Screen&rdquo;.
        </span>
      ) : null}
    </span>
  );
}
