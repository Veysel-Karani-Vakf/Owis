import { motion, useReducedMotion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useId } from 'react';
import type { ProgramStatistic } from '@/data/programs';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';

type InstitutionalFiguresProps = {
  statistics: ProgramStatistic[];
  /** Small line above the heading, from the programs-page labels. */
  eyebrow: string;
  title: string;
  /** The program's media note, printed as small type under the figures. */
  note?: string;
  noteLabel?: string;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

/** A figure typed as plain digits counts up; anything else ("13+", "%") is shown as written. */
function parseFigure(value: string) {
  const trimmed = value.trim();
  return /^\d{1,9}$/.test(trimmed) ? Number(trimmed) : null;
}

/**
 * One figure drawn as a seal: a slowly turning dotted ring outside, a solid arc
 * that draws itself in on reveal, and the number counting up at the centre.
 */
function Seal({
  value,
  index,
  active,
  reduced,
}: {
  value: string;
  index: number;
  active: boolean;
  reduced: boolean;
}) {
  const gradientId = useId();
  const target = parseFigure(value);
  const animated = useCountUp(target ?? 0, reduced ? 1 : 1700, active && target !== null);
  const shown = target === null ? value : active ? String(animated) : '0';

  return (
    <div className="relative h-32 w-32 md:h-36 md:w-36">
      <svg viewBox="0 0 144 144" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff5d6b" />
            <stop offset="100%" stopColor="#9c1006" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="72"
          cy="72"
          r="68"
          fill="none"
          stroke="#ffc8ce"
          strokeWidth="1.5"
          strokeDasharray="2 7"
          strokeLinecap="round"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '72px 72px' }}
        />
        <circle cx="72" cy="72" r="56" fill="none" stroke="#ffe1e4" strokeWidth="6" />
        <motion.circle
          cx="72"
          cy="72"
          r="56"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: reduced ? 0.01 : 1.4, ease: smoothEase, delay: reduced ? 0 : 0.15 + index * 0.12 }}
          style={{ rotate: -90, transformOrigin: '72px 72px' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span dir="ltr" className="text-3xl font-black tabular-nums leading-none text-dark-950 md:text-4xl">
          {shown}
        </span>
      </div>
    </div>
  );
}

export default function InstitutionalFigures({
  statistics,
  eyebrow,
  title,
  note,
  noteLabel,
}: InstitutionalFiguresProps) {
  const reduced = !!useReducedMotion();
  const { ref, inView } = useInView<HTMLOListElement>({ threshold: 0.3 });

  if (!statistics.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="max-w-2xl text-start">
        {eyebrow && (
          <span className="inline-flex items-center gap-2.5 text-sm font-black text-primary-700">
            <span
              aria-hidden="true"
              className="h-1.5 w-7 rounded-full bg-gradient-to-r from-primary-600 to-primary-300 rtl:bg-gradient-to-l"
            />
            {eyebrow}
          </span>
        )}
        <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{title}</h2>
      </div>

      {/* One plate, hairlines between the cells: the figures read as a single record, not four cards. Each cell stays white and only its content rises in, so the hairline backdrop never shows through. */}
      <ol
        ref={ref}
        className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[32px] border border-primary-100 bg-primary-100 shadow-[0_24px_64px_rgba(40,12,18,0.08)] md:grid-cols-4"
      >
        {statistics.map((stat, index) => (
          <li key={`${stat.value}-${stat.label}`} className="bg-white px-4 py-9 md:py-12">
            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: reduced ? 0.01 : 0.6, ease: smoothEase, delay: reduced ? 0 : index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <Seal value={stat.value} index={index} active={inView} reduced={reduced} />
              <p className="mt-5 text-sm font-bold text-dark-800 md:text-base">{stat.label}</p>
              {stat.description && (
                <p className="mt-1.5 max-w-[14rem] text-xs leading-relaxed text-dark-500">{stat.description}</p>
              )}
            </motion.div>
          </li>
        ))}
      </ol>

      {note && (
        <p className="mt-5 flex max-w-3xl items-start gap-2.5 text-start text-xs leading-relaxed text-dark-500 md:text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
          <span>
            {noteLabel && <span className="font-bold text-dark-700">{noteLabel} </span>}
            {note}
          </span>
        </p>
      )}
    </div>
  );
}
