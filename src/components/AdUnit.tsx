"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT } from "@/lib/ads";

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

// One responsive AdSense display unit. The AdSense script loads late (see layout.tsx),
// but pushing onto window.adsbygoogle before that is safe: the script fills queued units when it arrives.
export function AdUnit({ slot, variant = "banner" }: { slot: string; variant?: "banner" | "square" }) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    const unit = ref.current;
    if (!slot || !unit || unit.dataset.adsbygoogleStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense throws if a unit was already filled, for example after a fast re-render.
    }
  }, [slot]);

  if (!slot) return null;
  return (
    <aside aria-label="Advertisement" className={`ad-unit ad-unit-${variant}`}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
