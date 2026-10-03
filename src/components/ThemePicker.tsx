"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { THEME_BAR_COLOURS, THEME_OPTIONS, THEME_STORAGE_KEY, type AppliedTheme, type ThemeChoice } from "@/lib/theme";

function resolve(choice: ThemeChoice): AppliedTheme {
  if (choice !== "auto") return choice;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "neon" : "classic";
}

function apply(choice: ThemeChoice) {
  const theme = resolve(choice);
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_BAR_COLOURS[theme]);
}

export function ThemePicker() {
  const [choice, setChoice] = useState<ThemeChoice>("auto");
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let saved: ThemeChoice = "auto";
    try {
      saved = (window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeChoice | null) ?? "auto";
    } catch {
      saved = "auto";
    }
    setChoice(saved);
    apply(saved);

    // In Auto, follow the phone when it switches between light and dark.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      let current: ThemeChoice = "auto";
      try {
        current = (window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeChoice | null) ?? "auto";
      } catch {
        current = "auto";
      }
      if (current === "auto") apply("auto");
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);

  useEffect(() => {
    if (!open) return;
    function close(event: MouseEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  function pick(next: ThemeChoice) {
    setChoice(next);
    apply(next);
    setOpen(false);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The theme still applies for this visit.
    }
  }

  return (
    <span className="theme-picker" ref={wrapper}>
      <button className="theme-picker-button" type="button" aria-label="Change theme" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Palette aria-hidden="true" />
      </button>
      {open ? (
        <span className="theme-picker-menu" role="menu">
          {THEME_OPTIONS.map((option) => (
            <button
              className={`theme-option theme-option-${option.id}`}
              key={option.id}
              type="button"
              role="menuitemradio"
              aria-checked={choice === option.id}
              onClick={() => pick(option.id)}
            >
              <span className="theme-swatch" aria-hidden="true" />
              <span className="theme-option-text"><b>{option.label}</b><small>{option.note}</small></span>
              {choice === option.id ? <Check aria-hidden="true" /> : null}
            </button>
          ))}
        </span>
      ) : null}
    </span>
  );
}
