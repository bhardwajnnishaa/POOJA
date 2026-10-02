export type FestivalId = "diwali" | "eid" | "newYear" | "rakhi" | "holi" | "independenceDay";

export type CalendarEntry = {
  date: string;
  name: string;
  category: "public-holiday" | "festival" | "observance";
  source: string;
  tentative: boolean;
  festivalId?: FestivalId;
};

export type CalendarResponse = {
  dates?: Partial<Record<FestivalId, Record<number, string>>>;
  events?: CalendarEntry[];
  error?: string;
};