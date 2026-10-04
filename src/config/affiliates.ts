import type { FestivalId } from "@/types/calendar";
import type { PersonalDateKind } from "@/lib/personal-dates";

export type { FestivalId };

// Set NEXT_PUBLIC_AMAZON_TAG after joining Amazon Associates India.
const AMAZON_AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG;

export type PriceRange = { min?: number; max?: number };

// Amazon's price filter takes paise, e.g. p_36:-49999 is "below ₹500".
function amazonSearch(term: string, price?: PriceRange) {
  const params = new URLSearchParams({ k: term });
  if (price) {
    const min = price.min === undefined ? "" : String(price.min * 100);
    const max = price.max === undefined ? "" : String(price.max * 100 - 1);
    params.set("rh", `p_36:${min}-${max}`);
  }
  if (AMAZON_AFFILIATE_TAG) params.set("tag", AMAZON_AFFILIATE_TAG);
  return `https://www.amazon.in/s?${params}`;
}

const RETAILERS = [
  { id: "amazon", label: "Amazon", search: amazonSearch },
  { id: "myntra", label: "Myntra", search: (term: string) => `https://www.myntra.com/search?q=${encodeURIComponent(term)}` },
  { id: "purplle", label: "Purplle", search: (term: string) => `https://www.purplle.com/search?q=${encodeURIComponent(term)}` },
  { id: "nykaa", label: "Nykaa", search: (term: string) => `https://www.nykaa.com/search/result/?q=${encodeURIComponent(term)}` },
  { id: "meesho", label: "Meesho", search: (term: string) => `https://www.meesho.com/search?q=${encodeURIComponent(term)}` },
  { id: "ajio", label: "AJIO", search: (term: string) => `https://www.ajio.com/search/?text=${encodeURIComponent(term)}` },
  { id: "flipkart", label: "Flipkart", search: (term: string) => `https://www.flipkart.com/search?q=${encodeURIComponent(term)}` },
] as const;

export type RetailerId = (typeof RETAILERS)[number]["id"];

// Only Amazon links carry the price range; other stores open a plain search.
export function retailerSearch(id: RetailerId, term: string, price?: PriceRange) {
  const retailer = RETAILERS.find((entry) => entry.id === id)!;
  return { label: retailer.label, href: id === "amazon" ? amazonSearch(term, price) : retailer.search(term) };
}
export type ShoppingLink = { id: RetailerId | QuickStoreId; label: string; href: string };

// Fast delivery apps. Grocery apps open a search; food apps open the home page, since dishes depend on the city.
const QUICK_STORES = [
  { id: "blinkit", label: "Blinkit", search: (term: string) => `https://blinkit.com/s/?q=${encodeURIComponent(term)}` },
  { id: "zepto", label: "Zepto", search: (term: string) => `https://www.zepto.com/search?query=${encodeURIComponent(term)}` },
  { id: "instamart", label: "Instamart", search: (term: string) => `https://www.swiggy.com/instamart/search?custom_back=true&query=${encodeURIComponent(term)}` },
  { id: "bigbasket", label: "BigBasket", search: (term: string) => `https://www.bigbasket.com/ps/?q=${encodeURIComponent(term)}` },
] as const;

const FOOD_STORES = [
  { id: "swiggy", label: "Swiggy", href: "https://www.swiggy.com/" },
  { id: "zomato", label: "Zomato", href: "https://www.zomato.com/" },
] as const;

export type QuickStoreId = (typeof QUICK_STORES)[number]["id"] | (typeof FOOD_STORES)[number]["id"];
export type DeliveryLinks = { quick: ShoppingLink[]; food: ShoppingLink[] };

function deliveryLinks(term: string): DeliveryLinks {
  return {
    quick: QUICK_STORES.map((store) => ({ id: store.id, label: store.label, href: store.search(term) })),
    food: FOOD_STORES.map((store) => ({ id: store.id, label: store.label, href: store.href })),
  };
}

// One short search per event, for things that can arrive in minutes.
const QUICK_TERMS: Record<FestivalId, string> = {
  diwali: "diya", eid: "sewai", newYear: "party snacks", rakhi: "rakhi", holi: "gulal",
  independenceDay: "tricolour flag", navratri: "puja samagri", dussehra: "puja samagri",
  karwaChauth: "karwa chauth thali", dhanteras: "silver coin", bhaiDooj: "chocolate gift box",
  chhath: "puja samagri", guruNanak: "dry fruits", christmas: "plum cake",
};

const PERSONAL_QUICK_TERMS: Record<PersonalDateKind, string> = {
  birthday: "birthday cake", anniversary: "flower bouquet", other: "chocolate gift box",
};

export const DELIVERY_LINKS = Object.fromEntries(
  (Object.keys(QUICK_TERMS) as FestivalId[]).map((id) => [id, deliveryLinks(QUICK_TERMS[id])]),
) as Record<FestivalId, DeliveryLinks>;

export const PERSONAL_DELIVERY_LINKS = Object.fromEntries(
  (Object.keys(PERSONAL_QUICK_TERMS) as PersonalDateKind[]).map((kind) => [kind, deliveryLinks(PERSONAL_QUICK_TERMS[kind])]),
) as Record<PersonalDateKind, DeliveryLinks>;

const SHOPPING_TERMS: Record<FestivalId, Record<RetailerId, string>> = {
  diwali: {
    amazon: "Diwali gifts and diyas", myntra: "Diwali ethnic outfits", purplle: "Diwali beauty gifts",
    nykaa: "Diwali makeup gifts", meesho: "Diwali decor and gifts", ajio: "Diwali ethnic wear",
    flipkart: "Diwali gifts and lights",
  },
  eid: {
    amazon: "Eid gifts", myntra: "Eid festive outfits", purplle: "Eid beauty gifts",
    nykaa: "Eid makeup and gifts", meesho: "Eid outfits and gifts", ajio: "Eid ethnic wear",
    flipkart: "Eid gifts",
  },
  newYear: {
    amazon: "New Year party decorations", myntra: "New Year party outfits", purplle: "New Year beauty looks",
    nykaa: "New Year party makeup", meesho: "New Year party wear", ajio: "New Year party outfits",
    flipkart: "New Year party essentials",
  },
  rakhi: {
    amazon: "Rakhi gifts for siblings", myntra: "Rakhi ethnic outfits", purplle: "Rakhi beauty gifts",
    nykaa: "Rakhi gifts and beauty", meesho: "Rakhi gifts for brother sister", ajio: "Rakhi ethnic wear",
    flipkart: "Rakhi gifts and hampers",
  },
  holi: {
    amazon: "organic Holi colours and pichkari", myntra: "white Holi outfits", purplle: "Holi skin care",
    nykaa: "Holi skin care and sunscreen", meesho: "Holi colours and outfits", ajio: "white Holi outfits",
    flipkart: "Holi colours and water guns",
  },
  independenceDay: {
    amazon: "India tricolour decorations", myntra: "Independence Day outfits", purplle: "tricolour nail art",
    nykaa: "tricolour makeup", meesho: "tricolour decorations", ajio: "Independence Day outfits",
    flipkart: "India tricolour accessories",
  },
  navratri: {
    amazon: "Navratri puja samagri and decoration", myntra: "Navratri chaniya choli", purplle: "Navratri makeup",
    nykaa: "festive makeup", meesho: "Navratri chaniya choli and dandiya", ajio: "Navratri ethnic wear",
    flipkart: "dandiya sticks and Navratri decor",
  },
  dussehra: {
    amazon: "Dussehra puja items and gifts", myntra: "Dussehra ethnic wear", purplle: "festive beauty gifts",
    nykaa: "festive makeup gifts", meesho: "Dussehra ethnic outfits", ajio: "festive ethnic wear",
    flipkart: "Dussehra gifts",
  },
  karwaChauth: {
    amazon: "Karwa Chauth thali set", myntra: "Karwa Chauth saree", purplle: "Karwa Chauth makeup",
    nykaa: "bridal makeup kit", meesho: "Karwa Chauth saree and thali", ajio: "Karwa Chauth ethnic wear",
    flipkart: "Karwa Chauth gifts for wife",
  },
  dhanteras: {
    amazon: "Dhanteras silver coin and utensils", myntra: "festive jewellery", purplle: "festive beauty gifts",
    nykaa: "festive gift sets", meesho: "Dhanteras puja items", ajio: "festive ethnic wear",
    flipkart: "Dhanteras kitchen utensils",
  },
  bhaiDooj: {
    amazon: "Bhai Dooj gifts for brother", myntra: "men ethnic kurta", purplle: "Bhai Dooj gifts for sister",
    nykaa: "gift sets for sister", meesho: "Bhai Dooj tilak thali", ajio: "men festive wear",
    flipkart: "Bhai Dooj gift hamper",
  },
  chhath: {
    amazon: "Chhath puja samagri and soop", myntra: "cotton saree", purplle: "festive beauty",
    nykaa: "festive skincare", meesho: "Chhath puja saree", ajio: "festive ethnic wear",
    flipkart: "Chhath puja items",
  },
  guruNanak: {
    amazon: "Sikh religious books and gifts", myntra: "men kurta pyjama", purplle: "festive beauty",
    nykaa: "festive gift sets", meesho: "Gurpurab outfits", ajio: "festive ethnic wear",
    flipkart: "Gurpurab gifts",
  },
  christmas: {
    amazon: "Christmas tree and decorations", myntra: "Christmas party outfits", purplle: "Christmas beauty gifts",
    nykaa: "Christmas gift sets", meesho: "Christmas decorations", ajio: "Christmas party wear",
    flipkart: "Christmas gifts and decorations",
  },
};

function linksForEvent(event: FestivalId): ShoppingLink[] {
  return RETAILERS.map((retailer) => ({
    id: retailer.id,
    label: retailer.label,
    href: retailer.search(SHOPPING_TERMS[event][retailer.id]),
  }));
}

export const AFFILIATE_LINKS = Object.fromEntries(
  (Object.keys(SHOPPING_TERMS) as FestivalId[]).map((id) => [id, linksForEvent(id)]),
) as Record<FestivalId, ShoppingLink[]>;

const PERSONAL_SHOPPING_TERMS: Record<PersonalDateKind, Record<RetailerId, string>> = {
  birthday: {
    amazon: "birthday gifts", myntra: "birthday gift", purplle: "birthday gift set",
    nykaa: "birthday gift set", meesho: "birthday gifts", ajio: "birthday gift",
    flipkart: "birthday gifts",
  },
  anniversary: {
    amazon: "anniversary gifts for couple", myntra: "anniversary gift", purplle: "anniversary gift set",
    nykaa: "anniversary gift set", meesho: "anniversary gifts", ajio: "anniversary gift",
    flipkart: "anniversary gifts",
  },
  other: {
    amazon: "gift ideas", myntra: "gifts", purplle: "gift set",
    nykaa: "gift sets", meesho: "gifts", ajio: "gifts",
    flipkart: "gifts",
  },
};

export const PERSONAL_SHOPPING_LINKS = Object.fromEntries(
  (Object.keys(PERSONAL_SHOPPING_TERMS) as PersonalDateKind[]).map((kind) => [
    kind,
    RETAILERS.map((retailer) => ({ id: retailer.id, label: retailer.label, href: retailer.search(PERSONAL_SHOPPING_TERMS[kind][retailer.id]) })),
  ]),
) as Record<PersonalDateKind, ShoppingLink[]>;
