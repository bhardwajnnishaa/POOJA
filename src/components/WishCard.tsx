"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, ImageIcon, X } from "lucide-react";
import { drawWishCard, type WishCardData } from "@/lib/story-card";
import { useT } from "@/lib/i18n";

/** "Make it a card": puts the wish on a WhatsApp Status image to share or save. */
export function WishCardButton({ card, shareText }: { card: WishCardData; shareText: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="quote-card-button" type="button" onClick={() => setOpen(true)}>
        <ImageIcon aria-hidden="true" /> {t("Make it a card")}
      </button>
      {open ? createPortal(<WishCardSheet card={card} shareText={shareText} onClose={() => setOpen(false)} />, document.body) : null}
    </>
  );
}

function WishCardSheet({ card, shareText, onClose }: { card: WishCardData; shareText: string; onClose: () => void }) {
  const t = useT();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [failed, setFailed] = useState(false);
  // Draw once when the sheet opens.
  const cardRef = useRef(card);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    let url: string | null = null;
    drawWishCard(cardRef.current)
      .then((blob) => {
        url = URL.createObjectURL(blob);
        setImageUrl(url);
        setFile(new File([blob], "festive-clock-wish.png", { type: "image/png" }));
      })
      .catch(() => setFailed(true));
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      if (url) URL.revokeObjectURL(url);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  const canShareImage = Boolean(file && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] }));

  async function shareImage() {
    if (!file) return;
    try {
      await navigator.share({ files: [file], text: shareText });
    } catch {
      // Cancelled or not allowed; Save image still works.
    }
  }

  return (
    <div className="share-sheet-backdrop" role="presentation" onClick={onClose}>
      <div className="share-sheet" role="dialog" aria-modal="true" aria-label={t("Your greeting card")} onClick={(event) => event.stopPropagation()}>
        <div className="share-sheet-head">
          <h2>{t("Your greeting card")} {card.emoji}</h2>
          <button className="share-sheet-close" type="button" aria-label={t("Close")} onClick={onClose}><X aria-hidden="true" /></button>
        </div>
        <div className="share-sheet-preview">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- a local blob URL, not a remote image
            <img src={imageUrl} alt={t("Greeting card with your wish")} />
          ) : (
            <span>{failed ? t("Could not create the image.") : t("Making your card…")}</span>
          )}
        </div>
        <p className="share-sheet-hint">{t("Perfect for WhatsApp Status and Instagram Stories ✨")}</p>
        <div className="share-sheet-actions">
          {canShareImage ? (
            <button className="share-sheet-primary" type="button" onClick={() => void shareImage()}><ImageIcon aria-hidden="true" /> {t("Share card")}</button>
          ) : null}
          {imageUrl ? (
            <a className={canShareImage ? "share-sheet-secondary" : "share-sheet-primary"} href={imageUrl} download="festive-clock-wish.png">
              <Download aria-hidden="true" /> {t("Save image")}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
