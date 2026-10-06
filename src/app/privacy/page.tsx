import type { Metadata } from "next";
import { REMIND_ME_ENABLED } from "@/lib/features";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";
import { SITE_NAME } from "@/lib/site";
import { CONTACT_EMAIL } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles your information, including My dates, AI wishes and shopping links.`,
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "3 October 2026";

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy" intro={`Last updated: ${LAST_UPDATED}. This page explains what information ${SITE_NAME} uses and why. In short: we have no accounts, and we do not sell your data.`}>
      <h2>No accounts, no sign-up</h2>
      <p>You can use every part of {SITE_NAME} without creating an account. We do not ask for your name, phone number or email address.</p>

      <h2>Information saved on your own device</h2>
      <p>Your <b>My dates</b> (names, dates and types) and your <b>My picks</b> favourites are saved only in your browser&apos;s local storage on your device.</p>
      <p>They are never sent to our servers. You can delete a date with its delete button, or remove everything by clearing this site&apos;s data in your browser settings.</p>

      <h2>Writing wishes with AI</h2>
      <p>The quote maker works without sending anything when you choose a ready-made wish or tap &ldquo;Try another quote&rdquo;.</p>
      <p>If you tap <b>Generate with AI</b>, the details you entered are sent to our server and to Google&apos;s Gemini service to write the wish. These details are the celebration, tone, language, length, and the optional name and personal detail.</p>
      <p>We do not store these details. Google processes them under its own terms and privacy policy. Please do not enter sensitive personal information.</p>

      <h2>Shopping and affiliate links</h2>
      <p>Gift ideas and store buttons link to shops such as Amazon, Flipkart, Myntra, Nykaa, Purplle, Meesho and AJIO. Some links are affiliate links, and we may use an affiliate network such as Cuelinks.</p>
      <p>When you click these links, the shop or the network may use cookies or similar technology to record that you came from {SITE_NAME}. This lets them pay us a small commission, at no extra cost to you. Their own privacy policies apply on their websites.</p>

      {REMIND_ME_ENABLED ? (
        <>
      <h2>Reminders</h2>
      <p><b>Remind me</b> can send you a notification at the time you choose. If you allow notifications, your phone gives us a notification address. We pass it, with the reminder text and time, to our scheduling service (Upstash QStash), which holds it only until the reminder is sent. We keep no list of users. You can turn notifications off any time in your browser or phone settings.</p>
      <p>If notifications are not available, Remind me opens Google Calendar or your phone&apos;s calendar instead. For the phone calendar, the event name and date are sent to our server only to create the calendar file. Nothing is stored.</p>
        </>
      ) : null}

      <h2>Sharing</h2>
      <p>Share buttons open WhatsApp, Facebook, Telegram or your phone&apos;s share menu with a ready message. We do not see who you share with.</p>

      <h2>Hosting and technical data</h2>
      <p>The site is hosted by Vercel. Like most websites, the hosting provider may keep standard technical logs, such as your IP address, browser type and the pages requested, to run and protect the service.</p>
      <p>The photo on the home page is loaded from Unsplash, which receives a standard request from your browser. Festival dates are refreshed from public Google holiday calendars by our server. This does not involve any information about you.</p>

      <h2>Advertising</h2>
      <p>{SITE_NAME} does not show ads at the moment. If we add advertising, for example Google AdSense, we will update this page first to explain what changes.</p>

      <h2>Children</h2>
      <p>{SITE_NAME} is a general audience website. We do not knowingly collect personal information from children.</p>

      <h2>Changes to this policy</h2>
      <p>If we change how we handle information, we will update this page and the date at the top.</p>

      <h2>Contact</h2>
      <p>Questions about privacy? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or visit our <Link href="/contact">Contact</Link> page.</p>
    </InfoPage>
  );
}
