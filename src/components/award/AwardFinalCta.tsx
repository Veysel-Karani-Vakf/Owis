import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { AwardContent } from '@/data/award/content';
import { awardRoutes } from '@/data/award/routes';
import { useI18n } from '@/i18n/useI18n';
import { useRevealMotion } from '@/hooks/useResponsiveMotion';
import { awardButton, awardEase } from './awardUi';

type AwardFinalCtaProps = {
  content: AwardContent;
};

/** Section G — closing call to action on a deep green panel, with a seedling that grows in. */
export default function AwardFinalCta({ content }: AwardFinalCtaProps) {
  const { cta } = content;
  const { isRtl } = useI18n();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const title = useRevealMotion({ y: 20, duration: 0.7 });
  const text = useRevealMotion({ y: 16, duration: 0.7, delay: 0.08 });
  const action = useRevealMotion({ y: 14, duration: 0.7, delay: 0.16 });

  return (
    <section
      id="award-cta"
      aria-labelledby="award-cta-title"
      className="bg-gradient-to-b from-white to-award-cream-50 px-4 pb-20 pt-4 md:px-8 md:pb-28"
    >
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-award-green-900 px-6 py-14 text-white shadow-[0_40px_90px_rgba(3,47,44,0.32)] sm:px-10 md:px-14 md:py-16 lg:py-14">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-award-green-800 via-award-green-900 to-award-green-950"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(199,160,105,0.22),transparent_40%),radial-gradient(circle_at_85%_90%,rgba(106,160,136,0.25),transparent_45%)]"
        />
        <div aria-hidden="true" className="award-pattern award-pattern--light absolute inset-0 -z-10 opacity-60" />

        <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
          <div className="text-center lg:text-start">
            <motion.h2
              id="award-cta-title"
              {...title}
              className="font-brand text-[1.9rem] font-bold leading-tight sm:text-4xl lg:text-[2.75rem]"
            >
              {cta.title}
            </motion.h2>
            <motion.p
              {...text}
              className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.9] text-white/75 sm:text-lg lg:mx-0"
            >
              {cta.description}
            </motion.p>
            <motion.div {...action} className="mt-8 flex justify-center lg:justify-start">
              <Link to={awardRoutes.eligibility} className={`group ${awardButton.light}`}>
                {cta.button}
                <ArrowIcon
                  className={`h-[18px] w-[18px] transition-transform duration-300 ${
                    isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </div>

          <Seedling />
        </div>
      </div>
    </section>
  );
}

/** Line-art seedling in cupped soil: the stem draws, then the leaves unfold from their base. */
function Seedling() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const play = inView || Boolean(reduceMotion);
  const instant = Boolean(reduceMotion);

  const leaf = (delay: number, originX: number, originY: number) => ({
    initial: instant ? false : ({ scale: 0, opacity: 0 } as const),
    animate: play ? { scale: 1, opacity: 1 } : undefined,
    transition: { duration: 0.8, delay: instant ? 0 : delay, ease: awardEase },
    style: { originX, originY },
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 320 250"
      className="mx-auto h-44 w-auto sm:h-52 lg:h-60"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="award-cta-leaf" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#6aa088" />
          <stop offset="1" stopColor="#c5dbcc" />
        </linearGradient>
        <linearGradient id="award-cta-leaf-gold" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#b68342" />
          <stop offset="1" stopColor="#e2c48f" />
        </linearGradient>
      </defs>

      {/* Halo rings */}
      <g fill="none" stroke="#ffffff" strokeOpacity="0.09">
        <circle cx="160" cy="132" r="96" />
        <circle cx="160" cy="132" r="72" strokeDasharray="3 7" />
      </g>

      {/* Soil held in cupped hands (abstracted as a bowl line) */}
      <path d="M92 206 C116 194 204 194 228 206 C214 222 106 222 92 206 Z" fill="#05453c" />
      <path
        d="M66 200 C88 238 232 238 254 200"
        fill="none"
        stroke="#dcbb85"
        strokeOpacity="0.7"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Stem */}
      <motion.path
        d="M160 204 C158 176 164 150 160 104"
        fill="none"
        stroke="#dcbb85"
        strokeWidth="4"
        strokeLinecap="round"
        initial={instant ? false : { pathLength: 0 }}
        animate={play ? { pathLength: 1 } : undefined}
        transition={{ duration: 1, ease: awardEase }}
      />

      {/* Leaves */}
      <motion.path
        d="M160 168 C138 170 112 160 100 134 C126 130 150 142 160 168 Z"
        fill="url(#award-cta-leaf)"
        {...leaf(0.55, 1, 1)}
      />
      <motion.path
        d="M161 140 C182 140 210 126 222 98 C194 96 168 112 161 140 Z"
        fill="url(#award-cta-leaf)"
        {...leaf(0.8, 0, 1)}
      />
      <motion.path
        d="M160 106 C150 92 150 74 160 60 C170 74 170 92 160 106 Z"
        fill="url(#award-cta-leaf-gold)"
        {...leaf(1.05, 0.5, 1)}
      />
    </svg>
  );
}
