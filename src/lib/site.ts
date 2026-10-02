export const SITE_NAME = "Festive Clock";

// NEXT_PUBLIC_SITE_URL wins, e.g. after buying a custom domain.
// On Vercel, the production domain is filled in automatically.
function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");

  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelDomain) return `https://${vercelDomain}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
