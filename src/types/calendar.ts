export type FestivalId =
  | "diwali"
  | "eid"
  | "newYear"
  | "rakhi"
  | "holi"
  | "independenceDay"
  | "navratri"
  | "dussehra"
  | "karwaChauth"
  | "dhanteras"
  | "bhaiDooj"
  | "chhath"
  | "guruNanak"
  | "christmas"
  | "lohri"
  | "makarSankranti"
  | "mahaShivratri"
  | "ramNavami"
  | "eidAlAdha"
  | "teej"
  | "janmashtami"
  | "onam"
  | "ganeshChaturthi";

export type CalendarEntry = {
  date: string;
  name: string;
  category: "public-holiday" | "festival" | "observance";
  source: string;
  tentative: boolean;
  festivalId?: FestivalId;
  /** Where the calendar links this entry; defaults to the wish maker. */
  href?: string;
};

export type CalendarResponse = {
  dates?: Partial<Record<FestivalId, Record<number, string>>>;
  events?: CalendarEntry[];
  error?: string;
};