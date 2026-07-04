import en from "./en.json";
import zu from "./zu.json";

export type Lang = "en" | "zu";

export const LANGS: Lang[] = ["en", "zu"];
export const DEFAULT_LANG: Lang = "en";

const dictionaries: Record<Lang, Record<string, string>> = {
  en: en as Record<string, string>,
  zu: zu as Record<string, string>,
};

// Server side helper used by .astro pages to render the default (English) copy.
// The runtime language toggle island swaps strings client side using the same keys.
export function t(key: string, lang: Lang = DEFAULT_LANG): string {
  const dict = dictionaries[lang] ?? dictionaries[DEFAULT_LANG];
  return dict[key] ?? dictionaries[DEFAULT_LANG][key] ?? key;
}

// Full dictionaries are shipped to the client once so the toggle is instant
// and works offline, which suits the low bandwidth requirement.
export function getDictionaries() {
  return dictionaries;
}
