import useEmblaCarousel from 'embla-carousel-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Play } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { ProgramVideo } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

export type CarouselVideoSelection = {
  videoId: string;
  title: string;
  posterImage: string;
};

type PioneerVideoCarouselProps = {
  eyebrow: string;
  title: string;
  description: string;
  videos: ProgramVideo[];
  labels: {
    watchVideo: string;
    officialSource: string;
    previous: string;
    next: string;
  };
  onVideoSelect: (video: CarouselVideoSelection) => void;
  autoplayMs?: number;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

export default function PioneerVideoCarousel({
  eyebrow,
  title,
  description,
  videos,
  labels,
  onVideoSelect,
  autoplayMs = 5500,
}: PioneerVideoCarouselProps) {
  const { isRtl } = useI18n();
  const shouldReduceMotion = !!useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: videos.length > 2,
    align: 'center',
    direction: isRtl ? 'rtl' : 'ltr',
    skipSnaps: false,
  });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({ direction: isRtl ? 'rtl' : 'ltr' });
  }, [emblaApi, isRtl]);

  useEffect(() => {
    if (!emblaApi || shouldReduceMotion || paused || autoplayMs <= 0 || videos.length < 2) return;
    const timer = window.setInterval(() => emblaApi.scrollNext(), autoplayMs);
    return () => window.clearInterval(timer);
  }, [emblaApi, shouldReduceMotion, paused, autoplayMs, videos.length, selected]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!videos.length) return null;

  const PrevIcon = isRtl ? ArrowRight : ArrowLeft;
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl text-start">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-600" />
              <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
            </div>
            <h2 className="text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-dark-600 md:text-base">{description}</p>
          </div>

          <div className="flex items-center gap-3">
            <span dir="ltr" className="text-sm font-bold tabular-nums text-dark-500">
              {String(selected + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label={labels.previous}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
            >
              <PrevIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label={labels.next}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-[0_12px_26px_rgba(195,7,16,0.3)] transition-all hover:-translate-y-0.5 hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
            >
              <NextIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div ref={emblaRef} className="mt-10 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex touch-pan-y">
          {videos.map((video, index) => {
            const isActive = index === selected;

            return (
              <div
                key={video.id}
                className="min-w-0 shrink-0 grow-0 basis-[84%] pe-5 sm:basis-[62%] lg:basis-[46%] xl:basis-[38%]"
              >
                <motion.article
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { scale: isActive ? 1 : 0.93, opacity: isActive ? 1 : 0.62, y: isActive ? 0 : 12 }
                  }
                  transition={{ duration: 0.5, ease: smoothEase }}
                  className={`overflow-hidden rounded-[26px] border bg-white text-start shadow-[0_18px_48px_rgba(40,12,18,0.08)] transition-[border-color,box-shadow] duration-500 ${
                    isActive ? 'border-primary-200 shadow-[0_30px_72px_rgba(40,12,18,0.16)]' : 'border-primary-100'
                  }`}
                >
                  <button
                    type="button"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => {
                      if (!isActive) {
                        emblaApi?.scrollTo(index);
                        return;
                      }
                      onVideoSelect({ videoId: video.videoId, title: video.title, posterImage: video.posterImage });
                    }}
                    className="group relative block aspect-video w-full overflow-hidden bg-dark-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                    aria-label={`${labels.watchVideo}: ${video.title}`}
                  >
                    <img
                      src={video.posterImage}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-dark-950/10 to-transparent" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary-700 shadow-xl transition-transform duration-300 group-hover:scale-110">
                        {isActive && !shouldReduceMotion && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 animate-ping rounded-full bg-white/60"
                            style={{ animationDuration: '2s' }}
                          />
                        )}
                        <Play className="h-7 w-7 fill-current" aria-hidden="true" />
                      </span>
                    </span>
                    <span className="absolute bottom-4 start-4 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      <span dir="ltr">{String(index + 1).padStart(2, '0')}</span>
                    </span>
                  </button>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-dark-950">{video.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-dark-600">{video.description}</p>
                    <a
                      href={video.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isActive ? 0 : -1}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
                    >
                      {labels.officialSource}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </motion.article>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label={title}>
        {videos.map((video, index) => {
          const isActive = index === selected;
          return (
            <button
              key={video.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={video.title}
              onClick={() => emblaApi?.scrollTo(index)}
              className="group flex h-8 items-center px-0.5"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'w-8 bg-primary-600' : 'w-2 bg-primary-200 group-hover:bg-primary-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
