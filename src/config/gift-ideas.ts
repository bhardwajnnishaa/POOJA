import type { FestivalId, PriceRange, RetailerId } from "@/config/affiliates";
import type { PersonalDateKind } from "@/lib/personal-dates";

export type BudgetId = "under500" | "under1000" | "premium";

export const BUDGETS: { id: BudgetId; label: string; price: PriceRange }[] = [
  { id: "under500", label: "Under ₹500", price: { max: 500 } },
  { id: "under1000", label: "₹500 to ₹1,000", price: { min: 500, max: 1000 } },
  { id: "premium", label: "Above ₹1,000", price: { min: 1000 } },
];

export type GiftIdea = {
  name: string;
  why: string;
  store: RetailerId;
  term: string;
};

type BudgetIdeas = Record<BudgetId, GiftIdea[]>;

export const GIFT_IDEAS: Record<FestivalId, BudgetIdeas> = {
  lohri: {
    under500: [
      { name: "Rewri and gajak box", why: "The classic Lohri sweets to share around the bonfire.", store: "amazon", term: "rewri gajak gift box" },
      { name: "Til and peanut chikki", why: "A crunchy winter treat for family and friends.", store: "amazon", term: "til peanut chikki" },
      { name: "Woollen socks set", why: "Useful on a cold January night.", store: "amazon", term: "woollen socks pack" },
    ],
    under1000: [
      { name: "Phulkari dupatta", why: "Bright Punjabi embroidery for the Lohri evening.", store: "meesho", term: "phulkari dupatta" },
      { name: "Dry fruit box", why: "A warm winter gift for elders.", store: "amazon", term: "dry fruits gift box" },
      { name: "Soft shawl", why: "Keeps you warm by the fire.", store: "myntra", term: "women shawl" },
    ],
    premium: [
      { name: "Punjabi suit", why: "A festive outfit for Lohri celebrations.", store: "myntra", term: "punjabi suit" },
      { name: "Men's Nehru jacket", why: "Smart and warm for the evening.", store: "myntra", term: "men nehru jacket" },
      { name: "Fire pit for the balcony", why: "A safe, small bonfire for apartment homes.", store: "amazon", term: "outdoor fire pit" },
    ],
  },
  makarSankranti: {
    under500: [
      { name: "Kites and manja set", why: "Kite flying is the heart of Uttarayan.", store: "amazon", term: "kites with manja set" },
      { name: "Til-gud laddoo", why: "\"Til-gud ghya, god god bola\" — sweets to share.", store: "amazon", term: "til gud laddoo" },
      { name: "Cap and sunglasses", why: "For a long day on the terrace.", store: "amazon", term: "sun cap and sunglasses" },
    ],
    under1000: [
      { name: "Brass Pongal pot", why: "For cooking sweet Pongal the traditional way.", store: "amazon", term: "brass pongal pot" },
      { name: "Kite reel (firki)", why: "Makes flying and winding manja easier.", store: "amazon", term: "kite firki reel" },
      { name: "Festive kurta", why: "Fresh clothes for the harvest festival.", store: "myntra", term: "men kurta" },
    ],
    premium: [
      { name: "Cotton saree", why: "A festive outfit for Sankranti and Pongal.", store: "myntra", term: "cotton saree" },
      { name: "Sweets hamper", why: "A generous gift for relatives.", store: "amazon", term: "sweets gift hamper" },
      { name: "Silk dhoti and shirt set", why: "Traditional wear for Pongal.", store: "amazon", term: "silk dhoti shirt set" },
    ],
  },
  mahaShivratri: {
    under500: [
      { name: "Rudraksha mala", why: "Used for chanting \"Om Namah Shivaya\".", store: "amazon", term: "rudraksha mala" },
      { name: "Puja samagri kit", why: "Everything for the Shivling abhishek.", store: "amazon", term: "mahashivratri puja samagri kit" },
      { name: "Vrat snacks", why: "Makhana and dry fruits for the fast.", store: "amazon", term: "roasted makhana" },
    ],
    under1000: [
      { name: "Brass Shivling", why: "For daily puja at home.", store: "amazon", term: "brass shivling" },
      { name: "Copper lota", why: "For offering water on the Shivling.", store: "amazon", term: "copper lota for puja" },
      { name: "White kurta", why: "Simple and pure for the temple visit.", store: "myntra", term: "white kurta men" },
    ],
    premium: [
      { name: "Shiva wall art", why: "A calm, spiritual touch for the home.", store: "amazon", term: "lord shiva wall painting" },
      { name: "Brass diya set", why: "For the night-long jagran.", store: "amazon", term: "brass diya set" },
      { name: "Silk saree", why: "A festive outfit for the temple.", store: "myntra", term: "silk saree" },
    ],
  },
  ramNavami: {
    under500: [
      { name: "Ram Darbar photo frame", why: "For the Ram Navami puja corner.", store: "amazon", term: "ram darbar photo frame" },
      { name: "Puja thali set", why: "For the midday aarti.", store: "amazon", term: "puja thali set" },
      { name: "Panjiri prasad mix", why: "A traditional bhog for the day.", store: "amazon", term: "panjiri" },
    ],
    under1000: [
      { name: "Ramcharitmanas", why: "For reading on Lord Rama's birthday.", store: "amazon", term: "ramcharitmanas book" },
      { name: "Brass bell", why: "For daily puja at home.", store: "amazon", term: "brass puja bell" },
      { name: "Festive kurta", why: "For the temple and the shobha yatra.", store: "myntra", term: "men kurta" },
    ],
    premium: [
      { name: "Ram Darbar idol", why: "A lasting idol for the home temple.", store: "amazon", term: "ram darbar idol brass" },
      { name: "Silk saree", why: "A festive outfit for the puja.", store: "myntra", term: "silk saree" },
      { name: "Wooden home temple", why: "A proper place for daily worship.", store: "amazon", term: "wooden mandir for home" },
    ],
  },
  eidAlAdha: {
    under500: [
      { name: "Attar", why: "A traditional Eid fragrance.", store: "amazon", term: "attar perfume" },
      { name: "Eid greeting cards", why: "For Eidi and family visits.", store: "amazon", term: "eid mubarak cards" },
      { name: "Sewai and dates", why: "Sweet treats for guests.", store: "amazon", term: "sewai and dates" },
    ],
    under1000: [
      { name: "Prayer mat", why: "A soft, useful gift for daily namaz.", store: "amazon", term: "prayer mat" },
      { name: "Dry fruit box", why: "A classic gift for relatives.", store: "amazon", term: "dry fruits gift box" },
      { name: "Embroidered dupatta", why: "A festive touch for the Eid outfit.", store: "meesho", term: "embroidered dupatta" },
    ],
    premium: [
      { name: "Pathani suit", why: "Smart traditional wear for Eid prayers.", store: "ajio", term: "pathani suit men" },
      { name: "Anarkali suit", why: "A festive outfit for family visits.", store: "myntra", term: "anarkali suit" },
      { name: "Serving tray set", why: "For hosting the Eid feast.", store: "amazon", term: "serving tray set" },
    ],
  },
  teej: {
    under500: [
      { name: "Green glass bangles", why: "Green bangles are part of the Teej shringar.", store: "amazon", term: "green glass bangles" },
      { name: "Mehendi cones", why: "No Teej is complete without mehendi.", store: "amazon", term: "natural mehendi cones" },
      { name: "Bindi and sindoor set", why: "A small shringar gift.", store: "amazon", term: "bindi sindoor set" },
    ],
    under1000: [
      { name: "Lehariya dupatta", why: "The classic Teej print from Rajasthan.", store: "meesho", term: "lehariya dupatta" },
      { name: "Kundan jewellery set", why: "Festive jewellery for the celebration.", store: "amazon", term: "kundan jewellery set" },
      { name: "Shringar gift box", why: "A thoughtful gift for a wife or sister.", store: "amazon", term: "solah shringar kit" },
    ],
    premium: [
      { name: "Green lehariya saree", why: "Green is the colour of Hariyali Teej.", store: "myntra", term: "green lehariya saree" },
      { name: "Silver payal", why: "A lasting Teej gift.", store: "amazon", term: "silver payal" },
      { name: "Swing (jhula) for the balcony", why: "Swings are a Teej tradition.", store: "amazon", term: "balcony swing jhula" },
    ],
  },
  janmashtami: {
    under500: [
      { name: "Laddu Gopal dress", why: "A new poshak for Kanha's birthday.", store: "meesho", term: "laddu gopal dress" },
      { name: "Bansuri (flute)", why: "Krishna's flute, for decoration or play.", store: "amazon", term: "bansuri flute" },
      { name: "Peacock feather set", why: "For the jhanki and decoration.", store: "amazon", term: "peacock feathers decoration" },
    ],
    under1000: [
      { name: "Laddu Gopal jhula", why: "A cradle for the midnight celebration.", store: "amazon", term: "laddu gopal jhula" },
      { name: "Kids Krishna costume", why: "For school events and photos.", store: "amazon", term: "kids krishna costume" },
      { name: "Makhan mishri bowl set", why: "For Kanha's favourite bhog.", store: "amazon", term: "brass bowl set for bhog" },
    ],
    premium: [
      { name: "Brass Laddu Gopal idol", why: "A lasting idol for the home temple.", store: "amazon", term: "brass laddu gopal idol" },
      { name: "Radha Krishna painting", why: "A beautiful piece for the living room.", store: "amazon", term: "radha krishna painting" },
      { name: "Festive kurta set", why: "For the midnight puja.", store: "myntra", term: "kurta pyjama set" },
    ],
  },
  onam: {
    under500: [
      { name: "Pookalam flower stencils", why: "Makes a neat flower carpet easy.", store: "amazon", term: "pookalam rangoli stencil" },
      { name: "Banana chips and sharkara varatti", why: "Classic Onam sadya snacks.", store: "amazon", term: "kerala banana chips" },
      { name: "Brass nilavilakku (small)", why: "The traditional Kerala lamp.", store: "amazon", term: "nilavilakku small" },
    ],
    under1000: [
      { name: "Kasavu mundu", why: "Traditional Onam wear for men.", store: "ajio", term: "kasavu mundu" },
      { name: "Uruli bowl", why: "Fill it with flowers for the home.", store: "amazon", term: "brass uruli" },
      { name: "Banana leaf plates", why: "Serve the sadya the traditional way.", store: "amazon", term: "banana leaf plates" },
    ],
    premium: [
      { name: "Kasavu saree", why: "The classic off-white and gold Onam saree.", store: "myntra", term: "kerala kasavu saree" },
      { name: "Brass nilavilakku (large)", why: "A lasting lamp for the home.", store: "amazon", term: "brass nilavilakku large" },
      { name: "Couple's Onam set", why: "Matching kasavu outfits for the family.", store: "amazon", term: "kerala couple dress set" },
    ],
  },
  ganeshChaturthi: {
    under500: [
      { name: "Modak mould", why: "Make Bappa's favourite modaks at home.", store: "amazon", term: "modak mould" },
      { name: "Ganpati decoration flowers", why: "Bright artificial garlands for the mandap.", store: "amazon", term: "artificial flower garland" },
      { name: "Aarti book and diya", why: "For the daily aarti.", store: "amazon", term: "ganpati aarti book" },
    ],
    under1000: [
      { name: "Eco-friendly Ganesh idol", why: "A clay idol that dissolves safely at visarjan.", store: "amazon", term: "eco friendly ganesh idol" },
      { name: "Ganpati mandap backdrop", why: "A ready decoration for the home.", store: "amazon", term: "ganpati decoration backdrop" },
      { name: "LED string lights", why: "Lights up the pandal or home.", store: "amazon", term: "led string lights" },
    ],
    premium: [
      { name: "Brass Ganesh idol", why: "A lasting idol for the home temple.", store: "amazon", term: "brass ganesh idol" },
      { name: "Silk saree", why: "A festive outfit for aarti and visits.", store: "myntra", term: "silk saree" },
      { name: "Men's kurta set", why: "Fresh clothes for Bappa's welcome.", store: "myntra", term: "men kurta set" },
    ],
  },
  diwali: {
    under500: [
      { name: "Clay diyas set", why: "Every home lights diyas on Diwali night.", store: "amazon", term: "clay diyas for diwali" },
      { name: "Rangoli colours and stencils", why: "Easy for kids and beginners to make a neat rangoli.", store: "amazon", term: "rangoli colours with stencils" },
      { name: "Scented candles", why: "A small, warm gift for friends and neighbours.", store: "amazon", term: "scented candles gift set" },
    ],
    under1000: [
      { name: "Dry fruit gift box", why: "A classic Diwali gift for relatives and colleagues.", store: "amazon", term: "dry fruits gift box diwali" },
      { name: "LED string lights", why: "Brightens balconies and windows for the whole season.", store: "amazon", term: "led string lights for decoration" },
      { name: "Brass puja thali set", why: "Useful for Lakshmi Puja and lasts for years.", store: "amazon", term: "brass puja thali set" },
    ],
    premium: [
      { name: "Silver coin", why: "A traditional Dhanteras and Diwali purchase.", store: "amazon", term: "silver coin lakshmi ganesh" },
      { name: "Decorative urli bowl", why: "Fill it with flowers and floating diyas at the entrance.", store: "amazon", term: "decorative urli bowl" },
      { name: "Silk saree", why: "A festive outfit for Diwali puja and family visits.", store: "myntra", term: "silk saree" },
    ],
  },
  eid: {
    under500: [
      { name: "Attar", why: "A thoughtful Eid gift that many people love to wear.", store: "amazon", term: "attar perfume" },
      { name: "Dates gift box", why: "Shared at home and with guests through the festival.", store: "amazon", term: "premium dates gift box" },
      { name: "Mehendi cones", why: "For Chand Raat mehendi with family and friends.", store: "amazon", term: "natural mehendi cones" },
    ],
    under1000: [
      { name: "Dry fruit gift box", why: "Perfect for sheer khurma and for visiting relatives.", store: "amazon", term: "dry fruits gift box" },
      { name: "Kids' kurta pyjama", why: "Children love dressing up in new clothes on Eid.", store: "myntra", term: "kids kurta pyjama" },
      { name: "Serving bowl set", why: "Handy for hosting Eid lunch and dinner.", store: "amazon", term: "serving bowl set" },
    ],
    premium: [
      { name: "Pathani suit", why: "A smart Eid outfit for men.", store: "ajio", term: "pathani suit men" },
      { name: "Anarkali suit", why: "An elegant Eid outfit for women.", store: "myntra", term: "women anarkali suit" },
      { name: "Perfume gift set", why: "A premium gift for someone special.", store: "nykaa", term: "perfume gift set" },
    ],
  },
  newYear: {
    under500: [
      { name: "Planner or diary", why: "Helps start the new year organised.", store: "amazon", term: "planner diary undated" },
      { name: "Party decoration kit", why: "Balloons and banners for a New Year's Eve party at home.", store: "amazon", term: "new year party decoration kit" },
      { name: "Coffee mug", why: "A simple gift for friends and colleagues.", store: "amazon", term: "coffee mug gift" },
    ],
    under1000: [
      { name: "Yoga mat", why: "For anyone with a fitness resolution.", store: "amazon", term: "yoga mat" },
      { name: "Water bottle", why: "A practical gift for a healthier new year.", store: "amazon", term: "insulated water bottle" },
      { name: "Board game", why: "Fun for family and friends on New Year's Eve.", store: "amazon", term: "board game for family" },
    ],
    premium: [
      { name: "Smartwatch", why: "Tracks steps and sleep for new-year fitness goals.", store: "amazon", term: "smartwatch" },
      { name: "Wireless earbuds", why: "A popular gift for music lovers.", store: "amazon", term: "wireless earbuds" },
      { name: "Party outfit", why: "Look good at the New Year's Eve party.", store: "ajio", term: "party wear" },
    ],
  },
  rakhi: {
    under500: [
      { name: "Rakhi with roli and chawal", why: "Everything needed for the Rakhi ritual in one pack.", store: "amazon", term: "rakhi set with roli chawal" },
      { name: "Chocolate gift box", why: "A sweet return gift for a sister or brother.", store: "amazon", term: "chocolate gift box" },
      { name: "Kids' cartoon rakhi", why: "Little brothers love rakhis with their favourite characters.", store: "amazon", term: "kids cartoon rakhi" },
    ],
    under1000: [
      { name: "Rakhi gift hamper", why: "Rakhi, sweets and a small gift together.", store: "amazon", term: "rakhi gift hamper" },
      { name: "Wallet for brother", why: "A useful gift he will carry every day.", store: "amazon", term: "men leather wallet" },
      { name: "Makeup gift set for sister", why: "A popular return gift for sisters.", store: "nykaa", term: "makeup gift set" },
    ],
    premium: [
      { name: "Silver rakhi", why: "A rakhi that can be kept as a keepsake.", store: "amazon", term: "silver rakhi" },
      { name: "Wrist watch", why: "A lasting gift for a brother or sister.", store: "amazon", term: "wrist watch gift" },
      { name: "Handbag for sister", why: "A stylish gift she will use often.", store: "myntra", term: "women handbag" },
    ],
  },
  holi: {
    under500: [
      { name: "Herbal gulal", why: "Gentler on skin than chemical colours.", store: "amazon", term: "herbal gulal holi colours" },
      { name: "Pichkari", why: "Kids' favourite part of Holi.", store: "amazon", term: "pichkari for holi" },
      { name: "Sunscreen", why: "Apply before playing to protect your skin.", store: "purplle", term: "sunscreen spf 50" },
    ],
    under1000: [
      { name: "White cotton kurta", why: "The classic Holi outfit that shows off every colour.", store: "myntra", term: "white cotton kurta" },
      { name: "Waterproof phone pouch", why: "Keeps your phone safe while you play.", store: "amazon", term: "waterproof mobile pouch" },
      { name: "Hair oil and skin care", why: "Oil your hair and skin first so colours wash off easily.", store: "nykaa", term: "hair oil" },
    ],
    premium: [
      { name: "Bluetooth party speaker", why: "Holi songs for the whole society.", store: "amazon", term: "bluetooth party speaker" },
      { name: "Thandai and sweets hamper", why: "A festive gift for friends and family.", store: "amazon", term: "holi gift hamper" },
      { name: "Ethnic outfit set", why: "For Holi gatherings and photos.", store: "ajio", term: "white ethnic set" },
    ],
  },
  independenceDay: {
    under500: [
      { name: "Tricolour badges", why: "Easy to wear for school and office celebrations.", store: "amazon", term: "tricolour badge" },
      { name: "Books on freedom fighters", why: "A great way for kids to learn about India's history.", store: "amazon", term: "freedom fighters book for kids" },
      { name: "Tricolour wristbands", why: "A simple gift for children and students.", store: "amazon", term: "tricolour wristband" },
    ],
    under1000: [
      { name: "Khadi kurta", why: "Khadi is closely linked with India's freedom movement.", store: "myntra", term: "khadi kurta" },
      { name: "Tricolour dupatta", why: "For Independence Day programmes and events.", store: "meesho", term: "tricolour dupatta" },
      { name: "Indian history book", why: "Learn the story behind 15 August 1947.", store: "amazon", term: "indian freedom struggle book" },
    ],
    premium: [
      { name: "Handloom saree", why: "Supports Indian weavers and traditional crafts.", store: "myntra", term: "handloom saree" },
      { name: "Handicraft home decor", why: "Celebrates Indian craftsmanship.", store: "amazon", term: "indian handicraft home decor" },
      { name: "Indian history book set", why: "A lasting gift for readers of any age.", store: "amazon", term: "indian history books set" },
    ],
  },
  navratri: {
    under500: [
      { name: "Dandiya sticks", why: "Ready for garba and dandiya nights.", store: "amazon", term: "dandiya sticks" },
      { name: "Puja samagri kit", why: "Everything needed for Ghatasthapana and daily puja.", store: "amazon", term: "navratri puja samagri kit" },
      { name: "Oxidised jewellery", why: "Completes the garba look.", store: "amazon", term: "oxidised jewellery set for women" },
    ],
    under1000: [
      { name: "Chaniya choli", why: "The classic outfit for garba nights.", store: "meesho", term: "chaniya choli" },
      { name: "Men's kediyu kurta", why: "Traditional garba wear for men.", store: "amazon", term: "kediyu kurta for men" },
      { name: "Brass kalash", why: "Used for Ghatasthapana on the first day.", store: "amazon", term: "brass kalash for puja" },
    ],
    premium: [
      { name: "Designer chaniya choli", why: "A standout outfit for all nine nights.", store: "myntra", term: "lehenga choli" },
      { name: "Durga idol", why: "A lasting piece for the home temple.", store: "amazon", term: "durga idol for home" },
      { name: "Festive silk saree", why: "For Ashtami and Navami puja.", store: "myntra", term: "silk saree" },
    ],
  },
  dussehra: {
    under500: [
      { name: "Puja thali set", why: "For Dussehra and Shastra puja at home.", store: "amazon", term: "puja thali set" },
      { name: "Marigold toran", why: "A bright door decoration for the festival.", store: "amazon", term: "marigold toran door hanging" },
      { name: "Kids' Ramayana book", why: "Tells children the story behind Dussehra.", store: "amazon", term: "ramayana book for kids" },
    ],
    under1000: [
      { name: "Sweets gift box", why: "Shared with family and neighbours after Ravan dahan.", store: "amazon", term: "sweets gift box" },
      { name: "Men's kurta", why: "A smart outfit for Dussehra celebrations.", store: "myntra", term: "men kurta" },
      { name: "Women's ethnic suit", why: "A festive look for the day.", store: "myntra", term: "women ethnic suit" },
    ],
    premium: [
      { name: "Ram Darbar idol", why: "A meaningful gift for the home temple.", store: "amazon", term: "ram darbar idol" },
      { name: "Silk saree", why: "For Dussehra puja and visits to relatives.", store: "myntra", term: "silk saree" },
      { name: "Dry fruit hamper", why: "A premium festive gift.", store: "amazon", term: "dry fruits hamper premium" },
    ],
  },
  karwaChauth: {
    under500: [
      { name: "Karwa Chauth thali set", why: "With karwa, sieve and diya for the evening puja.", store: "amazon", term: "karwa chauth thali set" },
      { name: "Glass bangles", why: "A traditional part of the Karwa Chauth look.", store: "amazon", term: "glass bangles set" },
      { name: "Mehendi cones", why: "For mehendi the day before the fast.", store: "amazon", term: "natural mehendi cones" },
    ],
    under1000: [
      { name: "Makeup kit", why: "For getting ready for the evening puja.", store: "nykaa", term: "makeup kit for women" },
      { name: "Sargi gift box", why: "Dry fruits and sweets for the pre-dawn meal.", store: "amazon", term: "dry fruits gift box" },
      { name: "Earrings", why: "A thoughtful gift from husband to wife.", store: "myntra", term: "women earrings" },
    ],
    premium: [
      { name: "Red saree", why: "The traditional colour for Karwa Chauth.", store: "myntra", term: "red saree" },
      { name: "Women's watch", why: "A lasting gift for your wife.", store: "amazon", term: "women watch" },
      { name: "Gold-plated jewellery set", why: "Completes the festive look.", store: "amazon", term: "gold plated jewellery set for women" },
    ],
  },
  dhanteras: {
    under500: [
      { name: "Steel utensils", why: "Buying new utensils on Dhanteras is a common tradition.", store: "amazon", term: "stainless steel utensils" },
      { name: "Clay diyas", why: "The first diyas of Diwali are lit on Dhanteras.", store: "amazon", term: "clay diyas" },
      { name: "Lakshmi Ganesh idol", why: "For Diwali puja two days later.", store: "amazon", term: "lakshmi ganesh idol small" },
    ],
    under1000: [
      { name: "Brass diya", why: "A traditional metal purchase for the day.", store: "amazon", term: "brass diya" },
      { name: "Copper water bottle", why: "A useful metal item for the home.", store: "amazon", term: "copper water bottle" },
      { name: "Kitchen cookware", why: "New cookware for the festive season.", store: "amazon", term: "kitchen cookware set" },
    ],
    premium: [
      { name: "Silver coin", why: "A traditional Dhanteras purchase.", store: "amazon", term: "silver coin" },
      { name: "Gold coin", why: "Many families buy gold on Dhanteras.", store: "amazon", term: "gold coin" },
      { name: "Kitchen appliance", why: "A useful upgrade for the home.", store: "amazon", term: "mixer grinder" },
    ],
  },
  bhaiDooj: {
    under500: [
      { name: "Tilak thali", why: "With roli, chawal and diya for the tilak ceremony.", store: "amazon", term: "tilak thali set" },
      { name: "Chocolate gift box", why: "A sweet gift for a brother or sister.", store: "amazon", term: "chocolate gift box" },
      { name: "Greeting card", why: "A simple way to share your wishes.", store: "amazon", term: "greeting card for brother" },
    ],
    under1000: [
      { name: "Wallet for brother", why: "A useful gift he will carry every day.", store: "amazon", term: "men leather wallet" },
      { name: "Gift set for sister", why: "A popular return gift from brothers.", store: "nykaa", term: "gift set for women" },
      { name: "Dry fruit box", why: "A festive gift the whole family can share.", store: "amazon", term: "dry fruits gift box" },
    ],
    premium: [
      { name: "Wrist watch", why: "A lasting gift for a brother or sister.", store: "amazon", term: "wrist watch gift" },
      { name: "Handbag for sister", why: "A stylish gift she will use often.", store: "myntra", term: "women handbag" },
      { name: "Wireless earbuds", why: "A popular gift for any age.", store: "amazon", term: "wireless earbuds" },
    ],
  },
  chhath: {
    under500: [
      { name: "Bamboo soop", why: "Used to offer arghya to the sun.", store: "amazon", term: "bamboo soop for chhath puja" },
      { name: "Puja samagri kit", why: "Essentials for the four days of Chhath.", store: "amazon", term: "chhath puja samagri" },
      { name: "Brass lota", why: "For offering water during arghya.", store: "amazon", term: "brass lota" },
    ],
    under1000: [
      { name: "Cotton saree", why: "Comfortable for long rituals at the ghat.", store: "myntra", term: "cotton saree" },
      { name: "Bamboo daura basket", why: "To carry offerings to the ghat.", store: "amazon", term: "bamboo basket daura" },
      { name: "Men's dhoti kurta", why: "Traditional wear for the puja.", store: "amazon", term: "dhoti kurta for men" },
    ],
    premium: [
      { name: "Silk saree", why: "A festive saree for the main day.", store: "myntra", term: "silk saree" },
      { name: "Brass puja set", why: "A lasting set for every year's puja.", store: "amazon", term: "brass puja set" },
      { name: "Dry fruit hamper", why: "A premium gift for the family.", store: "amazon", term: "dry fruits hamper premium" },
    ],
  },
  guruNanak: {
    under500: [
      { name: "Gutka Sahib", why: "A respectful gift for daily prayer.", store: "amazon", term: "gutka sahib" },
      { name: "Kids' book on Guru Nanak", why: "Shares Guru Nanak Dev Ji's teachings with children.", store: "amazon", term: "guru nanak book for kids" },
      { name: "Diyas and candles", why: "Homes are lit up for Gurpurab.", store: "amazon", term: "clay diyas" },
    ],
    under1000: [
      { name: "Kurta pyjama", why: "A neat outfit for the gurdwara.", store: "myntra", term: "men kurta pyjama" },
      { name: "Women's salwar suit", why: "A festive outfit for Gurpurab.", store: "myntra", term: "women salwar suit" },
      { name: "Steel kada", why: "A meaningful gift in Sikh tradition.", store: "amazon", term: "steel kada" },
    ],
    premium: [
      { name: "Phulkari dupatta", why: "Punjab's traditional embroidered craft.", store: "amazon", term: "phulkari dupatta" },
      { name: "Sikh history book set", why: "A lasting gift for readers.", store: "amazon", term: "sikh history books" },
      { name: "Festive suit", why: "For Gurpurab celebrations with family.", store: "ajio", term: "women ethnic suit" },
    ],
  },
  christmas: {
    under500: [
      { name: "Christmas ornaments", why: "Decorate the tree with the family.", store: "amazon", term: "christmas tree ornaments" },
      { name: "Santa cap", why: "Fun for kids and office parties.", store: "amazon", term: "santa cap" },
      { name: "Fairy lights", why: "Adds a warm glow to any room.", store: "amazon", term: "fairy lights" },
    ],
    under1000: [
      { name: "Christmas tree", why: "The centrepiece of Christmas at home.", store: "amazon", term: "christmas tree" },
      { name: "Plum cake hamper", why: "A classic Christmas treat to share.", store: "amazon", term: "plum cake gift box" },
      { name: "Secret Santa gift", why: "Easy picks for office gift exchanges.", store: "amazon", term: "secret santa gift" },
    ],
    premium: [
      { name: "Party outfit", why: "For Christmas parties and New Year's Eve.", store: "ajio", term: "party wear" },
      { name: "Perfume gift set", why: "A premium gift for someone special.", store: "nykaa", term: "perfume gift set" },
      { name: "Bluetooth speaker", why: "Carols and party music for the season.", store: "amazon", term: "bluetooth speaker" },
    ],
  },
};

export const PERSONAL_GIFT_IDEAS: Record<PersonalDateKind, BudgetIdeas> = {
  birthday: {
    under500: [
      { name: "Personalised mug", why: "Add their name or photo for a gift that feels personal.", store: "amazon", term: "personalised mug with photo" },
      { name: "Chocolate hamper", why: "A sweet gift that suits any age.", store: "amazon", term: "chocolate gift hamper" },
      { name: "Scented candle", why: "A warm, simple gift for friends.", store: "amazon", term: "scented candle gift" },
    ],
    under1000: [
      { name: "Photo frame", why: "Frame a favourite memory together.", store: "amazon", term: "personalised photo frame" },
      { name: "Indoor plant", why: "A living gift that lasts.", store: "amazon", term: "indoor plant gift" },
      { name: "Perfume", why: "A popular birthday gift for adults.", store: "nykaa", term: "perfume" },
    ],
    premium: [
      { name: "Smartwatch", why: "Useful every day.", store: "amazon", term: "smartwatch" },
      { name: "Wireless earbuds", why: "A favourite with music lovers.", store: "amazon", term: "wireless earbuds" },
      { name: "Leather wallet or handbag", why: "A stylish gift they will carry daily.", store: "myntra", term: "leather wallet" },
    ],
  },
  anniversary: {
    under500: [
      { name: "Couple mug set", why: "A cute everyday reminder of each other.", store: "amazon", term: "couple mug set" },
      { name: "Anniversary card", why: "Write your own words of love.", store: "amazon", term: "anniversary greeting card" },
      { name: "Couple keychain", why: "A small gift you both carry.", store: "amazon", term: "couple keychain" },
    ],
    under1000: [
      { name: "Couple photo frame", why: "Display a favourite photo of you two.", store: "amazon", term: "couple photo frame" },
      { name: "Memory scrapbook", why: "Fill it with photos from your years together.", store: "amazon", term: "anniversary scrapbook" },
      { name: "Photo lamp", why: "A glowing photo gift for the bedroom.", store: "amazon", term: "personalised photo lamp" },
    ],
    premium: [
      { name: "Couple watch set", why: "Matching watches for both of you.", store: "amazon", term: "couple watch set" },
      { name: "Pendant or jewellery", why: "A classic anniversary gift.", store: "amazon", term: "pendant for wife" },
      { name: "Perfume gift set", why: "A premium gift for your partner.", store: "nykaa", term: "perfume gift set" },
    ],
  },
  other: {
    under500: [
      { name: "Greeting card", why: "A simple way to share your wishes.", store: "amazon", term: "greeting card" },
      { name: "Chocolates", why: "Always welcome.", store: "amazon", term: "chocolate gift box" },
      { name: "Scented candle", why: "A warm gift for any occasion.", store: "amazon", term: "scented candle gift" },
    ],
    under1000: [
      { name: "Photo frame", why: "Frame a special memory.", store: "amazon", term: "photo frame gift" },
      { name: "Dry fruit box", why: "A thoughtful gift for family.", store: "amazon", term: "dry fruits gift box" },
      { name: "Indoor plant", why: "A gift that keeps growing.", store: "amazon", term: "indoor plant gift" },
    ],
    premium: [
      { name: "Smartwatch", why: "A useful gift for anyone.", store: "amazon", term: "smartwatch" },
      { name: "Wireless earbuds", why: "A popular gift for any age.", store: "amazon", term: "wireless earbuds" },
      { name: "Perfume gift set", why: "A premium gift for someone special.", store: "nykaa", term: "perfume gift set" },
    ],
  },
};
