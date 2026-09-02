import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { languages, type Locale } from '@/i18n/content';
import { useI18n } from '@/i18n/useI18n';

type LanguageSwitcherProps = {
  scrolled?: boolean;
  tone?: 'auto' | 'dark' | 'light';
  compact?: boolean;
  onChange?: () => void;
};

export default function LanguageSwitcher({
  scrolled = false,
  tone = 'auto',
  compact = false,
  onChange,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const shouldReduceMotion = useReducedMotion();
  const activeLanguage = languages.find((language) => language.code === locale) ?? languages[0];
  const darkSurface = tone === 'dark' || (tone === 'auto' && !scrolled);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const chooseLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    setOpen(false);
    onChange?.();
  };

  const focusOption = (index: number) => {
    const nextIndex = (index + languages.length) % languages.length;
    optionRefs.current[nextIndex]?.focus();
  };

  const buttonClass = darkSurface
    ? 'btn-border-run--light border-white/25 bg-white/10 text-white hover:bg-white/15'
    : 'btn-border-run--sheen-tint border-dark-950/10 bg-white/75 text-dark-800 hover:bg-white';

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={t('accessibility.languageSwitcher')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`btn-border-run inline-flex h-11 min-w-[4.6rem] items-center justify-center gap-2 rounded-full border px-3 text-xs font-black uppercase backdrop-blur-md transition-all focus-visible:outline-primary-600 ${buttonClass} ${
          compact ? 'min-w-[4.25rem] px-2.5' : ''
        }`}
      >
        <Globe2 className="h-4 w-4" />
        <span>{activeLanguage.short}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={t('accessibility.languageMenu')}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -5 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute end-0 top-full z-[240] mt-2 w-[108px] overflow-hidden rounded-[14px] border border-primary-950/[0.12] bg-white p-1.5 text-dark-900 shadow-[0_14px_35px_rgba(30,10,15,0.14)]"
          >
            {languages.map((language, index) => {
              const selected = language.code === locale;

              return (
                <button
                  key={language.code}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="menuitemradio"
                  aria-label={language.nativeName}
                  aria-checked={selected}
                  aria-current={selected ? 'true' : undefined}
                  title={language.nativeName}
                  onClick={() => chooseLocale(language.code)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      focusOption(index + 1);
                    }

                    if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      focusOption(index - 1);
                    }

                    if (event.key === 'Home') {
                      event.preventDefault();
                      focusOption(0);
                    }

                    if (event.key === 'End') {
                      event.preventDefault();
                      focusOption(languages.length - 1);
                    }
                  }}
                  className={`btn-border-run btn-border-run--sheen-tint relative flex h-11 w-full items-center justify-center rounded-[10px] text-sm font-bold uppercase tracking-[0.04em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    selected
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-dark-700 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  {selected && (
                    <Check
                      className="pointer-events-none absolute start-3 h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  )}
                  <span>{language.short}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
