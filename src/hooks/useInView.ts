import { useEffect, useRef, useState } from 'react';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';

const DEFAULT_THRESHOLD = 0.15;

function clampThreshold(value: number, isNarrow: boolean) {
  return Math.min(Math.max(value, 0.01), isNarrow ? 0.16 : 0.35);
}

function resolveThreshold(threshold: IntersectionObserverInit['threshold'], isNarrow: boolean) {
  if (Array.isArray(threshold)) {
    return threshold.map((value) => clampThreshold(value, isNarrow));
  }

  return clampThreshold(threshold ?? DEFAULT_THRESHOLD, isNarrow);
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: DEFAULT_THRESHOLD }
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const isNarrow = useNarrowScreen();
  const { root = null, rootMargin, threshold } = options;
  const thresholdKey = Array.isArray(options.threshold)
    ? options.threshold.join(',')
    : String(options.threshold ?? DEFAULT_THRESHOLD);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      (typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, {
      root,
      rootMargin: rootMargin ?? (isNarrow ? '0px 0px -8% 0px' : '0px 0px -10% 0px'),
      threshold: resolveThreshold(threshold, isNarrow),
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [isNarrow, root, rootMargin, threshold, thresholdKey]);

  return { ref, inView };
}
