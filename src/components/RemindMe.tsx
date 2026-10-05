"use client";

import { useEffect, useState } from "react";
import { AlarmClock, CalendarPlus, Smartphone } from "lucide-react";
import { useLang, useT } from "@/lib/i18n";
import { googleCalendarLink, reminderTimes, type ReminderInput } from "@/lib/reminder";

type RemindMeProps = {
  title: string;
  /** Day of the event in India, YYYY-MM-DD. */
  date: string;
  details?: string;
  /** Birthdays and anniversaries repeat every year. */
  yearly?: boolean;
  className?: string;
};

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
  const t = useT();
  const hindi = useLang() === "hi";
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("09:00");
  const [daysBefore, setDaysBefore] = useState<0 | 1>(0);
  const [isApple, setIsApple] = useState(false);
  useEffect(() => setIsApple(/iphone|ipad|ipod|macintosh/i.test(navigator.userAgent) && "ontouchend" in document), []);

  const input: ReminderInput = { title: props.title, date: props.date, time, daysBefore, details: props.details, yearly: props.yearly };
  const { start } = reminderTimes(input);
  const icsHref = `/api/remind?${new URLSearchParams({
    title: props.title, date: props.date, time, before: String(daysBefore), details: props.details ?? "", ...(props.yearly ? { yearly: "1" } : {}),
  })}`;

  const google = (
    <a className="remind-me-option" href={googleCalendarLink(input)} target="_blank" rel="noopener noreferrer" key="google">
      <CalendarPlus aria-hidden="true" /> {t("Google Calendar")}
    </a>
  );
  const phone = (
    <a className="remind-me-option" href={icsHref} key="phone">
      <Smartphone aria-hidden="true" /> {isApple ? t("iPhone Calendar") : t("Phone calendar")}
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
          <p className="remind-me-when" suppressHydrationWarning>🔔 {(hindi ? WHEN_LABEL_HI : WHEN_LABEL).format(start)}</p>
          <div className="remind-me-options">{isApple ? [phone, google] : [google, phone]}</div>
          <p className="remind-me-note">{t("Your calendar will ring at this time. Save the event when it opens.")}</p>
        </div>
      ) : null}
    </div>
  );
}
