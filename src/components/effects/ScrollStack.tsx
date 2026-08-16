import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Children, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type ScrollStackProps = {
  children: ReactNode;
  variant?: 'stack' | 'deck' | 'fade' | 'flip' | 'zoom' | 'reveal';
  scrollLength?: number;
  peek?: number;
  scaleStep?: number;
  blur?: number;
  dim?: number;
  smooth?: number;
  depth?: number;
  cardWidth?: number;
  cardHeight?: number;
  borderRadius?: number;
  perspective?: number;
  showProgress?: boolean;
  showCounter?: boolean;
  className?: string;
};

type StackLayerProps = {
  children: ReactNode;
  index: number;
  count: number;
  progress: MotionValue<number>;
  peek: number;
  scaleStep: number;
  blur: number;
  dim: number;
  depth: number;
  borderRadius: number;
  minHeight: string;
};

function useNarrowScreen(maxWidth: number) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [maxWidth]);

  return matches;
}

function StackLayer({
  children,
  index,
  count,
  progress,
  peek,
  scaleStep,
  blur,
  dim,
  depth,
  borderRadius,
  minHeight,
}: StackLayerProps) {
  const relative = useTransform(progress, (value) => index - value * (count - 1));
  const y = useTransform(relative, (value) => {
    if (value < 0) return Math.max(value, -depth) * peek;
    return Math.min(value, depth) * (peek + 16);
  });
  const scale = useTransform(relative, (value) => 1 - Math.min(Math.max(-value, 0), depth) * scaleStep);
  const opacity = useTransform(relative, (value) => {
    if (value < -depth - 0.2) return 0;
    if (value > depth + 0.2) return 0;
    return 1;
  });
  const filter = useTransform(relative, (value) => `blur(${Math.min(Math.max(-value, 0), depth) * blur}px)`);
  const brightness = useTransform(
    relative,
    (value) => `brightness(${1 - Math.min(Math.max(-value, 0), depth) * dim})`
  );
  const zIndex = useTransform(progress, (value) => {
    const active = Math.round(value * (count - 1));
    return count + depth - Math.abs(index - active);
  });

  return (
    <motion.div
      className="absolute inset-x-0 top-0 mx-auto w-full will-change-transform"
      style={{
        y,
        scale,
        opacity,
        filter,
        zIndex,
        borderRadius,
        minHeight,
      }}
    >
      <motion.div style={{ filter: brightness }} className="h-full">
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function ScrollStack({
  children,
  variant = 'stack',
  scrollLength = 0.72,
  peek = 20,
  scaleStep = 0.035,
  blur = 0,
  dim = 0.12,
  smooth = 0.12,
  depth = 3,
  cardWidth = 960,
  cardHeight = 0.52,
  borderRadius = 22,
  perspective = 1400,
  showProgress = true,
  showCounter = true,
  className = '',
}: ScrollStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useNarrowScreen(767);
  const cards = useMemo(() => Children.toArray(children), [children]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start center', 'end center'],
  });
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 210,
    damping: 30 + smooth * 120,
    mass: 0.25 + smooth,
  });
  const progress = shouldReduceMotion ? scrollYProgress : springProgress;
  const progressWidth = useTransform(progress, [0, 1], ['0%', '100%']);
  const count = cards.length;
  const minHeight = `clamp(430px, ${Math.round(cardHeight * 100)}vh, 620px)`;
  const runwayHeight = `${Math.max(150, (count - 1) * scrollLength * 100 + 74)}vh`;

  useMotionValueEvent(progress, 'change', (value) => {
    const nextIndex = Math.min(count - 1, Math.max(0, Math.round(value * (count - 1))));
    setActiveIndex(nextIndex);
  });

  if (count === 0) return null;

  if (shouldReduceMotion || isMobile || variant !== 'stack') {
    return (
      <div className={`mt-12 grid gap-5 ${className}`}>
        {cards.map((card, index) => (
          <div key={index}>{card}</div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={stackRef}
      className={`relative mt-14 ${className}`}
      style={{ minHeight: runwayHeight }}
    >
      <div
        className="sticky top-24 mx-auto flex min-h-[calc(100vh-7rem)] w-full flex-col items-center justify-center py-4"
        style={{ maxWidth: `${cardWidth}px`, perspective }}
      >
        <div className="relative w-full" style={{ minHeight }}>
          {cards.map((card, index) => (
            <StackLayer
              key={index}
              index={index}
              count={count}
              progress={progress}
              peek={peek}
              scaleStep={scaleStep}
              blur={blur}
              dim={dim}
              depth={depth}
              borderRadius={borderRadius}
              minHeight={minHeight}
            >
              {card}
            </StackLayer>
          ))}
        </div>

        {(showProgress || showCounter) && (
          <div className="mt-6 flex w-full flex-col gap-3 px-1 sm:flex-row sm:items-center">
            {showProgress && (
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-100">
                <motion.div
                  className="h-full rounded-full bg-primary-700"
                  style={{ width: progressWidth }}
                />
              </div>
            )}
            {showCounter && (
              <div
                className="text-sm font-semibold text-primary-800"
                aria-live="polite"
              >
                {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
