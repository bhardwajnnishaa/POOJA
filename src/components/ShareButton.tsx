"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { ShareOptions } from "@/components/ShareOptions";

// One Share button: the phone's own share sheet where available, otherwise WhatsApp, Facebook and Telegram.
export function ShareButton({ message, onShared }: { message: string; onShared?: () => void }) {
  const [showOptions, setShowOptions] = useState(false);

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text: message, url: window.location.href });
        onShared?.();
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    setShowOptions(!showOptions);
  }

  return (
    <>
      <button className="share-button" type="button" aria-expanded={showOptions} onClick={share}>
        <Share2 aria-hidden="true" /> Share
      </button>
      {showOptions ? <div className="share-button-options"><ShareOptions message={message} onShared={onShared} /></div> : null}
    </>
  );
}
