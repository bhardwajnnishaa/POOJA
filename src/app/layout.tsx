import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const CUELINKS_CID = process.env.NEXT_PUBLIC_CUELINKS_CID;

export const metadata: Metadata = {
  title: "The Celebration Calendar | Indian Festive Countdown",
  description:
    "A live countdown to India's biggest festivals and celebrations. Share the excitement and get ready for what is next.",
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
    <html lang="en">
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
