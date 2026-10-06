import { parseJob, pushConfigured, queueJob } from "@/lib/push-server";

// Called by the Remind me button with the phone's push address and the reminder.
export async function POST(request: Request) {
  if (!pushConfigured()) return Response.json({ error: "Reminders are not switched on yet" }, { status: 503 });
  const job = parseJob(await request.json().catch(() => null));
  if (!job) return Response.json({ error: "Invalid reminder" }, { status: 400 });
  try {
    await queueJob(job);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Could not set the reminder" }, { status: 502 });
  }
}
