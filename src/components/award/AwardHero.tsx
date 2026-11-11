import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { awardMedia, awardSectionIds, type AwardContent } from '@/data/award/content';
import { awardRoutes } from '@/data/award/routes';
import { useI18n } from '@/i18n/useI18n';
import AwardEmblem from './AwardEmblem';
import { quickLinkIcons } from './awardIcons';
import { awardButton, awardEase, scrollToAwardSection } from './awardUi';

type AwardHeroProps = {
  content: AwardContent;
};

/** Landing hero: warm cream stage, photo on the far side, emblem + title + two calls to action. */
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
    ? 'text-[clamp(2.15rem,9.5vw,2.75rem)] sm:text-5xl lg:text-[3.35rem] xl:text-[3.75rem]'
    : 'text-[clamp(1.9rem,8vw,2.4rem)] sm:text-[2.6rem] lg:text-[2.6rem] xl:text-[2.85rem]';

  return (
    <>
      <section
        id="award-hero"
        aria-labelledby="award-hero-title"
        className="relative isolate overflow-hidden bg-award-cream-200"
      >
        {/* Photograph: full-bleed and veiled on phones, the far half of the stage on desktop. */}
        <div className="absolute inset-0 -z-20 lg:inset-y-0 lg:end-0 lg:start-auto lg:w-[58%] xl:w-[60%]">
          <motion.img
            src={awardMedia.hero.src}
            srcSet={awardMedia.hero.srcSet}
            sizes="(min-width: 1024px) 60vw, 100vw"
            width={awardMedia.hero.width}
            height={awardMedia.hero.height}
            alt={hero.imageAlt}
            // React 18 only passes the lowercase attribute through to the DOM.
            {...{ fetchpriority: 'high' }}
            decoding="async"
            initial={reduceMotion ? false : { scale: 1.07, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: awardEase }}
            className="h-full w-full object-cover object-[42%_50%] [filter:saturate(0.82)_sepia(0.1)_brightness(1.04)] lg:object-[36%_50%]"
          />
          {/* Cream veil: strong on phones, a wash from the text side on desktop. */}
          <div className="absolute inset-0 bg-gradient-to-b from-award-cream-200/80 via-award-cream-200/90 to-award-cream-200 lg:hidden" />
          <div className="absolute inset-0 hidden from-award-cream-200 from-0% via-award-cream-200/55 via-30% to-transparent to-70% lg:block ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-t from-award-cream-200 to-transparent lg:block" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(255,246,228,0.55),transparent_55%)]" />
        </div>

        {/* Faint star lattice on the cream side. */}
        <div
          aria-hidden="true"
          className="award-pattern pointer-events-none absolute inset-y-0 start-0 -z-10 w-full opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] lg:w-[46%]"
        />

        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 pb-32 pt-28 sm:min-h-[660px] md:px-8 lg:min-h-[700px] lg:pb-36 lg:pt-32 xl:min-h-[740px]">
          <div className="mx-auto w-full max-w-[36rem] text-center lg:mx-0 lg:max-w-[42rem] lg:text-start xl:max-w-[45rem]">
            <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-7">
              <motion.div
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, scale: 0.85 },
                      animate: { opacity: 1, scale: 1 },
                      transition: { duration: 0.7, ease: awardEase },
                    })}
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-[0_16px_40px_rgba(15,56,60,0.12)] ring-1 ring-award-gold-200/70 backdrop-blur-sm lg:h-auto lg:w-auto lg:rounded-none lg:bg-transparent lg:shadow-none lg:ring-0 lg:backdrop-blur-none"
              >
                <AwardEmblem
                  animate
                  delay={0.15}
                  className="h-[4.25rem] w-[3.4rem] lg:h-[10.5rem] lg:w-[8.4rem] xl:h-[11.5rem] xl:w-[9.2rem]"
                />
              </motion.div>

              <h1 id="award-hero-title" className={`font-brand font-bold leading-[1.18] text-award-ink ${titleSize}`}>
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
                  className="mt-1 block font-bold text-award-gold-500 [font-size:0.82em] [letter-spacing:0.04em]"
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
            </div>

            <motion.p
              {...rise(0.7)}
              className="mx-auto mt-6 max-w-[34rem] text-[15px] leading-[1.95] text-award-body sm:text-lg lg:mx-0 lg:mt-7 lg:max-w-[33rem]"
            >
              {hero.description}
            </motion.p>

            <motion.div
              {...rise(0.85)}
              className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <Link to={awardRoutes.eligibility} className={`group ${awardButton.primary}`}>
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
                className={awardButton.secondary}
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
        <ul className="grid grid-cols-3 overflow-hidden rounded-[26px] border border-award-line/80 bg-white/95 shadow-[0_26px_60px_rgba(15,56,60,0.1)] backdrop-blur">
          {hero.quickLinks.map((link) => {
            const Icon = quickLinkIcons[link.target];
            const targetId = awardSectionIds[link.target];

            return (
              <li key={link.target} className="border-award-line/80 [&:not(:first-child)]:border-s">
                <a
                  href={`#${targetId}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToAwardSection(targetId);
                  }}
                  className="group flex h-full flex-col items-center gap-2 px-2 py-5 text-center transition-colors duration-300 hover:bg-award-cream-100 focus-visible:bg-award-cream-100 focus-visible:outline-none sm:gap-2.5 sm:px-5 sm:py-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-award-gold-100/80 text-award-gold-600 ring-4 ring-award-gold-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 motion-reduce:transform-none sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className="text-[13px] font-bold leading-snug text-award-ink sm:text-base">{link.title}</span>
                  <span className="hidden text-sm leading-snug text-award-body sm:block">{link.description}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </>
  );
}
