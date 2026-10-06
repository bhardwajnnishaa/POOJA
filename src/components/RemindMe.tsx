"use client";

import { useEffect, useState } from "react";
import { AlarmClock, BellRing } from "lucide-react";
import { useLang, useT } from "@/lib/i18n";
import { googleCalendarLink, reminderTimes, type ReminderInput } from "@/lib/reminder";
import { VAPID_PUBLIC_KEY } from "@/lib/push-config";
import { REMIND_ME_ENABLED } from "@/lib/features";

type RemindMeProps = {
  title: string;
  /** Day of the event in India, YYYY-MM-DD. */
  date: string;
  details?: string;
  /** Birthdays and anniversaries repeat every year. */
  yearly?: boolean;
  /** Page the notification opens when tapped. */
  href?: string;
  className?: string;
};

type PushStatus = "idle" | "setting" | "done" | "denied" | "error";
const SET_KEY = "festive-clock-reminders-set";

// Asked once per page: are app notifications switched on for this site?
let pushEnabled: Promise<boolean> | null = null;
function pushAvailable() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return Promise.resolve(false);
  pushEnabled ??= fetch("/api/push/status", { cache: "no-store" })
    .then((response) => (response.ok ? response.json() : { enabled: false }))
    .then((data: { enabled?: boolean }) => Boolean(data.enabled))
    .catch(() => false);
  return pushEnabled;
}

function keyBytes(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

function readSet(): Record<string, number> {
  try {
    return JSON.parse(window.localStorage.getItem(SET_KEY) ?? "{}") as Record<string, number>;
  } catch {
    return {};
  }
}

// Subscribes this phone to Festive Clock notifications and asks the server to send one at the chosen time.
async function schedulePush(title: string, body: string, url: string, at: number) {
  if ((await Notification.requestPermission()) !== "granted") return "denied" as const;
  const registration = (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.register("/sw.js"));
  await navigator.serviceWorker.ready;
  const subscription = (await registration.pushManager.getSubscription())
    ?? (await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(VAPID_PUBLIC_KEY) }));
  const response = await fetch("/api/push/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription: subscription.toJSON(), title, body, url, at }),
  });
  return response.ok ? ("done" as const) : ("error" as const);
}

const TIMES = [
  { value: "07:00", en: "7 AM", hi: "सुबह 7" },
  { value: "09:00", en: "9 AM", hi: "सुबह 9" },
  { value: "12:00", en: "12 PM", hi: "दोपहर 12" },
  { value: "18:00", en: "6 PM", hi: "शाम 6" },
  { value: "21:00", en: "9 PM", hi: "रात 9" },
];

const WHEN_LABEL = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
const WHEN_LABEL_HI = new Intl.DateTimeFormat("hi-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

// "Remind me": an alert at the time the person picks, added to Google Calendar or the phone's calendar.
export function RemindMe(props: RemindMeProps) {
  if (!REMIND_ME_ENABLED) return null;
  return <RemindMePanel {...props} />;
}

function RemindMePanel(props: RemindMeProps) {
  const t = useT();
  const hindi = useLang() === "hi";
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("09:00");
  const [daysBefore, setDaysBefore] = useState<0 | 1>(0);
  const [isApple, setIsApple] = useState(false);
  const [canPush, setCanPush] = useState(false);
  const [status, setStatus] = useState<PushStatus>("idle");
  useEffect(() => setIsApple(/iphone|ipad|ipod|macintosh/i.test(navigator.userAgent) && "ontouchend" in document), []);
  useEffect(() => {
    if (!open) return;
    let active = true;
    void pushAvailable().then((available) => { if (active) setCanPush(available); });
    return () => { active = false; };
  }, [open]);

  const input: ReminderInput = { title: props.title, date: props.date, time, daysBefore, details: props.details, yearly: props.yearly };
  const { start } = reminderTimes(input);
  const icsHref = `/api/remind?${new URLSearchParams({
    title: props.title, date: props.date, time, before: String(daysBefore), details: props.details ?? "", ...(props.yearly ? { yearly: "1" } : {}),
  })}`;

  const whenLabel = (hindi ? WHEN_LABEL_HI : WHEN_LABEL).format(start);
  const setKey = `${props.title}|${start}`;
  const alreadySet = status === "done" || (typeof window !== "undefined" && readSet()[setKey] === start);

  async function setReminder() {
    setStatus("setting");
    const title = daysBefore ? (hindi ? `${props.title} कल है!` : `${props.title} is tomorrow!`) : (hindi ? `${props.title} आज है!` : `${props.title} is today!`);
    const body = hindi ? "Festive Clock की याद 🔔 देखने के लिए टैप करें" : "Your Festive Clock reminder 🔔 Tap to open";
    try {
      const result = await schedulePush(title, body, props.href ?? "/", start);
      setStatus(result);
      if (result === "done") {
        try { window.localStorage.setItem(SET_KEY, JSON.stringify({ ...readSet(), [setKey]: start })); } catch { /* still set on the server */ }
      }
    } catch {
      setStatus("error");
    }
  }

  // Without app notifications: iPhone gets its own Calendar app, everyone else gets Google Calendar.
  const calendarButton = (
    <a
      className="remind-me-set"
      href={isApple ? icsHref : googleCalendarLink(input)}
      {...(isApple ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      suppressHydrationWarning
    >
      <BellRing aria-hidden="true" />
      <span>{t("Set reminder")}<small>{whenLabel}</small></span>
    </a>
  );

  return (
    <div className={`remind-me ${props.className ?? ""}`.trim()}>
      <button className="remind-me-button" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        <AlarmClock aria-hidden="true" /> {t("Remind me")}
      </button>
      {open ? (
        <div className="remind-me-menu">
          <div className="remind-me-choice" role="group" aria-label={t("When")}>
            <span>{t("When")}</span>
            <button type="button" aria-pressed={daysBefore === 0} onClick={() => setDaysBefore(0)}>{t("On the day")}</button>
            <button type="button" aria-pressed={daysBefore === 1} onClick={() => setDaysBefore(1)}>{t("1 day before")}</button>
          </div>
          <div className="remind-me-choice remind-me-times" role="group" aria-label={t("Alert time")}>
            <span>⏰ {t("Alert time")}</span>
            {TIMES.map((option) => (
              <button type="button" key={option.value} aria-pressed={time === option.value} onClick={() => setTime(option.value)}>
                {hindi ? option.hi : option.en}
              </button>
            ))}
          </div>
          {canPush && status !== "denied" && status !== "error" ? (
            alreadySet ? (
              <p className="remind-me-done" role="status">✅ {t("Reminder set!")}<small>{whenLabel}</small></p>
            ) : (
              <button className="remind-me-set" type="button" onClick={() => void setReminder()} disabled={status === "setting"} suppressHydrationWarning>
                <BellRing aria-hidden="true" />
                <span>{status === "setting" ? t("Setting…") : t("Set reminder")}<small>{whenLabel}</small></span>
              </button>
            )
          ) : calendarButton}
          <p className="remind-me-note">
            {canPush && status !== "denied" && status !== "error"
              ? t("Tap Allow when asked. Your phone will show a notification with sound at this time.")
              : status === "denied"
                ? t("Notifications are blocked for this site, so your calendar will remind you instead. Tap Save when it opens.")
                : status === "error"
                  ? t("Could not set it automatically. Use your calendar instead: tap Save when it opens.")
                  : isApple
                    ? t("For automatic reminders on iPhone, add Festive Clock to your Home Screen first. For now, tap Save when your calendar opens.")
                    : t("Tap Save when your calendar opens. Your phone will then remind you with its notification sound.")}
          </p>
        </div>
      ) : null}
    </div>
  );
}
