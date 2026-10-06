// Plain data shared by server pages and browser components (no "use client" here).
import type { FestivalId } from "@/types/calendar";

export const FESTIVAL_HI: Record<FestivalId, { name: string; subtitle: string }> = {
  diwali: { name: "दिवाली", subtitle: "रोशनी का त्योहार" },
  eid: { name: "ईद-उल-फ़ित्र", subtitle: "मेल-मिलाप का जश्न" },
  newYear: { name: "नया साल", subtitle: "नया पन्ना, नई शुरुआत" },
  rakhi: { name: "रक्षाबंधन", subtitle: "एक धागा, ज़िंदगी भर का प्यार" },
  holi: { name: "होली", subtitle: "रंगों का त्योहार" },
  independenceDay: { name: "स्वतंत्रता दिवस", subtitle: "आज़ादी का जश्न" },
  navratri: { name: "नवरात्रि", subtitle: "माँ दुर्गा की नौ रातें" },
  dussehra: { name: "दशहरा", subtitle: "बुराई पर अच्छाई की जीत" },
  karwaChauth: { name: "करवा चौथ", subtitle: "प्यार का व्रत, चाँद के साथ पूरा" },
  dhanteras: { name: "धनतेरस", subtitle: "दिवाली का पहला दिन" },
  bhaiDooj: { name: "भाई दूज", subtitle: "एक तिलक, एक दुआ, एक वादा" },
  chhath: { name: "छठ पूजा", subtitle: "डूबते और उगते सूरज को अर्घ्य" },
  guruNanak: { name: "गुरु नानक जयंती", subtitle: "गुरु नानक देव जी का प्रकाश पर्व" },
  christmas: { name: "क्रिसमस", subtitle: "खुशियाँ, कैरल और पेड़ पर सितारा" },
  lohri: { name: "लोहड़ी", subtitle: "अलाव, रेवड़ी और भांगड़ा" },
  makarSankranti: { name: "मकर संक्रांति", subtitle: "पतंग, तिल-गुड़ और पोंगल" },
  mahaShivratri: { name: "महाशिवरात्रि", subtitle: "भगवान शिव की महान रात्रि" },
  ramNavami: { name: "राम नवमी", subtitle: "भगवान राम का जन्मोत्सव" },
  eidAlAdha: { name: "ईद-उल-अज़हा", subtitle: "बकरीद, क़ुर्बानी का त्योहार" },
  teej: { name: "हरियाली तीज", subtitle: "हरी चूड़ियाँ, मेहंदी और झूले" },
  janmashtami: { name: "जन्माष्टमी", subtitle: "कान्हा का आधी रात का जन्मदिन" },
  onam: { name: "ओणम", subtitle: "केरल का फ़सल त्योहार" },
  ganeshChaturthi: { name: "गणेश चतुर्थी", subtitle: "गणपति बप्पा मोरया!" },
};
