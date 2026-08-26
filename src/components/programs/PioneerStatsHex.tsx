import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { BookOpen, Globe2, GraduationCap, Users, type LucideIcon } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { resolveIcon } from '@/lib/icons';

type Indicator = { label: string; value: number | null; icon?: string };

// Same defaults as the home-page cards, so both views of the indicators agree when
// the editor has not picked an icon.
const indicatorIcons: LucideIcon[] = [GraduationCap, BookOpen, Users, Globe2];

type PioneerStatsHexProps = {
  eyebrow: string;
  title: string;
  description: string;
  centerTitle: string;
  centerLabel: string;
  indicators: Indicator[];
  unavailableLabel: string;
  formatNumber: (value: number) => string;
  isRtl: boolean;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
const HEX_GRADIENT = 'linear-gradient(160deg, #ff7184 0%, #da0812 48%, #7d070c 100%)';

// Diagram geometry (desktop): a 1000x600 canvas. The centre hexagon sits at (500,300) and the
// stat badges sit on an orbit ring around it. The ring itself is the connector: it is
// drawn clockwise as one arc segment per badge, each one arriving at the next badge.
const CANVAS = { width: 1000, height: 600 } as const;
const CENTER = { x: 500, y: 300 } as const;
const RING_RADIUS = 230;
const RING_ANGLE = 38; // degrees above/below the horizontal axis (the classic 4-badge layout)
const NODE_HEX_RADIUS = 45;

type Side = 'left' | 'right';
type Anchor = { key: string; angle: number; side: Side; x: number; y: number };

// SVG angles run clockwise from the +x axis (y grows downwards). Angles are normalised to
// [0, 360) so clockwise ordering is a plain numeric sort.
function makeAnchor(key: string, rawAngle: number): Anchor {
  const angle = ((rawAngle % 360) + 360) % 360;
  const rad = (angle * Math.PI) / 180;
  const x = CENTER.x + RING_RADIUS * Math.cos(rad);
  return {
    key,
    angle,
    side: x >= CENTER.x ? 'right' : 'left',
    x,
    y: CENTER.y + RING_RADIUS * Math.sin(rad),
  };
}

// Ring anchors for any number of badges. Exactly four keeps the original two-per-side look;
// any other count is spread evenly around the ring, mirrored about the vertical axis so the
// diagram stays balanced whatever the editor adds or removes.
function makeAnchors(count: number): Anchor[] {
  if (count === 4) {
    return [
      makeAnchor('topRight', -RING_ANGLE),
      makeAnchor('bottomRight', RING_ANGLE),
      makeAnchor('bottomLeft', 180 - RING_ANGLE),
      makeAnchor('topLeft', 180 + RING_ANGLE),
    ];
  }
  return Array.from({ length: count }, (_, index) =>
    makeAnchor(`ring-${index}`, -90 + 180 / count + (360 * index) / count),
  );
}

// Reading order follows the page direction: top rows first, then RTL reads right-to-left and
// LTR left-to-right within a row.
function readingOrder(anchors: Anchor[], isRtl: boolean): Anchor[] {
  return [...anchors].sort((a, b) => {
    // Anchors on the same row (within a pixel) are ordered by the writing direction.
    if (Math.abs(a.y - b.y) > 1) return a.y - b.y;
    return isRtl ? b.x - a.x : a.x - b.x;
  });
}

// The ring is drawn clockwise starting from the first badge in reading order.
function ringOrder(anchors: Anchor[], start: Anchor | undefined): Anchor[] {
  const clockwise = [...anchors].sort((a, b) => a.angle - b.angle);
  const from = start ? clockwise.indexOf(start) : 0;
  return clockwise.map((_, index) => clockwise[(from + index) % clockwise.length]);
}

function arcPath(from: Anchor, to: Anchor) {
  const sweep = (((to.angle - from.angle) % 360) + 360) % 360;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${from.x} ${from.y} A ${RING_RADIUS} ${RING_RADIUS} 0 ${largeArc} 1 ${to.x} ${to.y}`;
}

const FULL_RING_PATH = [
  `M ${CENTER.x} ${CENTER.y - RING_RADIUS}`,
  `A ${RING_RADIUS} ${RING_RADIUS} 0 1 1 ${CENTER.x} ${CENTER.y + RING_RADIUS}`,
  `A ${RING_RADIUS} ${RING_RADIUS} 0 1 1 ${CENTER.x} ${CENTER.y - RING_RADIUS}`,
].join(' ');

const RING_BASE_DELAY = 0.45;
const RING_STEP = 0.32;

function Hexagon({
  className,
  innerClassName,
  children,
}: {
  className: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={`relative ${className}`} style={{ filter: 'drop-shadow(0 14px 22px rgba(218, 8, 18, 0.2))' }}>
      <div className="absolute inset-0" style={{ clipPath: HEX_CLIP, background: HEX_GRADIENT }} />
      <div
        className={`absolute inset-[3px] flex flex-col items-center justify-center bg-white ${innerClassName ?? ''}`}
        style={{ clipPath: HEX_CLIP }}
      >
        {children}
      </div>
    </div>
  );
}

function StatValue({
  value,
  active,
  reduced,
  unavailableLabel,
  formatNumber,
}: {
  value: number | null;
  active: boolean;
  reduced: boolean;
  unavailableLabel: string;
  formatNumber: (value: number) => string;
}) {
  const hasValue = value !== null;
  const animated = useCountUp(value ?? 0, reduced ? 1 : 1900, active && hasValue);

  if (!hasValue) {
    return <span className="px-2 text-center text-[11px] font-bold leading-tight text-dark-500">{unavailableLabel}</span>;
  }

  return (
    <span dir="ltr" className="text-xl font-black tabular-nums leading-none text-primary-700 md:text-[1.45rem]">
      {formatNumber(animated)}
    </span>
  );
}

function StatNode({
  indicator,
  index,
  hexOnLeft,
  isRtl,
  active,
  reduced,
  unavailableLabel,
  formatNumber,
  delay,
}: {
  indicator: Indicator;
  index: number;
  hexOnLeft: boolean;
  isRtl: boolean;
  active: boolean;
  reduced: boolean;
  unavailableLabel: string;
  formatNumber: (value: number) => string;
  delay: number;
}) {
  // Flex rows follow the writing direction, so the physical side of the hexagon is derived
  // from both the requested side and the page direction.
  const rowClass = hexOnLeft !== isRtl ? 'flex-row' : 'flex-row-reverse';
  const pillClass = hexOnLeft ? '-ml-9 pl-12 pr-6' : '-mr-9 pr-12 pl-6';
  const Icon = resolveIcon(indicator.icon, indicatorIcons, index);

  return (
    <motion.div
      initial={reduced ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.7, y: 12 }}
      animate={active ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={reduced ? { duration: 0.01 } : { type: 'spring', stiffness: 240, damping: 20, mass: 0.9, delay }}
      whileHover={reduced ? undefined : { y: -4 }}
      className={`group flex items-center ${rowClass}`}
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.45 }}
        className="relative z-10"
      >
        <Hexagon
          className="h-[104px] w-[90px] transition-transform duration-300 group-hover:scale-105"
          innerClassName="px-1"
        >
          <StatValue
            value={indicator.value}
            active={active}
            reduced={reduced}
            unavailableLabel={unavailableLabel}
            formatNumber={formatNumber}
          />
        </Hexagon>
      </motion.div>
      <div
        className={`flex min-h-[58px] min-w-[170px] max-w-[230px] items-center justify-center rounded-full border border-primary-100 bg-white py-3 text-center shadow-[0_16px_38px_rgba(40,12,18,0.09)] transition-[box-shadow,border-color] duration-300 group-hover:border-primary-200 group-hover:shadow-[0_22px_48px_rgba(156,16,6,0.16)] ${pillClass}`}
      >
        <span className="inline-flex items-center gap-2 text-sm font-bold leading-snug text-dark-800 md:text-[15px]">
          <Icon className="h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
          {indicator.label}
        </span>
      </div>
    </motion.div>
  );
}

function CenterHexagon({
  title,
  label,
  active,
  reduced,
  compact,
}: {
  title: string;
  label: string;
  active: boolean;
  reduced: boolean;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.55, rotate: -14 }}
      animate={active ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
      transition={reduced ? { duration: 0.01 } : { type: 'spring', stiffness: 170, damping: 18, mass: 1 }}
      className="relative flex items-center justify-center"
    >
      <motion.span
        aria-hidden="true"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
        className={`absolute rounded-full border border-dashed border-primary-200/90 ${
          compact ? 'h-[196px] w-[196px]' : 'h-[272px] w-[272px]'
        }`}
      />
      <motion.span
        aria-hidden="true"
        animate={reduced ? undefined : { scale: [1, 1.12, 1], opacity: [0.35, 0.12, 0.35] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute rounded-full bg-primary-500/15 blur-2xl ${compact ? 'h-40 w-40' : 'h-56 w-56'}`}
      />
      <Hexagon className={compact ? 'h-[182px] w-[158px]' : 'h-[242px] w-[210px]'} innerClassName="gap-2 px-5">
        <span
          className={`bg-clip-text text-center font-brand font-black leading-tight text-transparent ${
            compact || title.length > 12 ? 'text-2xl' : 'text-[2rem]'
          }`}
          style={{ backgroundImage: HEX_GRADIENT }}
        >
          {title}
        </span>
        <span className="flex items-center gap-2 text-xs font-bold tracking-wide text-dark-500">
          <span aria-hidden="true" className="h-px w-4 bg-primary-300" />
          {label}
          <span aria-hidden="true" className="h-px w-4 bg-primary-300" />
        </span>
      </Hexagon>
    </motion.div>
  );
}

export default function PioneerStatsHex({
  eyebrow,
  title,
  description,
  centerTitle,
  centerLabel,
  indicators,
  unavailableLabel,
  formatNumber,
  isRtl,
}: PioneerStatsHexProps) {
  const reduced = !!useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const nodes = indicators ?? [];
  // One anchor per indicator, however many the editor has entered.
  const reading = readingOrder(makeAnchors(nodes.length), isRtl);
  const activeRing = ringOrder(reading, reading[0]);

  const headingVariants: Variants = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0.01 : 0.6, ease: smoothEase } },
  };

  return (
    <div>
      <motion.div
        variants={headingVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto mb-10 max-w-3xl text-center"
      >
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-primary-200" />
          <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
          <span className="h-px w-8 bg-primary-200" />
        </div>
        <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{title}</h2>
        <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{description}</p>
      </motion.div>

      <div ref={ref}>
        {/* Desktop: the orbit diagram */}
        <div
          className="relative mx-auto hidden w-full max-w-[1000px] md:block"
          style={{ aspectRatio: `${CANVAS.width} / ${CANVAS.height}` }}
        >
          <svg
            viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {/* Faint full orbit underneath */}
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={RING_RADIUS}
              fill="none"
              stroke="#ffe1e4"
              strokeWidth="3"
              strokeDasharray="2 10"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* The ring drawn clockwise, one arc per badge (a lone badge has nowhere to go) */}
            {activeRing.length > 1 && activeRing.map((from, index) => {
              const to = activeRing[(index + 1) % activeRing.length];
              return (
                <motion.path
                  key={`${from.key}-${to.key}`}
                  d={arcPath(from, to)}
                  fill="none"
                  stroke="#da0812"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={reduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.5 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
                  transition={
                    reduced
                      ? { duration: 0.01 }
                      : { duration: RING_STEP * 0.95, delay: RING_BASE_DELAY + index * RING_STEP + 0.08, ease: 'easeInOut' }
                  }
                />
              );
            })}

            {/* A satellite that keeps travelling the orbit once it is drawn */}
            {!reduced && inView && (
              <g>
                <circle r="11" fill="#da0812" opacity="0.18">
                  <animateMotion dur="18s" repeatCount="indefinite" begin="2s" path={FULL_RING_PATH} />
                </circle>
                <circle r="5" fill="#da0812">
                  <animateMotion dur="18s" repeatCount="indefinite" begin="2s" path={FULL_RING_PATH} />
                </circle>
              </g>
            )}
          </svg>

          <div
            className="absolute"
            style={{
              left: `${(CENTER.x / CANVAS.width) * 100}%`,
              top: `${(CENTER.y / CANVAS.height) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CenterHexagon title={centerTitle} label={centerLabel} active={inView} reduced={reduced} />
          </div>

          {nodes.map((indicator, index) => {
            const anchor = reading[index];
            if (!anchor) return null;
            // The hexagon of a right-hand badge faces the centre, i.e. it sits on the badge's left.
            const hexOnLeft = anchor.side === 'right';
            const anchorStyle =
              anchor.side === 'right'
                ? { left: `${((anchor.x - NODE_HEX_RADIUS) / CANVAS.width) * 100}%` }
                : { right: `${((CANVAS.width - anchor.x - NODE_HEX_RADIUS) / CANVAS.width) * 100}%` };
            // Each badge pops in as the ring reaches it.
            const ringIndex = activeRing.indexOf(anchor);

            return (
              <div
                key={`${index}-${anchor.key}`}
                className="absolute"
                style={{ ...anchorStyle, top: `${(anchor.y / CANVAS.height) * 100}%`, transform: 'translateY(-50%)' }}
              >
                <StatNode
                  indicator={indicator}
                  index={index}
                  hexOnLeft={hexOnLeft}
                  isRtl={isRtl}
                  active={inView}
                  reduced={reduced}
                  unavailableLabel={unavailableLabel}
                  formatNumber={formatNumber}
                  delay={RING_BASE_DELAY + ringIndex * RING_STEP}
                />
              </div>
            );
          })}
        </div>

        {/* Mobile: the same badges hanging off one vertical trunk */}
        <div className="md:hidden">
          <div className="flex justify-center pb-6">
            <CenterHexagon title={centerTitle} label={centerLabel} active={inView} reduced={reduced} compact />
          </div>
          <ol className="relative mx-auto max-w-[20rem] space-y-6 border-s-2 border-primary-200 ps-8">
            {nodes.map((indicator, index) => (
              <li key={`${index}-mobile`} className="relative">
                {/* A short curve that peels off the trunk and lands on the hexagon's centre line. */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 32 44"
                  className="absolute -start-8 top-1/2 h-11 w-8 overflow-visible"
                  style={{ transform: isRtl ? 'translateY(-100%) scaleX(-1)' : 'translateY(-100%)' } as CSSProperties}
                >
                  <path d="M 1 0 C 1 30, 9 43, 32 43" fill="none" stroke="#ffe1e4" strokeWidth="3" />
                  <motion.path
                    d="M 1 0 C 1 30, 9 43, 32 43"
                    fill="none"
                    stroke="#da0812"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : undefined}
                    transition={
                      reduced ? { duration: 0.01 } : { duration: 0.5, delay: 0.3 + index * 0.14, ease: smoothEase }
                    }
                  />
                </svg>
                <StatNode
                  indicator={indicator}
                  index={index}
                  hexOnLeft={!isRtl}
                  isRtl={isRtl}
                  active={inView}
                  reduced={reduced}
                  unavailableLabel={unavailableLabel}
                  formatNumber={formatNumber}
                  delay={0.55 + index * 0.16}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>

    </div>
  );
}
