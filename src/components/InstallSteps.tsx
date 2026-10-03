import { EllipsisVertical, Share, SquarePlus } from "lucide-react";
import type { InstallDevice } from "@/lib/use-install-prompt";

// Picture-style steps for adding the site to the home screen on each kind of device.
export function InstallSteps({ device }: { device: InstallDevice }) {
  if (device === "apple") {
    return (
      <ol className="install-steps">
        <li><span className="install-step-icon"><Share aria-hidden="true" /></span><span>Tap <b>Share</b> at the bottom of Safari.</span></li>
        <li><span className="install-step-icon"><SquarePlus aria-hidden="true" /></span><span>Scroll down and tap <b>Add to Home Screen</b>.</span></li>
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
