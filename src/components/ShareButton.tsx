"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Image as ImageIcon, Link as LinkIcon, Share2, X } from "lucide-react";
import { ShareOptions } from "@/components/ShareOptions";
import { drawStoryCard, type StoryData } from "@/lib/story-card";
import { useT } from "@/lib/i18n";

export type { StoryData };

// The Share button. With a story, it opens a sheet offering a Story / Status image as well as the link.
export function ShareButton({ message, onShared, story }: { message: string; onShared?: () => void; story?: StoryData }) {
  const t = useT();
  const [showOptions, setShowOptions] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  async function shareLink() {
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
      <button className="share-button" type="button" aria-expanded={story ? sheetOpen : showOptions} onClick={() => (story ? setSheetOpen(true) : void shareLink())}>
        <Share2 aria-hidden="true" /> {t("Share")}
      </button>
      {showOptions && !story ? <div className="share-button-options"><ShareOptions message={message} onShared={onShared} /></div> : null}
      {story && sheetOpen ? <ShareSheet story={story} message={message} onShared={onShared} onClose={() => setSheetOpen(false)} /> : null}
    </>
  );
}

function ShareSheet({ story, message, onShared, onClose }: { story: StoryData; message: string; onShared?: () => void; onClose: () => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [failed, setFailed] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  // Draw once when the sheet opens, even though the page passes fresh props every minute.
  const storyRef = useRef(story);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    let url: string | null = null;
    drawStoryCard(storyRef.current, Date.now())
      .then((blob) => {
        url = URL.createObjectURL(blob);
        setImageUrl(url);
        setFile(new File([blob], "festive-clock-story.png", { type: "image/png" }));
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
      await navigator.share({ files: [file], text: `${message} ${window.location.href}` });
      onShared?.();
    } catch {
      // Cancelled or not allowed; the download button still works.
    }
  }

  async function shareLink() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text: message, url: window.location.href });
        onShared?.();
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    setShowLinks(true);
  }

  return (
    <div className="share-sheet-backdrop" role="presentation" onClick={onClose}>
      <div className="share-sheet" role="dialog" aria-modal="true" aria-label={`Share ${story.title}`} onClick={(event) => event.stopPropagation()}>
        <div className="share-sheet-head">
          <h2>Share {story.emoji}</h2>
          <button className="share-sheet-close" type="button" aria-label="Close" onClick={onClose}><X aria-hidden="true" /></button>
        </div>
        <div className="share-sheet-preview">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- a local blob URL, not a remote image
            <img src={imageUrl} alt={`Story card: ${story.title}`} />
          ) : (
            <span>{failed ? "Could not create the image." : "Making your Story card…"}</span>
          )}
        </div>
        <p className="share-sheet-hint">Perfect for Instagram Stories and WhatsApp Status ✨</p>
        <div className="share-sheet-actions">
          {canShareImage ? (
            <button className="share-sheet-primary" type="button" onClick={shareImage}><ImageIcon aria-hidden="true" /> Share Story image</button>
          ) : null}
          {imageUrl ? (
            <a className={canShareImage ? "share-sheet-secondary" : "share-sheet-primary"} href={imageUrl} download="festive-clock-story.png">
              <Download aria-hidden="true" /> Save image
            </a>
          ) : null}
          <button className="share-sheet-secondary" type="button" onClick={shareLink}><LinkIcon aria-hidden="true" /> Share link</button>
        </div>
        {showLinks ? <ShareOptions message={message} onShared={onShared} /> : null}
      </div>
    </div>
  );
}
