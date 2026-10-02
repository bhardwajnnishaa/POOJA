import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const CUELINKS_CID = process.env.NEXT_PUBLIC_CUELINKS_CID;

const DESCRIPTION =
  "A live countdown to India's biggest festivals and celebrations. Share the excitement and get ready for what is next.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Indian Festival Countdown`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: `${SITE_NAME} | Indian Festival Countdown`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
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
    <html lang="en-IN">
      <body>
        {children}
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
