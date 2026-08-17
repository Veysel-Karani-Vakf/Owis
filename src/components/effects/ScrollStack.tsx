import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import FadeContent from './FadeContent';

type ScrollStackProps = {
  children: ReactNode;
  header?: ReactNode;
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
  stepLabels?: string[];
  indicatorLabel?: string;
  topSpacing?: string;
  stickyTop?: number;
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
  layerRef?: (node: HTMLDivElement | null) => void;
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

const FINAL_STAGE_HOLD = 0.28;

function getLastStageStart(count: number) {
  return count <= 1 ? 1 : 1 - FINAL_STAGE_HOLD;
}

function getActiveIndexFromProgress(value: number, count: number) {
  if (count <= 1) return 0;

  const clamped = Math.min(1, Math.max(0, value));
  const lastStageStart = getLastStageStart(count);

  if (clamped >= lastStageStart) return count - 1;

  const segmentLength = lastStageStart / (count - 1);
  return Math.min(count - 2, Math.floor(clamped / segmentLength));
}

function getScrollTargetProgress(index: number, count: number) {
  if (count <= 1) return 0;

  const lastStageStart = getLastStageStart(count);

  if (index >= count - 1) {
    return lastStageStart + (1 - lastStageStart) * 0.42;
  }

  const segmentLength = lastStageStart / (count - 1);
  return Math.min(lastStageStart - 0.01, index * segmentLength + segmentLength * 0.08);
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
  layerRef,
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
      ref={layerRef}
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

type FadeLayerProps = {
  children: ReactNode;
  index: number;
  count: number;
  activeIndex: number;
  borderRadius: number;
  minHeight: string;
  layerRef?: (node: HTMLDivElement | null) => void;
};

function FadeLayer({
  children,
  index,
  count,
  activeIndex,
  borderRadius,
  minHeight,
  layerRef,
}: FadeLayerProps) {
  const isActive = activeIndex === index;
  const yOffset = index < activeIndex ? -8 : 8;

  return (
    <motion.div
      ref={layerRef}
      aria-hidden={!isActive}
      className={`absolute inset-x-0 top-0 mx-auto w-full will-change-transform ${
        isActive ? 'scroll-stack-layer--active' : 'scroll-stack-layer--inactive'
      }`}
      initial={false}
      animate={
        isActive
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: yOffset, scale: 0.992 }
      }
      transition={{
        duration: isActive ? 0.46 : 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        zIndex: isActive ? count + 2 : 0,
        pointerEvents: isActive ? 'auto' : 'none',
        visibility: isActive ? 'visible' : 'hidden',
        borderRadius,
        minHeight,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function ScrollStack({
  children,
  header,
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
  stepLabels = [],
  indicatorLabel = 'Steps',
  topSpacing = '3.5rem',
  stickyTop = 112,
  className = '',
}: ScrollStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useNarrowScreen(767);
  const cards = useMemo(() => Children.toArray(children), [children]);
  const count = cards.length;
  const isFadeMode = variant === 'fade' || variant === 'reveal';
  const isStackMode = variant === 'stack';
  const stickyTopOffset = `${stickyTop}px`;
  const scrollOffset = useMemo(
    () => [`0 ${stickyTop}px`, '1 1'] as [`0 ${number}px`, '1 1'],
    [stickyTop]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [measuredLayerHeight, setMeasuredLayerHeight] = useState(0);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: scrollOffset,
  });
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 210,
    damping: 30 + smooth * 120,
    mass: 0.25 + smooth,
  });
  const progress = shouldReduceMotion || isFadeMode ? scrollYProgress : springProgress;
  const progressWidth = useTransform(progress, [0, 1], ['0%', '100%']);
  const minHeight = isFadeMode
    ? `clamp(340px, ${Math.round(cardHeight * 100)}vh, 500px)`
    : `clamp(430px, ${Math.round(cardHeight * 100)}vh, 620px)`;
  const resolvedMinHeight =
    measuredLayerHeight > 0 ? `max(${minHeight}, ${Math.ceil(measuredLayerHeight)}px)` : minHeight;
  const runwayHeight = `${
    isFadeMode
      ? Math.max(240, 100 + (count - 1) * scrollLength * 100)
      : Math.max(150, (count - 1) * scrollLength * 100 + 74)
  }vh`;
  const staticCards = shouldReduceMotion || isMobile || (!isStackMode && !isFadeMode);
  const labels = useMemo(
    () => cards.map((_, index) => stepLabels[index] ?? String(index + 1).padStart(2, '0')),
    [cards, stepLabels]
  );

  const setLayerRef = useCallback((index: number, node: HTMLDivElement | null) => {
    layerRefs.current[index] = node;
  }, []);

  useMotionValueEvent(progress, 'change', (value) => {
    const nextIndex = isFadeMode
      ? getActiveIndexFromProgress(value, count)
      : Math.min(count - 1, Math.max(0, Math.round(value * (count - 1))));

    setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
  });

  useEffect(() => {
    setMeasuredLayerHeight(0);
    if (count === 0 || staticCards) return undefined;

    let frame = 0;
    const updateHeight = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextHeight = layerRefs.current.reduce((maxHeight, node) => {
          if (!node) return maxHeight;
          return Math.max(maxHeight, node.scrollHeight, node.getBoundingClientRect().height);
        }, 0);

        setMeasuredLayerHeight((currentHeight) =>
          Math.abs(currentHeight - nextHeight) < 1 ? currentHeight : nextHeight
        );
      });
    };

    const observers = layerRefs.current
      .filter((node): node is HTMLDivElement => Boolean(node))
      .map((node) => {
        const observer = new ResizeObserver(updateHeight);
        observer.observe(node);
        return observer;
      });

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateHeight);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [count, staticCards, variant]);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!stackRef.current || count <= 1) return;

      const rect = stackRef.current.getBoundingClientRect();
      const start = rect.top + window.scrollY - stickyTop;
      const end = rect.bottom + window.scrollY - window.innerHeight;
      const targetProgress = isFadeMode ? getScrollTargetProgress(index, count) : index / (count - 1);
      const target = start + (end - start) * targetProgress;

      window.scrollTo({
        top: target,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    },
    [count, isFadeMode, shouldReduceMotion, stickyTop]
  );

  if (count === 0) return null;

  if (staticCards) {
    return (
      <div className={className} style={{ marginBlockStart: topSpacing }}>
        {header && <div className="mb-8">{header}</div>}
        <div className="grid gap-5">
          {cards.map((card, index) =>
            shouldReduceMotion ? (
              <div key={index}>{card}</div>
            ) : (
              <FadeContent
                key={index}
                blur={false}
                duration={560}
                initialOpacity={0}
                yOffset={12}
                delay={Math.min(index * 70, 210)}
                threshold={0.16}
              >
                {card}
              </FadeContent>
            )
          )}
        </div>
      </div>
    );
  }

  if (isFadeMode) {
    return (
      <div
        ref={stackRef}
        className={`relative ${className}`}
        style={{ minHeight: runwayHeight, marginBlockStart: topSpacing }}
      >
        <div
          className="sticky mx-auto flex w-full flex-col items-center justify-center py-3 md:py-4"
          style={{
            top: stickyTopOffset,
            height: `calc(100svh - ${stickyTopOffset})`,
            maxWidth: `${cardWidth}px`,
            perspective,
          }}
        >
          {header && <div className="mb-8 w-full">{header}</div>}

          <div className="relative isolate w-full" style={{ minHeight: resolvedMinHeight }}>
            {cards.map((card, index) => (
              <FadeLayer
                key={index}
                index={index}
                count={count}
                activeIndex={activeIndex}
                borderRadius={borderRadius}
                minHeight={resolvedMinHeight}
                layerRef={(node) => setLayerRef(index, node)}
              >
                {card}
              </FadeLayer>
            ))}
          </div>

          {(showProgress || showCounter) && (
            <div className="mt-5 w-full rounded-2xl border border-primary-100 bg-white/90 px-4 py-3 shadow-[0_16px_42px_rgba(44,13,19,0.06)]">
              <div className="flex items-center gap-4">
                {showProgress && (
                  <div className="relative h-14 flex-1" aria-label={indicatorLabel}>
                    <div className="absolute inset-x-4 top-4 h-px rounded-full bg-primary-100" />
                    <motion.div
                      className="absolute top-4 h-px rounded-full bg-primary-700"
                      style={{
                        width: progressWidth,
                        insetInlineStart: '1rem',
                      }}
                    />
                    <div
                      className="relative z-10 grid"
                      style={{
                        gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
                      }}
                    >
                      {cards.map((_, index) => {
                        const isActive = activeIndex === index;

                        return (
                          <button
                            key={index}
                            type="button"
                            aria-current={isActive ? 'step' : undefined}
                            aria-label={`${labels[index]} ${String(index + 1).padStart(2, '0')} / ${String(
                              count
                            ).padStart(2, '0')}`}
                            onClick={() => scrollToIndex(index)}
                            className="group flex min-w-0 flex-col items-center gap-2 text-center focus-visible:outline-primary-700"
                          >
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-300 ${
                                isActive
                                  ? 'border-primary-700 bg-primary-700 text-white'
                                  : 'border-primary-200 bg-white text-dark-400 group-hover:border-primary-400 group-hover:text-primary-700'
                              }`}
                              dir="ltr"
                            >
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span
                              className={`hidden max-w-[11rem] truncate text-xs font-semibold transition-colors duration-300 sm:block ${
                                isActive ? 'text-primary-800' : 'text-dark-400'
                              }`}
                            >
                              {labels[index]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {showCounter && (
                  <div className="shrink-0 text-sm font-semibold text-primary-800" aria-live="polite" dir="ltr">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={stackRef}
      className={`relative ${className}`}
      style={{ minHeight: runwayHeight, marginBlockStart: topSpacing }}
    >
      <div
        className="sticky mx-auto flex w-full flex-col items-center justify-center py-3 md:py-4"
        style={{
          top: stickyTopOffset,
          height: `calc(100svh - ${stickyTopOffset})`,
          maxWidth: `${cardWidth}px`,
          perspective,
        }}
      >
        <div className="relative w-full" style={{ minHeight: resolvedMinHeight }}>
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
              minHeight={resolvedMinHeight}
              layerRef={(node) => setLayerRef(index, node)}
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
