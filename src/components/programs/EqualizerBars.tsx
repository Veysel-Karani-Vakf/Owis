import { motion, useReducedMotion } from 'framer-motion';

const peaks = [0.45, 0.85, 0.6, 1, 0.5, 0.75, 0.35, 0.9, 0.55];

/** Radio-style equalizer bars that keep breathing under the Owais platform logo. */
export default function EqualizerBars({ className = '' }: { className?: string }) {
  const reduced = !!useReducedMotion();

  return (
    <div aria-hidden="true" dir="ltr" className={`flex h-11 items-end justify-center gap-2 ${className}`}>
      {peaks.map((peak, index) => (
        <motion.span
          key={index}
          initial={{ scaleY: 0.3 }}
          animate={reduced ? { scaleY: peak } : { scaleY: [0.3, peak, 0.4, peak * 0.8, 0.3] }}
          transition={
            reduced
              ? { duration: 0.01 }
              : { duration: 1.6 + (index % 3) * 0.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.12 }
          }
          className="w-2 origin-bottom rounded-full bg-gradient-to-t from-primary-700 to-primary-400"
          style={{ height: `${peak * 100}%` }}
        />
      ))}
    </div>
  );
}
