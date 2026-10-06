import { pushConfigured } from "@/lib/push-server";

// Lets the Remind me button know whether app notifications are switched on for this site.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ enabled: pushConfigured() }, { headers: { "Cache-Control": "no-store" } });
}
