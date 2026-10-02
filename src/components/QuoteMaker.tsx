"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Pencil, RefreshCw, Sparkles, WandSparkles, X } from "lucide-react";
import { ShareOptions } from "@/components/ShareOptions";

type QuoteTone = "heartfelt" | "poetic" | "playful";
type QuoteLanguage = "English" | "Hindi" | "Hinglish";
type LocalizedLanguage = Exclude<QuoteLanguage, "English">;
type QuoteLength = "short" | "medium" | "long";
type ToneQuotes = Record<QuoteTone, string[]>;

const FESTIVAL_NAMES = ["Diwali", "Eid al-Fitr", "New Year", "Rakhi", "Holi", "Independence Day"];
const QUOTES: Record<string, Record<QuoteTone, string[]>> = {
  Diwali: {
    heartfelt: ["May every little light remind you how much brightness you bring to the people around you.", "Wishing you a home full of laughter, a heart full of hope, and a Diwali full of love."],
    poetic: ["May a thousand lamps make a sky of your home, and every wish find its way into the light.", "Where a diya glows, hope gathers. May yours shine on long after the night is through."],
    playful: ["May your sweets be plentiful, your diyas stay lit, and your group chat finally agree on plans.", "Wishing you sparkle, seconds of dessert, and absolutely no burnt ladoos."],
  },
  "Eid al-Fitr": {
    heartfelt: ["May this Eid bring your favourite people close and leave your heart a little fuller.", "May every shared meal, kind word, and warm embrace make this Eid one to remember."],
    poetic: ["A crescent in the sky, a little more grace in the heart, and the joy of finding your way home.", "May the moon mark a beginning filled with peace, generosity, and light."],
    playful: ["Wishing you a table full of treats and a plate nobody asks you to share.", "Eid plans: show up hungry, leave happy, and take the good sweets home."],
  },
  "New Year": {
    heartfelt: ["May the year ahead meet you gently and give you many reasons to be proud.", "Here is to fresh starts, familiar faces, and more ordinary days that feel wonderful."],
    poetic: ["A new page, still warm with possibility. May you fill it with what makes you feel alive.", "May every sunrise bring a small beginning and every season a story worth keeping."],
    playful: ["New year, same wonderful you, with a few more snacks and better plans.", "May your resolutions be kind, your calendar have breathing room, and your year be a good one."],
  },
  Rakhi: {
    heartfelt: ["Some bonds need no words; one small thread can hold a lifetime of love.", "To the person who has been my partner in mischief and my place to land: always grateful for you."],
    poetic: ["A thread around the wrist, a thousand memories around the heart.", "Across every mile and every year, a little thread finds its way home."],
    playful: ["You still owe me for all those childhood snacks. Happy Rakhi, favourite accomplice.", "Cheers to shared secrets, borrowed things, and a lifetime of sibling-level honesty."],
  },
  Holi: {
    heartfelt: ["May the colours you share today find their way into the days that follow.", "Here is to old friends, open doors, and the kind of joy that leaves colour everywhere."],
    poetic: ["Let joy spill like colour, let old worries fade, and let spring find you laughing.", "A sky of colour, a heart set free, and a little more wonder in everything we see."],
    playful: ["Wear the old clothes, protect the snacks, and trust absolutely nobody with a water balloon.", "Wishing you bright colours, big laughs, and a phone that survives the celebrations."],
  },
  "Independence Day": {
    heartfelt: ["May we honour the people who brought us here by building a kinder tomorrow together.", "Proud of where we come from, hopeful for where we can go, and grateful to share the journey."],
    poetic: ["May the tricolour remind us that courage, peace, and new beginnings belong together.", "A flag against the morning sky, and a million hopes rising with it."],
    playful: ["A little extra pride, a little extra colour, and one more reason to cheer together.", "Wishing you a joyful Independence Day and a playlist full of songs you know by heart."],
  },
};

const GENERAL_QUOTES: Record<QuoteTone, string[]> = {
  heartfelt: ["May this celebration bring your favourite people a little closer and leave your heart a little fuller.", "Wishing you a day full of warmth, good company, and moments worth keeping."],
  poetic: ["May this day leave a little more wonder in the ordinary and a little more light in every room.", "Some days stay with us like the last note of a favourite song. May this be one of them."],
  playful: ["Wishing you big smiles, excellent snacks, and a celebration story worth retelling.", "May the plans be easy, the treats be plenty, and the photos be mostly flattering."],
};

const LOCALIZED_QUOTES: Record<LocalizedLanguage, Record<string, ToneQuotes>> = {
  Hindi: {
    Diwali: {
      heartfelt: ["दीपों की यह रोशनी आपके जीवन में खुशियाँ और अपनों का साथ लेकर आए।", "आपका घर हँसी से और आपका दिल उम्मीद से भरा रहे। दीपावली की हार्दिक शुभकामनाएँ।"],
      poetic: ["हर दिया एक नई उम्मीद जगाए, हर रोशनी आपके सपनों तक पहुँच जाए।", "दीपों की कतारों में खुशियों का रास्ता मिले और हर आँगन प्रेम से जगमगाए।"],
      playful: ["मिठाइयाँ खूब हों, दीये देर तक जलें और पटाखों से ज़्यादा हँसी गूँजे।", "इस दिवाली मिठाई दो बार लें और खुशियाँ हर किसी के साथ बाँटें।"],
    },
    "Eid al-Fitr": {
      heartfelt: ["यह ईद आपके घर में सुकून, दिलों में मोहब्बत और अपनों के साथ ढेर सारी खुशियाँ लाए।", "ईद की हर मुलाक़ात आपके दिल को थोड़ा और खुशियों से भर दे। ईद मुबारक।"],
      poetic: ["चाँद की नर्म रोशनी में दुआएँ खिलें और हर घर तक मोहब्बत पहुँचे।", "ईद का चाँद नई उम्मीद लाए और हर दिल में अमन की रोशनी जगाए।"],
      playful: ["सेवइयाँ भरपूर हों और आपकी पसंदीदा मिठाई कोई छुपाकर न रखे। ईद मुबारक।", "ईद का प्लान: दिल खोलकर मिलें, भरपेट खाएँ और थोड़ी मिठाई घर भी ले जाएँ।"],
    },
    "New Year": {
      heartfelt: ["नया साल आपके लिए सुकून, नई उम्मीदें और गर्व करने के ढेरों पल लेकर आए।", "आने वाला साल अपनों की हँसी और छोटी-छोटी खुशियों से भरा रहे।"],
      poetic: ["नया साल एक खुला पन्ना है—इसे उन कहानियों से भरें जो दिल को रोशन करें।", "हर सुबह नई उम्मीद लाए और हर मौसम याद रखने लायक कहानी बने।"],
      playful: ["नया साल, वही प्यारे आप—बस थोड़ा बेहतर प्लान और ढेर सारे स्नैक्स।", "आपके नए साल के वादे आसान हों और मिठाइयों की कोई गिनती न हो।"],
    },
    Rakhi: {
      heartfelt: ["कलाई पर एक धागा, दिल में बचपन भर की यादें। हमेशा साथ रहने के लिए शुक्रिया।", "तुम मेरे साथी, मेरी ताकत और मेरी सबसे प्यारी यादों का हिस्सा हो। रक्षाबंधन मुबारक।"],
      poetic: ["राखी का धागा छोटा सही, इसमें सिमटा प्यार उम्रभर का है।", "दूरी कितनी भी हो, राखी का धागा दिलों को घर तक ले आता है।"],
      playful: ["बचपन के सारे राज़ सुरक्षित हैं—बस पुराने उधार की मिठाई बाकी है।", "मेरे पसंदीदा साथी-ए-शरारत को राखी की ढेर सारी शुभकामनाएँ।"],
    },
    Holi: {
      heartfelt: ["रंगों की तरह आपकी खुशियाँ भी हर दिन और गहरी होती जाएँ।", "अपनों की हँसी, खुले दिल और खूबसूरत रंगों वाली होली मुबारक।"],
      poetic: ["रंगों में पुराने ग़म घुलें और हँसी से हर मौसम खिल उठे।", "आज आसमान रंगीन हो, दिल आज़ाद हो और हर पल में थोड़ा जादू हो।"],
      playful: ["पुराने कपड़े पहनें, फोन बचाएँ और पानी के गुब्बारों से किसी पर भरोसा न करें।", "आपकी होली रंगीन हो, हँसी ज़ोरदार और गुझिया भरपूर।"],
    },
    "Independence Day": {
      heartfelt: ["आज़ादी का सम्मान हम एक बेहतर और दयालु कल बनाकर करें।", "अपनी मिट्टी पर गर्व, आने वाले कल से उम्मीद और साथ चलने की खुशी।"],
      poetic: ["तिरंगे के रंग साहस, शांति और नई उम्मीदों की कहानी सुनाएँ।", "सुबह की हवा में लहराता तिरंगा, और उसके साथ उठती करोड़ों उम्मीदें।"],
      playful: ["आज गर्व थोड़ा ज़्यादा, रंग थोड़े चमकीले और जश्न सबके साथ।", "देशभक्ति के गाने तेज़ रखें और आज़ादी का दिन मुस्कान के साथ मनाएँ।"],
    },
  },
  Hinglish: {
    Diwali: {
      heartfelt: ["Diye ki har roshni aapki zindagi mein khushiyan aur apno ka saath laaye.", "Ghar hansi se, dil umeed se aur Diwali pyaar se bhari rahe."],
      poetic: ["Har diya ek nayi umeed jagaye, har roshni aapke sapnon tak jaaye.", "Roshni ki raahon par khushiyan milen aur har aangan pyaar se jagmagaaye."],
      playful: ["Mithai bharpoor ho, diye der tak jalen aur hasi sabse zyada chamke.", "Is Diwali mithai second round mein bhi lena, calories chhutti par hain."],
    },
    "Eid al-Fitr": {
      heartfelt: ["Yeh Eid ghar mein sukoon, dilon mein mohabbat aur apno ke saath khushiyan laaye.", "Har mulaqat dil ko thoda aur khush kare. Eid Mubarak!"],
      poetic: ["Chaand ki roshni mein duaayein khilen aur har ghar tak mohabbat pahunche.", "Eid ka chaand nayi umeed laaye aur dilon mein aman jagaye."],
      playful: ["Seviyan extra ho aur aapki favourite mithai koi chhupa kar na rakhe.", "Eid plan: dil se milo, pet bhar ke khao aur mithai parcel karna mat bhoolo."],
    },
    "New Year": {
      heartfelt: ["Naya saal sukoon, nayi umeedein aur proud feel karne ke moments laaye.", "Aane wala saal apno ki hasi aur chhoti-chhoti khushiyon se bhara rahe."],
      poetic: ["Naya saal ek khula panna hai—use dil ko roshan karne wali kahaniyon se bharo.", "Har subah nayi umeed laaye aur har season ek yaadgaar kahani bane."],
      playful: ["Naya saal, wahi awesome aap—bas plans thode better aur snacks extra.", "Resolutions gentle hon, calendar relaxed ho aur treats unlimited."],
    },
    Rakhi: {
      heartfelt: ["Kalai par ek dhaaga, dil mein bachpan bhar ki yaadein. Hamesha saath ke liye thank you.", "Tum partner in crime bhi ho aur meri safe place bhi. Rakhi Mubarak!"],
      poetic: ["Rakhi ka dhaaga chhota sahi, par ismein pyaar poori zindagi ka hai.", "Dooriyan chahe jitni hon, Rakhi ka dhaaga dil ko ghar le aata hai."],
      playful: ["Bachpan ke saare secrets safe hain—bas purani treat abhi bhi due hai.", "Mere favourite partner-in-mischief ko Rakhi ki dher saari wishes."],
    },
    Holi: {
      heartfelt: ["Aaj ke rang aane wale har din ko thoda aur khushnuma bana dein.", "Apno ki hasi, khule dil aur beautiful colours wali Holi ho."],
      poetic: ["Rangon mein purani fikrein ghulen aur hasi se har mausam khil jaaye.", "Aaj aasman rangin ho, dil azaad ho aur har pal mein thoda magic ho."],
      playful: ["Purane kapde pehno, phone bachao aur water balloons ke maamle mein kisi par trust mat karo.", "Holi colourful ho, hasi loud ho aur gujiya unlimited."],
    },
    "Independence Day": {
      heartfelt: ["Azaadi ka best celebration ek kinder aur better kal milkar banana hai.", "Apni mitti par pride, aane wale kal se hope aur saath chalne ki khushi."],
      poetic: ["Tirange ke rang courage, peace aur new beginnings ki kahani sunaayein.", "Subah ki hawa mein tiranga lehraye aur saath mein lakhon umeedein."],
      playful: ["Aaj pride extra, colours bright aur celebration sabke saath.", "Patriotic playlist loud rakho aur Independence Day smile ke saath manao."],
    },
  },
};

const GENERAL_LOCALIZED_QUOTES: Record<LocalizedLanguage, ToneQuotes> = {
  Hindi: {
    heartfelt: ["यह उत्सव अपनों को करीब लाए और आपका दिल खुशियों से भर दे।", "आपका दिन प्यार, अच्छी यादों और अपनों की मुस्कान से सजा रहे।"],
    poetic: ["आज का दिन हर साधारण पल में थोड़ी रोशनी और थोड़ी उम्मीद भर दे।", "कुछ दिन दिल में पसंदीदा गीत की आखिरी धुन जैसे रह जाते हैं—यह दिन भी ऐसा ही हो।"],
    playful: ["आपका दिन मुस्कान, स्वादिष्ट पकवान और सुनाने लायक यादों से भरा रहे।", "प्लान आसान हों, पकवान भरपूर और तस्वीरें सबकी पसंद की आएँ।"],
  },
  Hinglish: {
    heartfelt: ["Yeh celebration apno ko paas laaye aur dil ko khushiyon se bhar de.", "Aapka din pyaar, achhi yaadon aur apno ki smile se saja rahe."],
    poetic: ["Aaj ka din har ordinary pal mein thodi roshni aur hope bhar de.", "Kuch din favourite song ki last tune jaise dil mein reh jaate hain—yeh din bhi aisa ho."],
    playful: ["Aapka din smiles, tasty treats aur sunane layak stories se bhara rahe.", "Plans easy hon, snacks plenty aur photos sabki favourite."],
  },
};

function quoteCollectionName(eventName: string) {
  if (/diwali|deepavali/i.test(eventName)) return "Diwali";
  if (/eid.*fitr|fitr.*eid/i.test(eventName)) return "Eid al-Fitr";
  if (/raksha bandhan|\brakhi\b/i.test(eventName)) return "Rakhi";
  if (/\bholi\b/i.test(eventName)) return "Holi";
  if (/new year/i.test(eventName)) return "New Year";
  if (/independence day/i.test(eventName)) return "Independence Day";
  return eventName;
}

async function copyToClipboard(message: string) {
  try {
    await navigator.clipboard.writeText(message);
  } catch {
    const field = document.createElement("textarea");
    field.value = message;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
}

export function QuoteMaker({
  selectedEvent,
  eventNames = [],
}: {
  selectedEvent?: string | null;
  eventNames?: string[];
}) {
  const [eventName, setEventName] = useState(FESTIVAL_NAMES[0]);
  const [tone, setTone] = useState<QuoteTone>("heartfelt");
  const [language, setLanguage] = useState<QuoteLanguage>("English");
  const [length, setLength] = useState<QuoteLength>("medium");
  const [recipient, setRecipient] = useState("");
  const [details, setDetails] = useState("");
  const [includeEmoji, setIncludeEmoji] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [generatedQuote, setGeneratedQuote] = useState("");
  const [editedQuote, setEditedQuote] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [generation, setGeneration] = useState<"ready" | "generating" | "ai" | "local">("ready");
  const [notice, setNotice] = useState("");
  const quoteKey = quoteCollectionName(eventName);
  const quoteOptions = language === "English"
    ? QUOTES[quoteKey]?.[tone] ?? GENERAL_QUOTES[tone]
    : LOCALIZED_QUOTES[language][quoteKey]?.[tone] ?? GENERAL_LOCALIZED_QUOTES[language][tone];
  const fallbackQuote = quoteOptions[quoteIndex % quoteOptions.length];
  const dedication = recipient.trim()
    ? language === "Hindi" ? `${recipient.trim()} के लिए: ` : language === "Hinglish" ? `${recipient.trim()} ke liye: ` : `For ${recipient.trim()}: `
    : "";
  const baseQuote = generatedQuote || `${dedication}${fallbackQuote}${includeEmoji ? " ✨" : ""}`;
  const quote = editedQuote ?? baseQuote;
  const allEventNames = Array.from(new Set([...FESTIVAL_NAMES, ...eventNames]));

  useEffect(() => {
    if (selectedEvent) {
      setEventName(selectedEvent);
      setGeneratedQuote("");
      setEditedQuote(null);
      setQuoteIndex(0);
      setIsEditing(false);
      setGeneration("ready");
    }
  }, [selectedEvent]);

  function resetGeneratedQuote() {
    setGeneratedQuote("");
    setEditedQuote(null);
    setIsEditing(false);
    setGeneration("ready");
  }

  function makeAnotherQuote() {
    setQuoteIndex((index) => (index + 1) % quoteOptions.length);
    setGeneratedQuote("");
    setEditedQuote(null);
    setIsEditing(false);
    setGeneration("ready");
    setNotice("");
  }

  async function generateQuote() {
    setGeneration("generating");
    setNotice("");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName, tone, language, length, recipient, details, includeEmoji }),
      });
      const result = await response.json() as { quote?: string; error?: string };
      if (!response.ok || !result.quote) {
        throw new Error(result.error ?? "AI generation is unavailable");
      }

      setGeneratedQuote(result.quote);
      setEditedQuote(null);
      setIsEditing(false);
      setGeneration("ai");
    } catch (error) {
      setGeneratedQuote(`${dedication}${fallbackQuote}${includeEmoji ? " ✨" : ""}`);
      setEditedQuote(null);
      setIsEditing(false);
      setGeneration("local");
      setNotice(error instanceof Error && error.message.includes("GEMINI_API_KEY")
        ? `Curated ${language} quote ready. Add GEMINI_API_KEY to enable AI generation.`
        : `AI is unavailable right now. A curated ${language} quote is ready instead.`);
    }
  }

  function announceCopy(message: string) {
    void copyToClipboard(message).then(() => {
      setNotice("Quote copied to your clipboard.");
      window.setTimeout(() => setNotice(""), 3200);
    });
  }

  return (
    <section className="quote-section" id="quote-studio">
      <div className="quote-section-inner">
        <div className="quote-intro">
          <div className="eyebrow"><span className="eyebrow-line" /> A FEW WORDS, MADE YOURS</div>
          <h2>A note for<br /><em>the moment.</em></h2>
          <p>Choose a celebration, set the mood, and make a little message for someone who matters.</p>
          <span className="quote-ai-note"><span className={`ai-status-dot ${generation === "ai" ? "ai-status-active" : ""}`} />
            {generation === "ai" ? "Original AI-written quote" : "AI generation · your choices, your words"}
          </span>
        </div>
        <div className="quote-maker">
          <div className="quote-controls">
            <label className="quote-field">
              <span>Celebration</span>
              <select value={eventName} onChange={(event) => { setEventName(event.target.value); setQuoteIndex(0); resetGeneratedQuote(); }}>
                {allEventNames.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <label className="quote-field">
              <span>Feeling</span>
              <select value={tone} onChange={(event) => { setTone(event.target.value as QuoteTone); resetGeneratedQuote(); }}>
                <option value="heartfelt">Heartfelt</option>
                <option value="poetic">Poetic</option>
                <option value="playful">Playful</option>
              </select>
            </label>
            <label className="quote-field">
              <span>Language</span>
              <select value={language} onChange={(event) => { setLanguage(event.target.value as QuoteLanguage); resetGeneratedQuote(); }}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Hinglish">Hinglish</option>
              </select>
            </label>
            <label className="quote-field">
              <span>Length</span>
              <select value={length} onChange={(event) => { setLength(event.target.value as QuoteLength); resetGeneratedQuote(); }}>
                <option value="short">Short</option>
                <option value="medium">A few lines</option>
                <option value="long">A little more</option>
              </select>
            </label>
            <label className="quote-field">
              <span>For someone special <small>Optional</small></span>
              <input maxLength={48} onChange={(event) => { setRecipient(event.target.value); resetGeneratedQuote(); }} placeholder="Add their name" value={recipient} />
            </label>
            <label className="quote-field">
              <span>Include a personal detail <small>Optional</small></span>
              <input maxLength={140} onChange={(event) => { setDetails(event.target.value); resetGeneratedQuote(); }} placeholder="A memory, wish, or inside joke" value={details} />
            </label>
            <label className="quote-emoji-toggle">
              <input type="checkbox" checked={includeEmoji} onChange={(event) => { setIncludeEmoji(event.target.checked); resetGeneratedQuote(); }} />
              <span>Add a little sparkle</span>
              <Sparkles aria-hidden="true" />
            </label>
            <button className="quote-generate" disabled={generation === "generating"} type="button" onClick={() => void generateQuote()}>
              <WandSparkles aria-hidden="true" />
              {generation === "generating" ? "Creating your quote…" : "Generate with AI"}
            </button>
            <button className="quote-another" type="button" onClick={makeAnotherQuote}>
              <RefreshCw aria-hidden="true" /> Try another quote
            </button>
            {generation === "local" && <p className="quote-fallback-note">Curated fallback · Add an API key to turn on AI.</p>}
          </div>
          <div className="quote-preview">
            <span className="quote-mark" aria-hidden="true">“</span>
            {isEditing ? (
              <textarea
                aria-label="Edit your quote"
                className="quote-editor"
                maxLength={600}
                onChange={(event) => setEditedQuote(event.target.value)}
                value={editedQuote ?? quote}
              />
            ) : <p className="quote-text">{quote}</p>}
            <p className="quote-attribution">A {tone} note for {eventName}</p>
            <div className="quote-actions">
              {isEditing ? (
                <>
                  <button className="quote-copy" type="button" onClick={() => { setEditedQuote(null); setIsEditing(false); }}>
                    <X aria-hidden="true" /> Cancel
                  </button>
                  <button className="quote-edit-button" type="button" disabled={!editedQuote?.trim()} onClick={() => { setEditedQuote(editedQuote?.trim() ?? ""); setIsEditing(false); }}>
                    <Check aria-hidden="true" /> Save edit
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="quote-copy" onClick={() => announceCopy(quote)}>
                    <Copy aria-hidden="true" /> Copy quote
                  </button>
                  <button className="quote-edit-button" type="button" onClick={() => { setEditedQuote(quote); setIsEditing(true); }}>
                    <Pencil aria-hidden="true" /> Edit quote
                  </button>
                  <ShareOptions message={quote} onShared={() => setNotice("Quote copied and ready to share.")} />
                </>
              )}
            </div>
            <p className="quote-notice" role="status" aria-live="polite">{notice}</p>
          </div>
        </div>
      </div>
    </section>
  );
}