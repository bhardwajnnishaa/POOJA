import { icsFile, parseReminderQuery } from "@/lib/reminder";

// Serves the reminder as a real .ics file, so iPhone shows "Add to Calendar" (a file made inside
// the page does not open from the installed app). Nothing is stored.
export function GET(request: Request) {
  const input = parseReminderQuery(new URL(request.url).searchParams);
  if (!input) return new Response("Invalid reminder", { status: 400 });
  return new Response(icsFile(input), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      // inline (not attachment): iPhone then opens it straight in Calendar instead of downloading it.
      "Content-Disposition": 'inline; filename="festive-clock-reminder.ics"',
      "Cache-Control": "no-store",
    },
  });
}
