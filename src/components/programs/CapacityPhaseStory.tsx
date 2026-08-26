import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { CalendarDays, Handshake, Megaphone, Users, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import type { ProgramPhase, ProgramSection } from '@/data/programs';

type CapacityPhaseStoryProps = {
  eyebrow: string;
  section: ProgramSection;
  phase?: ProgramPhase;
  images: string[];
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
const stepIcons: LucideIcon[] = [CalendarDays, Handshake, Users, Megaphone];

export default function CapacityPhaseStory({ eyebrow, section, phase, images }: CapacityPhaseStoryProps) {
  const reduced = !!useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.75', 'end 0.6'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  const lineScale = useTransform(progress, [0, 1], reduced ? [1, 1] : [0, 1]);

  const paragraphs = section?.paragraphs ?? [];
  const collage = (images ?? []).filter(Boolean).slice(0, 3);

  if (!section) return null;

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div className="text-start lg:sticky lg:top-28 lg:self-start">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600" />
          <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
        </div>
        <h2 className="text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{section.title}</h2>
        {phase && (
          <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{phase.description}</p>
        )}

        {collage.length > 0 && (
          <div className="relative mt-8 h-56 max-w-md sm:h-64">
            {collage.map((image, index) => {
              const offsets = [
                'start-0 top-0 w-[58%] rotate-[-3deg]',
                'end-0 top-6 w-[52%] rotate-[4deg]',
                'start-[22%] top-20 w-[56%] rotate-[-1deg]',
              ];
              return (
                <motion.figure
                  key={`${index}-${image}`}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 26, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, ease: smoothEase, delay: index * 0.14 }}
                  whileHover={reduced ? undefined : { y: -8, rotate: 0, zIndex: 10 }}
                  className={`absolute aspect-[4/3] overflow-hidden rounded-[18px] border-4 border-white bg-dark-950 shadow-[0_20px_48px_rgba(40,12,18,0.18)] ${offsets[index] ?? ''}`}
                  style={{ zIndex: index }}
                >
                  <img src={image} alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover" />
                </motion.figure>
              );
            })}
          </div>
        )}
      </div>

      <ol ref={listRef} className="relative space-y-5 ps-10 text-start md:ps-12">
        <span aria-hidden="true" className="absolute bottom-8 start-[1.05rem] top-8 w-px bg-primary-100 md:start-[1.3rem]" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: lineScale }}
          className="absolute bottom-8 start-[1.05rem] top-8 w-px origin-top bg-gradient-to-b from-primary-600 via-primary-500 to-primary-300 md:start-[1.3rem]"
        />

        {paragraphs.map((paragraph, index) => {
          const Icon = stepIcons[index % stepIcons.length];
          return (
            <motion.li
              key={`${index}-${paragraph}`}
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, ease: smoothEase }}
              className="relative"
            >
              <motion.span
                aria-hidden="true"
                initial={reduced ? { scale: 1 } : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.15 }}
                className="absolute -start-10 top-6 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-primary-600 text-white shadow-[0_0_0_3px_rgba(255,225,228,1),0_12px_24px_rgba(195,7,16,0.28)] md:-start-12 md:h-11 md:w-11"
              >
                <Icon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
              </motion.span>

              <article className="group rounded-[24px] border border-primary-100 bg-white p-6 shadow-[0_18px_48px_rgba(40,12,18,0.07)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_26px_60px_rgba(156,16,6,0.12)] motion-reduce:hover:translate-y-0 md:p-7">
                <span className="text-xs font-bold text-primary-600">
                  <span dir="ltr" className="tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </span>
                <p className="mt-2 text-base leading-relaxed text-dark-700 md:text-[17px]">{paragraph}</p>
                <span
                  aria-hidden="true"
                  className="mt-5 block h-1 w-10 rounded-full bg-primary-600 transition-[width] duration-500 group-hover:w-24"
                />
              </article>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
