import type { FestivalId, PriceRange, RetailerId } from "@/config/affiliates";

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
};
