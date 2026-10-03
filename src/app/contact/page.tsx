import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { SITE_NAME } from "@/lib/site";
import { CONTACT_EMAIL } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Contact",
  description: `How to contact ${SITE_NAME} about festival dates, suggestions or partnerships.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <InfoPage title="Contact us" intro="We would love to hear from you.">
      <p className="contact-email">
        Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>

      <h2>Write to us about</h2>
      <ul>
        <li>A festival date that looks wrong for your region.</li>
        <li>A festival or feature you would like us to add.</li>
        <li>A problem with the website or app.</li>
        <li>Partnerships and collaborations.</li>
      </ul>

      <p>Please include the page link and, if possible, a screenshot. We read every message and try to reply within a few days.</p>
      <p>Please do not send passwords, bank details or other sensitive information by email.</p>
    </InfoPage>
  );
}
