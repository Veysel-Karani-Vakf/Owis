import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Handshake, MapPin, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ProgramCity } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

type ActiveVideo = {
  videoId: string;
  videoFile?: string;
  title: string;
  posterImage: string;
};

type CapacityCitiesProps = {
  eyebrow: string;
  title: string;
  description: string;
  cities: ProgramCity[];
  labels: {
    partner: string;
    watchVideo: string;
  };
  onVideoSelect: (video: ActiveVideo) => void;
  autoRotateMs?: number;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

// The dashboard's video widget stores `posterImage`, while the static city
// shape uses `image`; both spellings are honoured here.
type CityRecord = ProgramCity & { posterImage?: string };

function cityImage(city: CityRecord) {
  return city.image || city.posterImage || '';
}

export default function CapacityCities({
  eyebrow,
  title,
  description,
  cities,
  labels,
  onVideoSelect,
  autoRotateMs = 6500,
}: CapacityCitiesProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [cycle, setCycle] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const list: CityRecord[] = cities ?? [];
  const active = list[activeIndex] ?? list[0];
  const rotating = !reduced && !paused && inView && autoRotateMs > 0 && list.length > 1;

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % list.length);
      setCycle((value) => value + 1);
    }, autoRotateMs);
    return () => window.clearTimeout(timer);
  }, [rotating, activeIndex, autoRotateMs, list.length, cycle]);

  if (!active) return null;

  const goTo = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setCycle((value) => value + 1);
  };

  const slideX = (isRtl ? -1 : 1) * direction;

  return (
    <div
      ref={sectionRef}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="mx-auto max-w-7xl px-4 md:px-8"
    >
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-primary-200" />
          <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
          <span className="h-px w-8 bg-primary-200" />
        </div>
        <h2 className="text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{title}</h2>
        <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr] lg:gap-8">
        {/* City selector */}
        <div role="tablist" aria-label={title} className="order-2 flex gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {list.map((city, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={city.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`capacity-city-panel-${city.id}`}
                id={`capacity-city-tab-${city.id}`}
                onClick={() => goTo(index)}
                className={`group relative isolate flex min-w-[15rem] shrink-0 items-center gap-4 overflow-hidden rounded-[22px] border p-4 text-start transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 lg:min-w-0 ${
                  isActive
                    ? 'border-primary-200 bg-white shadow-[0_20px_48px_rgba(156,16,6,0.14)]'
                    : 'border-primary-100 bg-white/70 hover:border-primary-200 hover:bg-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="capacity-city-active"
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    className="absolute inset-y-3 start-0 w-1.5 rounded-full bg-primary-600"
                  />
                )}
                <span
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-2 transition-all duration-300 ${
                    isActive ? 'ring-primary-600' : 'ring-transparent group-hover:ring-primary-200'
                  }`}
                >
                  <img
                    src={cityImage(city)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className={`h-full w-full object-cover transition-transform duration-500 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-[11px] font-bold text-primary-600">
                    <span dir="ltr" className="tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="h-px w-5 bg-primary-200" />
                  </span>
                  <span
                    className={`mt-1 block text-base font-bold transition-colors ${
                      isActive ? 'text-dark-950' : 'text-dark-700'
                    }`}
                  >
                    {city.name}
                  </span>
                  {city.partner && (
                    <span className="mt-0.5 line-clamp-1 block text-xs text-dark-500">{city.partner}</span>
                  )}
                </span>

                {isActive && rotating && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 bottom-0 h-0.5 overflow-hidden rounded-full bg-primary-100"
                  >
                    <motion.span
                      key={`${activeIndex}-${cycle}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: autoRotateMs / 1000, ease: 'linear' }}
                      className="block h-full origin-left bg-primary-600 rtl:origin-right"
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Showcase panel */}
        <div className="order-1 lg:order-2">
          <div
            role="tabpanel"
            id={`capacity-city-panel-${active.id}`}
            aria-labelledby={`capacity-city-tab-${active.id}`}
            className="relative isolate aspect-[4/3] overflow-hidden rounded-[28px] border border-primary-100 bg-dark-950 shadow-[0_30px_70px_rgba(40,12,18,0.18)] sm:aspect-[16/10]"
          >
            <AnimatePresence initial={false} custom={slideX} mode="popLayout">
              <motion.img
                key={active.id}
                src={cityImage(active)}
                alt={active.imageAlt ?? ''}
                custom={slideX}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.08, x: `${6 * slideX}%` }}
                animate={{ opacity: 1, scale: 1, x: '0%' }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.03, x: `${-4 * slideX}%` }}
                transition={{ duration: reduced ? 0.2 : 0.7, ease: smoothEase }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/25 to-dark-950/10"
            />

            <div className="absolute start-5 top-5 flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
              <MapPin className="h-3.5 w-3.5 text-primary-200" aria-hidden="true" />
              <span dir="ltr" className="tabular-nums">
                {String(activeIndex + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 text-start text-white md:p-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: smoothEase }}
                >
                  <h3 className="text-2xl font-bold md:text-3xl">{active.name}</h3>
                  {active.partner && (
                    <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-white/85 md:text-[15px]">
                      <Handshake className="mt-0.5 h-4 w-4 shrink-0 text-primary-200" aria-hidden="true" />
                      <span>
                        <span className="font-bold text-white">{labels.partner}</span> {active.partner}
                      </span>
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onVideoSelect({
                      videoId: active.videoId,
                      videoFile: active.videoFile,
                      title: active.videoTitle || active.name,
                      posterImage: cityImage(active),
                    })
                  }
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-primary-700 shadow-[0_14px_30px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-0.5 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white">
                    {!reduced && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 animate-ping rounded-full bg-primary-400/60"
                        style={{ animationDuration: '1.8s' }}
                      />
                    )}
                    <Play className="relative h-3 w-3 fill-current" aria-hidden="true" />
                  </span>
                  {labels.watchVideo}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
