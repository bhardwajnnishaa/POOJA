export type FestivalId = "diwali" | "eid" | "newYear" | "rakhi" | "holi" | "independenceDay";

const AMAZON_AFFILIATE_TAG = "replace-with-your-amazon-tag";

const RETAILERS = [
  {
    id: "amazon",
    label: "Amazon",
    search: (term: string) => `https://www.amazon.in/s?k=${encodeURIComponent(term)}&tag=${AMAZON_AFFILIATE_TAG}`,
  },
  { id: "myntra", label: "Myntra", search: (term: string) => `https://www.myntra.com/search?q=${encodeURIComponent(term)}` },
  { id: "purplle", label: "Purplle", search: (term: string) => `https://www.purplle.com/search?q=${encodeURIComponent(term)}` },
  { id: "nykaa", label: "Nykaa", search: (term: string) => `https://www.nykaa.com/search/result/?q=${encodeURIComponent(term)}` },
  { id: "meesho", label: "Meesho", search: (term: string) => `https://www.meesho.com/search?q=${encodeURIComponent(term)}` },
  { id: "ajio", label: "AJIO", search: (term: string) => `https://www.ajio.com/search/?text=${encodeURIComponent(term)}` },
  { id: "flipkart", label: "Flipkart", search: (term: string) => `https://www.flipkart.com/search?q=${encodeURIComponent(term)}` },
] as const;

type RetailerId = (typeof RETAILERS)[number]["id"];
export type ShoppingLink = { id: RetailerId; label: string; href: string };

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
};

function linksForEvent(event: FestivalId): ShoppingLink[] {
  return RETAILERS.map((retailer) => ({
    id: retailer.id,
    label: retailer.label,
    href: retailer.search(SHOPPING_TERMS[event][retailer.id]),
  }));
}

export const AFFILIATE_LINKS: Record<FestivalId, ShoppingLink[]> = {
  diwali: linksForEvent("diwali"),
  eid: linksForEvent("eid"),
  newYear: linksForEvent("newYear"),
  rakhi: linksForEvent("rakhi"),
  holi: linksForEvent("holi"),
  independenceDay: linksForEvent("independenceDay"),
};