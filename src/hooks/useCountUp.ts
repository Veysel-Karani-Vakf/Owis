import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function useCountUp(
  target: number,
  duration: number = 2000,
  start: boolean = false
) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!start || target === 0) return;

    if (shouldReduceMotion) {
      setValue(target);
      return;
    }

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, start, shouldReduceMotion]);

  return value;
}
