import { useReducedMotion } from 'framer-motion';
import type { CSSProperties, HTMLAttributes, MouseEvent, PointerEvent, ReactNode } from 'react';
import { useRef } from 'react';

type CreditTiltCardProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  children: ReactNode;
  disabled?: boolean;
  rotationIntensity?: number;
  scaleOnHover?: number;
  shineColor?: string;
};

type TiltStyle = CSSProperties & {
  '--credit-hover-scale'?: string;
  '--credit-rotate-x'?: string;
  '--credit-rotate-y'?: string;
  '--credit-scale'?: string;
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
  rotationIntensity = 7,
  scaleOnHover = 1.018,
  shineColor = 'rgba(255, 255, 255, 0.72)',
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
      cardRef.current.style.setProperty('--credit-shine-opacity', '1');
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

    cardRef.current.style.setProperty('--credit-rotate-x', `${rotateX}deg`);
    cardRef.current.style.setProperty('--credit-rotate-y', `${rotateY}deg`);
    cardRef.current.style.setProperty('--credit-scale', String(scaleOnHover));
    cardRef.current.style.setProperty('--credit-shine-x', `${pointerX}px`);
    cardRef.current.style.setProperty('--credit-shine-y', `${pointerY}px`);
  };

  const resetCard = () => {
    if (!cardRef.current) return;
    cardRef.current.style.removeProperty('--credit-rotate-x');
    cardRef.current.style.removeProperty('--credit-rotate-y');
    cardRef.current.style.removeProperty('--credit-scale');
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
    '--credit-shine-x': '50%',
    '--credit-shine-y': '50%',
    '--credit-shine-opacity': '0',
    transformStyle: 'preserve-3d',
    ...style,
  };

  return (
    <article
      ref={cardRef}
      className={`group relative overflow-hidden transition-[transform,border-color,box-shadow] duration-300 ease-out will-change-transform [transform:perspective(900px)_rotateX(var(--credit-rotate-x,0deg))_rotateY(var(--credit-rotate-y,0deg))_scale(var(--credit-scale,1))] hover:[--credit-scale:var(--credit-hover-scale)] ${className}`}
      style={tiltStyle}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[var(--credit-shine-opacity)] transition-opacity duration-200"
        style={{
          background: `radial-gradient(260px circle at var(--credit-shine-x) var(--credit-shine-y), ${shineColor}, transparent 58%)`,
          mixBlendMode: 'soft-light',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-px z-0 rounded-[inherit] border border-white/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div
        className="relative z-10"
        style={{ transform: shouldReduceMotion ? undefined : 'translateZ(26px)' }}
      >
        {children}
      </div>
    </article>
  );
}
