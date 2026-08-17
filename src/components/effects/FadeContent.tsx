import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type FadeContentProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: string;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  yOffset?: number;
  once?: boolean;
};

const defaultEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

function toSeconds(value: number) {
  return value > 10 ? value / 1000 : value;
}

function resolveEase(value?: string) {
  if (!value || value === 'ease-out' || value === 'power2.out') return defaultEase;
  if (value === 'linear') return 'linear';
  if (value === 'ease-in') return 'easeIn';
  if (value === 'ease-in-out') return 'easeInOut';
  return defaultEase;
}

export default function FadeContent({
  children,
  blur = false,
  duration = 650,
  easing,
  ease,
  delay = 0,
  threshold = 0.16,
  initialOpacity = 0,
  yOffset = 18,
  once = true,
  className = '',
  ...props
}: FadeContentProps) {
  const shouldReduceMotion = useReducedMotion();
  const resolvedEase = resolveEase(easing ?? ease);

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : {
              opacity: initialOpacity,
              y: yOffset,
              filter: blur ? 'blur(8px)' : 'blur(0px)',
            }
      }
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount: Math.min(Math.max(threshold, 0), 1) }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : toSeconds(duration),
        delay: shouldReduceMotion ? 0 : toSeconds(delay),
        ease: resolvedEase,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
