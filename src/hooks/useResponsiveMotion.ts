import { useReducedMotion, type MotionProps, type Transition } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export const responsiveMotionEase = [0.22, 1, 0.36, 1] as const;

type RevealMotionOptions = {
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  staggerIndex?: number;
  stagger?: number;
  amount?: number;
  mobileY?: number;
  mobileX?: number;
  mobileScale?: number;
  mobileDuration?: number;
  mobileAmount?: number;
  once?: boolean;
  margin?: string;
  mobileMargin?: string;
  ease?: Transition['ease'];
};

type RevealMotionProps = Pick<MotionProps, 'initial' | 'whileInView' | 'viewport' | 'transition'>;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveMobileAxis(value: number, mobileValue: number | undefined, maxDistance: number) {
  if (typeof mobileValue === 'number') return mobileValue;
  if (value === 0) return 0;
  return Math.sign(value) * Math.min(Math.abs(value), maxDistance);
}

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, [query]);

  return matches;
}

export function useNarrowScreen(maxWidth = 767) {
  return useMediaQuery(`(max-width: ${maxWidth}px)`);
}

export function useRevealMotion({
  y = 18,
  x = 0,
  scale = 1,
  duration = 0.55,
  delay = 0,
  staggerIndex = 0,
  stagger = 0,
  amount = 0.18,
  mobileY,
  mobileX,
  mobileScale,
  mobileDuration,
  mobileAmount,
  once = true,
  margin = '0px 0px -10% 0px',
  mobileMargin = '0px 0px -8% 0px',
  ease = responsiveMotionEase,
}: RevealMotionOptions = {}): RevealMotionProps {
  const shouldReduceMotion = useReducedMotion();
  const isNarrow = useNarrowScreen();

  return useMemo(() => {
    const resolvedY = isNarrow ? resolveMobileAxis(y, mobileY, 18) : y;
    const resolvedX = isNarrow ? resolveMobileAxis(x, mobileX, 10) : x;
    const resolvedScale = isNarrow ? mobileScale ?? Math.max(scale, 0.99) : scale;
    const resolvedAmount = clamp(isNarrow ? mobileAmount ?? Math.min(amount, 0.16) : amount, 0.05, 0.35);
    const resolvedDuration = shouldReduceMotion
      ? 0.01
      : isNarrow
        ? mobileDuration ?? Math.min(duration, 0.5)
        : duration;
    const resolvedDelay = shouldReduceMotion ? 0 : delay + staggerIndex * stagger;

    return {
      initial: shouldReduceMotion
        ? { opacity: 1, x: 0, y: 0, scale: 1 }
        : { opacity: 0, x: resolvedX, y: resolvedY, scale: resolvedScale },
      whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
      viewport: {
        once,
        amount: resolvedAmount,
        margin: isNarrow ? mobileMargin : margin,
      },
      transition: {
        duration: resolvedDuration,
        delay: resolvedDelay,
        ease,
      },
    };
  }, [
    amount,
    delay,
    duration,
    ease,
    isNarrow,
    margin,
    mobileAmount,
    mobileDuration,
    mobileMargin,
    mobileScale,
    mobileX,
    mobileY,
    once,
    scale,
    shouldReduceMotion,
    stagger,
    staggerIndex,
    x,
    y,
  ]);
}
