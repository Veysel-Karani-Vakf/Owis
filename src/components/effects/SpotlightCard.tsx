import type { CSSProperties, HTMLAttributes, PointerEvent } from 'react';
import { useRef } from 'react';

type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
  spotlightColor?: string;
  disabled?: boolean;
  contentClassName?: string;
};

type SpotlightStyle = CSSProperties & {
  '--spotlight-x'?: string;
  '--spotlight-y'?: string;
  '--spotlight-opacity'?: string;
};

function canTrackPointer() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(180, 35, 58, 0.12)',
  disabled = false,
  contentClassName = '',
  style,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef(false);

  const setSpotlightOpacity = (value: string) => {
    cardRef.current?.style.setProperty('--spotlight-opacity', value);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    trackingRef.current = !disabled && canTrackPointer();
    if (trackingRef.current) setSpotlightOpacity('1');
    onPointerEnter?.(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (trackingRef.current && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      cardRef.current.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
      cardRef.current.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
    }

    onPointerMove?.(event);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    trackingRef.current = false;
    setSpotlightOpacity('0');
    onPointerLeave?.(event);
  };

  const spotlightStyle: SpotlightStyle = {
    '--spotlight-x': '50%',
    '--spotlight-y': '50%',
    '--spotlight-opacity': '0',
    ...style,
  };

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden ${className}`}
      style={spotlightStyle}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[var(--spotlight-opacity)] transition-opacity duration-300"
        style={{
          background: `radial-gradient(360px circle at var(--spotlight-x) var(--spotlight-y), ${spotlightColor}, transparent 72%)`,
        }}
      />
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
}
