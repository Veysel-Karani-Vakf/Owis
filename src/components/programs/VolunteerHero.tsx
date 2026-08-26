import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, HandHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/internal/Breadcrumbs';
import type { BreadcrumbItem } from '@/data/about';
import type { Program, VolunteerCopy } from '@/data/programs';

type VolunteerHeroProps = {
  program: Program;
  breadcrumbs: BreadcrumbItem[];
  copy: VolunteerCopy;
  /** Fallback join destination; `copy.joinUrl` set in the admin wins over it. */
  volunteerRoute: string;
  exploreAnchor: string;
};

const heroEase = [0.22, 1, 0.36, 1] as const;

export default function VolunteerHero({
  program,
  breadcrumbs,
  copy,
  volunteerRoute,
  exploreAnchor,
}: VolunteerHeroProps) {
  const reduced = !!useReducedMotion();
  const duration = reduced ? 0.01 : 0.7;
  const joinTo = copy.joinUrl || volunteerRoute;

  const scrollToExplore = () => {
    const el = document.getElementById(exploreAnchor);
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className="relative isolate overflow-hidden bg-dark-950 pb-24 pt-28 text-white md:pb-28 md:pt-32">
      <motion.img
        src={program.heroImage}
        alt={program.heroImageAlt}
        initial={{ scale: reduced ? 1 : 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0.01 : 1.2, ease: heroEase }}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Darkest at the start edge, where the copy sits, clearing toward the photo. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-dark-950/95 via-dark-950/80 to-dark-950/35 rtl:bg-gradient-to-l" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_35%,rgba(218,8,18,0.4),transparent_45%)] rtl:bg-[radial-gradient(circle_at_82%_35%,rgba(218,8,18,0.4),transparent_45%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
        <div className="text-start">
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, ease: heroEase }}
            className="mb-6"
          >
            <Breadcrumbs items={breadcrumbs} light />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: reduced ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: reduced ? 0 : 0.08, ease: heroEase }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-black backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
            {copy.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: reduced ? 0 : 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: reduced ? 0 : 0.14, ease: heroEase }}
            className="mt-5 text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
          >
            {program.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: reduced ? 0 : 0.2, ease: heroEase }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg"
          >
            {program.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: reduced ? 0 : 0.26, ease: heroEase }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to={joinTo}
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-primary-600 px-7 py-3 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hover:translate-y-0"
            >
              <HandHeart className="h-4 w-4" aria-hidden="true" />
              {copy.joinCta}
            </Link>
            <button
              type="button"
              onClick={scrollToExplore}
              className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {copy.exploreCta}
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
          </motion.div>
        </div>

        {/* The unit's badge, tilted out of the photo like a pinned card. */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 34, rotate: reduced ? 0 : -3 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: reduced ? 0.01 : 0.9, delay: reduced ? 0 : 0.3, ease: heroEase }}
          className="relative mx-auto hidden w-full max-w-[16rem] lg:block"
        >
          <span aria-hidden="true" className="absolute -inset-5 rounded-[36px] border border-dashed border-white/25" />
          <div className="relative overflow-hidden rounded-[28px] bg-white p-3 shadow-[0_34px_80px_rgba(0,0,0,0.45)]">
            <img
              src={program.overviewImage ?? program.heroImage}
              alt=""
              aria-hidden="true"
              width={1080}
              height={1080}
              className="aspect-square w-full scale-[1.14] rounded-[20px] object-contain"
            />
          </div>
        </motion.div>
      </div>

      {/* Slogan rail pinned to the hero's bottom edge. */}
      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-dark-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3.5 text-start md:px-8">
          <span className="text-sm font-bold text-white/80">{copy.slogan}</span>
          <span aria-hidden="true" className="hidden h-4 w-px bg-white/20 sm:block" />
          {(copy.hashtags ?? []).map((tag) => (
            <span key={tag} className="text-sm font-black text-primary-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
