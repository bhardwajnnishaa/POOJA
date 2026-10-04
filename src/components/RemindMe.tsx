"use client";

import { useState } from "react";
import { Bell, CalendarPlus, Smartphone } from "lucide-react";

type RemindMeProps = {
  title: string;
  /** Day of the event in India, YYYY-MM-DD. */
  date: string;
  details?: string;
  /** Birthdays and anniversaries repeat every year. */
  yearly?: boolean;
  className?: string;
};

const compact = (date: string) => date.replaceAll("-", "");

function nextDay(date: string) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function googleCalendarLink({ title, date, details, yearly }: RemindMeProps) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${compact(date)}/${compact(nextDay(date))}`,
    details: details ?? "",
    ctz: "Asia/Kolkata",
  });
  if (yearly) params.set("recur", "RRULE:FREQ=YEARLY");
  return `https://calendar.google.com/calendar/render?${params}`;
}

const escapeIcs = (text: string) => text.replace(/[\\,;]/g, (match) => `\\${match}`).replace(/\n/g, "\\n");

// An all-day event with two alerts: 9 AM the day before, and 8 AM on the day.
function icsFile({ title, date, details, yearly }: RemindMeProps) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Festive Clock//Remind me//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${compact(date)}-${title.replace(/[^a-z0-9]/gi, "").toLowerCase()}@festive-clock`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(date)}`,
    `DTEND;VALUE=DATE:${compact(nextDay(date))}`,
    ...(yearly ? ["RRULE:FREQ=YEARLY"] : []),
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(details ?? "")}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(`${title} is tomorrow!`)}`,
    "TRIGGER:-PT15H",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(`${title} is today!`)}`,
    "TRIGGER:PT8H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

// "Remind me": adds the day to Google Calendar or the phone's own calendar. Nothing is sent to our server.
export function RemindMe(props: RemindMeProps) {
  const [open, setOpen] = useState(false);

  function downloadIcs() {
    const blob = new Blob([icsFile(props)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${props.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "reminder"}.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    setOpen(false);
  }

  return (
    <div className={`remind-me ${props.className ?? ""}`.trim()}>
      <button className="remind-me-button" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Bell aria-hidden="true" /> Remind me
      </button>
      {open ? (
        <div className="remind-me-menu">
          <a className="remind-me-option" href={googleCalendarLink(props)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            <CalendarPlus aria-hidden="true" /> Google Calendar
          </a>
          <button className="remind-me-option" type="button" onClick={downloadIcs}>
            <Smartphone aria-hidden="true" /> Phone calendar
          </button>
          <p className="remind-me-note">Phone calendar alerts you the day before and on the day 🔔</p>
        </div>
      ) : null}
    </div>
  );
}
