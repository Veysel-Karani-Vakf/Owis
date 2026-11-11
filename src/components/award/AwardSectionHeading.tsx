import { motion } from 'framer-motion';
import { useRevealMotion } from '@/hooks/useResponsiveMotion';

type AwardSectionHeadingProps = {
  /** Used as the heading id, so the section can point aria-labelledby at it. */
  id: string;
  title: string;
  description?: string;
  align?: 'center' | 'start';
};

/** Gold leaf between two hairlines that fade outwards — the award's section ornament. */
export function AwardOrnament({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`flex items-center gap-2.5 ${className}`}>
      <span className="h-px w-10 from-transparent to-award-gold-300 ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
      <svg viewBox="0 0 16 16" className="h-4 w-4 text-award-gold-400">
        <path d="M8 1.5 C11.5 4.5 11.5 9.5 8 14.5 C4.5 9.5 4.5 4.5 8 1.5 Z" fill="currentColor" />
        <path d="M8 4 L8 12.5" stroke="#fdfbf8" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
      <span className="h-px w-10 from-transparent to-award-gold-300 ltr:bg-gradient-to-l rtl:bg-gradient-to-r" />
    </span>
  );
}

export default function AwardSectionHeading({ id, title, description, align = 'center' }: AwardSectionHeadingProps) {
  const ornament = useRevealMotion({ y: 10, duration: 0.5 });
  const heading = useRevealMotion({ y: 18, duration: 0.6, delay: 0.06 });
  const text = useRevealMotion({ y: 14, duration: 0.6, delay: 0.12 });
  const centered = align === 'center';

  return (
    <div className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : 'items-start text-start'}`}>
      <motion.div {...ornament}>
        <AwardOrnament />
      </motion.div>
      <motion.h2
        id={id}
        {...heading}
        className="font-brand text-[1.85rem] font-bold leading-tight text-award-ink sm:text-4xl lg:text-[2.6rem]"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p {...text} className="max-w-2xl text-[15px] leading-relaxed text-award-body sm:text-lg">
          {description}
        </motion.p>
      )}
    </div>
  );
}
