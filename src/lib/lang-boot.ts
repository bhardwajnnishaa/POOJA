// Shared with the server layout, so it must not live in a "use client" file.
export const LANG_STORAGE_KEY = "festive-clock-lang";

// Sets <html lang> before the page paints, so Hindi text gets the right font shaping.
export const LANG_BOOT_SCRIPT = `try{if(localStorage.getItem("${LANG_STORAGE_KEY}")==="hi")document.documentElement.lang="hi-IN"}catch(e){}`;
