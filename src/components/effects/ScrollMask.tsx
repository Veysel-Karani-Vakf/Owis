import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
} from 'framer-motion';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type ScrollMaskProps = {
  src: string;
  alt?: string;
  variant?: 'wipe' | 'iris' | 'curtain' | 'slats' | 'grid' | 'type';
  angle?: number;
  originY?: number;
  zoom?: number;
  fit?: 'cover' | 'contain';
  radius?: number;
  overlay?: number;
  revealContent?: boolean;
  calm?: boolean;
  className?: string;
  children: ReactNode;
};

const contentEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

type MaskSectionStyle = CSSProperties & {
  '--scroll-mask-angle': string;
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

export default function ScrollMask({
  src,
  alt = '',
  variant = 'wipe',
  angle = 108,
  originY = 52,
  zoom = 1.06,
  fit = 'cover',
  radius = 0,
  overlay = 0.48,
  revealContent = true,
  calm = true,
  className = '',
  children,
}: ScrollMaskProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useNarrowScreen(767);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const isContain = fit === 'contain';
  const openProgress = useTransform(scrollYProgress, [0, calm ? 0.36 : 0.62], [0, 1]);
  const usesSimpleMask = calm || isMobile || variant !== 'wipe';
  const initialClip = calm
    ? `inset(0% 0% 0% 0% round ${radius}px)`
    : usesSimpleMask
    ? 'inset(8% 5% 10% 5% round 22px)'
    : `polygon(15% ${Math.max(originY - 38, 8)}%, 84% 6%, 91% 88%, 10% 95%)`;
  const targetClip = usesSimpleMask
    ? `inset(0% 0% 0% 0% round ${radius}px)`
    : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
  const maskClipPath = useTransform(
    openProgress,
    [0, 1],
    [initialClip, targetClip]
  );
  const imageScale = useTransform(
    openProgress,
    [0, 1],
    [isContain ? 1 : calm ? Math.min(zoom, 1.025) : Math.min(zoom, 1.08), 1]
  );
  const frameOpacity = useTransform(openProgress, [0, 0.85], [calm ? 0 : 0.72, 0]);
  const contentOpacity = useTransform(openProgress, [0, 0.26], [calm ? 1 : 0.96, 1]);
  const contentY = useTransform(openProgress, [0, 0.3], [revealContent && !calm ? 10 : 0, 0]);

  const imageStyle: MotionStyle = shouldReduceMotion
    ? {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        scale: 1,
      }
    : {
        clipPath: maskClipPath,
        scale: imageScale,
        transformOrigin: `50% ${originY}%`,
      };

  const contentStyle: MotionStyle = shouldReduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: contentOpacity, y: contentY };

  return (
    <section
      ref={sectionRef}
      className={`relative isolate flex min-h-[480px] items-end overflow-hidden bg-dark-950 pt-28 md:min-h-[520px] md:pt-32 lg:min-h-[560px] ${className}`}
      style={{ '--scroll-mask-angle': `${angle}deg` } as MaskSectionStyle}
    >
      {isContain && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="absolute inset-0 -z-30 h-full w-full scale-[1.04] object-cover opacity-45 blur-md saturate-95"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-x-4 bottom-8 top-24 -z-30 rounded-[26px] border border-white/20 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.24)] md:inset-x-8 md:bottom-10 md:top-28 lg:inset-x-10"
      />
      <motion.img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full"
        style={{
          ...imageStyle,
          objectFit: fit,
          objectPosition: 'center center',
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-4 bottom-8 top-24 -z-10 rounded-[26px] border border-white/25 md:inset-x-8 md:bottom-10 md:top-28 lg:inset-x-10"
        style={{ opacity: shouldReduceMotion ? 0 : frameOpacity }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(36,0,2,0.90),rgba(77,3,6,0.74),rgba(17,19,21,0.56))]"
        style={{ opacity: overlay }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(180,35,58,0.18),transparent_42%,rgba(0,0,0,0.18))]"
      />
      <motion.div
        className="relative mx-auto w-full max-w-7xl px-4 pb-14 md:px-8 md:pb-16 lg:pb-20"
        style={{
          ...contentStyle,
          textShadow: '0 2px 18px rgba(0,0,0,0.34)',
        }}
        transition={{ duration: 0.65, ease: contentEase }}
      >
        {children}
      </motion.div>
    </section>
  );
}
