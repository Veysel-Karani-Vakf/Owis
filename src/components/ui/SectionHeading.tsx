import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'right';
  light?: boolean;
  children?: ReactNode;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
  children,
}: SectionHeadingProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12 });

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : 'items-start text-start'}`}
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2"
        >
          <span className="h-px w-8 bg-gold-400" />
          <span className={`text-sm font-medium tracking-wide ${light ? 'text-gold-300' : 'text-gold-600'}`}>
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-gold-400" />
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.52, delay: 0.08 }}
        className={`text-3xl font-bold leading-tight md:text-4xl lg:text-5xl ${light ? 'text-white' : 'text-dark-900'}`}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.52, delay: 0.14 }}
          className={`max-w-2xl text-base leading-relaxed md:text-lg ${light ? 'text-white/70' : 'text-dark-500'}`}
        >
          {description}
        </motion.p>
      )}

      {children}
    </div>
  );
}
