"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
export type InstallDevice = "unknown" | "installed" | "apple" | "android" | "desktop";

// Chrome fires beforeinstallprompt once per page, so keep it in one shared place for every install button.
let deferredPrompt: InstallPromptEvent | null = null;
let installedNow = false;
const listeners = new Set<() => void>();
let listening = false;

function notify() {
  listeners.forEach((listener) => listener());
}

function startListening() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as InstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    installedNow = true;
    notify();
  });
}

function detectDevice(): InstallDevice {
  const standalone = window.matchMedia("(display-mode: standalone)").matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone || installedNow) return "installed";
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return "apple";
  // iPads report themselves as a Mac, so tell them apart by the touch screen.
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return "apple";
  if (/android/i.test(navigator.userAgent)) return "android";
  return "desktop";
}

export function useInstallPrompt() {
  const [device, setDevice] = useState<InstallDevice>("unknown");
  const [canPrompt, setCanPrompt] = useState(false);

  useEffect(() => {
    startListening();
    const sync = () => {
      setDevice(detectDevice());
      setCanPrompt(deferredPrompt !== null);
    };
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  async function promptInstall() {
    if (!deferredPrompt) return false;
    const event = deferredPrompt;
    deferredPrompt = null;
    await event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === "accepted") installedNow = true;
    notify();
    return choice.outcome === "accepted";
  }

  return { device, canPrompt, promptInstall };
}
