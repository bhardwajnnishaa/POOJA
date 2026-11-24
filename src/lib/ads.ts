// Google AdSense publisher ID. It must match public/ads.txt.
export const ADSENSE_CLIENT = "ca-pub-9561435102395818";

// Ad unit IDs from AdSense > Ads > By ad unit. Each one is a number such as "1234567890".
// A slot shows nothing until its ID is set, so the page never shows an empty box.
export const AD_SLOT_BANNER = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER ?? "";
export const AD_SLOT_IN_FEED = process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED ?? "";
