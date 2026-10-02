import { NextResponse } from "next/server";
import { getCalendarData } from "@/lib/calendar-data";

export const revalidate = 21600;

export async function GET() {
  try {
    return NextResponse.json(await getCalendarData());
  } catch {
    return NextResponse.json({ error: "Festival calendars are unavailable" }, { status: 503 });
  }
}