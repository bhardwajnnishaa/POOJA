import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";
import { FESTIVAL_INFO } from "@/lib/festivals";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `What ${SITE_NAME} is, where its festival dates come from and how the site is funded.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <InfoPage title={`About ${SITE_NAME}`} intro={`${SITE_NAME} is a free website and app that counts down to India's festivals and to the special days in your own life.`}>
      <h2>What you can do here</h2>
      <ul>
        <li>Follow live countdowns to {FESTIVAL_INFO.length} Indian festivals, in India time.</li>
        <li>Add your own birthdays, anniversaries and special days in My dates.</li>
        <li>Find gift ideas for every budget, from under ₹500 to above ₹1,000.</li>
        <li>Write wishes in English, Hindi or Hinglish and share them on WhatsApp, Facebook or Telegram.</li>
        <li>Install it on your phone from the <Link href="/app">Get the app</Link> page.</li>
      </ul>

      <h2>Where the dates come from</h2>
      <p>Fixed dates, such as Independence Day and Christmas, never change.</p>
      <p>Festivals that follow the lunar calendar move every year. We check these dates against published panchang sources and the Government of India holiday list.</p>
      <p>Some festivals can fall a day earlier or later in different regions. Eid depends on the moon sighting. Please confirm the date with your local temple, mosque, gurdwara or panchang for religious observances.</p>

      <h2>How the site is funded</h2>
      <p>{SITE_NAME} is free to use. Some shopping links are affiliate links.</p>
      <p>If you buy something after clicking one, the store may pay us a small commission. You pay the same price. We never show fake discounts, and gift ideas are chosen to be useful, not because of commission rates.</p>

      <h2>Get in touch</h2>
      <p>Spotted a wrong date or have an idea? Visit our <Link href="/contact">Contact</Link> page.</p>
    </InfoPage>
  );
}
