import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}: Indian Festival Countdown`,
    short_name: SITE_NAME,
    description: "Live countdowns, gift ideas and wishes for Indian festivals.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbf8f1",
    theme_color: "#ff6a3d",
    lang: "en-IN",
    categories: ["lifestyle", "shopping"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
