// Client side language runtime.
//
// The full EN and ZU dictionaries are embedded once in the page (see BaseLayout).
// This keeps the toggle instant and functional offline, which suits the low
// bandwidth requirement. No network request is made when switching language.

type Dict = Record<string, string>;
type Dictionaries = Record<string, Dict>;

const STORAGE_KEY = "suncasa-lang";
const SUPPORTED = ["en", "zu"] as const;
type Lang = (typeof SUPPORTED)[number];

declare global {
  interface Window {
    __SUNCASA_I18N__?: Dictionaries;
    suncasaSetLang?: (lang: Lang) => void;
    suncasaGetLang?: () => Lang;
  }
}

function getDicts(): Dictionaries {
  return window.__SUNCASA_I18N__ ?? { en: {}, zu: {} };
}

function normalize(value: string | null): Lang {
  return value === "zu" ? "zu" : "en";
}

function applyLang(lang: Lang): void {
  const dicts = getDicts();
  const dict = dicts[lang] ?? dicts.en ?? {};
  const fallback = dicts.en ?? {};

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const value = dict[key] ?? fallback[key];
    if (value !== undefined) el.textContent = value;
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (!key) return;
    const value = dict[key] ?? fallback[key];
    if (value !== undefined) el.setAttribute("aria-label", value);
  });

  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("data-lang", lang);

  // Note: the language toggle buttons are owned entirely by the React
  // LangToggle island. This runtime intentionally does not mutate them, which
  // avoids a hydration mismatch. The island listens for the langchange event
  // dispatched below to reflect the active language.

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // storage may be unavailable, language still applies for this session
  }

  window.dispatchEvent(new CustomEvent("suncasa:langchange", { detail: { lang } }));
}

export function initI18n(): void {
  let initial: Lang = "en";
  try {
    initial = normalize(localStorage.getItem(STORAGE_KEY));
  } catch {
    initial = "en";
  }

  window.suncasaSetLang = (lang: Lang) => applyLang(normalize(lang));
  window.suncasaGetLang = () => normalize(document.documentElement.getAttribute("data-lang"));

  applyLang(initial);
}
