import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { awardImageAttrs, awardMedia, awardSectionIds, type AwardContent } from '@/data/award/content';
import { awardRoutes } from '@/data/award/routes';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';
import { useI18n } from '@/i18n/useI18n';
import { quickLinkIcons } from './awardIcons';
import { awardButton, awardEase, scrollToAwardSection } from './awardUi';

type AwardHeroProps = {
  content: AwardContent;
};

// Sparkles around the trophy (percent positions inside the trophy stage, size in px).
const SPARKLES: [number, number, number][] = [
  [12, 18, 3],
  [84, 12, 2],
  [92, 38, 3],
  [6, 52, 2],
  [18, 80, 2],
  [78, 74, 3],
  [64, 6, 2],
  [34, 92, 2],
  [96, 64, 2],
  [4, 30, 2],
  [50, 2, 2],
  [88, 88, 2],
];

/**
 * Landing hero after the official 2026 poster: the gold trophy on a deep-red
 * glow with concentric rings and sparkles, the two partner marks, "back again",
 * the title, the "second edition | 2026" pill and the hashtag. The site header
 * keeps its usual transparent state above it.
 */
export default function AwardHero({ content }: AwardHeroProps) {
  const { hero, labels, media } = content;
  const { isRtl, locale } = useI18n();
  const reduceMotion = useReducedMotion();
  const isNarrow = useNarrowScreen();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const float = !reduceMotion && !isNarrow;

  const rise = (delay: number, distance = 22) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: distance },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: awardEase },
        };

  // Latin display type (en/tr) runs wider than Arabic, so it gets a smaller scale.
  const titleSize = isRtl
    ? 'text-[clamp(2.2rem,9.5vw,2.9rem)] sm:text-5xl lg:text-[3.6rem] xl:text-[4.1rem]'
    : 'text-[clamp(1.9rem,8vw,2.4rem)] sm:text-[2.6rem] lg:text-[2.9rem] xl:text-[3.2rem]';

  return (
    <>
      <section
        id="award-hero"
        aria-labelledby="award-hero-title"
        className="relative isolate overflow-hidden bg-dark-950"
      >
        {/* The poster's red: brightest behind the trophy, falling to near black at the edges. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_28%,#b4121c_0%,#8a0b14_24%,#4d0306_55%,#1a0102_90%)] lg:ltr:bg-[radial-gradient(circle_at_72%_52%,#b4121c_0%,#8a0b14_22%,#4d0306_50%,#1a0102_82%)] lg:rtl:bg-[radial-gradient(circle_at_28%_52%,#b4121c_0%,#8a0b14_22%,#4d0306_50%,#1a0102_82%)]"
        />
        <div aria-hidden="true" className="geometric-pattern absolute inset-0 -z-10 opacity-10" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-dark-950/50 to-transparent"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-32 pt-28 md:px-8 lg:min-h-[720px] lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-40 lg:pt-32 xl:min-h-[760px]">
          <div className="mx-auto w-full max-w-[36rem] text-center lg:mx-0 lg:max-w-[40rem] lg:text-start">
            {/* Partner marks, as on the poster */}
            <motion.ul {...rise(0.05, 12)} className="mb-7 inline-flex items-center gap-4 sm:gap-5">
              <li>
                <img
                  src={media.logoVolunteerUnit}
                  alt={hero.partners.volunteerUnit}
                  width={278}
                  height={320}
                  className="h-14 w-auto brightness-0 invert sm:h-16 lg:h-[4.5rem]"
                />
              </li>
              <li aria-hidden="true" className="h-12 w-px bg-white/30 sm:h-14" />
              <li>
                <img
                  src={media.logoMaan}
                  alt={hero.partners.maan}
                  width={201}
                  height={320}
                  className="h-16 w-auto sm:h-[4.5rem] lg:h-20"
                />
              </li>
            </motion.ul>

            <motion.p
              {...rise(0.12, 14)}
              className="flex items-center justify-center gap-3 text-[15px] font-semibold text-white/85 sm:text-base lg:justify-start"
            >
              <span aria-hidden="true" className="h-px w-8 bg-primary-300" />
              {hero.eyebrow}
            </motion.p>

            <h1 id="award-hero-title" className={`mt-4 font-brand font-bold leading-[1.18] text-white ${titleSize}`}>
              {hero.titleLines.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em] lg:whitespace-nowrap">
                  <motion.span
                    className="block"
                    {...(reduceMotion
                      ? {}
                      : {
                          initial: { y: '105%' },
                          animate: { y: '0%' },
                          transition: { duration: 0.9, delay: 0.25 + index * 0.12, ease: awardEase },
                        })}
                  >
                    {line}
                  </motion.span>{' '}
                </span>
              ))}
              <span className="sr-only"> {hero.year}</span>
            </h1>

            <motion.p
              {...rise(0.5, 14)}
              className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[15px] font-bold text-white backdrop-blur-sm sm:text-base"
            >
              {hero.edition}
              <span aria-hidden="true" className="h-4 w-px bg-white/40" />
              <span className="font-latin tracking-wide">{hero.year}</span>
            </motion.p>

            <motion.p
              {...rise(0.65)}
              className="mx-auto mt-6 max-w-[34rem] text-[15px] leading-[1.95] text-white/80 sm:text-lg lg:mx-0"
            >
              {hero.description}
            </motion.p>

            <motion.div
              {...rise(0.8)}
              className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <Link to={awardRoutes.apply} className={awardButton.light}>
                {hero.primaryCta}
                <ArrowIcon
                  className={`h-[18px] w-[18px] transition-transform duration-300 ${
                    isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                  }`}
                  aria-hidden="true"
                />
              </Link>
              <a
                href={`#${awardSectionIds.eligibility}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToAwardSection(awardSectionIds.eligibility);
                }}
                className={awardButton.secondaryOnDark}
              >
                {hero.secondaryCta}
              </a>
            </motion.div>

            <motion.div
              {...rise(0.95, 10)}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 lg:justify-start"
            >
              <span className="text-sm font-bold tracking-wide text-white/70" dir="rtl">
                {hero.hashtag}
              </span>
              {locale === 'ar' && (
                <img
                  src="/media/hero-slogan-ar-white.png"
                  alt="وقفنا معًا لنهضة اليمن"
                  width={823}
                  height={167}
                  className="h-7 w-auto opacity-80 sm:h-8"
                />
              )}
            </motion.div>
          </div>

          {/* Trophy stage */}
          <div className="relative order-first mx-auto flex h-[300px] w-full max-w-[22rem] items-center justify-center sm:h-[360px] lg:order-none lg:h-[560px] lg:max-w-none xl:h-[600px]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {[1, 0.74, 0.5].map((scale) => (
                <span
                  key={scale}
                  className="absolute aspect-square rounded-full border border-white/10"
                  style={{ width: `${scale * 118}%` }}
                />
              ))}
              <span className="absolute aspect-square w-[70%] rounded-full bg-[radial-gradient(circle,rgba(255,206,140,0.28),transparent_62%)]" />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {SPARKLES.map(([x, y, size], index) => (
                <motion.span
                  key={`${x}-${y}`}
                  className="absolute rounded-full bg-[#ffe7c2]"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: size,
                    height: size,
                    boxShadow: '0 0 8px 2px rgba(255,214,150,0.45)',
                  }}
                  initial={false}
                  animate={float && index % 3 === 0 ? { opacity: [0.25, 0.9, 0.25] } : { opacity: 0.55 }}
                  transition={
                    float && index % 3 === 0
                      ? { duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 0 }
                  }
                />
              ))}
            </div>
            <motion.img
              src={media.trophy}
              alt={hero.imageAlt}
              {...awardImageAttrs('trophy', media.trophy)}
              // React 18 only passes the lowercase attribute through to the DOM.
              {...{ fetchpriority: 'high' }}
              decoding="async"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 24 }}
              animate={float ? { opacity: 1, scale: 1, y: [0, -10, 0] } : { opacity: 1, scale: 1, y: 0 }}
              transition={
                float
                  ? {
                      opacity: { duration: 1, ease: awardEase },
                      scale: { duration: 1.1, ease: awardEase },
                      y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
                    }
                  : { duration: reduceMotion ? 0 : 1, ease: awardEase }
              }
              // The built-in trophy may spill past its stage; a picture uploaded from
              // the dashboard can have any shape, so it is fitted inside instead.
              className={`relative h-full w-auto drop-shadow-[0_34px_50px_rgba(0,0,0,0.5)] ${
                media.trophy === awardMedia.trophy.src ? 'max-w-none' : 'max-w-full object-contain'
              }`}
            />
          </div>
        </div>
      </section>

      {/* Quick links, floating over the hero's lower edge. */}
      <motion.nav
        aria-label={labels.sectionNav}
        {...rise(1, 26)}
        className="relative z-10 mx-auto -mt-20 max-w-5xl px-4 md:px-8"
      >
        <ul className="grid grid-cols-3 overflow-hidden rounded-[26px] border border-dark-100 bg-white shadow-[0_26px_60px_rgba(20,0,4,0.12)]">
          {hero.quickLinks.map((link) => {
            const Icon = quickLinkIcons[link.target];
            const targetId = awardSectionIds[link.target];

            return (
              <li key={link.target} className="border-dark-100 [&:not(:first-child)]:border-s">
                <a
                  href={`#${targetId}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToAwardSection(targetId);
                  }}
                  className="group flex h-full flex-col items-center gap-2 px-2 py-5 text-center transition-colors duration-300 hover:bg-warm focus-visible:bg-warm focus-visible:outline-none sm:gap-2.5 sm:px-5 sm:py-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-[transform,background-color,color] duration-300 group-hover:-translate-y-0.5 group-hover:bg-primary-500 group-hover:text-white motion-reduce:transform-none sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className="text-[13px] font-bold leading-snug text-dark-900 sm:text-base">{link.title}</span>
                  <span className="hidden text-sm leading-snug text-dark-500 sm:block">{link.description}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </>
  );
}
