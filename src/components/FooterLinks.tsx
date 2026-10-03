import Link from "next/link";

export function FooterLinks() {
  return (
    <nav className="footer-links" aria-label="Site information">
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/privacy">Privacy Policy</Link>
      <Link href="/app">Get the app</Link>
    </nav>
  );
}
