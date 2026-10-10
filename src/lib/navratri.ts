// Sharad Navratri day by day: which form of Maa Durga is worshipped on each of the nine days.
// Safe for the browser: dates come from festivals.ts, with no astronomy.
import { FESTIVAL_INFO } from "@/lib/festivals";

export type NavDurga = { en: string; hi: string; detailEn: string; detailHi: string };

// Day 1 to day 9, in the order of the Devi Kavach.
export const NAVDURGA: NavDurga[] = [
  {
    en: "Maa Shailputri",
    hi: "माँ शैलपुत्री",
    detailEn: "Daughter of Himavan, the mountain king. She rides the bull Nandi and holds a trident and a lotus. Navratri begins with Ghatasthapana and her puja.",
    detailHi: "पर्वतराज हिमालय की पुत्री। वे वृषभ (नंदी) पर सवार हैं और हाथों में त्रिशूल व कमल धारण करती हैं। घटस्थापना के साथ इसी दिन उनकी पूजा से नवरात्रि शुरू होती है।",
  },
  {
    en: "Maa Brahmacharini",
    hi: "माँ ब्रह्मचारिणी",
    detailEn: "The Devi of tapas and self-discipline. She walks barefoot with a japa mala and a kamandal. Her worship is linked with patience and steady devotion.",
    detailHi: "तप और संयम की देवी। वे नंगे पाँव चलती हैं और हाथों में जप माला व कमंडल रखती हैं। उनकी पूजा धैर्य और दृढ़ भक्ति से जुड़ी है।",
  },
  {
    en: "Maa Chandraghanta",
    hi: "माँ चंद्रघंटा",
    detailEn: "A bell-shaped half moon shines on her forehead. She rides a lion and has ten arms. She is worshipped for courage and calm.",
    detailHi: "उनके माथे पर घंटे के आकार का अर्धचंद्र है। वे सिंह पर सवार हैं और उनकी दस भुजाएँ हैं। साहस और शांति के लिए उनकी पूजा होती है।",
  },
  {
    en: "Maa Kushmanda",
    hi: "माँ कूष्मांडा",
    detailEn: "She is said to have created the universe with her gentle smile. She has eight arms and rides a lion. She is linked with light and good health.",
    detailHi: "मान्यता है कि उन्होंने अपनी मंद मुस्कान से ब्रह्मांड की रचना की। वे अष्टभुजा हैं और सिंह पर सवार हैं। उन्हें प्रकाश और अच्छे स्वास्थ्य से जोड़ा जाता है।",
  },
  {
    en: "Maa Skandamata",
    hi: "माँ स्कंदमाता",
    detailEn: "Mother of Skanda (Kartikeya), who sits on her lap. She is seated on a lotus and also rides a lion. Her worship is linked with a mother's love.",
    detailHi: "भगवान स्कंद (कार्तिकेय) की माता, जो उनकी गोद में विराजमान हैं। वे कमल पर बैठती हैं और सिंह पर भी सवार हैं। उनकी पूजा माँ के स्नेह से जुड़ी है।",
  },
  {
    en: "Maa Katyayani",
    hi: "माँ कात्यायनी",
    detailEn: "Born in the ashram of the sage Katyayana. In this warrior form she slew the demon Mahishasura. She rides a lion.",
    detailHi: "महर्षि कात्यायन के आश्रम में प्रकट हुईं। इसी योद्धा रूप में उन्होंने महिषासुर का वध किया। वे सिंह पर सवार हैं।",
  },
  {
    en: "Maa Kalaratri",
    hi: "माँ कालरात्रि",
    detailEn: "The fiercest of the nine forms, dark in colour and riding a donkey. She removes fear and darkness. She is also called Shubhankari, the one who does good.",
    detailHi: "नौ रूपों में सबसे उग्र, श्याम वर्ण और गर्दभ (गधे) पर सवार। वे भय और अंधकार का नाश करती हैं। उन्हें शुभंकरी भी कहा जाता है।",
  },
  {
    en: "Maa Mahagauri",
    hi: "माँ महागौरी",
    detailEn: "Fair and dressed in white, she rides a white bull. She is worshipped on Ashtami. Many homes perform kanya pujan on this day.",
    detailHi: "गौर वर्ण और श्वेत वस्त्रधारी, वे श्वेत वृषभ पर सवार हैं। अष्टमी पर उनकी पूजा होती है। कई घरों में इस दिन कन्या पूजन होता है।",
  },
  {
    en: "Maa Siddhidatri",
    hi: "माँ सिद्धिदात्री",
    detailEn: "The giver of all siddhis, seated on a lotus. She is worshipped on Navami, the last day of Navratri. Vijayadashami (Dussehra) follows.",
    detailHi: "सभी सिद्धियाँ देने वाली देवी, जो कमल पर विराजमान हैं। नवरात्रि के अंतिम दिन नवमी पर उनकी पूजा होती है। इसके बाद विजयादशमी (दशहरा) आती है।",
  },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function addDays(date: string, days: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

function dateOf(id: "navratri" | "dussehra", year: number) {
  const monthDay = FESTIVAL_INFO.find((festival) => festival.id === id)?.dates[year];
  return monthDay ? `${year}-${monthDay}` : null;
}

// First day (Ghatasthapana) of Sharad Navratri in a year, YYYY-MM-DD.
// Only for years with exactly nine days before Dussehra. When a tithi is lost or repeated,
// panchangs differ on which Devi falls on which day, so no day is shown rather than a wrong one.
function navratriStart(year: number) {
  const start = dateOf("navratri", year);
  const dussehra = dateOf("dussehra", year);
  return start && dussehra && addDays(start, 9) === dussehra ? start : null;
}

/** Navratri day for an India date (YYYY-MM-DD): 1 to 9, or 0 on the day before it starts. Null on other days. */
export function navratriDay(date: string): number | null {
  const start = navratriStart(Number(date.slice(0, 4)));
  if (!start) return null;
  const day = Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / DAY_MS) + 1;
  return day >= 0 && day <= 9 ? day : null;
}
