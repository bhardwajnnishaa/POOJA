export type PersonalDateKind = "birthday" | "anniversary" | "other";

export type PersonalDate = {
  id: string;
  name: string;
  month: number;
  day: number;
  kind: PersonalDateKind;
};

export const PERSONAL_DATE_KINDS: { id: PersonalDateKind; label: string }[] = [
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
  { id: "other", label: "Other" },
];

export const MAX_PERSONAL_DATES = 20;
export const MAX_NAME_LENGTH = 40;

// Saved only in this browser, so no personal data ever leaves the visitor's device.
const STORAGE_KEY = "festive-clock-my-dates";

function isPersonalDate(value: unknown): value is PersonalDate {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.id === "string"
    && typeof entry.name === "string"
    && Number.isInteger(entry.month) && (entry.month as number) >= 1 && (entry.month as number) <= 12
    && Number.isInteger(entry.day) && (entry.day as number) >= 1 && (entry.day as number) <= 31
    && PERSONAL_DATE_KINDS.some((kind) => kind.id === entry.kind);
}

export function loadPersonalDates(): PersonalDate[] {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
    return Array.isArray(saved) ? saved.filter(isPersonalDate).slice(0, MAX_PERSONAL_DATES) : [];
  } catch {
    return [];
  }
}

// Returns false when the browser blocks storage, e.g. in some private windows.
export function savePersonalDates(dates: PersonalDate[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dates));
    return true;
  } catch {
    return false;
  }
}

const INDIA_DATE_PARTS = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Kolkata",
});

function indiaToday(now: number) {
  const [year, month, day] = INDIA_DATE_PARTS.format(now).split("-").map(Number);
  return { year, month, day };
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Midnight in India on the date; 29 February falls back to 28 February in other years.
function occurrence(date: PersonalDate, year: number) {
  const day = date.month === 2 && date.day === 29 && !isLeapYear(year) ? 28 : date.day;
  return Date.UTC(year, date.month - 1, day, -5, -30);
}

export function isPersonalDateToday(date: PersonalDate, now: number) {
  const today = indiaToday(now);
  return occurrence(date, today.year) === Date.UTC(today.year, today.month - 1, today.day, -5, -30);
}

export function nextPersonalDate(date: PersonalDate, now: number) {
  const { year } = indiaToday(now);
  const thisYear = occurrence(date, year);
  return thisYear > now ? thisYear : occurrence(date, year + 1);
}
