import { motion, useReducedMotion } from 'framer-motion';
import { Building2, Gauge, Route, Workflow, type LucideIcon } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/useI18n';

type InstitutionalMapProps = {
  eyebrow: string;
  title: string;
  description: string;
  areaLabel: string;
  hubTitle: string;
  hubSubtitle?: string;
  items: string[];
  autoRotateMs?: number;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
const areaIcons: LucideIcon[] = [Gauge, Workflow, Route];
const CONNECTOR_WIDTH = 120;

function connectorPath(fromY: number, toY: number) {
  const c1 = CONNECTOR_WIDTH * 0.5;
  return `M 0 ${fromY} C ${c1} ${fromY}, ${CONNECTOR_WIDTH - c1} ${toY}, ${CONNECTOR_WIDTH} ${toY}`;
}

export default function InstitutionalMap({
  eyebrow,
  title,
  description,
  areaLabel,
  hubTitle,
  hubSubtitle,
  items,
  autoRotateMs = 4200,
}: InstitutionalMapProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [geometry, setGeometry] = useState<{ height: number; centers: number[] }>({ height: 0, centers: [] });
  const sectionRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  const rotating = !reduced && !paused && inView && items.length > 1;

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => setActiveIndex((current) => (current + 1) % items.length), autoRotateMs);
    return () => window.clearTimeout(timer);
  }, [rotating, activeIndex, autoRotateMs, items.length]);

  // Measure the branch cards so the connectors land exactly on each card's vertical centre.
  useLayoutEffect(() => {
    const column = columnRef.current;
    if (!column) return;
    const measure = () => {
      const rect = column.getBoundingClientRect();
      const centers = cardRefs.current.map((card) => {
        if (!card) return 0;
        const r = card.getBoundingClientRect();
        return r.top - rect.top + r.height / 2;
      });
      setGeometry({ height: rect.height, centers });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(column);
    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, [items.length]);

  if (!items.length) return null;

  const hubY = geometry.height / 2;
  const ready = geometry.height > 0 && geometry.centers.length === items.length;

  return (
    <div
      ref={sectionRef}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="mx-auto max-w-7xl px-4 md:px-8"
    >
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-primary-200" />
          <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
          <span className="h-px w-8 bg-primary-200" />
        </div>
        <h2 className="text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{title}</h2>
        <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(15rem,0.8fr)_auto_1.2fr] md:gap-0">
        {/* Hub */}
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, x: isRtl ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: smoothEase }}
          className="flex"
        >
          <div className="relative isolate flex w-full flex-col items-center justify-center overflow-hidden rounded-[28px] border border-primary-700 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-8 text-center text-white shadow-[0_28px_70px_rgba(156,16,6,0.32)] md:min-h-[24rem]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            />
            {!reduced && (
              <motion.svg
                aria-hidden="true"
                viewBox="0 0 200 200"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="pointer-events-none absolute -bottom-16 -start-16 h-56 w-56 text-white/15"
              >
                <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 10" />
              </motion.svg>
            )}

            <span className="relative flex h-20 w-20 items-center justify-center rounded-[22px] bg-white text-primary-700 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
              {!reduced && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 animate-ping rounded-[22px] bg-white/40"
                  style={{ animationDuration: '2.6s' }}
                />
              )}
              <Building2 className="h-9 w-9" aria-hidden="true" />
            </span>
            <h3 className="relative mt-6 text-2xl font-bold leading-snug md:text-3xl">{hubTitle}</h3>
            {hubSubtitle && <p className="relative mt-3 max-w-xs text-sm leading-relaxed text-white/80">{hubSubtitle}</p>}

            <div className="relative mt-6 flex items-center gap-2" aria-hidden="true">
              {items.map((item, index) => (
                <span
                  key={item}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === activeIndex ? 'w-8 bg-white' : 'w-3 bg-white/35'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Connectors (desktop only) */}
        <div className="relative hidden md:block" style={{ width: CONNECTOR_WIDTH }} aria-hidden="true">
          {ready && (
            <svg
              viewBox={`0 0 ${CONNECTOR_WIDTH} ${geometry.height}`}
              width={CONNECTOR_WIDTH}
              height={geometry.height}
              className={`absolute inset-0 h-full w-full overflow-visible ${isRtl ? '-scale-x-100' : ''}`}
            >
              <defs>
                <linearGradient id="institutional-map-flow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffc8ce" />
                  <stop offset="100%" stopColor="#c30710" />
                </linearGradient>
              </defs>
              {items.map((item, index) => {
                const d = connectorPath(hubY, geometry.centers[index]);
                const isActive = index === activeIndex;
                return (
                  <g key={item}>
                    <motion.path
                      d={d}
                      fill="none"
                      strokeWidth={2}
                      strokeLinecap="round"
                      initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.9, ease: smoothEase, delay: 0.25 + index * 0.15 }}
                      className={`transition-[stroke] duration-500 ${isActive ? 'stroke-primary-300' : 'stroke-primary-200'}`}
                    />
                    {isActive && (
                      <>
                        <motion.path
                          d={d}
                          fill="none"
                          stroke="url(#institutional-map-flow)"
                          strokeWidth={3}
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.6, ease: smoothEase }}
                        />
                        {!reduced && (
                          <circle r="5" className="fill-primary-600 drop-shadow-[0_0_6px_rgba(218,8,18,0.7)]">
                            <animateMotion dur="1.8s" repeatCount="indefinite" path={d} />
                          </circle>
                        )}
                      </>
                    )}
                    <circle cx={CONNECTOR_WIDTH} cy={geometry.centers[index]} r={isActive ? 5 : 3.5} className={`transition-all duration-500 ${isActive ? 'fill-primary-600' : 'fill-primary-200'}`} />
                  </g>
                );
              })}
              <circle cx={0} cy={hubY} r={5} className="fill-primary-700" />
            </svg>
          )}
        </div>

        {/* Branches */}
        <ol ref={columnRef} className="relative grid gap-4 md:gap-5">
          {/* Mobile vertical connector */}
          <span aria-hidden="true" className="absolute bottom-6 start-7 top-0 -z-10 w-px bg-primary-100 md:hidden" />
          {items.map((item, index) => {
            const Icon = areaIcons[index % areaIcons.length];
            const isActive = index === activeIndex;
            return (
              <motion.li
                key={item}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                initial={reduced ? { opacity: 1 } : { opacity: 0, x: isRtl ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: smoothEase, delay: 0.15 + index * 0.12 }}
              >
                <button
                  type="button"
                  aria-pressed={isActive}
                  onPointerEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`group relative isolate flex w-full items-center gap-5 overflow-hidden rounded-[24px] border bg-white p-5 text-start transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 md:p-6 ${
                    isActive
                      ? 'border-primary-300 shadow-[0_24px_56px_rgba(156,16,6,0.16)] md:-translate-x-1 rtl:md:translate-x-1'
                      : 'border-primary-100 shadow-[0_14px_36px_rgba(40,12,18,0.06)] hover:border-primary-200'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-y-0 start-0 w-1.5 bg-primary-600 transition-transform duration-500 ${
                      isActive ? 'scale-y-100' : 'scale-y-0'
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -end-4 -top-6 select-none text-[5.5rem] font-black leading-none transition-colors duration-500 ${
                      isActive ? 'text-primary-50' : 'text-transparent'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span
                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-[0_12px_26px_rgba(195,7,16,0.32)]'
                        : 'bg-primary-50 text-primary-700 ring-1 ring-primary-100'
                    }`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>

                  <span className="relative min-w-0 flex-1">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-primary-600">
                      {areaLabel}
                      <span dir="ltr" className="tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </span>
                    <span
                      className={`mt-1.5 block text-base font-bold leading-relaxed transition-colors duration-300 md:text-lg ${
                        isActive ? 'text-dark-950' : 'text-dark-700'
                      }`}
                    >
                      {item}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
