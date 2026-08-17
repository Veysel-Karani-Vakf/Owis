import { useReducedMotion } from 'framer-motion';
import type { CSSProperties, HTMLAttributes, MouseEvent, PointerEvent, ReactNode } from 'react';
import { useRef } from 'react';

type CreditTiltCardProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  children: ReactNode;
  disabled?: boolean;
  hoverShadow?: string;
  parallaxIntensity?: number;
  rotationIntensity?: number;
  scaleOnHover?: number;
  shadowColor?: string;
  shineColor?: string;
  showShadow?: boolean;
  showShine?: boolean;
};

type TiltStyle = CSSProperties & {
  '--credit-hover-scale'?: string;
  '--credit-parallax-x'?: string;
  '--credit-parallax-y'?: string;
  '--credit-rotate-x'?: string;
  '--credit-rotate-y'?: string;
  '--credit-scale'?: string;
  '--credit-shadow-hover'?: string;
  '--credit-shadow-rest'?: string;
  '--credit-shine-x'?: string;
  '--credit-shine-y'?: string;
  '--credit-shine-opacity'?: string;
};

function canTrackPointer() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

export default function CreditTiltCard({
  children,
  className = '',
  disabled = false,
  hoverShadow = '0 24px 58px rgba(35, 15, 20, 0.13)',
  parallaxIntensity = 1,
  rotationIntensity = 7,
  scaleOnHover = 1.018,
  shadowColor = 'rgba(35, 15, 20, 0.15)',
  shineColor = 'rgba(255, 255, 255, 0.72)',
  showShadow = true,
  showShine = true,
  style,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: CreditTiltCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const trackingRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const startTracking = () => {
    trackingRef.current = !disabled && !shouldReduceMotion && canTrackPointer();

    if (trackingRef.current && cardRef.current) {
      if (showShine) {
        cardRef.current.style.setProperty('--credit-shine-opacity', '1');
      }
      if (showShadow) {
        cardRef.current.style.setProperty('--credit-card-shadow', hoverShadow);
      }
    }
  };

  const moveTracking = (clientX: number, clientY: number) => {
    if (!trackingRef.current || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const pointerX = clientX - rect.left;
    const pointerY = clientY - rect.top;
    const x = pointerX / rect.width;
    const y = pointerY / rect.height;
    const rotateX = (0.5 - y) * rotationIntensity;
    const rotateY = (x - 0.5) * rotationIntensity;
    const parallaxX = (x - 0.5) * 18 * parallaxIntensity;
    const parallaxY = (y - 0.5) * 18 * parallaxIntensity;
    const shadowX = (0.5 - x) * 18 * Math.max(rotationIntensity / 7, 0.7);
    const shadowY = 18 + y * 12;
    const shadowBlur = 42 + Math.abs(x - 0.5) * 18 + Math.abs(y - 0.5) * 12;

    cardRef.current.style.setProperty('--credit-rotate-x', `${rotateX}deg`);
    cardRef.current.style.setProperty('--credit-rotate-y', `${rotateY}deg`);
    cardRef.current.style.setProperty('--credit-scale', String(scaleOnHover));
    cardRef.current.style.setProperty('--credit-parallax-x', `${parallaxX}px`);
    cardRef.current.style.setProperty('--credit-parallax-y', `${parallaxY}px`);
    cardRef.current.style.setProperty('--credit-shine-x', `${pointerX}px`);
    cardRef.current.style.setProperty('--credit-shine-y', `${pointerY}px`);
    if (showShadow) {
      cardRef.current.style.setProperty(
        '--credit-card-shadow',
        `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px ${shadowBlur.toFixed(1)}px ${shadowColor}`,
      );
    }
  };

  const resetCard = () => {
    if (!cardRef.current) return;
    cardRef.current.style.removeProperty('--credit-rotate-x');
    cardRef.current.style.removeProperty('--credit-rotate-y');
    cardRef.current.style.removeProperty('--credit-scale');
    cardRef.current.style.setProperty('--credit-parallax-x', '0px');
    cardRef.current.style.setProperty('--credit-parallax-y', '0px');
    cardRef.current.style.removeProperty('--credit-card-shadow');
    cardRef.current.style.setProperty('--credit-shine-opacity', '0');
  };

  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    startTracking();
    moveTracking(event.clientX, event.clientY);
    onPointerEnter?.(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    moveTracking(event.clientX, event.clientY);
    onPointerMove?.(event);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    trackingRef.current = false;
    resetCard();
    onPointerLeave?.(event);
  };

  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    startTracking();
    moveTracking(event.clientX, event.clientY);
  };

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    moveTracking(event.clientX, event.clientY);
  };

  const handleMouseLeave = () => {
    trackingRef.current = false;
    resetCard();
  };

  const tiltStyle: TiltStyle = {
    '--credit-hover-scale': String(scaleOnHover),
    '--credit-parallax-x': '0px',
    '--credit-parallax-y': '0px',
    '--credit-shadow-hover': hoverShadow,
    '--credit-shadow-rest': '0 14px 38px rgba(35, 15, 20, 0.06)',
    '--credit-shine-x': '50%',
    '--credit-shine-y': '50%',
    '--credit-shine-opacity': '0',
    boxShadow: showShadow ? 'var(--credit-card-shadow, var(--credit-shadow-rest))' : undefined,
    transformStyle: 'preserve-3d',
    ...style,
  };

  return (
    <article
      ref={cardRef}
      className={`group relative isolate overflow-hidden transition-[transform,border-color,box-shadow] duration-300 ease-out will-change-transform [transform:perspective(900px)_rotateX(var(--credit-rotate-x,0deg))_rotateY(var(--credit-rotate-y,0deg))_scale(var(--credit-scale,1))] hover:[--credit-card-shadow:var(--credit-shadow-hover)] hover:[--credit-scale:var(--credit-hover-scale)] motion-reduce:transform-none motion-reduce:transition-none ${className}`}
      style={tiltStyle}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {showShine && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-[var(--credit-shine-opacity)] transition-opacity duration-200"
            style={{
              background: `radial-gradient(300px circle at var(--credit-shine-x) var(--credit-shine-y), ${shineColor}, transparent 60%)`,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-20 z-0 transition-opacity duration-200"
            style={{
              background:
                'linear-gradient(115deg, transparent 24%, rgba(255, 255, 255, 0.58) 43%, transparent 62%)',
              mixBlendMode: 'screen',
              opacity: 'calc(var(--credit-shine-opacity) * 0.54)',
              transform: shouldReduceMotion
                ? undefined
                : 'translate3d(calc(var(--credit-parallax-x, 0px) * -0.55), calc(var(--credit-parallax-y, 0px) * -0.55), 1px) rotate(14deg)',
            }}
          />
        </>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-px z-0 rounded-[inherit] border border-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div
        className="relative z-10"
        style={{
          transform: shouldReduceMotion
            ? undefined
            : 'translate3d(calc(var(--credit-parallax-x, 0px) * 0.22), calc(var(--credit-parallax-y, 0px) * 0.22), 28px)',
        }}
      >
        {children}
      </div>
    </article>
  );
}
