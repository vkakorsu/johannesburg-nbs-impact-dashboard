import { useEffect, useState } from "react";

type Lang = "en" | "zu";

// Small interactive island. The heavy lifting (swapping every string on the
// page) is handled by the shared i18n client runtime. This component only
// reflects and sets the current language.
export default function LangToggle() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const current = window.suncasaGetLang?.() ?? "en";
    setLang(current);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ lang: Lang }>).detail;
      if (detail?.lang) setLang(detail.lang);
    };
    window.addEventListener("suncasa:langchange", onChange);
    return () => window.removeEventListener("suncasa:langchange", onChange);
  }, []);

  const choose = (next: Lang) => {
    window.suncasaSetLang?.(next);
    setLang(next);
  };

  return (
    <div
      className="inline-flex items-center rounded-full border border-paper-warm bg-paper/60 p-0.5 text-sm font-medium"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        data-lang-btn="en"
        aria-pressed={lang === "en"}
        onClick={() => choose("en")}
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "en" ? "bg-emerald text-paper" : "text-charcoal/70 hover:text-charcoal"
        }`}
      >
        English
      </button>
      <span aria-hidden="true" className="px-0.5 text-charcoal/30">
        |
      </span>
      <button
        type="button"
        data-lang-btn="zu"
        aria-pressed={lang === "zu"}
        onClick={() => choose("zu")}
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "zu" ? "bg-emerald text-paper" : "text-charcoal/70 hover:text-charcoal"
        }`}
      >
        isiZulu
      </button>
    </div>
  );
}
