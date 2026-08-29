import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';

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
  const isNarrow = useNarrowScreen();
  const resolvedEase = resolveEase(easing ?? ease);
  const resolvedThreshold = isNarrow
    ? Math.min(Math.max(threshold, 0.05), 0.16)
    : Math.min(Math.max(threshold, 0.05), 0.35);
  const resolvedYOffset =
    isNarrow && yOffset !== 0 ? Math.sign(yOffset) * Math.min(Math.abs(yOffset), 18) : yOffset;
  const resolvedBlur = blur ? (isNarrow ? 'blur(3px)' : 'blur(8px)') : 'blur(0px)';
  const resolvedDuration = shouldReduceMotion ? 0.01 : isNarrow ? Math.min(toSeconds(duration), 0.5) : toSeconds(duration);

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : {
              opacity: initialOpacity,
              y: resolvedYOffset,
              filter: resolvedBlur,
            }
      }
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{
        once,
        amount: resolvedThreshold,
        margin: isNarrow ? '0px 0px -8% 0px' : '0px 0px -10% 0px',
      }}
      transition={{
        duration: resolvedDuration,
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
