import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { awardMedia, awardSectionIds, type AwardContent } from '@/data/award/content';
import { awardRoutes } from '@/data/award/routes';
import { useI18n } from '@/i18n/useI18n';
import { quickLinkIcons } from './awardIcons';
import { awardButton, awardEase, scrollToAwardSection } from './awardUi';

type AwardHeroProps = {
  content: AwardContent;
};

/**
 * Landing hero: full-bleed photograph under the site's dark / deep-red veil,
 * white title with the year in the official red, two calls to action and the
 * quick-links card floating over the lower edge. The site header stays in its
 * usual transparent state above it.
 */
export default function AwardHero({ content }: AwardHeroProps) {
  const { hero, labels } = content;
  const { isRtl } = useI18n();
  const reduceMotion = useReducedMotion();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

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
    ? 'text-[clamp(2.15rem,9.5vw,2.75rem)] sm:text-5xl lg:text-[3.6rem] xl:text-[4.1rem]'
    : 'text-[clamp(1.9rem,8vw,2.4rem)] sm:text-[2.6rem] lg:text-[2.9rem] xl:text-[3.2rem]';

  return (
    <>
      <section
        id="award-hero"
        aria-labelledby="award-hero-title"
        className="relative isolate overflow-hidden bg-dark-950"
      >
        <motion.img
          src={awardMedia.hero.src}
          srcSet={awardMedia.hero.srcSet}
          sizes="100vw"
          width={awardMedia.hero.width}
          height={awardMedia.hero.height}
          alt={hero.imageAlt}
          // React 18 only passes the lowercase attribute through to the DOM.
          {...{ fetchpriority: 'high' }}
          decoding="async"
          initial={reduceMotion ? false : { scale: 1.07, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: awardEase }}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[42%_50%] lg:object-[30%_50%]"
        />
        {/* Veil: an even dark wash on phones; on desktop dark + deep red from the text side, opening onto the photo. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-dark-950/80 via-dark-950/70 to-dark-950/85 lg:hidden" />
        <div className="absolute inset-0 -z-10 hidden from-dark-950/95 from-0% via-primary-950/80 via-40% to-dark-950/20 to-80% lg:block ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 -z-10 ltr:bg-[radial-gradient(circle_at_22%_45%,rgba(218,8,18,0.22),transparent_42%)] rtl:bg-[radial-gradient(circle_at_78%_45%,rgba(218,8,18,0.22),transparent_42%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-dark-950/85 to-transparent" />
        {/* Keeps the site's transparent header legible over bright parts of the photo. */}
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-dark-950/60 to-transparent" />
        <div aria-hidden="true" className="geometric-pattern absolute inset-0 -z-10 opacity-20" />

        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 pb-32 pt-28 sm:min-h-[660px] md:px-8 lg:min-h-[700px] lg:pb-36 lg:pt-32 xl:min-h-[740px]">
          <div className="mx-auto w-full max-w-[36rem] text-center lg:mx-0 lg:max-w-[40rem] lg:text-start">
            <motion.p
              {...rise(0.1, 14)}
              className="inline-flex items-center gap-3 text-sm font-semibold text-white/85 sm:text-[15px]"
            >
              <span aria-hidden="true" className="h-px w-8 bg-primary-400" />
              {hero.eyebrow}
            </motion.p>

            <h1 id="award-hero-title" className={`mt-5 font-brand font-bold leading-[1.18] text-white ${titleSize}`}>
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
              <motion.span
                className="mt-1 block font-bold text-primary-500 [font-size:0.86em] [letter-spacing:0.04em]"
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 14, filter: 'blur(6px)' },
                      animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
                      transition: { duration: 0.9, delay: 0.55, ease: awardEase },
                    })}
              >
                {hero.year}
              </motion.span>
            </h1>

            <motion.p
              {...rise(0.7)}
              className="mx-auto mt-6 max-w-[34rem] text-[15px] leading-[1.95] text-white/80 sm:text-lg lg:mx-0 lg:mt-7"
            >
              {hero.description}
            </motion.p>

            <motion.div
              {...rise(0.85)}
              className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <Link to={awardRoutes.eligibility} className={awardButton.primaryOnDark}>
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
