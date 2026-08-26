import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { Eye, History, Sparkles, Telescope, type LucideIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ProgramTheme } from '@/data/programs';
import { resolveIcon } from '@/lib/icons';

type AwarenessThemesProps = {
  eyebrow: string;
  title: string;
  description: string;
  themeLabel: string;
  hubTitle: string;
  themes: ProgramTheme[];
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

// One icon per circle: history read, present studied, future anticipated.
const themeIcons: Record<string, LucideIcon> = {
  'read-history': History,
  'study-present': Eye,
  'anticipate-future': Telescope,
};
const fallbackIcons: LucideIcon[] = [History, Eye, Telescope];

const TICKS = 36;

export default function AwarenessThemes({
  eyebrow,
  title,
  description,
  themeLabel,
  hubTitle,
  themes,
}: AwarenessThemesProps) {
  const reduced = !!useReducedMotion();
  const [activeId, setActiveId] = useState(themes[0]?.id ?? '');
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(
    0,
    themes.findIndex((theme) => theme.id === activeId),
  );
  const activeTheme = themes[activeIndex];
  // Editor-chosen icon first, then the seeded id map, then the positional defaults.
  const ActiveIcon = activeTheme
    ? resolveIcon(
        activeTheme.icon,
        [themeIcons[activeTheme.id] ?? fallbackIcons[activeIndex] ?? Sparkles],
        activeIndex,
      )
    : Sparkles;

  // The section is taller than the viewport on large screens; the stage pins while the
  // scroll position walks through the circles one by one (hover/click still work between scrolls).
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 0.1', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!themes.length) return;
    const next = Math.min(themes.length - 1, Math.max(0, Math.floor(progress * themes.length)));
    const nextId = themes[next]?.id;
    if (nextId) setActiveId((current) => (current === nextId ? current : nextId));
  });

  if (!themes.length || !activeTheme) return null;

  const fillPercent = themes.length > 1 ? (activeIndex / (themes.length - 1)) * 100 : 100;

  return (
    <div ref={trackRef} className="mx-auto max-w-7xl px-4 md:px-8 lg:min-h-[190vh]">
      <div className="lg:sticky lg:top-24 lg:flex lg:min-h-[calc(100vh-6rem)] lg:flex-col lg:justify-center lg:pb-4">
        <div className="mx-auto mb-6 max-w-3xl text-center md:mb-8 [@media(min-height:900px)]:md:mb-12">
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: smoothEase }}
            className="mb-4 flex items-center justify-center gap-2"
          >
            <span className="h-px w-8 bg-primary-200" />
            <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
            <span className="h-px w-8 bg-primary-200" />
          </motion.div>
          <motion.h2
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.05 }}
            className="text-balance text-3xl font-bold leading-[1.3] text-dark-950 md:text-4xl"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.1 }}
            className="mt-3 text-sm leading-relaxed text-dark-600 md:text-base"
          >
            {description}
          </motion.p>
        </div>

        {/* One stage carries everything: the platform chip, the active circle's story, and the
            timeline the three circles stand on — so the whole journey reads as a single unit. */}
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 26, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="relative isolate overflow-hidden rounded-[32px] bg-dark-950 p-6 text-white shadow-[0_30px_80px_rgba(40,12,18,0.22)] md:p-8 [@media(min-height:900px)]:lg:p-12"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_10%,rgba(218,8,18,0.3),transparent_55%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:48px_48px]"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/85 backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-500" />
              </span>
              {hubTitle}
            </span>
            <span dir="ltr" className="text-sm font-black tabular-nums tracking-widest text-white/40">
              {String(activeIndex + 1).padStart(2, '0')} / {String(themes.length).padStart(2, '0')}
            </span>
          </div>

          <div className="relative mt-7 min-h-[180px] md:min-h-[165px] [@media(min-height:900px)]:lg:mt-10 [@media(min-height:900px)]:lg:min-h-[190px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`ghost-${activeTheme.id}`}
                aria-hidden="true"
                dir="ltr"
                initial={reduced ? { opacity: 1 } : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 }}
                transition={{ duration: reduced ? 0.01 : 0.45, ease: smoothEase }}
                className="pointer-events-none absolute -top-8 end-0 select-none text-[8rem] font-black leading-none tabular-nums text-white/[0.05] md:text-[10rem] [@media(min-height:900px)]:lg:text-[13rem]"
              >
                {String(activeIndex + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTheme.id}
                initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0, y: 0 } : { opacity: 0, y: -14 }}
                transition={{ duration: reduced ? 0.01 : 0.4, ease: smoothEase }}
                className="relative max-w-2xl text-start"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary-300">
                    <ActiveIcon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-black text-white/70">
                    {themeLabel} {String(activeIndex + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-4 text-balance text-3xl font-bold leading-tight [@media(min-height:900px)]:lg:mt-5 [@media(min-height:900px)]:lg:text-4xl">
                  {activeTheme.title}
                </h3>
                <p className="mt-2.5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
                  {activeTheme.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The journey line: it starts at the platform, fills red up to the active circle,
              and every station stands on it — nothing floats loose. */}
          <div className="relative mt-8 [@media(min-height:900px)]:lg:mt-12">
            <div aria-hidden="true" className="absolute -top-4 inset-x-6 flex justify-between md:inset-x-8">
              {Array.from({ length: TICKS }).map((_, index) => (
                <span key={index} className={`h-2.5 w-px ${index % 6 === 0 ? 'bg-white/25' : 'bg-white/10'}`} />
              ))}
            </div>

            {/* Inset so the line's ends sit exactly under the first and last station circles. */}
            <div aria-hidden="true" className="absolute top-[22px] inset-x-[52px] h-[3px] rounded-full bg-white/10 sm:inset-x-[68px] md:inset-x-[88px]">
              <motion.div
                initial={false}
                animate={{ width: `${fillPercent}%` }}
                transition={{ duration: reduced ? 0.01 : 0.7, ease: smoothEase }}
                className="absolute inset-y-0 start-0 rounded-full bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 rtl:bg-gradient-to-l"
              >
                <span className="absolute end-0 top-1/2 flex h-3 w-3 -translate-y-1/2 translate-x-1/2 rtl:-translate-x-1/2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-400" />
                </span>
              </motion.div>
            </div>

            <div className="relative flex items-start justify-between px-1 md:px-2">
              {themes.map((theme, index) => {
                const active = index === activeIndex;
                const passed = index < activeIndex;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onMouseEnter={() => setActiveId(theme.id)}
                    onFocus={() => setActiveId(theme.id)}
                    onClick={() => setActiveId(theme.id)}
                    aria-pressed={active}
                    aria-label={`${themeLabel} ${index + 1}: ${theme.title}`}
                    className="group z-10 flex w-24 flex-col items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-32 md:w-40"
                  >
                    <span className="relative flex h-11 w-11 items-center justify-center">
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500/40 motion-reduce:animate-none"
                        />
                      )}
                      <span
                        dir="ltr"
                        className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-black tabular-nums transition-all duration-500 ${
                          active
                            ? 'scale-110 border-primary-400 bg-primary-600 text-white shadow-[0_0_30px_rgba(218,8,18,0.55)]'
                            : passed
                              ? 'border-primary-500/60 bg-dark-950 text-primary-300'
                              : 'border-white/20 bg-dark-950 text-white/55 group-hover:border-white/45 group-hover:text-white/80'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </span>
                    <span
                      className={`text-balance text-center text-[11px] font-bold leading-snug transition-colors duration-500 sm:text-xs md:text-sm ${
                        active ? 'text-white' : passed ? 'text-primary-200/80' : 'text-white/45 group-hover:text-white/70'
                      }`}
                    >
                      {theme.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
