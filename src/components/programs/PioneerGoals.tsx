import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from 'framer-motion';
import { Compass, GraduationCap, Rocket, Telescope, type LucideIcon } from 'lucide-react';
import type { PointerEvent } from 'react';
import SpotlightCard from '@/components/effects/SpotlightCard';

type PioneerGoalsProps = {
  eyebrow: string;
  title: string;
  items: string[];
};

const goalIcons: LucideIcon[] = [GraduationCap, Telescope, Compass, Rocket];
const smoothEase = [0.22, 1, 0.36, 1] as const;

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

const cardVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 36, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: reduced ? { duration: 0.01 } : { type: 'spring', stiffness: 220, damping: 24, mass: 0.9 },
  },
});

function canTilt() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function GoalCard({ text, index, reduced }: { text: string; index: number; reduced: boolean }) {
  const Icon = goalIcons[index % goalIcons.length];
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [7, -7]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-7, 7]), { stiffness: 180, damping: 20 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || !canTilt()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  const resetPointer = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <motion.li variants={cardVariants(reduced)} className="h-full [perspective:1200px]">
      <motion.div
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        whileHover={reduced ? undefined : { y: -6 }}
        transition={{ duration: 0.35, ease: smoothEase }}
        className="h-full"
      >
        <SpotlightCard
          spotlightColor="rgba(218, 8, 18, 0.14)"
          contentClassName="flex h-full flex-col"
          className="h-full rounded-[26px] border border-primary-100 bg-white p-6 text-start shadow-[0_18px_48px_rgba(40,12,18,0.07)] transition-[border-color,box-shadow] duration-300 hover:border-primary-200 hover:shadow-[0_28px_64px_rgba(156,16,6,0.16)] md:p-7"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -end-3 -top-6 select-none text-[7.5rem] font-black leading-none text-primary-50 transition-colors duration-500 group-hover:text-primary-100"
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="relative flex h-16 w-16 items-center justify-center" style={{ transform: 'translateZ(30px)' }}>
            <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="32" cy="32" r="29" className="fill-none stroke-primary-100" strokeWidth="2" />
              <motion.circle
                cx="32"
                cy="32"
                r="29"
                className="fill-none stroke-primary-600"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: reduced ? 0.01 : 1.2, delay: reduced ? 0 : 0.25 + index * 0.1, ease: smoothEase }}
              />
            </svg>
            <motion.span
              animate={reduced ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-[0_12px_26px_rgba(195,7,16,0.32)] transition-transform duration-300 group-hover:scale-105"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </motion.span>
          </div>

          <p
            className="relative mb-6 mt-6 text-base font-semibold leading-relaxed text-dark-800 md:text-[17px]"
            style={{ transform: 'translateZ(18px)' }}
          >
            {text}
          </p>

          <span
            aria-hidden="true"
            className="mt-auto block h-1 w-10 rounded-full bg-primary-600 transition-[width] duration-500 group-hover:w-full"
          />
        </SpotlightCard>
      </motion.div>
    </motion.li>
  );
}

export default function PioneerGoals({ eyebrow, title, items }: PioneerGoalsProps) {
  const shouldReduceMotion = !!useReducedMotion();

  if (!items?.length) return null;

  return (
    <div>
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-primary-200" />
          <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
          <span className="h-px w-8 bg-primary-200" />
        </div>
        <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{title}</h2>
      </div>

      <motion.ol
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        {items.map((item, index) => (
          <GoalCard key={`${index}-${item}`} text={item} index={index} reduced={shouldReduceMotion} />
        ))}
      </motion.ol>
    </div>
  );
}
