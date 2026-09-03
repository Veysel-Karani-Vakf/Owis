import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Fragment, useEffect, useState, type CSSProperties, type FocusEvent, type PointerEvent } from 'react';
import type { LibraryProfileContent } from '@/data/library/profile';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';
import { containerVariants, revealVariants, smoothEase } from './profileShared';

type Step = LibraryProfileContent['investment']['principles'][number];

/* Showcase tempo: each principle holds the stage this long; the bodies pass the file a little faster. */
const PRINCIPLE_DWELL_MS = 3600;
const BODY_DWELL_MS = 3000;
const spot = { type: 'spring' as const, stiffness: 260, damping: 30 };

function numeral(index: number) {
  return String(index + 1).padStart(2, '0');
}

/**
 * A rotating showcase: one item is "on stage" at a time. It advances on its own while the
 * block is on screen, pauses under a resting mouse or keyboard focus, hover/focus peek at an
 * item, and a click keeps the visitor's pick for good. Reduced motion never auto-advances.
 */
function useShowcase(count: number, dwellMs: number, inView: boolean, reduced: boolean) {
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);
  const [held, setHeld] = useState(false);
  const rolling = inView && !reduced && !picked && !held && count > 1;

  useEffect(() => {
    if (!rolling) return;
    const id = window.setInterval(() => setActive((current) => (current + 1) % count), dwellMs);
    return () => window.clearInterval(id);
  }, [rolling, count, dwellMs]);

  const holdProps = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse') setHeld(true);
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse') setHeld(false);
    },
    onFocus: () => setHeld(true),
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeld(false);
    },
  };

  return {
    active,
    rolling,
    pick: (index: number) => {
      setActive(index);
      setPicked(true);
    },
    peek: (index: number) => setActive(index),
    holdProps,
  };
}

function itemProps(index: number, pick: (i: number) => void, peek: (i: number) => void) {
  return {
    onClick: () => pick(index),
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse') peek(index);
    },
    onFocus: () => peek(index),
  };
}

/* ---------- The four instruments: one small live drawing per discipline ---------- */

function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const point = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(rad)).toFixed(2)} ${(cy + r * Math.sin(rad)).toFixed(2)}`;
  };
  return `M ${point(from)} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${point(to)}`;
}

/** Feasibility = a study that rises bar by bar; risk = a gauge needle sweeping to its reading;
    diversification = one holding split into four; protection = a shield drawn and sealed. */
function Instrument({ kind, live }: { kind: number; live: boolean }) {
  const props = {
    viewBox: '0 0 56 56',
    className: 'profile-instr h-9 w-9',
    'data-live': live,
    'aria-hidden': true as const,
  };
  if (kind === 1) {
    return (
      <svg {...props}>
        <path d={arc(28, 40, 18, 180, 360)} className="profile-instr-arc" />
        <path d={arc(28, 40, 18, 300, 360)} className="profile-instr-zone" />
        <line x1="28" y1="40" x2="28" y2="21" className="profile-instr-needle" />
        <circle cx="28" cy="40" r="2.6" className="profile-instr-pivot" />
      </svg>
    );
  }
  if (kind === 2) {
    return (
      <svg {...props}>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={arc(28, 28, 15, -81 + i * 90, -9 + i * 90)}
            pathLength={1}
            style={{ '--i': i } as CSSProperties}
            className="profile-instr-seg"
          />
        ))}
        <circle cx="28" cy="28" r="4" className="profile-instr-core" />
      </svg>
    );
  }
  if (kind === 3) {
    return (
      <svg {...props}>
        <circle cx="28" cy="28" r="21" className="profile-instr-pulse" />
        <path
          d="M28 9 L43 15 V27 C43 36.5 36.5 43.5 28 47 C19.5 43.5 13 36.5 13 27 V15 Z"
          pathLength={1}
          className="profile-instr-shield"
        />
        <path d="M21.5 28.5 L26.5 33.5 L35.5 23" pathLength={1} className="profile-instr-check" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <line x1="10" y1="45" x2="46" y2="45" className="profile-instr-base" />
      {[14, 24, 18, 32].map((height, i) => (
        <rect
          key={i}
          x={12 + i * 9}
          y={44 - height}
          width="6"
          height={height}
          rx="1.5"
          style={{ '--i': i } as CSSProperties}
          className="profile-instr-bar"
        />
      ))}
    </svg>
  );
}

/**
 * Chapter 08 — the four investment disciplines along one measuring rule, shown one at a
 * time: the stage moves along the rule (a dwell bar runs across the active item's hairline),
 * the active instrument plays its drawing, the rest wait in pale.
 */
export function InvestmentPrinciplesRule({ principles, className = '' }: { principles: Step[]; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const block = useInView<HTMLOListElement>({ threshold: 0.3 });
  const { active, rolling, pick, peek, holdProps } = useShowcase(
    principles.length,
    PRINCIPLE_DWELL_MS,
    block.inView,
    Boolean(shouldReduceMotion)
  );

  return (
    <ol
      id="profile-investment-principles"
      ref={block.ref}
      {...holdProps}
      data-rolling={rolling ? 'true' : 'false'}
      style={{ '--dwell': `${PRINCIPLE_DWELL_MS}ms` } as CSSProperties}
      className={`profile-ruler-list grid scroll-mt-28 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {principles.map((principle, index) => {
        const isActive = active === index;
        return (
          <li
            key={principle.title}
            style={{ '--profile-delay': `${index * 140}ms` } as CSSProperties}
            data-active={isActive ? 'true' : 'false'}
            className="profile-ruler relative pe-6 pt-7 lg:pe-8"
          >
            <span aria-hidden="true" className="profile-ruler-tick" />
            <span aria-hidden="true" className="profile-ruler-dwell" />
            <button
              type="button"
              aria-pressed={isActive}
              {...itemProps(index, pick, peek)}
              className="profile-ignite block w-full rounded-[18px] text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-[18px] bg-white ring-1 transition-all duration-300 ${
                    isActive
                      ? '-translate-y-0.5 ring-primary-300 shadow-[0_12px_26px_rgba(218,8,18,0.16)]'
                      : 'ring-primary-100 shadow-[0_6px_16px_rgba(218,8,18,0.06)]'
                  }`}
                >
                  <Instrument kind={index} live={isActive} />
                </span>
                <span className="font-brand text-sm font-bold text-primary-600">{numeral(index)}</span>
              </span>
              <span
                className={`mt-4 block font-brand text-lg font-bold transition-colors duration-300 ${
                  isActive ? 'text-primary-700' : 'text-dark-900'
                }`}
              >
                {principle.title}
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-dark-500">{principle.text}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Chapter 08 — institutional separation as a two-tier chart that passes the file along: the
 * deciding bodies stand on a solid rail, the supporting and controlling bodies on a dotted
 * one, a white spotlight glides from body to body (crossing the dashed seam that carries
 * the note), the rail lights up behind it and the active node pulses.
 */
export function InvestmentSeparationChart({
  bodies,
  note,
  className = '',
}: {
  bodies: Step[];
  note: string;
  className?: string;
}) {
  const { isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);
  const block = useInView({ threshold: 0.3 });
  const { active, pick, peek, holdProps } = useShowcase(bodies.length, BODY_DWELL_MS, block.inView, reduced);
  const reveal = revealVariants(shouldReduceMotion);
  const rail: Variants = {
    hidden: reduced ? { scaleX: 1 } : { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: reduced ? 0.01 : 0.9, ease: smoothEase } },
  };
  const fromStart = { transformOrigin: isRtl ? '100% 50%' : '0 50%' };
  const fromEnd = { transformOrigin: isRtl ? '0 50%' : '100% 50%' };
  const tiers = [bodies.slice(0, 3), bodies.slice(3)];
  const crossed = active >= 3;

  return (
    <div
      id="profile-investment-separation"
      ref={block.ref}
      {...holdProps}
      className={`scroll-mt-28 rounded-[28px] bg-[#faf8f8] px-5 py-6 ring-1 ring-primary-100 md:px-8 md:py-8 ${
        block.inView ? 'profile-inview' : ''
      } ${className}`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {tiers.map((tier, tierIndex) => (
          <Fragment key={tierIndex}>
            {tierIndex === 1 && (
              <div className="my-6 flex items-center gap-4 md:my-7">
                <motion.span
                  aria-hidden="true"
                  variants={rail}
                  style={fromStart}
                  className={`profile-seam flex-1 ${crossed ? 'profile-seam--crossed' : ''}`}
                />
                <motion.p
                  variants={reveal}
                  className={`max-w-md text-center text-xs font-bold leading-relaxed transition-colors duration-500 md:text-sm ${
                    crossed ? 'text-primary-700' : 'text-dark-500'
                  }`}
                >
                  {note}
                </motion.p>
                <motion.span
                  aria-hidden="true"
                  variants={rail}
                  style={fromEnd}
                  className={`profile-seam flex-1 ${crossed ? 'profile-seam--crossed' : ''}`}
                />
              </div>
            )}
            <ol className="grid gap-y-2 md:grid-cols-3 md:gap-y-0">
              {tier.map((body, i) => {
                const index = tierIndex * 3 + i;
                const isActive = active === index;
                const lit = index <= active;
                return (
                  <motion.li key={body.title} variants={reveal} className="relative md:pe-6 md:pt-7">
                    <motion.span
                      aria-hidden="true"
                      variants={rail}
                      style={fromStart}
                      className={`absolute inset-x-0 top-0 hidden h-px transition-colors duration-500 md:block ${
                        lit ? 'bg-primary-500' : tierIndex === 0 ? 'bg-primary-200' : 'profile-body-rail--dotted'
                      }`}
                    />
                    <span
                      aria-hidden="true"
                      className={`profile-body-node ${lit ? 'profile-body-node--lit' : ''} ${isActive ? 'profile-body-node--active' : ''}`}
                    />
                    <button
                      type="button"
                      aria-pressed={isActive}
                      {...itemProps(index, pick, peek)}
                      className="relative isolate -mx-3 block w-[calc(100%+24px)] rounded-[18px] px-3 py-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                    >
                      {isActive && (
                        <motion.span
                          aria-hidden="true"
                          layoutId="profile-separation-spot"
                          transition={reduced ? { duration: 0 } : spot}
                          className="absolute inset-0 -z-10 rounded-[18px] bg-white shadow-[0_14px_30px_rgba(218,8,18,0.1)] ring-1 ring-primary-100"
                        />
                      )}
                      <span
                        className={`block font-brand text-lg font-bold transition-colors duration-300 ${
                          isActive ? 'text-primary-700' : 'text-dark-900'
                        }`}
                      >
                        {body.title}
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-dark-500">{body.text}</span>
                    </button>
                  </motion.li>
                );
              })}
            </ol>
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
