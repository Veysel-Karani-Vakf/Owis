import { AnimatePresence, motion, useReducedMotion, useScroll, type Variants } from 'framer-motion';
import { Sparkles as EmptyIcon, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/useI18n';

export type IdentityTab = {
  key: string;
  title: string;
  icon: LucideIcon;
  body?: string;
  bullets?: string[];
  chips?: string[];
};

type WaqfIdentityTabsProps = {
  eyebrow: string;
  title: string;
  description: string;
  tabs: IdentityTab[];
  ariaLabel: string;
  /** Auto-rotate interval used only when the section is NOT scroll-pinned (mobile / reduced motion). 0 disables. */
  autoRotateMs?: number;
  /** Extra scroll distance (in vh) allotted to each step after the first while the section is pinned. */
  stepVh?: number;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

const panelVariants: Variants = {
  hidden: (direction: number = 1) => ({ opacity: 0, y: 14 * direction, scale: 0.985 }),
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.34, ease: smoothEase } },
  exit: (direction: number = 1) => ({
    opacity: 0,
    y: -10 * direction,
    scale: 0.99,
    transition: { duration: 0.16, ease: smoothEase },
  }),
  reduced: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.01 } },
};

const listVariants: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.08, staggerChildren: 0.05 } },
  reduced: { transition: { delayChildren: 0, staggerChildren: 0 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: smoothEase } },
  reduced: { opacity: 1, y: 0, transition: { duration: 0.01 } },
};

const previewOf = (tab: IdentityTab) => tab.body ?? tab.bullets?.[0] ?? tab.chips?.join(' · ') ?? '';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, [query]);

  return matches;
}

export default function WaqfIdentityTabs({
  eyebrow,
  title,
  description,
  tabs,
  ariaLabel,
  autoRotateMs = 7000,
  stepVh = 70,
}: WaqfIdentityTabsProps) {
  const { isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px) and (min-height: 640px)');
  const pinned = isDesktop && !shouldReduceMotion;

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const inViewRef = useRef(false);

  // Lists may be emptied from the dashboard; keep hooks order stable and bail out below.
  const active: IdentityTab = tabs[activeIndex] ?? tabs[0] ?? { key: 'empty', title: '', icon: EmptyIcon };
  const ActiveIcon = active.icon;
  const rotating = !pinned && !shouldReduceMotion && !paused && autoRotateMs > 0;

  // Scroll-driven stepping while the section is pinned (desktop).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    if (!pinned) return;

    const unsubscribe = scrollYProgress.on('change', (value) => {
      const next = Math.min(tabs.length - 1, Math.max(0, Math.floor(value * tabs.length)));
      setActiveIndex((current) => {
        if (current === next) return current;
        setDirection(next > current ? 1 : -1);
        return next;
      });
    });
    return () => unsubscribe();
  }, [pinned, scrollYProgress, tabs.length]);

  const scrollToStep = (index: number) => {
    const element = sectionRef.current;
    if (!element) return;

    const sectionTop = element.getBoundingClientRect().top + window.scrollY;
    const scrollable = element.offsetHeight - window.innerHeight;
    const stepSize = scrollable / tabs.length;
    const target = sectionTop + stepSize * index + stepSize * 0.15;
    window.scrollTo({ top: target, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  const goTo = (nextIndex: number, dir?: number) => {
    const normalized = (nextIndex + tabs.length) % tabs.length;
    if (normalized === activeIndex) return;

    if (pinned) {
      scrollToStep(normalized);
      return;
    }

    setDirection(dir ?? (normalized > activeIndex ? 1 : -1));
    setActiveIndex(normalized);
    setCycle((value) => value + 1);
  };

  const focusTab = (index: number, dir?: number) => {
    const normalized = (index + tabs.length) % tabs.length;
    goTo(normalized, dir);
    window.requestAnimationFrame(() => {
      document.getElementById(`waqf-identity-tab-${tabs[normalized].key}`)?.focus();
    });
  };

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || !('IntersectionObserver' in window)) {
      inViewRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.35 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!rotating) return;

    const id = window.setInterval(() => {
      if (!inViewRef.current) return;
      setDirection(1);
      setActiveIndex((value) => (value + 1) % tabs.length);
      setCycle((value) => value + 1);
    }, autoRotateMs);

    return () => window.clearInterval(id);
  }, [rotating, autoRotateMs, tabs.length, cycle]);

  const pinnedHeight = pinned ? `calc(100vh + ${Math.max(tabs.length - 1, 0) * stepVh}vh)` : undefined;

  if (tabs.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative bg-white" style={{ height: pinnedHeight }}>
      <div
        className={`mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28 ${
          pinned ? 'sticky top-0 flex h-screen flex-col justify-center lg:py-0' : ''
        }`}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
        }}
      >
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-12"
        >
          <div className="text-start">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-600" />
              <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
            </div>
            <h2 className="max-w-xl text-balance text-3xl font-bold leading-tight text-dark-900 md:text-4xl lg:text-5xl">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-start text-base leading-relaxed text-dark-500 md:text-lg lg:justify-self-end lg:pb-1">
            {description}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-8">
          <div role="tablist" aria-label={ariaLabel} aria-orientation="vertical" className="flex min-w-0 flex-col gap-3">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = index === activeIndex;

              return (
                <button
                  key={tab.key}
                  id={`waqf-identity-tab-${tab.key}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="waqf-identity-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => goTo(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      focusTab(index + 1, 1);
                    } else if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      focusTab(index - 1, -1);
                    } else if (event.key === 'Home') {
                      event.preventDefault();
                      focusTab(0, -1);
                    } else if (event.key === 'End') {
                      event.preventDefault();
                      focusTab(tabs.length - 1, 1);
                    }
                  }}
                  className={`group relative isolate flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-4 py-4 text-start transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 motion-reduce:transition-none ${
                    isActive
                      ? 'border-primary-200 bg-white shadow-[0_14px_38px_rgba(35,15,20,0.09)]'
                      : 'border-transparent bg-white/60 hover:border-primary-100 hover:bg-white'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-3 start-0 w-1 rounded-full bg-primary-600 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                      isActive
                        ? 'bg-primary-700 text-white'
                        : 'bg-primary-50 text-primary-700 group-hover:bg-primary-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className={`text-base font-bold ${isActive ? 'text-dark-900' : 'text-dark-700'}`}>
                        {tab.title}
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-dark-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-xs leading-relaxed text-dark-500">{previewOf(tab)}</span>
                  </span>

                  {isActive && rotating && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-4 bottom-0 h-0.5 overflow-hidden rounded-full bg-primary-100"
                    >
                      <span
                        key={cycle}
                        className="waqf-identity-progress block h-full bg-primary-600"
                        style={{ animationDuration: `${autoRotateMs}ms`, transformOrigin: isRtl ? 'right' : 'left' }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="waqf-identity-panel"
            aria-labelledby={`waqf-identity-tab-${active.key}`}
            className="relative isolate min-h-[20rem] min-w-0 overflow-hidden rounded-[24px] border border-primary-100 bg-warm p-6 md:p-8 lg:h-0 lg:min-h-full"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -end-20 -top-24 -z-10 h-64 w-64 rounded-full bg-primary-100/70 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -start-10 -z-10 h-40 w-40 rounded-full bg-gold-100/80 blur-2xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-4 end-6 -z-10 select-none font-brand text-[7rem] font-bold leading-none text-primary-700/[0.05] md:text-[9rem]"
            >
              {String(activeIndex + 1).padStart(2, '0')}
            </span>

            <AnimatePresence custom={direction} mode="wait" initial={false}>
              <motion.div
                key={active.key}
                custom={direction}
                variants={panelVariants}
                initial={shouldReduceMotion ? 'reduced' : 'hidden'}
                animate={shouldReduceMotion ? 'reduced' : 'show'}
                exit={shouldReduceMotion ? undefined : 'exit'}
                className="flex h-full min-h-0 flex-col"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-[0_12px_30px_rgba(156,16,6,0.28)]">
                    <ActiveIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-primary-700">
                      <span dir="ltr">{`${String(activeIndex + 1).padStart(2, '0')} / ${String(tabs.length).padStart(2, '0')}`}</span>
                    </p>
                    <h3 className="text-2xl font-bold text-dark-900 md:text-3xl">{active.title}</h3>
                  </div>
                </div>

                <div className="mt-6 min-h-0 flex-1 overflow-y-auto pe-1">
                  {active.body && (
                    <p className="max-w-2xl text-base leading-relaxed text-dark-600 md:text-lg">{active.body}</p>
                  )}

                  {active.bullets && (
                    <motion.ol
                      variants={listVariants}
                      initial={shouldReduceMotion ? 'reduced' : 'hidden'}
                      animate={shouldReduceMotion ? 'reduced' : 'show'}
                      className="space-y-3"
                    >
                      {active.bullets.map((item, itemIndex) => (
                        <motion.li
                          key={item}
                          variants={itemVariants}
                          className="flex gap-3 rounded-2xl border border-primary-100 bg-white/80 px-4 py-3 text-sm leading-relaxed text-dark-600"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">
                            {String(itemIndex + 1).padStart(2, '0')}
                          </span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </motion.ol>
                  )}

                  {active.chips && (
                    <motion.ul
                      variants={listVariants}
                      initial={shouldReduceMotion ? 'reduced' : 'hidden'}
                      animate={shouldReduceMotion ? 'reduced' : 'show'}
                      className="flex flex-wrap gap-2.5"
                    >
                      {active.chips.map((item) => (
                        <motion.li
                          key={item}
                          variants={itemVariants}
                          className="rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm"
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {pinned && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 lg:flex"
          >
            {tabs.map((tab, index) => (
              <span
                key={tab.key}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-6 bg-primary-600' : 'w-1.5 bg-primary-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
