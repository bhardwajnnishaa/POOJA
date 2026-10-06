// Server side of app-notification reminders. QStash holds each reminder until it is due and then
// calls /api/push/deliver, which sends the notification with Web Push. Nothing is kept in a database.
import { Client, Receiver } from "@upstash/qstash";
import webpush from "web-push";
import { VAPID_PUBLIC_KEY } from "@/lib/push-config";
import { CONTACT_EMAIL } from "@/lib/site-contact";
import { SITE_URL } from "@/lib/site";

// QStash's free plan holds a message for at most 7 days, so far-off reminders hop forward in 6-day steps.
const MAX_HOP_MS = 6 * 24 * 60 * 60 * 1000;
const MAX_AHEAD_MS = 400 * 24 * 60 * 60 * 1000;

export type PushSubscriptionJSON = { endpoint: string; keys: { p256dh: string; auth: string } };
export type ReminderJob = { subscription: PushSubscriptionJSON; title: string; body: string; url: string; at: number };

export function pushConfigured() {
  return Boolean(process.env.VAPID_PRIVATE_KEY && process.env.QSTASH_TOKEN && process.env.QSTASH_CURRENT_SIGNING_KEY && process.env.QSTASH_NEXT_SIGNING_KEY);
}

/** Checks a reminder sent by the browser. Returns null for anything malformed or out of range. */
export function parseJob(value: unknown, now = Date.now()): ReminderJob | null {
  if (!value || typeof value !== "object") return null;
  const job = value as Record<string, unknown>;
  const sub = job.subscription as Record<string, unknown> | undefined;
  const keys = sub?.keys as Record<string, unknown> | undefined;
  if (typeof sub?.endpoint !== "string" || !/^https:\/\//.test(sub.endpoint) || sub.endpoint.length > 1000) return null;
  if (typeof keys?.p256dh !== "string" || typeof keys?.auth !== "string" || keys.p256dh.length > 200 || keys.auth.length > 100) return null;
  if (typeof job.title !== "string" || !job.title.trim() || job.title.length > 120) return null;
  if (typeof job.body !== "string" || job.body.length > 300) return null;
  if (typeof job.url !== "string" || !job.url.startsWith("/") || job.url.length > 300) return null;
  if (typeof job.at !== "number" || !Number.isFinite(job.at) || job.at < now - 60_000 || job.at > now + MAX_AHEAD_MS) return null;
  return {
    subscription: { endpoint: sub.endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } },
    title: job.title.trim(), body: job.body, url: job.url, at: Math.round(job.at),
  };
}

function qstash() {
  return new Client({ token: process.env.QSTASH_TOKEN!, ...(process.env.QSTASH_URL ? { baseUrl: process.env.QSTASH_URL } : {}) });
}

/** Queues the reminder (or its next hop) with QStash. */
export async function queueJob(job: ReminderJob, now = Date.now()) {
  const sendAt = Math.min(job.at, now + MAX_HOP_MS);
  await qstash().publishJSON({
    url: `${SITE_URL}/api/push/deliver`,
    body: job,
    notBefore: Math.max(Math.floor(now / 1000), Math.floor(sendAt / 1000)),
    retries: 3,
  });
}

/** True when the request really came from QStash. */
export async function fromQStash(request: Request, rawBody: string) {
  const signature = request.headers.get("upstash-signature");
  if (!signature) return false;
  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  });
  try {
    return await receiver.verify({ signature, body: rawBody });
  } catch {
    return false;
  }
}

/** Sends the notification. Returns false when the phone has turned notifications off (subscription gone). */
export async function sendPush(job: ReminderJob) {
  webpush.setVapidDetails(`mailto:${CONTACT_EMAIL}`, VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY!);
  try {
    await webpush.sendNotification(job.subscription, JSON.stringify({ title: job.title, body: job.body, url: job.url }), { TTL: 6 * 60 * 60, urgency: "high" });
    return true;
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode;
    if (status === 404 || status === 410) return false;
    throw error;
  }
}
