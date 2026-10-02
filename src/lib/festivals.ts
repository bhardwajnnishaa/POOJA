import type { FestivalId } from "@/types/calendar";

export type CalendarDates = Partial<Record<FestivalId, Record<number, string>>>;

export type FestivalInfo = {
  id: FestivalId;
  slug: string;
  name: string;
  subtitle: string;
  month: number;
  fallbackDay: number;
  // Month and day ("MM-DD") for festivals whose date moves each year.
  dates: Record<number, string>;
  theme: string;
  icon: "diya" | "moon" | "confetti" | "thread" | "colors" | "flag";
  moonDependent: boolean;
  // Another name people search for, e.g. "Raksha Bandhan" for Rakhi.
  otherName?: string;
  about: string[];
  aboutHinglish: string;
};

export const FESTIVAL_INFO: FestivalInfo[] = [
  {
    id: "diwali",
    slug: "diwali",
    name: "Diwali",
    subtitle: "Festival of lights",
    month: 11,
    fallbackDay: 8,
    dates: { 2025: "10-20", 2026: "11-08", 2027: "10-29", 2028: "10-17", 2029: "11-05", 2030: "10-26", 2031: "11-14", 2032: "11-02" },
    theme: "saffron",
    icon: "diya",
    moonDependent: false,
    otherName: "Deepavali",
    about: [
      "Diwali, also called Deepavali, is the Hindu festival of lights.",
      "Families light diyas, draw rangoli and perform Lakshmi Puja in the evening.",
      "The date follows the Hindu lunar calendar. It usually falls in October or November.",
    ],
    aboutHinglish: "Diwali roshni ka tyohar hai. Is din log diye jalate hain, rangoli banate hain aur shaam ko Lakshmi Puja karte hain.",
  },
  {
    id: "eid",
    slug: "eid-al-fitr",
    name: "Eid al-Fitr",
    subtitle: "A celebration of togetherness",
    month: 3,
    fallbackDay: 20,
    dates: { 2025: "03-31", 2026: "03-20", 2027: "03-10", 2028: "02-27", 2029: "02-15", 2030: "02-05", 2031: "01-26", 2032: "01-15" },
    theme: "jade",
    icon: "moon",
    moonDependent: true,
    otherName: "Eid ul-Fitr",
    about: [
      "Eid al-Fitr marks the end of Ramadan, the Islamic month of fasting.",
      "It begins on the first day of Shawwal with Eid prayers, festive meals and visits to family.",
      "The exact date depends on the sighting of the new moon. It can shift by a day in India.",
    ],
    aboutHinglish: "Eid al-Fitr Ramzan ke roze poore hone ki khushi mein manai jaati hai. Log Eid ki namaz padhte hain aur apno se milte hain.",
  },
  {
    id: "newYear",
    slug: "new-year",
    name: "New Year",
    subtitle: "A fresh page, a new beginning",
    month: 1,
    fallbackDay: 1,
    dates: {},
    theme: "blue",
    icon: "confetti",
    moonDependent: false,
    about: [
      "New Year's Day falls on 1 January and starts the Gregorian calendar year.",
      "Across India, people welcome it with midnight countdowns, fireworks and time with family and friends.",
    ],
    aboutHinglish: "New Year 1 January ko naye saal ki shuruaat ka jashn hai. Log raat 12 baje countdown karke naye saal ka swagat karte hain.",
  },
  {
    id: "rakhi",
    slug: "raksha-bandhan",
    name: "Rakhi",
    subtitle: "A little thread, a lifetime of love",
    month: 8,
    fallbackDay: 28,
    dates: { 2025: "08-09", 2026: "08-28", 2027: "08-17", 2028: "08-05", 2029: "08-24", 2030: "08-13", 2031: "08-02", 2032: "08-21" },
    theme: "rose",
    icon: "thread",
    moonDependent: false,
    otherName: "Raksha Bandhan",
    about: [
      "Raksha Bandhan, or Rakhi, celebrates the bond between brothers and sisters.",
      "A sister ties a rakhi on her brother's wrist, and he promises to protect her.",
      "It falls on the full moon (Purnima) of the Hindu month of Shravan, usually in August.",
    ],
    aboutHinglish: "Raksha Bandhan bhai-behen ke pyaar ka tyohar hai. Behen bhai ki kalai par rakhi baandhti hai aur bhai uski raksha ka vaada karta hai.",
  },
  {
    id: "holi",
    slug: "holi",
    name: "Holi",
    subtitle: "The festival of colours",
    month: 3,
    fallbackDay: 4,
    dates: { 2025: "03-14", 2026: "03-04", 2027: "03-22", 2028: "03-11", 2029: "03-01", 2030: "03-20", 2031: "03-09", 2032: "03-27" },
    theme: "coral",
    icon: "colors",
    moonDependent: false,
    about: [
      "Holi is the Hindu festival of colours and welcomes the arrival of spring.",
      "On the night before, people light the Holika Dahan bonfire.",
      "On Holi day, friends and families play with coloured powder and water. It falls in February or March.",
    ],
    aboutHinglish: "Holi rangon ka tyohar hai aur basant ke aane ki khushi mein manaya jaata hai. Ek raat pehle Holika Dahan hota hai.",
  },
  {
    id: "independenceDay",
    slug: "independence-day",
    name: "Independence Day",
    subtitle: "Celebrating the spirit of India",
    month: 8,
    fallbackDay: 15,
    dates: {},
    theme: "indigo",
    icon: "flag",
    moonDependent: false,
    about: [
      "India celebrates Independence Day every year on 15 August.",
      "It marks the end of British rule in 1947.",
      "The Prime Minister hoists the national flag at the Red Fort in Delhi and addresses the nation.",
    ],
    aboutHinglish: "15 August 1947 ko Bharat British raaj se azaad hua tha. Is din Pradhan Mantri Lal Qile par tiranga phehrate hain aur desh ko sambodhit karte hain.",
  },
];

export function festivalBySlug(slug: string) {
  return FESTIVAL_INFO.find((festival) => festival.slug === slug);
}

export function festivalPath(festival: Pick<FestivalInfo, "slug">) {
  return `/countdown/${festival.slug}`;
}

export function indiaYear(timestamp: number) {
  return Number(new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(timestamp));
}

// Midnight in India (UTC+5:30) on the festival day.
export function eventTimestamp(event: FestivalInfo, year: number, calendarDates: CalendarDates) {
  const monthDay = calendarDates[event.id]?.[year]?.slice(5) ?? event.dates[year];
  const month = monthDay ? Number(monthDay.slice(0, 2)) : event.month;
  const day = monthDay ? Number(monthDay.slice(3, 5)) : event.fallbackDay;
  return Date.UTC(year, month - 1, day, -5, -30);
}

export function nextEventTimestamp(event: FestivalInfo, now: number, calendarDates: CalendarDates) {
  const year = indiaYear(now);
  const thisYear = eventTimestamp(event, year, calendarDates);
  return thisYear > now ? thisYear : eventTimestamp(event, year + 1, calendarDates);
}

// Lunar festivals only have reliable dates for years we hold data for.
export function hasKnownDate(event: FestivalInfo, year: number, calendarDates: CalendarDates) {
  return Object.keys(event.dates).length === 0 || year in event.dates || Boolean(calendarDates[event.id]?.[year]);
}
