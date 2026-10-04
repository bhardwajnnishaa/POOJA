import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import "./themes.generated.css";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";

const CUELINKS_CID = process.env.NEXT_PUBLIC_CUELINKS_CID;

// Self-hosted at build time, so pages do not wait on a request to Google Fonts.
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

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
  verification: { google: "kxULr-TAohc65C6X6C0WjGzBBoGzQvMK8GY3Ng_D8fI" },
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
    <html lang="en-IN" className={`${sans.variable} ${serif.variable}`} data-theme="classic" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        {children}
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
