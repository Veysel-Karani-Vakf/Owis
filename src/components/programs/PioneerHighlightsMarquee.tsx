import { useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';

type PioneerHighlightsMarqueeProps = {
  label: string;
  items: string[];
};

export default function PioneerHighlightsMarquee({ label, items }: PioneerHighlightsMarqueeProps) {
  const { isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();

  if (!items?.length) return null;

  const track = [...items, ...items];

  return (
    <section
      aria-label={label}
      className="group relative isolate overflow-hidden border-y border-primary-800/40 bg-primary-700 text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(255,255,255,0.16),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-gradient-to-r from-primary-700 to-transparent rtl:bg-gradient-to-l md:w-28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-gradient-to-l from-primary-700 to-transparent rtl:bg-gradient-to-r md:w-28"
      />

      {shouldReduceMotion ? (
        <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4 text-sm font-bold md:px-8">
          {items.map((item, index) => (
            <li key={`${index}-${item}`} className="inline-flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary-200" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div dir="ltr" className="flex w-full">
          <ul
            className={`flex w-max shrink-0 items-center gap-10 py-4 [animation-duration:38s] group-hover:[animation-play-state:paused] md:gap-14 ${
              isRtl ? 'animate-marquee-rtl' : 'animate-marquee'
            }`}
          >
            {track.map((item, index) => (
              <li
                key={`${item}-${index}`}
                dir={isRtl ? 'rtl' : 'ltr'}
                aria-hidden={index >= items.length ? true : undefined}
                className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap text-sm font-bold tracking-wide md:text-base"
              >
                <Sparkles className="h-4 w-4 text-primary-200" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
