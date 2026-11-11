import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Quote } from 'lucide-react';
import { awardMedia, awardSectionIds, type AwardContent } from '@/data/award/content';
import { useNarrowScreen, useRevealMotion } from '@/hooks/useResponsiveMotion';
import { AwardOrnament } from './AwardSectionHeading';
import { pillarIcons } from './awardIcons';
import { awardEase } from './awardUi';

type AwardAboutProps = {
  content: AwardContent;
};

/** Section B — editorial "about" block: copy and pillars beside an arched photograph. */
export default function AwardAbout({ content }: AwardAboutProps) {
  const { about } = content;
  const reduceMotion = useReducedMotion();
  const isNarrow = useNarrowScreen();
  const copy = useRevealMotion({ y: 22, duration: 0.7 });
  const lead = useRevealMotion({ y: 18, duration: 0.7, delay: 0.08 });
  const body = useRevealMotion({ y: 16, duration: 0.7, delay: 0.14 });

  return (
    <section
      id={awardSectionIds.about}
      tabIndex={-1}
      aria-labelledby="award-about-title"
      className="relative overflow-hidden bg-award-cream-50 py-20 focus:outline-none md:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
        <div className="text-start">
          <motion.div {...copy} className="flex flex-col items-start gap-4">
            <span className="inline-flex items-center gap-3 text-sm font-bold text-award-gold-600">
              <AwardOrnament className="[&>span:last-child]:hidden" />
              {about.eyebrow}
            </span>
            <h2
              id="award-about-title"
              className="font-brand text-[1.85rem] font-bold leading-tight text-award-ink sm:text-4xl lg:text-[2.6rem]"
            >
              {about.title}
            </h2>
          </motion.div>

          <motion.p
            {...lead}
            className="mt-5 text-lg font-bold leading-[1.75] text-award-green-800 sm:text-xl lg:text-[1.35rem]"
          >
            {about.lead}
          </motion.p>

          <motion.div {...body} className="mt-5 space-y-4 text-[15px] leading-[2] text-award-body sm:text-base">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>

          <ul className="mt-9 grid gap-3 sm:grid-cols-3">
            {about.pillars.map((pillar, index) => {
              const Icon = pillarIcons[pillar.id];

              return (
                <motion.li
                  key={pillar.id}
                  initial={reduceMotion ? false : { opacity: 0, y: isNarrow ? 12 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.1 + index * 0.08, ease: awardEase }}
                >
                  <div className="group h-full rounded-[20px] border border-award-line bg-white p-4 shadow-[0_10px_26px_rgba(15,56,60,0.04)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-award-green-200 hover:shadow-[0_18px_36px_rgba(15,56,60,0.08)] motion-reduce:hover:translate-y-0 sm:p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-award-green-50 text-award-green-700 transition-colors duration-300 group-hover:bg-award-green-700 group-hover:text-white">
                      <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 text-[15px] font-bold text-award-ink">{pillar.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-award-body">{pillar.description}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Arched photograph — a nod to the arched windows of Yemeni houses. */}
        <motion.figure
          initial={reduceMotion ? false : { opacity: 0, y: isNarrow ? 16 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: awardEase }}
          className="relative mx-auto w-full max-w-[25rem] lg:max-w-[27rem]"
        >
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-b-[34px] rounded-t-[999px] border border-award-gold-300/70 ltr:translate-x-3 rtl:-translate-x-3 sm:-inset-4"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-b-[30px] rounded-t-[999px] bg-award-cream-300 shadow-[0_30px_70px_rgba(15,56,60,0.18)]">
              <motion.img
                src={awardMedia.about.src}
                srcSet={awardMedia.about.srcSet}
                sizes="(min-width: 1024px) 430px, (min-width: 640px) 400px, 92vw"
                width={awardMedia.about.width}
                height={awardMedia.about.height}
                alt={about.imageAlt}
                loading="lazy"
                decoding="async"
                initial={reduceMotion ? false : { scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1.4, ease: awardEase }}
                className="h-full w-full object-cover object-[50%_20%] [filter:saturate(0.85)_sepia(0.08)]"
              />
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-award-green-950/90 via-award-green-950/45 to-transparent" />
              <motion.blockquote
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.75, delay: reduceMotion ? 0 : 0.35, ease: awardEase }}
                className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7"
              >
                <Quote className="h-7 w-7 text-award-gold-300 rtl:-scale-x-100" aria-hidden="true" />
                {/* Arabic takes the display face; the Latin display face is all caps, so en/tr stay in italics. */}
                <p className="mt-2 text-base font-bold leading-[1.8] sm:text-lg rtl:font-brand ltr:italic">
                  {about.quote}
                </p>
              </motion.blockquote>
            </div>
          </div>

          <figcaption className="mt-7 flex items-center justify-center gap-2 text-[13px] font-semibold text-award-body">
            <MapPin className="h-4 w-4 shrink-0 text-award-gold-500" aria-hidden="true" />
            {about.imageCaption}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
