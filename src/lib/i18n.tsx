"use client";

// Hindi / English switch. The choice is saved on the phone and every open component updates at once.
import { useCallback, useSyncExternalStore } from "react";
import { FESTIVAL_HI } from "@/lib/i18n-data";
import type { FestivalId } from "@/types/calendar";

export type Lang = "en" | "hi";

import { LANG_STORAGE_KEY as STORAGE_KEY } from "@/lib/lang-boot";
const CHANGE_EVENT = "festive-clock-lang";

function readLang(): Lang {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function setLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // The switch still works for this visit.
  }
  document.documentElement.lang = lang === "hi" ? "hi-IN" : "en-IN";
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Pages are pre-built in English; Hindi is applied in the browser right after loading. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, readLang, () => "en");
}

// Interface text, keyed by the English wording. Anything missing simply stays in English.
const HI: Record<string, string> = {
  "Countdowns": "काउंटडाउन",
  "Calendar": "कैलेंडर",
  "OUR YEAR, IN CELEBRATIONS": "हमारा साल, त्योहारों के साथ",
  "Holi colours, Diwali diyas, your bestie's birthday 🎉 Every reason to celebrate, counting down live.": "होली के रंग, दिवाली के दीये, बेस्टी का बर्थडे 🎉 जश्न की हर वजह, लाइव काउंटडाउन के साथ।",
  "See what's next": "देखें आगे क्या है",
  "MANY REASONS TO CELEBRATE": "जश्न की कई वजहें",
  "Scroll to celebrate": "नीचे देखें",
  "THE COUNTDOWN IS ON": "काउंटडाउन शुरू है",
  "What are we celebrating next? 🎉": "अगला जश्न किसका है? 🎉",
  "Live countdowns · India time": "लाइव काउंटडाउन · भारतीय समय",
  "My dates": "मेरी तारीखें",
  "Bday, anniversary or any day that matters 💛 Saved only on your phone.": "जन्मदिन, सालगिरह या कोई भी खास दिन 💛 सिर्फ़ आपके फ़ोन में सेव।",
  "Add my date": "तारीख जोड़ें",
  "Name": "नाम",
  "Date": "तारीख",
  "Type": "प्रकार",
  "e.g. Mom's birthday": "जैसे: मम्मी का जन्मदिन",
  "Save date": "सेव करें",
  "Cancel": "रद्द करें",
  "The year does not matter. The countdown repeats every year.": "साल से फ़र्क नहीं पड़ता। काउंटडाउन हर साल दोहराया जाता है।",
  "Birthday": "जन्मदिन",
  "Anniversary": "सालगिरह",
  "Other": "अन्य",
  "My date": "मेरी तारीख",
  "Gift ideas": "गिफ़्ट आइडिया",
  "Hide gift ideas": "गिफ़्ट आइडिया छिपाएँ",
  "🎉 It's today! Send your wishes.": "🎉 आज ही है! शुभकामनाएँ भेजें।",
  "Find a festival or celebration": "त्योहार या जश्न खोजें",
  "All events": "सभी त्योहार",
  "My picks": "मेरी पसंद",
  "Open calendar": "कैलेंडर खोलें",
  "🌙 Ekadashi, Purnima, Amavasya": "🌙 एकादशी, पूर्णिमा, अमावस्या",
  "Ekadashi, Purnima & Amavasya": "एकादशी, पूर्णिमा और अमावस्या",
  "Every vrat date, with tithi times": "हर व्रत की तारीख, तिथि के समय के साथ",
  "Closest dates first": "सबसे नज़दीकी पहले",
  "Today 🎉": "आज 🎉",
  "Tomorrow": "कल",
  "It's almost here! 🔥": "बस आ ही गया! 🔥",
  "This week! 🔥": "इसी हफ़्ते! 🔥",
  "Loading… ⏳": "आने वाला है… ⏳",
  "Save the date 📌": "तारीख याद रखें 📌",
  "India": "भारत",
  "Days": "दिन",
  "Hours": "घंटे",
  "Minutes": "मिनट",
  "Seconds": "सेकंड",
  "Share": "शेयर करें",
  "Write a wish": "शुभकामना लिखें",
  "Remind me": "याद दिलाएँ",
  "Google Calendar": "Google कैलेंडर",
  "Phone calendar": "फ़ोन कैलेंडर",
  "Phone calendar alerts you the day before and on the day 🔔": "फ़ोन कैलेंडर एक दिन पहले और उसी दिन याद दिलाएगा 🔔",
  "iPhone Calendar": "iPhone कैलेंडर",
  "Set reminder": "रिमाइंडर सेट करें",
  "TODAY'S PANCHANG": "आज का पंचांग",
  "City": "शहर",
  "Today": "आज",
  "Yesterday": "बीता कल",
  "Previous day": "पिछला दिन",
  "Next day": "अगला दिन",
  "Month": "मास",
  "North India": "उत्तर भारत",
  "South & West": "दक्षिण व पश्चिम",
  "Sunrise": "सूर्योदय",
  "Sunset": "सूर्यास्त",
  "Moonrise": "चंद्रोदय",
  "Moonset": "चंद्रास्त",
  "Tithi": "तिथि",
  "Nakshatra": "नक्षत्र",
  "Yoga": "योग",
  "till": "तक",
  "then": "फिर",
  "Avoid for new work": "नए काम के लिए टालें",
  "Good times": "शुभ समय",
  "Rahu Kaal": "राहु काल",
  "Yamaganda": "यमगंड",
  "Gulika Kaal": "गुलिक काल",
  "Abhijit Muhurat": "अभिजीत मुहूर्त",
  "Brahma Muhurat": "ब्रह्म मुहूर्त",
  "Not today": "आज नहीं",
  "Not observed on Wednesday": "बुधवार को नहीं माना जाता",
  "Now": "अभी",
  "Times are for the city you choose, worked out from the Sun and Moon. Tithi, nakshatra and yoga are those running at sunrise. Your local panchang may differ by a minute or two.": "समय आपके चुने हुए शहर के लिए हैं, सूर्य और चंद्रमा की स्थिति से निकाले गए। तिथि, नक्षत्र और योग सूर्योदय के समय के हैं। स्थानीय पंचांग में एक-दो मिनट का अंतर हो सकता है।",
  "📿 Today's Panchang": "📿 आज का पंचांग",
  "Tap Save when your calendar opens. Your phone will ring at this time.": "कैलेंडर खुलने पर Save दबाएँ। इसी समय आपका फ़ोन याद दिलाएगा।",
  "When": "कब",
  "On the day": "उसी दिन",
  "1 day before": "1 दिन पहले",
  "Alert time": "अलार्म का समय",
  "Your calendar will ring at this time. Save the event when it opens.": "आपका कैलेंडर इसी समय याद दिलाएगा। खुलने पर इवेंट सेव करें।",
  "Show fewer festivals": "कम त्योहार दिखाएँ",
  "CELEBRATION EDIT": "त्योहार की शॉपिंग",
  "Shop the vibe ✨": "शॉपिंग करें ✨",
  "Gifts sorted. Zero overthinking. 🎁": "गिफ़्ट की टेंशन ख़त्म 🎁",
  "Choose an event": "त्योहार चुनें",
  "Festivals": "त्योहार",
  "Need it today? ⚡": "आज ही चाहिए? ⚡",
  "Delivered in minutes.": "मिनटों में डिलीवरी।",
  "Order the party food 🍕": "पार्टी का खाना मँगाएँ 🍕",
  "No events found": "कोई त्योहार नहीं मिला",
  "Try another search, or see every upcoming celebration.": "कुछ और खोजें, या सभी त्योहार देखें।",
  "Show all events": "सभी त्योहार देखें",
  "Choose what matters to you": "अपने पसंदीदा चुनें",
  "Save a celebration with its star to build your personal list.": "स्टार दबाकर अपनी लिस्ट बनाएँ।",
  "A LITTLE MORE JOY, A LITTLE MORE OFTEN": "खुशियाँ, बार-बार",
  "Make room for the good stuff.": "अच्छे पलों के लिए जगह बनाएँ।",
  "Life is better with something to look forward to. Pick your next one. Let the countdown begin ⏳": "किसी खास दिन का इंतज़ार ज़िंदगी को खूबसूरत बनाता है। अपना अगला जश्न चुनें। काउंटडाउन शुरू ⏳",
  "Made with 💛 for every celebration.": "हर जश्न के लिए 💛 से बनाया गया।",
  "Back to top ↑": "ऊपर जाएँ ↑",
  "No download. No app store. Just": "कोई डाउनलोड नहीं। कोई ऐप स्टोर नहीं। बस",
  "one tap ✨": "एक टैप ✨",
  "Add to Home Screen": "होम स्क्रीन पर जोड़ें",
  "Next Ekadashi": "अगली एकादशी",
  "Next Purnima": "अगली पूर्णिमा",
  "Next Amavasya": "अगली अमावस्या",
  "Running now · ends": "अभी चल रही है · समाप्त",
  "Close": "बंद करें",
};

/** Returns t(englishText): the Hindi version when Hindi is on, otherwise the English text. */
export function useT() {
  const lang = useLang();
  return useCallback((english: string) => (lang === "hi" ? HI[english] ?? english : english), [lang]);
}

export { FESTIVAL_HI };

/** Festival name and tagline in the chosen language. */
export function useFestivalText() {
  const lang = useLang();
  return useCallback(
    (festival: { id: FestivalId; name: string; subtitle: string }) =>
      lang === "hi" ? FESTIVAL_HI[festival.id] : { name: festival.name, subtitle: festival.subtitle },
    [lang],
  );
}

const DATE_FORMATS = {
  en: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }),
  hi: new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }),
};

/** "8 November 2026" or "8 नवंबर 2026". */
export function useDateLabel() {
  const lang = useLang();
  return useCallback((timestamp: number) => DATE_FORMATS[lang].format(timestamp), [lang]);
}

/** Header button: shows the other language, so the tap target says where it goes. */
export function LanguageToggle() {
  const lang = useLang();
  return (
    <button
      className="lang-toggle"
      type="button"
      aria-label={lang === "hi" ? "Switch to English" : "हिंदी में देखें"}
      onClick={() => setLang(lang === "hi" ? "en" : "hi")}
    >
      {lang === "hi" ? "English" : "हिंदी"}
    </button>
  );
}

