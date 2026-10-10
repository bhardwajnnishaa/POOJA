import type { Metadata, Viewport } from "next";
import { DM_Sans, Noto_Sans_Devanagari, Noto_Serif_Devanagari, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import "./themes.generated.css";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import { LANG_BOOT_SCRIPT } from "@/lib/lang-boot";
import { DayRefresh } from "@/components/DayRefresh";

const CUELINKS_CID = process.env.NEXT_PUBLIC_CUELINKS_CID;
const ADSENSE_CLIENT = "ca-pub-9561435102395818";
// The AdSense script is large and pulls in more files, so it loads only after the app has opened
// and the phone is idle. A plain script tag, because AdSense rejects the attribute next/script adds.
const ADSENSE_LOADER = `window.addEventListener("load",function(){var go=function(){var s=document.createElement("script");s.async=true;s.crossOrigin="anonymous";s.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}";document.head.appendChild(s)};setTimeout(function(){window.requestIdleCallback?requestIdleCallback(go,{timeout:3000}):go()},2500)});`;

// Self-hosted at build time, so pages do not wait on a request to Google Fonts.
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
// Hindi text. Neither font above has Devanagari letters, so these fill in for them.
// Not preloaded: the browser fetches them only when a page shows Hindi.
const sansHi = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-sans-hi", display: "swap", preload: false });
const serifHi = Noto_Serif_Devanagari({ subsets: ["devanagari"], variable: "--font-serif-hi", display: "swap", preload: false });

const DESCRIPTION =
  "Live countdowns to Diwali, Holi, Eid, Rakhi, Independence Day and New Year. Check Indian festival dates, days left, wishes and gift ideas.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Indian Festival Countdown & Dates`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: `${SITE_NAME} | Indian Festival Countdown & Dates`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
  // Next.js now only emits the standard tag; iPhones before iOS 16.4 still need the Apple one
  // to open the Home Screen icon as a full-screen app.
  other: { "apple-mobile-web-app-capable": "yes" },
  // Both Search Console codes stay: removing one unverifies that property.
  verification: {
    google: ["kxULr-TAohc65C6X6C0WjGzBBoGzQvMK8GY3Ng_D8fI", "TUYM3ZuWHvfd1iWV29VLGH6r9jByemFy828"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf5e9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${serif.variable} ${sansHi.variable} ${serifHi.variable}`} data-theme="classic" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT + LANG_BOOT_SCRIPT }} />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* Google AdSense account tag: lets Google confirm the site without loading the ads script first. */}
        <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
      </head>
      <body>
        {children}
        <DayRefresh />
        <script dangerouslySetInnerHTML={{ __html: ADSENSE_LOADER }} />
        <Script id="service-worker" strategy="lazyOnload">
          {`if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(function () {});`}
        </Script>
        {CUELINKS_CID ? (
          <>
            <Script id="cuelinks-config" strategy="afterInteractive">
              {`var cId = ${JSON.stringify(CUELINKS_CID)};`}
            </Script>
            <Script
              id="cuelinks"
              src="https://cdn0.cuelinks.com/js/cuelinksv2.js"
              strategy="afterInteractive"
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
