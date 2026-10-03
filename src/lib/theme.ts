export type ThemeChoice = "auto" | "classic" | "neon" | "pastel";
export type AppliedTheme = Exclude<ThemeChoice, "auto">;

export const THEME_STORAGE_KEY = "festive-clock-theme";

export const THEME_OPTIONS: { id: ThemeChoice; label: string; note: string }[] = [
  { id: "auto", label: "Auto", note: "Follows your phone's dark mode" },
  { id: "classic", label: "Classic", note: "Warm and festive" },
  { id: "neon", label: "Neon Night", note: "Dark, with glow" },
  { id: "pastel", label: "Pastel Pop", note: "Soft and bright" },
];

// Browser bar colour for each theme.
export const THEME_BAR_COLOURS: Record<AppliedTheme, string> = {
  classic: "#fbf5e9",
  neon: "#1b1435",
  pastel: "#fff8fc",
};

// Runs in <head> before the page paints, so a saved or dark theme never flashes the light one first.
export const THEME_BOOT_SCRIPT = `(function(){try{var c=localStorage.getItem("${THEME_STORAGE_KEY}")||"auto";var t=c==="auto"?(matchMedia("(prefers-color-scheme: dark)").matches?"neon":"classic"):c;document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","classic");}})();`;
