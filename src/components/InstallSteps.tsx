"use client";

import { useState } from "react";
import { ArrowUpToLine, Compass, Copy, EllipsisVertical, Share, SquarePlus, ToggleRight } from "lucide-react";
import type { InstallDevice } from "@/lib/use-install-prompt";

// Apps such as Instagram and Facebook open links in their own browser, which cannot add to the Home Screen.
// Safari and Chrome name themselves "Safari" in the user agent; those in-app browsers do not.
function appleBrowser(): "safari" | "chrome" | "in-app" {
  const agent = navigator.userAgent;
  if (/CriOS/.test(agent)) return "chrome";
  if (!/Safari\//.test(agent) || /FBAN|FBAV|Instagram|Line\//.test(agent)) return "in-app";
  return "safari";
}

// Inside Instagram or Facebook there is no Add to Home Screen, so offer the link to paste into Safari.
function CopyLink() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    const link = window.location.origin + "/";
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      window.prompt("Copy this link and open it in Safari:", link);
    }
    setCopied(true);
  }
  return (
    <button className="install-copy-link" type="button" onClick={() => void copy()}>
      <Copy aria-hidden="true" /> {copied ? "Link copied! Paste it in Safari" : "Copy link for Safari"}
    </button>
  );
}

// Picture-style steps for adding the site to the home screen on each kind of device.
export function InstallSteps({ device }: { device: InstallDevice }) {
  if (device === "apple") {
    const browser = appleBrowser();
    if (browser === "in-app") {
      return (
        <ol className="install-steps">
          <li><span className="install-step-icon"><Compass aria-hidden="true" /></span><span>This page is open inside another app. Tap <b>⋯</b> or the <b>compass</b> and choose <b>Open in Safari</b>.</span></li>
          <li><span className="install-step-icon"><Copy aria-hidden="true" /></span><span>Or copy the link below and paste it into <b>Safari</b>.</span></li>
          <li><span className="install-step-icon install-step-done">✓</span><span>Then add it to your Home Screen from Safari.</span></li>
          <li className="install-copy-row"><CopyLink /></li>
        </ol>
      );
    }
    return (
      <ol className="install-steps">
        {browser === "chrome" ? (
          <li><span className="install-step-icon"><Share aria-hidden="true" /></span><span>Tap <b>Share</b> at the top right of Chrome.</span></li>
        ) : (
          <>
            <li className="install-step-tip"><span className="install-step-icon"><Compass aria-hidden="true" /></span><span>Opened from <b>WhatsApp</b>? Tap the <b>compass</b> at the bottom right first, to open this page in Safari.</span></li>
            <li><span className="install-step-icon"><ArrowUpToLine aria-hidden="true" /></span><span>Don&apos;t see Safari&apos;s buttons? Tap the <b>web address at the very top</b>, or scroll up a little. The buttons come back at the bottom.</span></li>
            <li><span className="install-step-icon"><Share aria-hidden="true" /></span><span>Tap <b>Share</b> (square with an arrow ⬆️). On new iPhones, tap <b>⋯</b> at the bottom right first, then <b>Share</b>.</span></li>
          </>
        )}
        <li><span className="install-step-icon"><SquarePlus aria-hidden="true" /></span><span>Tap <b>Add to Home Screen</b>. If you do not see it, tap <b>View More</b> or scroll down.</span></li>
        <li><span className="install-step-icon"><ToggleRight aria-hidden="true" /></span><span>If you see <b>Open as Web App</b>, keep it switched on.</span></li>
        <li><span className="install-step-icon install-step-done">✓</span><span>Tap <b>Add</b>. The Festive Clock icon appears on your home screen.</span></li>
      </ol>
    );
  }
  if (device === "desktop") {
    return (
      <ol className="install-steps">
        <li><span className="install-step-icon"><SquarePlus aria-hidden="true" /></span><span>In Chrome or Edge, click the <b>install icon</b> at the right of the address bar.</span></li>
        <li><span className="install-step-icon install-step-done">✓</span><span>Click <b>Install</b>.</span></li>
      </ol>
    );
  }
  return (
    <ol className="install-steps">
      <li><span className="install-step-icon"><EllipsisVertical aria-hidden="true" /></span><span>Tap the <b>⋮ menu</b> at the top right of Chrome.</span></li>
      <li><span className="install-step-icon"><SquarePlus aria-hidden="true" /></span><span>Tap <b>Add to Home screen</b> or <b>Install app</b>.</span></li>
      <li><span className="install-step-icon install-step-done">✓</span><span>Tap <b>Add</b>. The Festive Clock icon appears on your home screen.</span></li>
    </ol>
  );
}
