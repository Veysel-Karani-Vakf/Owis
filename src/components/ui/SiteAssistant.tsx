import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, BookOpen, FileText, Landmark, Newspaper, PenLine, X, LayoutGrid, Layers } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assistantLabels, buildSiteIndex, type AssistantLink, type AssistantReply, type EntryKind } from '@/assistant/engine';
import { askAssistant, type ChatHistoryItem } from '@/assistant/aiClient';
import { useScrolled } from '@/hooks/useScrolled';
import { useTopOnlyChrome } from '@/hooks/useTopOnlyChrome';
import { useI18n } from '@/i18n/useI18n';
import AssistantIcon from '@/components/icons/AssistantIcon';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  links?: AssistantLink[];
  suggestions?: string[];
};

const KIND_ICONS: Record<EntryKind, typeof FileText> = {
  page: LayoutGrid,
  program: Layers,
  project: Landmark,
  news: Newspaper,
  library: BookOpen,
  document: FileText,
  form: PenLine,
};

const STORAGE_KEY = 'vkv-assistant-open';

let messageId = 0;
const nextId = () => ++messageId;

export default function SiteAssistant() {
  const { locale, content, isRtl } = useI18n();
  const labels = assistantLabels[locale];
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  // On top-only-chrome routes the launcher lives at the top of the page: once
  // the visitor scrolls into the content it parks out of the way and comes back
  // at the top. An open conversation is never yanked away mid-scroll.
  const topOnly = useTopOnlyChrome();
  const scrolledPast = useScrolled(80);
  const parked = topOnly && scrolledPast && !open;

  // Rebuilt whenever the locale or the CMS snapshot changes (`content` is a new object then).
  const index = useMemo(() => buildSiteIndex(locale, content), [locale, content]);

  // Restore the panel state for the session, and greet on the first open.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) === '1') setOpen(true);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, open ? '1' : '0');
    } catch {
      /* storage unavailable */
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setMessages((current) => (current.length ? current : [{ id: nextId(), role: 'assistant', text: labels.welcome, suggestions: labels.suggestions }]));
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 250);
    return () => window.clearTimeout(focusTimer);
  }, [open, labels]);

  // Language switch: start a fresh conversation in the new language.
  const localeRef = useRef(locale);
  useEffect(() => {
    if (localeRef.current === locale) return;
    localeRef.current = locale;
    setMessages(open ? [{ id: nextId(), role: 'assistant', text: labels.welcome, suggestions: labels.suggestions }] : []);
  }, [locale, labels, open]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const ask = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || thinking) return;
    // History for the AI: what is on screen before this question, minus the
    // canned welcome message.
    const history: ChatHistoryItem[] = messages
      .filter((message) => message.text !== labels.welcome)
      .map((message) => ({ role: message.role, text: message.text }));
    setMessages((current) => [...current, { id: nextId(), role: 'user', text: trimmed }]);
    setInput('');
    setThinking(true);
    const started = Date.now();
    const reply: AssistantReply = await askAssistant(trimmed, history, { locale, site: content, index });
    // The offline fallback answers instantly; a short pause keeps it readable.
    const delay = Math.max(0, 350 - (Date.now() - started));
    timerRef.current = window.setTimeout(() => {
      setMessages((current) => [...current, { id: nextId(), role: 'assistant', ...reply }]);
      setThinking(false);
      timerRef.current = null;
    }, delay);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(input);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      ask(input);
    }
  };

  const isActive = (href: string) => href.split('?')[0] === location.pathname;

  return (
    // The inline-start corner: the home hero already parks its play button at
    // the inline-end corner, and the two would sit on top of each other.
    <div
      className={`site-assistant fixed bottom-5 z-[120] flex flex-col items-start gap-3 transition-[opacity,transform] duration-300 ease-out print:hidden ${
        parked ? 'pointer-events-none translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{ insetInlineStart: '1.25rem' }}
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-hidden={parked || undefined}
    >
      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            role="dialog"
            aria-label={labels.title}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="site-assistant-panel flex w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white text-dark-900 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]"
          >
            <header className="relative flex items-center gap-3 bg-dark-950 px-4 py-3 text-white">
              <div className="geometric-pattern pointer-events-none absolute inset-0 opacity-20" />
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30">
                <AssistantIcon className="h-6 w-6" />
              </span>
              <div className="relative min-w-0 flex-1 text-start">
                <div className="text-sm font-bold">{labels.title}</div>
                <div className="truncate text-xs text-white/60">{labels.subtitle}</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={labels.close}
                className="btn-border-run btn-border-run--light relative grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-warm px-4 py-4" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={
                      message.role === 'user'
                        ? 'max-w-[85%] whitespace-pre-line rounded-2xl rounded-ee-md bg-primary-500 px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm'
                        : 'max-w-[92%] whitespace-pre-line rounded-2xl rounded-ss-md border border-black/5 bg-white px-4 py-2.5 text-sm leading-relaxed text-dark-800 shadow-sm'
                    }
                  >
                    {message.text}
                  </div>

                  {message.links && message.links.length > 0 && (
                    <ul className="flex w-full max-w-[92%] flex-col gap-1.5">
                      {message.links.map((item) => {
                        const Icon = KIND_ICONS[item.kind] ?? FileText;
                        return (
                          <li key={`${message.id}-${item.href}`}>
                            <Link
                              to={item.href}
                              onClick={() => {
                                if (window.innerWidth < 768) setOpen(false);
                              }}
                              className={`btn-border-run btn-border-run--sheen-tint group flex items-start gap-3 rounded-xl border px-3 py-2.5 text-start transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                                isActive(item.href)
                                  ? 'border-primary-200 bg-primary-50'
                                  : 'border-black/5 bg-white hover:border-primary-200 hover:bg-primary-50'
                              }`}
                            >
                              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-dark-50 text-primary-600 transition group-hover:bg-primary-100">
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[11px] font-semibold uppercase tracking-wide text-primary-600">{labels.kinds[item.kind]}</span>
                                <span className="block text-sm font-semibold leading-snug text-dark-900">{item.label}</span>
                                {item.hint && <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-dark-500">{item.hint}</span>}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex max-w-[92%] flex-wrap gap-1.5">
                      {message.suggestions.map((suggestion) => (
                        <button
                          key={`${message.id}-${suggestion}`}
                          type="button"
                          onClick={() => ask(suggestion)}
                          className="btn-border-run btn-border-run--sheen-tint rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-medium text-primary-700 transition hover:bg-primary-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {thinking && (
                <div className="flex items-center gap-1.5 rounded-2xl rounded-ss-md border border-black/5 bg-white px-4 py-3 shadow-sm" aria-label={labels.typing}>
                  <span className="site-assistant-dot" />
                  <span className="site-assistant-dot [animation-delay:150ms]" />
                  <span className="site-assistant-dot [animation-delay:300ms]" />
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="border-t border-black/5 bg-white p-3">
              <div className="flex items-center gap-2 rounded-full border border-black/10 bg-warm px-2 py-1.5 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={labels.placeholder}
                  aria-label={labels.placeholder}
                  autoComplete="off"
                  maxLength={300}
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-dark-900 placeholder:text-dark-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  aria-label={labels.send}
                  className="btn-border-run grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-500 text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-dark-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-dark-400">{labels.poweredBy}</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? labels.close : labels.open}
        tabIndex={parked ? -1 : undefined}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn-border-run relative grid h-14 w-14 place-items-center rounded-full bg-primary-500 text-white shadow-[0_12px_30px_-8px_rgba(218,8,18,0.6)] transition-colors hover:bg-primary-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
      >
        <AnimatePresence initial={false} mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <AssistantIcon className="h-8 w-8" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary-400/50 [animation-duration:2.5s]" aria-hidden="true" />}
      </motion.button>
    </div>
  );
}
