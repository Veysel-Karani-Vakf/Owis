import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Clapperboard, MessagesSquare, Mic, PenLine, Radio, Sparkles, type LucideIcon } from 'lucide-react';
import Breadcrumbs from '@/components/internal/Breadcrumbs';
import type { BreadcrumbItem } from '@/data/about';
import type { Program } from '@/data/programs';
import { resolveIcon } from '@/lib/icons';

type AwarenessHeroProps = {
  program: Program;
  breadcrumbs: BreadcrumbItem[];
  labels: {
    eyebrow: string;
    heroNote: string;
    exploreCta: string;
    onAir: string;
  };
  initiativesAnchor: string;
};

const heroEase = [0.22, 1, 0.36, 1] as const;
// Defaults keyed by the seeded product ids; an editor-chosen icon name wins over them.
const productIcons: Record<string, LucideIcon> = {
  podcast: Mic,
  visuals: Clapperboard,
  diwaniya: MessagesSquare,
  blog: PenLine,
};
const fallbackIcons: LucideIcon[] = [Sparkles];

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

/** Radio-style equalizer bars that keep breathing under the platform logo. */
function Equalizer({ reduced }: { reduced: boolean }) {
  const bars = [0.45, 0.85, 0.6, 1, 0.5, 0.75, 0.35, 0.9, 0.55];

  return (
    <div aria-hidden="true" className="flex h-8 items-end justify-center gap-1.5" dir="ltr">
      {bars.map((peak, index) => (
        <motion.span
          key={index}
          initial={{ scaleY: 0.3 }}
          animate={reduced ? { scaleY: peak } : { scaleY: [0.3, peak, 0.4, peak * 0.8, 0.3] }}
          transition={
            reduced
              ? { duration: 0.01 }
              : { duration: 1.6 + (index % 3) * 0.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.12 }
          }
          className="w-1.5 origin-bottom rounded-full bg-gradient-to-t from-primary-700 to-primary-400"
          style={{ height: `${peak * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function AwarenessHero({ program, breadcrumbs, labels, initiativesAnchor }: AwarenessHeroProps) {
  const reduced = !!useReducedMotion();
  const duration = reduced ? 0.01 : 0.7;
  const products = program.mediaProducts ?? [];

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

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-4 pb-16 md:px-8 md:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
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
            {labels.eyebrow}
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

          {products.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: reduced ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration, delay: reduced ? 0 : 0.34, ease: heroEase }}
              className="mt-8 flex flex-wrap items-center gap-2.5"
            >
              {products.map((product, index) => {
                const Icon = resolveIcon(product.icon, [productIcons[product.id] ?? fallbackIcons[0]], index);

                return (
                  <motion.li
                    key={product.id || `${product.title}-${index}`}
                    initial={{ opacity: 0, y: reduced ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration, delay: reduced ? 0 : 0.38 + index * 0.08, ease: heroEase }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm font-bold text-white/80 backdrop-blur transition-colors hover:border-primary-400/60 hover:text-white"
                  >
                    <Icon className="h-4 w-4 text-primary-400" aria-hidden="true" />
                    {product.title}
                  </motion.li>
                );
              })}
            </motion.ul>
          )}

          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: reduced ? 0 : 0.46, ease: heroEase }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={scrollToInitiatives}
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-dark-950 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hover:translate-y-0"
            >
              {labels.exploreCta}
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay: reduced ? 0 : 0.56, ease: heroEase }}
            className="mt-8 flex max-w-xl items-start gap-3 text-sm leading-relaxed text-white/55"
          >
            <Radio className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" aria-hidden="true" />
            {labels.heroNote}
          </motion.p>
        </div>

        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center lg:max-w-none lg:justify-end">
          <motion.figure
            initial={{ opacity: 0, y: reduced ? 0 : 36, rotate: 0 }}
            animate={{
              opacity: 1,
              y: reduced ? 0 : [0, -10, 0],
              rotate: reduced ? 0 : -2,
            }}
            transition={{
              opacity: { duration, delay: reduced ? 0 : 0.3, ease: heroEase },
              rotate: { duration, delay: reduced ? 0 : 0.3, ease: heroEase },
              y: reduced
                ? { duration: 0.01 }
                : { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 },
            }}
            className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-white p-4 text-center shadow-[0_30px_70px_rgba(0,0,0,0.45)] ring-1 ring-white/30"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(218,8,18,0.08),transparent_55%)]"
            />
            <div className="flex items-center justify-between px-2 pt-1" dir="ltr">
              <span aria-hidden="true" className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary-600/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-dark-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-dark-200" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                {labels.onAir}
              </span>
            </div>
            <img
              src={program.heroImage}
              alt={program.heroImageAlt}
              width={1080}
              height={1080}
              className="mt-2 aspect-square w-full rounded-[22px] object-cover"
            />
            <figcaption className="px-2 pb-3">
              <Equalizer reduced={reduced} />
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
