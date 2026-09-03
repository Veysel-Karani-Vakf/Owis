import { animate, motion, motionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useMemo, useState, type CSSProperties, type FocusEvent, type PointerEvent } from 'react';
import { Compass, GraduationCap, Scale, Users } from 'lucide-react';
import type { LibraryProfileContent } from '@/data/library/profile';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';

type Step = LibraryProfileContent['pioneers']['pillars'][number];

const pillarIcons = [Compass, Scale, GraduationCap, Users];

function numeral(index: number) {
  return String(index + 1).padStart(2, '0');
}

/** A sub-chapter title with an editorial rule running out from it. */
function BlockHeading({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-5">
      <h3 className="shrink-0 font-brand text-2xl font-bold text-dark-900 md:text-[28px]">{children}</h3>
      <span aria-hidden="true" className="h-px min-w-6 flex-1 bg-primary-100" />
    </div>
  );
}

/**
 * The four cornerstones as one strip of columns: outlined numerals fill, a crimson base
 * bar draws under each column, hairlines seam them; resting a mouse on a column floods it
 * crimson from the base up — the pillar rises.
 */
export function PioneerPillarsStrip({
  heading,
  pillars,
  className = '',
}: {
  heading: string;
  pillars: Step[];
  className?: string;
}) {
  const strip = useInView({ threshold: 0.3 });

  return (
    <div
      id="profile-pioneer-pillars"
      ref={strip.ref}
      className={`scroll-mt-28 ${strip.inView ? 'profile-inview' : ''} ${className}`}
    >
      <BlockHeading>{heading}</BlockHeading>
      <div className="profile-pillar-grid mt-7 grid gap-px overflow-hidden rounded-[28px] ring-1 ring-primary-100 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, index) => {
          const Icon = pillarIcons[index] ?? Compass;
          return (
            <div
              key={pillar.title}
              style={{ '--profile-delay': `${index * 180}ms` } as CSSProperties}
              className="profile-pillar relative isolate flex min-h-[230px] flex-col p-6 md:p-7 lg:min-h-[320px]"
            >
              <span aria-hidden="true" className="profile-pillar-flood" />
              <div className="flex items-start justify-between gap-3">
                <span
                  aria-hidden="true"
                  className="profile-pillar-numeral font-brand text-[72px] font-bold leading-none lg:text-[84px]"
                >
                  {numeral(index)}
                </span>
                <span className="profile-pillar-icon mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-primary-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <div className="profile-ignite mt-auto pt-8">
                <h4 className="profile-pillar-title font-brand text-xl font-bold text-dark-900">
                  <span className="sr-only">{numeral(index)} </span>
                  {pillar.title}
                </h4>
                <p className="profile-pillar-text mt-2 text-sm leading-relaxed text-dark-500">{pillar.text}</p>
              </div>
              <span aria-hidden="true" className="profile-pillar-base" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Radar geometry: a 360-unit scene, pentagon rim at 128, number chips just outside it. */
const PATH_COUNT = 5;
const SIZE = 360;
const CENTER = SIZE / 2;
const RADIUS = 128;
const CHIP_RADIUS = RADIUS + 32;
const SEAL_RADIUS = RADIUS + 12;
/* Build tempo: first vertex after 300ms, one every 560ms; the rotation afterwards. */
const BUILD_START_MS = 300;
const BUILD_STEP_MS = 560;
const ROTATE_MS = 3200;
const rise = { type: 'spring' as const, stiffness: 110, damping: 15, mass: 0.8 };

/** Vertex i on a ring of the given radius; RTL mirrors the sweep so path 02 follows the reading direction. */
function vertex(index: number, radius: number, mirror: boolean) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / PATH_COUNT;
  return {
    x: CENTER + Math.cos(angle) * radius * (mirror ? -1 : 1),
    y: CENTER + Math.sin(angle) * radius,
  };
}

function ring(radius: number, mirror: boolean) {
  return Array.from({ length: PATH_COUNT }, (_, i) => {
    const p = vertex(i, radius, mirror);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  });
}

function VertexDot({
  radius,
  index,
  mirror,
  active,
}: {
  radius: MotionValue<number>;
  index: number;
  mirror: boolean;
  active: boolean;
}) {
  const cx = useTransform(radius, (v) => vertex(index, RADIUS * v, mirror).x);
  const cy = useTransform(radius, (v) => vertex(index, RADIUS * v, mirror).y);
  return (
    <>
      <motion.circle
        cx={cx}
        cy={cy}
        r={14}
        className={`profile-radar-halo ${active ? 'profile-radar-halo--on' : ''}`}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={active ? 7 : 5}
        className={`profile-radar-dot ${active ? 'profile-radar-dot--on' : ''}`}
      />
    </>
  );
}

type RadarSceneProps = {
  inView: boolean;
  reduced: boolean;
  mirror: boolean;
  active: number;
  built: number;
  onStep: (index: number) => void;
};

/** Owns the five vertex radii: each springs from the centre to the rim in turn once the scene is on screen. */
function RadarScene({ inView, reduced, mirror, active, built, onStep }: RadarSceneProps) {
  const radii = useMemo(() => Array.from({ length: PATH_COUNT }, () => motionValue(0)), []);
  const points = useTransform(radii, (values: number[]) =>
    values
      .map((v, i) => {
        const p = vertex(i, RADIUS * v, mirror);
        return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
      })
      .join(' ')
  );
  const complete = built >= PATH_COUNT;

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      radii.forEach((r) => r.set(1));
      radii.forEach((_, i) => onStep(i));
      return;
    }
    const timers = radii.map((r, i) =>
      window.setTimeout(
        () => {
          animate(r, 1, rise);
          onStep(i);
        },
        BUILD_START_MS + i * BUILD_STEP_MS
      )
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [inView, reduced, radii, onStep]);

  const rim = ring(RADIUS, mirror);
  const sealPath = `M ${ring(SEAL_RADIUS, mirror).join(' L ')} Z`;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-full w-full overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      {[1, 0.66, 0.33].map((scale) => (
        <polygon key={scale} points={ring(RADIUS * scale, mirror).join(' ')} className="profile-radar-guide" />
      ))}
      {rim.map((point, i) => (
        <line
          key={point}
          x1={CENTER}
          y1={CENTER}
          x2={point.split(',')[0]}
          y2={point.split(',')[1]}
          className={`profile-radar-axis ${active === i ? 'profile-radar-axis--on' : ''}`}
        />
      ))}
      <path d={sealPath} pathLength={1} className={`profile-radar-seal ${complete ? 'profile-radar-seal--on' : ''}`} />
      <motion.polygon points={points} className="profile-radar-shape" />
      {radii.map((r, i) => (
        <VertexDot key={i} radius={r} index={i} mirror={mirror} active={active === i} />
      ))}
      <circle cx={CENTER} cy={CENTER} r={3.5} className="fill-primary-600" />
    </svg>
  );
}

/**
 * The five parallel paths as a pentagon radar that builds itself: each vertex springs out
 * to the rim while its row rules itself in the list beside it, a gold seal closes round the
 * finished figure, then the highlight rotates through the paths until the visitor picks one.
 */
export function PioneerPathsRadar({
  heading,
  paths,
  className = '',
}: {
  heading: string;
  paths: Step[];
  className?: string;
}) {
  const { isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const block = useInView({ threshold: 0.3 });
  const [active, setActive] = useState(0);
  const [built, setBuilt] = useState(0);
  const [picked, setPicked] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = Boolean(shouldReduceMotion);
  const complete = built >= PATH_COUNT;

  const onStep = useMemo(
    () => (index: number) => {
      setBuilt((count) => Math.max(count, index + 1));
      setActive(index);
    },
    []
  );

  useEffect(() => {
    if (!block.inView || !complete || reduced || picked || held) return;
    const id = window.setInterval(() => setActive((current) => (current + 1) % PATH_COUNT), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [block.inView, complete, reduced, picked, held]);

  const hold = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') setHeld(true);
  };
  const release = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') setHeld(false);
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeld(false);
  };

  return (
    <div
      id="profile-pioneer-paths"
      ref={block.ref}
      className={`scroll-mt-28 ${block.inView ? 'profile-inview' : ''} ${className}`}
    >
      <BlockHeading>{heading}</BlockHeading>
      <div className="mt-7 grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[380px]">
          <RadarScene
            key={isRtl ? 'rtl' : 'ltr'}
            inView={block.inView}
            reduced={reduced}
            mirror={isRtl}
            active={active}
            built={built}
            onStep={onStep}
          />
          {paths.map((path, index) => {
            const p = vertex(index, CHIP_RADIUS, isRtl);
            const isBuilt = index < built;
            return (
              <span
                key={path.title}
                aria-hidden="true"
                style={{ left: `${(p.x / SIZE) * 100}%`, top: `${(p.y / SIZE) * 100}%` }}
                className={`profile-radar-chip absolute flex h-9 w-9 items-center justify-center rounded-full font-brand text-xs font-bold ${
                  isBuilt ? 'profile-radar-chip--built' : ''
                } ${
                  active === index
                    ? 'bg-primary-600 text-white shadow-[0_8px_20px_rgba(218,8,18,0.35)]'
                    : 'bg-white text-primary-700 ring-1 ring-primary-200'
                }`}
              >
                {numeral(index)}
              </span>
            );
          })}
        </div>

        <ol
          onPointerEnter={hold}
          onPointerLeave={release}
          onFocus={() => setHeld(true)}
          onBlur={onBlur}
          className="divide-y divide-primary-100/80 border-y border-primary-100/80"
        >
          {paths.map((path, index) => {
            const isActive = active === index;
            return (
              <li key={path.title}>
                <button
                  type="button"
                  aria-current={isActive ? 'true' : undefined}
                  data-built={index < built ? 'true' : 'false'}
                  onClick={() => {
                    setActive(index);
                    setPicked(true);
                  }}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') setActive(index);
                  }}
                  onFocus={() => setActive(index)}
                  className="profile-radar-row grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 py-4 ps-4 pe-2 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 md:py-5"
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full font-brand text-sm font-bold transition-colors duration-300 ${
                      isActive ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700'
                    }`}
                  >
                    {numeral(index)}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block font-brand text-lg font-bold transition-colors duration-300 ${isActive ? 'text-primary-700' : 'text-dark-900'}`}
                    >
                      {path.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-dark-500">{path.text}</span>
                  </span>
                  <span aria-hidden="true" className="profile-radar-row-bar" />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
