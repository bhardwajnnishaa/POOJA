import { Compass, EllipsisVertical, Share, SquarePlus, ToggleRight } from "lucide-react";
import type { InstallDevice } from "@/lib/use-install-prompt";

// Apps such as Instagram and Facebook open links in their own browser, which cannot add to the Home Screen.
// Safari and Chrome name themselves "Safari" in the user agent; those in-app browsers do not.
function appleBrowser(): "safari" | "chrome" | "in-app" {
  const agent = navigator.userAgent;
  if (/CriOS/.test(agent)) return "chrome";
  if (!/Safari\//.test(agent) || /FBAN|FBAV|Instagram|Line\//.test(agent)) return "in-app";
  return "safari";
}

// Picture-style steps for adding the site to the home screen on each kind of device.
export function InstallSteps({ device }: { device: InstallDevice }) {
  if (device === "apple") {
    const browser = appleBrowser();
    if (browser === "in-app") {
      return (
        <ol className="install-steps">
          <li><span className="install-step-icon"><Compass aria-hidden="true" /></span><span>This page is open inside another app. Tap <b>⋯</b> or the <b>compass</b> and choose <b>Open in Safari</b>.</span></li>
          <li><span className="install-step-icon install-step-done">✓</span><span>Then add it to your Home Screen from Safari.</span></li>
        </ol>
      );
    }
    return (
      <ol className="install-steps">
        {browser === "chrome" ? (
          <li><span className="install-step-icon"><Share aria-hidden="true" /></span><span>Tap <b>Share</b> at the top right of Chrome.</span></li>
        ) : (
          <li><span className="install-step-icon"><Share aria-hidden="true" /></span><span>Tap <b>Share</b> in Safari. On newer iPhones, tap <b>⋯</b> at the bottom first.</span></li>
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
