import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { useI18n } from '@/i18n/useI18n';

export const smoothEase = [0.22, 1, 0.36, 1] as const;

/** The 13 chapters, in reel order. The rail, counter chip, and hash links all derive from this. */
export const profileChapterIds = [
  'profile-hero',
  'profile-pillars',
  'profile-problem',
  'profile-story',
  'profile-identity',
  'profile-cycle',
  'profile-creation',
  'profile-governance',
  'profile-tracks',
  'profile-pioneers',
  'profile-numbers',
  'profile-participate',
  'profile-cta',
] as const;

export type ProfileChapterId = (typeof profileChapterIds)[number];

/** One IntersectionObserver owns active-chapter state: the middle 10% viewport band. */
export function useActiveChapter() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const elements = profileChapterIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = profileChapterIds.indexOf(entry.target.id as ProfileChapterId);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}

type ChapterProps = {
  id: ProfileChapterId;
  className?: string;
  /** Own clearance for hash jumps (px); full-screen slides that pad for the header pass 0. */
  scrollOffset?: number;
  children: ReactNode;
};

export function Chapter({ id, className = '', scrollOffset, children }: ChapterProps) {
  return (
    <section id={id} data-profile-chapter data-scroll-offset={scrollOffset} className={className}>
      {children}
    </section>
  );
}

type SectionHeadingProps = {
  index: number;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  /** 'light' on crimson plates, 'dark' on paper surfaces. */
  tone?: 'light' | 'dark';
  className?: string;
};

/** Chapter header: ghost folio numeral bleeding behind an eyebrow + heading + standfirst. */
export function SectionHeading({ index, eyebrow, heading, subheading, tone = 'dark', className = '' }: SectionHeadingProps) {
  const reveal = revealVariants();
  const numeral = String(index).padStart(2, '0');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4, margin: '0px 0px -10% 0px' }}
      className={`relative ${className}`}
    >
      <span
        aria-hidden="true"
        className={`profile-ghost ${tone === 'light' ? 'profile-ghost--light' : ''} pointer-events-none absolute -top-10 start-0 font-brand text-[110px] font-bold leading-none md:-top-14 md:text-[150px]`}
      >
        {numeral}
      </span>
      {eyebrow && (
        <motion.p
          variants={reveal}
          className={`relative mb-3 text-sm font-bold tracking-wide ${
            tone === 'light' ? 'text-[#fb7185]' : 'text-primary-600'
          }`}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={reveal}
        className={`relative max-w-3xl text-balance font-brand text-3xl font-bold leading-tight md:text-4xl lg:text-[42px] ${
          tone === 'light' ? 'text-white' : 'text-dark-900'
        }`}
      >
        {heading}
      </motion.h2>
      {subheading && (
        <motion.p
          variants={reveal}
          className={`relative mt-4 max-w-2xl text-base leading-relaxed md:text-lg ${
            tone === 'light' ? 'text-white/70' : 'text-dark-500'
          }`}
        >
          {subheading}
        </motion.p>
      )}
    </motion.div>
  );
}

export const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export function revealVariants(reduced?: boolean | null): Variants {
  return {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.01 : 0.62, ease: smoothEase },
    },
  };
}

/** Splits a headline into word spans that cascade in — the reel's caption voice. */
export function WordReveal({
  text,
  className = '',
  as: Tag = 'h2',
  stagger = 0.07,
}: {
  text: string;
  className?: string;
  as?: 'h2' | 'h3' | 'p';
  stagger?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');
  const MotionTag = Tag === 'h2' ? motion.h2 : Tag === 'h3' ? motion.h3 : motion.p;

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6, margin: '0px 0px -8% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: shouldReduceMotion ? 0 : stagger } } }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={{
            hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0.01 : 0.62, ease: smoothEase } },
          }}
          className="inline-block"
        >
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </MotionTag>
  );
}

type CountUpNumberProps = {
  value: number;
  suffix?: string;
  decimals?: number;
  /** Fire the count. Counters key once — re-entering a chapter never re-counts. */
  start: boolean;
  duration?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Brand counter: rAF count-up (Latin digits in every locale per brand), width reserved
 * so giant numbers never judder layout, aria-hidden live digits + sr-only settled value.
 */
export function CountUpNumber({ value, suffix = '', decimals = 0, start, duration = 2000, className = '', style }: CountUpNumberProps) {
  const { formatNumber } = useI18n();
  const factor = 10 ** decimals;
  const animated = useCountUp(Math.round(value * factor), duration, start);

  const settled = decimals > 0 ? value.toFixed(decimals) : formatNumber(value);
  const current = decimals > 0 ? (animated / factor).toFixed(decimals) : formatNumber(animated);

  return (
    <span className={className} style={style}>
      <span aria-hidden="true" className="profile-count" style={{ minWidth: `${(settled + suffix).length * 0.62}em` }}>
        {current}
        {suffix}
      </span>
      <span className="sr-only">
        {settled}
        {suffix}
      </span>
    </span>
  );
}
