import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

type NavItem = {
  href: string;
  label: string;
  i18nKey: string;
  active: boolean;
};

interface Props {
  items: NavItem[];
}

export default function MobileMenu({ items }: Props) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "zu">("en");
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const current = window.suncasaGetLang?.() ?? "en";
    setLang(current);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ lang: "en" | "zu" }>).detail;
      if (detail?.lang) setLang(detail.lang);
    };
    window.addEventListener("suncasa:langchange", onChange);
    return () => window.removeEventListener("suncasa:langchange", onChange);
  }, []);

  const choose = (next: "en" | "zu") => {
    window.suncasaSetLang?.(next);
    setLang(next);
  };

  const close = useCallback(() => {
    setOpen(false);
    btnRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const firstLink = panelRef.current?.querySelector("a");
    firstLink?.focus();

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen(true)}
        className="grid h-9 w-9 cursor-pointer place-items-center rounded-sm border border-rule text-charcoal transition-colors hover:bg-paper-warm lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal/50"
            onClick={close}
          />

          {/* Panel */}
          <div
            ref={panelRef}
            className="absolute bottom-0 right-0 top-0 flex w-80 max-w-[85vw] flex-col border-l-2 border-emerald/20 bg-paper shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-rule px-5 py-4">
              <span className="eyebrow text-emerald">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-sm border border-rule text-charcoal transition-colors hover:bg-paper-warm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-1">
                {items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      data-i18n={item.i18nKey}
                      onClick={close}
                      className={`block rounded-md px-4 py-3 text-base transition-colors hover:bg-paper-warm ${
                        item.active
                          ? "bg-paper-warm text-emerald font-semibold"
                          : "text-charcoal/80"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-rule px-5 py-4">
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
                  EN
                </button>
                <span aria-hidden="true" className="px-0.5 text-charcoal/30">|</span>
                <button
                  type="button"
                  data-lang-btn="zu"
                  aria-pressed={lang === "zu"}
                  onClick={() => choose("zu")}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    lang === "zu" ? "bg-emerald text-paper" : "text-charcoal/70 hover:text-charcoal"
                  }`}
                >
                  ZU
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
