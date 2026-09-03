import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BarChart3, Play } from 'lucide-react';
import Breadcrumbs from '@/components/internal/Breadcrumbs';
import type { BreadcrumbItem } from '@/data/about';
import type { LibraryProfileContent } from '@/data/library/profile';
import { libraryRoutes } from '@/data/library';
import { useI18n } from '@/i18n/useI18n';
import { Chapter, CountUpNumber, WordReveal, smoothEase } from './profileShared';
import { useInView } from '@/hooks/useInView';

type HeroProps = {
  content: LibraryProfileContent;
  breadcrumbs: BreadcrumbItem[];
};

/** Chapter 01 — the opening curtain: a real photo stage, in the homepage hero's language. */
export function ProfileHeroChapter({ content, breadcrumbs }: HeroProps) {
  const { locale } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  // Scrolling away lowers the curtain: the opening scene sinks and dims.
  const bodyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: bodyRef, offset: ['start start', 'end start'] });
  const exitOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);
  const exitY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const exitScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  const { hero, labels } = content;

  return (
    <Chapter
      id="profile-hero"
      className="relative flex min-h-[calc(100svh-64px)] flex-col overflow-hidden bg-dark-950 pt-28 md:min-h-[calc(100svh-88px)] md:pt-36"
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: shouldReduceMotion ? 0.01 : 0.9, ease: smoothEase }}
        className="absolute inset-0"
      >
        <img
          src={hero.image}
          alt=""
          className="profile-kenburns h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>
      {/* Homepage-hero overlay, deepened in the middle band because the copy sits centered. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5, 8, 16, 0.62) 0%, rgba(5, 8, 16, 0.46) 45%, rgba(18, 4, 6, 0.76) 100%)',
        }}
      />
      <div aria-hidden="true" className="geometric-pattern absolute inset-0 opacity-10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8">
        <Breadcrumbs items={breadcrumbs} light />
      </div>

      <motion.div
        ref={bodyRef}
        style={shouldReduceMotion ? undefined : { opacity: exitOpacity, y: exitY, scale: exitScale }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 pb-16 pt-10 text-center md:px-8"
      >
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.6, ease: smoothEase }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-md"
        >
          <Play className="h-3.5 w-3.5" aria-hidden="true" />
          {hero.eyebrow} · {content.meta.title}
        </motion.p>

        <h1
          key={`${locale}-${hero.title}`}
          className={`clip-reveal ${revealed || shouldReduceMotion ? 'clip-reveal-revealed' : ''} max-w-4xl text-balance py-2 font-brand text-4xl font-bold leading-snug text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)] md:text-6xl lg:text-7xl`}
          style={{ transition: shouldReduceMotion ? undefined : 'clip-path 950ms cubic-bezier(0.22, 1, 0.36, 1) 150ms' }}
        >
          {hero.title}
        </h1>

        <WordReveal
          as="p"
          text={hero.slogan}
          stagger={0.09}
          className="mt-6 font-brand text-xl font-bold text-white md:text-2xl"
        />

        <motion.p
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.65, delay: shouldReduceMotion ? 0 : 0.55, ease: smoothEase }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg"
        >
          {hero.subtitle} {hero.intro}
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.65, delay: shouldReduceMotion ? 0 : 0.75, ease: smoothEase }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#profile-pillars"
            className="btn-border-run inline-flex min-h-12 items-center gap-2 rounded-full bg-primary-600 px-6 font-bold text-white shadow-[0_14px_36px_rgba(0,0,0,0.35)] transition-colors hover:bg-primary-700"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            {labels.scrollHint}
          </a>
          <a
            href="#profile-numbers"
            className="btn-border-run btn-border-run--light inline-flex min-h-12 items-center gap-2 rounded-full border border-white/70 bg-white/10 px-6 font-bold text-white backdrop-blur-[2px] transition-colors hover:bg-white hover:text-dark-900"
          >
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            {labels.watchNumbers}
          </a>
        </motion.div>
      </motion.div>

      {/* The drawn line IS the scroll cue — the motion system itself invites the scroll. */}
      <div aria-hidden="true" className="relative z-10 flex justify-center pb-6">
        <svg width="2" height="64" viewBox="0 0 2 64" fill="none" className="overflow-visible">
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="64"
            stroke="url(#profile-cue-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            className={`profile-cue-line ${revealed ? 'profile-cue-line--drawn' : ''}`}
          />
          <circle
            cx="1"
            cy="3"
            r="2.5"
            fill="#ffffff"
            className={`profile-cue-dot ${revealed ? 'profile-cue-dot--live' : ''}`}
          />
          <defs>
            <linearGradient id="profile-cue-gradient" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </Chapter>
  );
}

/** Chapter 13 — the final curtain: the homepage participation plate closes the reel. */
export function ProfileCtaChapter({ content }: { content: LibraryProfileContent }) {
  const { isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.3 });
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const { cta } = content;

  return (
    <Chapter id="profile-cta" className="relative overflow-hidden bg-dark-900">
      <div className="absolute inset-0">
        <img
          src={cta.image}
          alt=""
          loading="lazy"
          className="profile-kenburns--loop h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-primary-900/70 to-dark-950/80" />
      </div>
      <div aria-hidden="true" className="geometric-pattern absolute inset-0 opacity-20" />

      <div ref={ref} className="relative mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col items-center justify-center px-4 py-24 text-center md:px-8">
        {/* The progress stroke completes into a closed ring — the reel's full stop. */}
        <div aria-hidden="true" className="relative mb-8 h-20 w-20">
          <svg viewBox="0 0 80 80" fill="none" className="h-full w-full -rotate-90">
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: shouldReduceMotion ? 0.01 : 1.3, ease: smoothEase }}
            />
          </svg>
          <motion.span
            initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: shouldReduceMotion ? 0 : 1.1, type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center font-brand text-lg font-bold text-gold-300"
          >
            <span className="profile-star-pulse inline-block">٭</span>
          </motion.span>
        </div>

        <p className="mb-4 font-brand text-base font-bold text-gold-300 md:text-lg">{cta.slogan}</p>
        <WordReveal
          text={cta.title}
          stagger={0.09}
          className="max-w-3xl text-balance font-brand text-3xl font-bold leading-tight text-white md:text-5xl"
        />
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.6, delay: shouldReduceMotion ? 0 : 0.5, ease: smoothEase }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg"
        >
          {cta.text}
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.65, delay: shouldReduceMotion ? 0 : 0.7, ease: smoothEase }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/donate"
            className="btn-border-run btn-border-run--light inline-flex min-h-12 items-center gap-2 rounded-full bg-gold-400 px-7 font-bold text-dark-900 shadow-xl transition-colors hover:bg-gold-300"
          >
            {cta.donate}
            <ArrowIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/participate/share-ideas"
            className="btn-border-run btn-border-run--light inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-white/25 bg-white/5 px-7 font-bold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10"
          >
            {cta.participate}
          </Link>
        </motion.div>

        <div className="mt-14 flex flex-col items-center gap-3">
          <p aria-hidden="true" className="font-brand text-sm font-bold text-white/50">
            <CountUpNumber value={13} start={inView} duration={900} className="profile-count" /> / 13
          </p>
          <Link
            to={libraryRoutes.index}
            className="btn-border-run btn-border-run--light inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-bold text-white/70 transition-colors hover:text-white"
          >
            {cta.backToLibrary}
          </Link>
        </div>
      </div>
    </Chapter>
  );
}
