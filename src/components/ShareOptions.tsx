"use client";

import { Facebook, MessageCircle, Send } from "lucide-react";

async function copyMessage(message: string) {
  try {
    await navigator.clipboard.writeText(message);
  } catch {
    const field = document.createElement("textarea");
    field.value = message;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
}

export function ShareOptions({ message, onShared }: { message: string; onShared?: () => void }) {
  function prepareShare(platform: "whatsapp" | "facebook" | "telegram", event: React.MouseEvent<HTMLAnchorElement>) {
    const pageUrl = window.location.href;
    const fullMessage = `${message}\n${pageUrl}`;
    const shareLinks = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(fullMessage)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(message)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(message)}`,
    };

    event.currentTarget.href = shareLinks[platform];
    void copyMessage(fullMessage).then(() => onShared?.());
  }

  return (
    <div className="share-options" aria-label="Share this event">
      <a className="share-option share-option-whatsapp" href="https://wa.me/" target="_blank" rel="noopener noreferrer" onClick={(event) => prepareShare("whatsapp", event)}>
        <MessageCircle aria-hidden="true" /><span>WhatsApp</span>
      </a>
      <a className="share-option share-option-facebook" href="https://www.facebook.com/sharer/sharer.php" target="_blank" rel="noopener noreferrer" onClick={(event) => prepareShare("facebook", event)}>
        <Facebook aria-hidden="true" /><span>Facebook</span>
      </a>
      <a className="share-option share-option-telegram" href="https://t.me/share/url" target="_blank" rel="noopener noreferrer" onClick={(event) => prepareShare("telegram", event)}>
        <Send aria-hidden="true" /><span>Telegram</span>
      </a>
    </div>
  );
}