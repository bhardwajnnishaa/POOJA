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
  icon: "diya" | "moon" | "confetti" | "thread" | "colors" | "flag" | "lotus" | "sun" | "coins" | "moonrise" | "tree";
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
  {
    id: "navratri",
    slug: "navratri",
    name: "Navratri",
    subtitle: "Nine nights of Maa Durga",
    month: 10,
    fallbackDay: 11,
    dates: { 2026: "10-11", 2027: "09-30" },
    theme: "coral",
    icon: "lotus",
    moonDependent: false,
    otherName: "Sharad Navratri",
    about: [
      "Sharad Navratri is a nine-night festival dedicated to Goddess Durga and her nine forms.",
      "It begins with Ghatasthapana on the first day of the bright half of the Hindu month of Ashwin.",
      "People fast, perform puja and, in Gujarat and many other states, dance garba and dandiya.",
    ],
    aboutHinglish: "Navratri Maa Durga ke nau roopon ki pooja ke nau din hain. Log vrat rakhte hain, pooja karte hain aur garba-dandiya khelte hain.",
  },
  {
    id: "dussehra",
    slug: "dussehra",
    name: "Dussehra",
    subtitle: "The victory of good over evil",
    month: 10,
    fallbackDay: 20,
    dates: { 2026: "10-20", 2027: "10-09" },
    theme: "indigo",
    icon: "colors",
    moonDependent: false,
    otherName: "Vijayadashami",
    about: [
      "Dussehra, or Vijayadashami, celebrates the victory of good over evil.",
      "It marks Lord Rama's victory over Ravana and Goddess Durga's victory over Mahishasura.",
      "It falls on the tenth day after Navratri begins. In many places, effigies of Ravana are burnt in the evening.",
    ],
    aboutHinglish: "Dussehra buraai par achhaai ki jeet ka tyohar hai. Is din Bhagwan Ram ne Ravan par aur Maa Durga ne Mahishasur par vijay paayi thi. Shaam ko Ravan dahan hota hai.",
  },
  {
    id: "karwaChauth",
    slug: "karwa-chauth",
    name: "Karwa Chauth",
    subtitle: "A fast of love, broken by moonlight",
    month: 10,
    fallbackDay: 29,
    dates: { 2026: "10-29", 2027: "10-18" },
    theme: "rose",
    icon: "moonrise",
    moonDependent: false,
    otherName: "Karva Chauth",
    about: [
      "On Karwa Chauth, married women fast from sunrise to moonrise for the well-being of their husbands.",
      "The day begins with sargi before dawn. In the evening, women perform puja and break the fast after seeing the moon.",
      "It falls on the fourth day after the full moon in the Hindu month of Kartik.",
    ],
    aboutHinglish: "Karwa Chauth par suhagin mahilayein pati ki lambi umar ke liye suraj nikalne se chaand nikalne tak vrat rakhti hain. Shaam ko chaand dekhkar vrat khola jaata hai.",
  },
  {
    id: "dhanteras",
    slug: "dhanteras",
    name: "Dhanteras",
    subtitle: "The first day of Diwali",
    month: 11,
    fallbackDay: 6,
    dates: { 2026: "11-06", 2027: "10-27" },
    theme: "saffron",
    icon: "coins",
    moonDependent: false,
    otherName: "Dhantrayodashi",
    about: [
      "Dhanteras is the first day of the five-day Diwali festival.",
      "Many families buy gold, silver or new utensils on this day, as it is considered auspicious.",
      "In the evening, people worship Lord Dhanvantari and Goddess Lakshmi.",
    ],
    aboutHinglish: "Dhanteras Diwali ke paanch dinon ka pehla din hai. Is din sona, chaandi ya naye bartan khareedna shubh maana jaata hai.",
  },
  {
    id: "bhaiDooj",
    slug: "bhai-dooj",
    name: "Bhai Dooj",
    subtitle: "A tilak, a prayer, a promise",
    month: 11,
    fallbackDay: 11,
    dates: { 2026: "11-11", 2027: "10-31" },
    theme: "blue",
    icon: "thread",
    moonDependent: false,
    otherName: "Bhau Beej",
    about: [
      "Bhai Dooj celebrates the bond between brothers and sisters.",
      "Sisters apply a tilak on their brothers' foreheads and pray for their long life. Brothers give gifts in return.",
      "It is usually celebrated two days after Diwali, and is also called Bhau Beej and Yama Dwitiya.",
    ],
    aboutHinglish: "Bhai Dooj par behen bhai ke maathe par tilak lagakar uski lambi umar ki dua karti hai. Bhai badle mein behen ko tohfa deta hai.",
  },
  {
    id: "chhath",
    slug: "chhath-puja",
    name: "Chhath Puja",
    subtitle: "Prayers to the setting and rising sun",
    month: 11,
    fallbackDay: 15,
    dates: { 2026: "11-15", 2027: "11-04" },
    theme: "coral",
    icon: "sun",
    moonDependent: false,
    about: [
      "Chhath Puja is dedicated to Surya, the Sun God, and to Chhathi Maiya.",
      "It is celebrated mainly in Bihar, Jharkhand and eastern Uttar Pradesh, and by their communities across India.",
      "The date shown is the main day, when devotees offer arghya to the setting sun. They offer arghya to the rising sun the next morning.",
    ],
    aboutHinglish: "Chhath Puja Surya Dev aur Chhathi Maiya ki pooja ka tyohar hai. Vrati doobte suraj aur ugte suraj, dono ko arghya dete hain.",
  },
  {
    id: "guruNanak",
    slug: "guru-nanak-jayanti",
    name: "Guru Nanak Jayanti",
    subtitle: "Prakash Purab of Guru Nanak Dev Ji",
    month: 11,
    fallbackDay: 24,
    dates: { 2026: "11-24", 2027: "11-14" },
    theme: "jade",
    icon: "diya",
    moonDependent: false,
    otherName: "Gurpurab",
    about: [
      "Guru Nanak Jayanti marks the birth anniversary of Guru Nanak Dev Ji, the first Sikh Guru.",
      "It is celebrated on Kartik Purnima, the full moon of the Hindu month of Kartik.",
      "Gurdwaras hold prayers, kirtan and langar, and many homes are lit up for the day.",
    ],
    aboutHinglish: "Guru Nanak Jayanti Sikh dharm ke pehle Guru, Guru Nanak Dev Ji ka prakash parv hai. Gurudwaron mein kirtan, ardaas aur langar hota hai.",
  },
  {
    id: "christmas",
    slug: "christmas",
    name: "Christmas",
    subtitle: "Joy, carols and a star on the tree",
    month: 12,
    fallbackDay: 25,
    dates: {},
    theme: "jade",
    icon: "tree",
    moonDependent: false,
    about: [
      "Christmas celebrates the birth of Jesus Christ.",
      "In India, people attend midnight mass, decorate Christmas trees and share cake and sweets.",
      "It falls on 25 December every year and is a national holiday.",
    ],
    aboutHinglish: "Christmas Yeshu Masih ke janm ki khushi mein 25 December ko manaya jaata hai. Log church jaate hain, Christmas tree sajaate hain aur cake baantte hain.",
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
