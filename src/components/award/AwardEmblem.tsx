import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
import { awardEase } from './awardUi';

type AwardEmblemProps = {
  className?: string;
  /** Play the one-off "growing" entrance; otherwise the mark renders settled. */
  animate?: boolean;
  /** Delay (s) before the entrance starts. */
  delay?: number;
};

/**
 * Temporary mark for the Owais Volunteer Award (until an official logo exists):
 * a gold sweep rising like a raised arm, a green leaf and a young bud — giving
 * that grows. Decorative; the award name is always present as text beside it.
 */
export default function AwardEmblem({ className = '', animate = false, delay = 0 }: AwardEmblemProps) {
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const gold = `award-emblem-gold-${uid}`;
  const leaf = `award-emblem-leaf-${uid}`;
  const play = animate && !reduceMotion;

  const grow = (start: number, originX: number, originY: number) =>
    play
      ? {
          initial: { opacity: 0, scale: 0.4 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.85, delay: delay + start, ease: awardEase },
          style: { originX, originY },
        }
      : {};

  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gold} x1="0" y1="1" x2="0.6" y2="0">
          <stop offset="0" stopColor="#b68342" />
          <stop offset="0.55" stopColor="#c7a069" />
          <stop offset="1" stopColor="#e2c48f" />
        </linearGradient>
        <linearGradient id={leaf} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#045c4b" />
          <stop offset="1" stopColor="#2f806a" />
        </linearGradient>
      </defs>

      {/* Gold sweep (the raised arm / stem) */}
      <motion.path
        d="M52 146 C22 132 8 104 14 80 C19 61 36 49 60 44 C42 54 30 68 28 86 C26 108 36 130 52 146 Z"
        fill={`url(#${gold})`}
        {...grow(0, 0.85, 1)}
      />

      {/* Leaf */}
      <motion.g {...grow(0.22, 0, 1)}>
        <path d="M46 124 C50 92 72 62 112 44 C114 80 94 110 46 124 Z" fill={`url(#${leaf})`} />
        <path
          d="M53 116 C68 96 86 72 106 52"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.28"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Head */}
      <motion.g
        {...(play
          ? {
              initial: { opacity: 0, y: -10 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.7, delay: delay + 0.5, ease: awardEase },
            }
          : {})}
      >
        <path d="M66 14 L76 28 L66 42 L56 28 Z" fill={`url(#${gold})`} />
        <circle cx="66" cy="28" r="3.4" fill="#fdfbf8" />
      </motion.g>

      {/* Young bud */}
      <motion.path d="M46 42 C34 36 28 24 30 10 C42 16 48 28 46 42 Z" fill="#05453c" {...grow(0.68, 0.9, 1)} />
    </svg>
  );
}
