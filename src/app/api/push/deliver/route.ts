import { fromQStash, parseJob, pushConfigured, queueJob, sendPush } from "@/lib/push-server";

// QStash calls this when a reminder (or one of its 6-day hops) is due.
export async function POST(request: Request) {
  if (!pushConfigured()) return new Response("Not configured", { status: 503 });
  const raw = await request.text();
  if (!(await fromQStash(request, raw))) return new Response("Forbidden", { status: 403 });
  let parsed: unknown = null;
  try { parsed = JSON.parse(raw); } catch { /* handled below */ }
  // Jobs already accepted may be up to a minute late by the time they arrive.
  const job = parseJob(parsed, Date.now() - 24 * 60 * 60 * 1000);
  if (!job) return new Response("Bad job", { status: 200 });
  if (job.at - Date.now() > 60_000) {
    await queueJob(job);
    return new Response("Rescheduled", { status: 200 });
  }
  await sendPush(job);
  return new Response("Sent", { status: 200 });
}
