import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ProgramTheme } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

type AwarenessThemesProps = {
  eyebrow: string;
  title: string;
  description: string;
  themeLabel: string;
  hubTitle: string;
  themes: ProgramTheme[];
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

// Radar geometry (viewBox 0..400). Each theme sits on its own ring, fanned around the hub.
const RING_RADII = [78, 128, 172];
const NODE_ANGLES = [-70, 25, 150];

function polar(radius: number, angleDeg: number) {
  const angle = (angleDeg * Math.PI) / 180;
  return {
    x: 200 + radius * Math.cos(angle),
    y: 200 + radius * Math.sin(angle),
  };
}

export default function AwarenessThemes({
  eyebrow,
  title,
  description,
  themeLabel,
  hubTitle,
  themes,
}: AwarenessThemesProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const [activeId, setActiveId] = useState(themes[0]?.id ?? '');
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(
    0,
    themes.findIndex((theme) => theme.id === activeId),
  );
  const activeTheme = themes[activeIndex];
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // The section is taller than the viewport on large screens; the content pins while the
  // scroll position walks through the themes one by one (hover/click still work between scrolls).
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 0.1', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!themes.length) return;
    const next = Math.min(themes.length - 1, Math.max(0, Math.floor(progress * themes.length)));
    const nextId = themes[next]?.id;
    if (nextId) setActiveId((current) => (current === nextId ? current : nextId));
  });

  if (!themes.length || !activeTheme) return null;

  return (
    <div ref={trackRef} className="mx-auto max-w-7xl px-4 md:px-8 lg:min-h-[190vh]">
      <div className="grid gap-10 lg:sticky lg:top-24 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-12">
        <div className="text-start">
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: smoothEase }}
            className="mb-3 flex items-center gap-2"
          >
            <span className="h-px w-8 bg-primary-200" />
            <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
          </motion.div>
          <motion.h2
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.05 }}
            className="text-balance text-2xl font-bold leading-[1.3] text-dark-950 md:text-3xl"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: smoothEase, delay: 0.1 }}
            className="mt-3 max-w-xl text-sm leading-relaxed text-dark-600 md:text-base"
          >
            {description}
          </motion.p>

          <div role="list" className="mt-6 border-t border-dark-100">
            {themes.map((theme, index) => {
              const active = theme.id === activeTheme.id;

              return (
                <motion.div
                  role="listitem"
                  key={theme.id}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.55,
                    ease: smoothEase,
                    delay: index * 0.08,
                  }}
                  className="border-b border-dark-100"
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActiveId(theme.id)}
                    onFocus={() => setActiveId(theme.id)}
                    onClick={() => setActiveId(theme.id)}
                    aria-pressed={active}
                    aria-label={`${themeLabel} ${index + 1}: ${theme.title}`}
                    className="group relative grid w-full grid-cols-[auto_1fr_auto] items-start gap-4 py-4 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 md:gap-5 md:py-4"
                  >
                    <motion.span
                      aria-hidden="true"
                      initial={false}
                      animate={{ scaleY: active ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: smoothEase }}
                      className="absolute inset-y-4 start-0 w-[3px] origin-top rounded-full bg-primary-600"
                    />
                    <span
                      dir="ltr"
                      className={`ps-4 text-2xl font-black leading-none tabular-nums transition-colors duration-500 md:text-3xl ${
                        active ? 'text-primary-600' : 'text-dark-200 group-hover:text-dark-300'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-base font-bold leading-snug transition-colors duration-500 md:text-lg ${
                          active ? 'text-dark-950' : 'text-dark-700 group-hover:text-dark-950'
                        }`}
                      >
                        {theme.title}
                      </span>
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.span
                            key="description"
                            initial={reduced ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={reduced ? { opacity: 0, height: 'auto' } : { opacity: 0, height: 0 }}
                            transition={{ duration: 0.45, ease: smoothEase }}
                            className="block overflow-hidden"
                          >
                            <span className="block pt-2 text-sm leading-relaxed text-dark-600">
                              {theme.description}
                            </span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                        active
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-dark-200 text-dark-400 group-hover:border-dark-400'
                      }`}
                    >
                      <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div>
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="relative mx-auto w-full max-w-[26rem]"
          >
            <div className="relative isolate aspect-square overflow-hidden rounded-[32px] bg-dark-950 text-white shadow-[0_30px_80px_rgba(40,12,18,0.22)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(218,8,18,0.32),transparent_60%)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:40px_40px]"
              />

              <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
                {RING_RADII.map((radius, index) => (
                  <circle
                    key={radius}
                    cx="200"
                    cy="200"
                    r={radius}
                    fill="none"
                    stroke={index === activeIndex ? 'rgba(255,155,165,0.7)' : 'rgba(255,255,255,0.14)'}
                    strokeWidth={index === activeIndex ? 1.5 : 1}
                    strokeDasharray={index === activeIndex ? undefined : '3 6'}
                    className="transition-all duration-500"
                  />
                ))}

                {[0, 1].map((ring) => (
                  <motion.circle
                    key={ring}
                    cx="200"
                    cy="200"
                    r="40"
                    fill="none"
                    stroke="rgba(255,120,130,0.6)"
                    strokeWidth="1.2"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={reduced ? { scale: 1, opacity: 0 } : { scale: [0.5, 5], opacity: [0.7, 0] }}
                    transition={
                      reduced
                        ? { duration: 0.01 }
                        : {
                            duration: 5,
                            ease: 'easeOut',
                            repeat: Infinity,
                            delay: ring * 2.5,
                          }
                    }
                    style={{ transformOrigin: '200px 200px' }}
                  />
                ))}

                {themes.map((theme, index) => {
                  const point = polar(RING_RADII[index % RING_RADII.length], NODE_ANGLES[index % NODE_ANGLES.length]);
                  const active = index === activeIndex;

                  return (
                    <motion.line
                      key={`line-${theme.id}`}
                      x1="200"
                      y1="200"
                      x2={point.x}
                      y2={point.y}
                      stroke="rgba(255,255,255,0.9)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={false}
                      animate={{
                        pathLength: active ? 1 : 0,
                        opacity: active ? 1 : 0,
                      }}
                      transition={{
                        duration: reduced ? 0.01 : 0.6,
                        ease: smoothEase,
                      }}
                    />
                  );
                })}
              </svg>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-3 text-center shadow-[0_18px_40px_rgba(0,0,0,0.4)] ring-4 ring-primary-600/40">
                  <span className="text-balance text-[11px] font-black leading-tight text-dark-950 md:text-xs">
                    {hubTitle}
                  </span>
                </div>
              </div>

              {themes.map((theme, index) => {
                const point = polar(RING_RADII[index % RING_RADII.length], NODE_ANGLES[index % NODE_ANGLES.length]);
                const active = index === activeIndex;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onMouseEnter={() => setActiveId(theme.id)}
                    onFocus={() => setActiveId(theme.id)}
                    onClick={() => setActiveId(theme.id)}
                    aria-label={`${themeLabel} ${index + 1}: ${theme.title}`}
                    aria-pressed={active}
                    style={{
                      left: `${(point.x / 400) * 100}%`,
                      top: `${(point.y / 400) * 100}%`,
                    }}
                    className="group absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <motion.span
                      aria-hidden="true"
                      initial={false}
                      animate={{
                        scale: active ? 1 : 0.7,
                        opacity: active ? 1 : 0,
                      }}
                      transition={{ duration: 0.45, ease: smoothEase }}
                      className="absolute h-10 w-10 rounded-full bg-primary-500/35 blur-[2px]"
                    />
                    <motion.span
                      initial={false}
                      animate={{ scale: active ? 1 : 0.8 }}
                      transition={{ duration: 0.45, ease: smoothEase }}
                      className={`relative flex h-9 w-9 items-center justify-center rounded-full text-xs font-black transition-colors duration-500 ${
                        active
                          ? 'bg-primary-600 text-white'
                          : 'bg-white/15 text-white/80 backdrop-blur group-hover:bg-white/30'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </motion.span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
