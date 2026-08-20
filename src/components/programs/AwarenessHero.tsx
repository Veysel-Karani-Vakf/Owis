import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ExternalLink, Radio } from 'lucide-react';
import Breadcrumbs from '@/components/internal/Breadcrumbs';
import type { BreadcrumbItem } from '@/data/about';
import type { Program } from '@/data/programs';

type AwarenessHeroProps = {
  program: Program;
  breadcrumbs: BreadcrumbItem[];
  labels: {
    awarenessEyebrow: string;
    awarenessHeroNote: string;
    exploreInitiatives: string;
    officialSource: string;
  };
  initiativesAnchor: string;
};

const heroEase = [0.22, 1, 0.36, 1] as const;

function PulseRings({ reduced }: { reduced: boolean }) {
  const rings = [0, 1, 2];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 800"
      className="pointer-events-none absolute -top-40 end-[-18rem] -z-10 h-[52rem] w-[52rem] opacity-70 md:-top-52 md:end-[-14rem] md:h-[64rem] md:w-[64rem] lg:end-[-8rem]"
    >
      <defs>
        <radialGradient id="awareness-hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(218,8,18,0.55)" />
          <stop offset="55%" stopColor="rgba(218,8,18,0.12)" />
          <stop offset="100%" stopColor="rgba(218,8,18,0)" />
        </radialGradient>
      </defs>
      <circle cx="400" cy="400" r="360" fill="url(#awareness-hero-glow)" />
      {[110, 200, 290, 380].map((radius) => (
        <circle key={radius} cx="400" cy="400" r={radius} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
      ))}
      {rings.map((ring) => (
        <motion.circle
          key={ring}
          cx="400"
          cy="400"
          r="90"
          fill="none"
          stroke="rgba(255,120,130,0.55)"
          strokeWidth="1.5"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={reduced ? { scale: 1 + ring * 1.2, opacity: 0.18 } : { scale: [0.4, 4.2], opacity: [0.6, 0] }}
          transition={
            reduced
              ? { duration: 0.01 }
              : {
                  duration: 6.5,
                  ease: 'easeOut',
                  repeat: Infinity,
                  delay: ring * 2.1,
                }
          }
          style={{ transformOrigin: '400px 400px' }}
        />
      ))}
    </svg>
  );
}

export default function AwarenessHero({ program, breadcrumbs, labels, initiativesAnchor }: AwarenessHeroProps) {
  const reduced = !!useReducedMotion();
  const duration = reduced ? 0.01 : 0.7;
  const badges = program.initiatives ?? [];

  const scrollToInitiatives = () => {
    const el = document.getElementById(initiativesAnchor);
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className="relative isolate overflow-hidden bg-dark-950 pt-28 text-white md:pt-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#240002_0%,#000000_55%,#0b0b0b_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <PulseRings reduced={reduced} />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 md:px-8 md:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
        <div className="text-start">
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, ease: heroEase }}
          >
            <Breadcrumbs items={breadcrumbs} light />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: reduced ? 0 : 0.08, ease: heroEase }}
            className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/85 backdrop-blur"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-500" />
            </span>
            {labels.awarenessEyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: reduced ? 0 : 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: reduced ? 0 : 0.16, ease: heroEase }}
            className="mt-6 max-w-3xl text-balance text-4xl font-bold leading-[1.2] md:text-6xl lg:text-[4.4rem]"
          >
            {program.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: reduced ? 0 : 0.26, ease: heroEase }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl"
          >
            {program.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: reduced ? 0 : 0.36, ease: heroEase }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={scrollToInitiatives}
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-dark-950 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hover:translate-y-0"
            >
              {labels.exploreInitiatives}
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
            <a
              href={program.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {labels.officialSource}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay: reduced ? 0 : 0.5, ease: heroEase }}
            className="mt-8 flex max-w-xl items-start gap-3 text-sm leading-relaxed text-white/55"
          >
            <Radio className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" aria-hidden="true" />
            {labels.awarenessHeroNote}
          </motion.p>
        </div>

        {badges.length > 0 && (
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none lg:justify-end">
            <div className="relative grid w-full grid-cols-2 gap-4 sm:gap-5 lg:max-w-[30rem]">
              {badges.slice(0, 2).map((initiative, index) => (
                <motion.figure
                  key={initiative.title}
                  initial={{ opacity: 0, y: reduced ? 0 : 36, rotate: 0 }}
                  animate={{
                    opacity: 1,
                    y: reduced ? 0 : [0, index === 0 ? -10 : 8, 0],
                    rotate: reduced ? 0 : index === 0 ? -3 : 3,
                  }}
                  transition={{
                    opacity: {
                      duration,
                      delay: reduced ? 0 : 0.3 + index * 0.14,
                      ease: heroEase,
                    },
                    rotate: {
                      duration,
                      delay: reduced ? 0 : 0.3 + index * 0.14,
                      ease: heroEase,
                    },
                    y: reduced
                      ? { duration: 0.01 }
                      : {
                          duration: 7 + index,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.9 + index * 0.6,
                        },
                  }}
                  className={`relative overflow-hidden rounded-[28px] bg-white p-3 text-center shadow-[0_30px_70px_rgba(0,0,0,0.45)] ring-1 ring-white/30 ${
                    index === 1 ? 'mt-10 sm:mt-14' : ''
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(218,8,18,0.08),transparent_55%)]"
                  />
                  <img
                    src={initiative.image}
                    alt={initiative.imageAlt}
                    width={1080}
                    height={1080}
                    className="aspect-square w-full rounded-[20px] object-cover"
                  />
                  <figcaption className="px-2 pb-2 pt-1 text-xs font-bold text-dark-700 sm:text-sm">
                    {initiative.title}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
