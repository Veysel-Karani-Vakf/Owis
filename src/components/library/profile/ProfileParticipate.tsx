import {
  AnimatePresence,
  animate,
  motion,
  useInView as useStageInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, Gift, HandCoins, Landmark, Pause, Play, Share2, Users } from 'lucide-react';
import { participateRoutes } from '@/data/participate';
import type { LibraryProfileContent } from '@/data/library/profile';
import { useI18n } from '@/i18n/useI18n';
import { Chapter, SectionHeading, containerVariants, revealVariants, smoothEase } from './profileShared';
import { SprigGlyph } from './ProfileCycleChapters';

const wayIcons = [HandCoins, Gift, Landmark, Users, Share2, Briefcase];
const wayRoutes = [
  '/donate',
  '/donate',
  participateRoutes.contact,
  participateRoutes.contact,
  participateRoutes.shareIdeas,
  participateRoutes.volunteer,
];

/* Showcase tempo: each tributary holds the stage this long; its drop takes PULSE_S to reach the basin. */
const DWELL_MS = 3400;
const PULSE_S = 1.05;
/* The basin's outer size (px); the ring sits at RING_R inside its 200-unit viewBox. */
const HUB_PX = 200;
const RING_R = 94;

type Way = LibraryProfileContent['participate']['ways'][number];
type Point = { x: number; y: number };
/** One tributary: its channel from the card's inner edge to the basin rim, and where it meets the rim. */
type Channel = { d: string; inlet: Point };

/** Position of `el` inside `root`, ignoring transforms (cards are measured while they slide in). */
function offsetWithin(el: HTMLElement, root: HTMLElement): Point {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

function polar(cx: number, cy: number, r: number, deg: number): Point {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const a = polar(cx, cy, r, from);
  const b = polar(cx, cy, r, to);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

const px = (n: number) => n.toFixed(1);

/* Inlets meet the rim within this many degrees of the horizontal, so the channels from the top and
   bottom cards come in from the sides and stay clear of the caption under the basin. */
const INLET_SPREAD = 34;

/** Where a side's ways meet the rim: degrees off the horizontal (down is positive), top card first. */
function inletTilt(slot: number, perSide: number) {
  return perSide > 1 ? -INLET_SPREAD + (2 * INLET_SPREAD * slot) / (perSide - 1) : 0;
}

/** The ring segment for way `index`: on the side its card is on (mirrored in RTL), at its inlet's angle. */
function segmentArc(index: number, count: number, mirrored: boolean) {
  const half = Math.ceil(count / 2);
  const perSide = index < half ? half : count - half;
  const slot = index < half ? index : index - half;
  const left = index < half !== mirrored;
  const tilt = inletTilt(slot, perSide);
  const centre = left ? 180 - tilt : tilt;
  const span = perSide > 1 ? Math.min(24, (2 * INLET_SPREAD) / (perSide - 1) - 8) : 24;
  return arcPath(100, 100, RING_R, centre - span / 2, centre + span / 2);
}

/** A wave crest: one sine period per 100 units, so a 200%-wide strip loops seamlessly at -50%. */
function WaveCrest({ height, fill, className }: { height: number; fill: string; className: string }) {
  const mid = height / 2;
  const d = `M0 ${mid} Q25 ${mid - 4} 50 ${mid} T100 ${mid} T150 ${mid} T200 ${mid} T250 ${mid} T300 ${mid} T350 ${mid} T400 ${mid} V${height} H0 Z`;
  return (
    <svg
      viewBox={`0 0 400 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      style={{ height, top: -height + 1 }}
    >
      <path d={d} fill={fill} />
    </svg>
  );
}

/**
 * Six ways in as tributaries: every card sends a channel to the waqf basin in the
 * middle, and the basin fills a sixth at a time as each tributary's drop arrives —
 * participation is wider than a money transfer, so one transfer is one stream of six.
 * The spotlight moves on its own while the scene is on screen, a resting mouse or
 * keyboard focus holds it (hover/focus peeks at a way), and the pause switch stops it
 * for good (reduced-motion users start stopped, with the basin already full).
 * Under lg the basin sits above the cards and the channels are not drawn.
 */
function ParticipateConfluence({ ways, labels }: { ways: Way[]; labels: LibraryProfileContent['labels'] }) {
  const { isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);
  const count = ways.length;
  const half = Math.ceil(count / 2);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const sceneRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const channelRefs = useRef<(SVGPathElement | null)[]>([]);
  const dropRef = useRef<SVGGElement>(null);

  const inView = useStageInView(sceneRef, { amount: 0.25 });
  const [seen, setSeen] = useState(false);
  const [ready, setReady] = useState(false);
  const [channels, setChannels] = useState<(Channel | null)[]>([]);

  const [active, setActive] = useState(0);
  const [filled, setFilled] = useState<ReadonlySet<number>>(() => new Set());
  const [burst, setBurst] = useState(0);
  const [held, setHeld] = useState(false);
  /* The visitor's own pause/play switch; null = not touched. */
  const [stopped, setStopped] = useState<boolean | null>(null);

  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  /* The showcase starts once the cards have slid in and the channels are drawn. */
  useEffect(() => {
    if (!seen) return;
    const id = window.setTimeout(() => setReady(true), reduced ? 0 : 1000);
    return () => window.clearTimeout(id);
  }, [seen, reduced]);

  /* ---- Geometry: channels from each card's inner edge to the basin rim, in scene pixels ---- */
  const measure = useCallback(() => {
    const root = sceneRef.current;
    const hub = hubRef.current;
    if (!root || !hub) return;
    const hubAt = offsetWithin(hub, root);
    const centre = { x: hubAt.x + hub.offsetWidth / 2, y: hubAt.y + hub.offsetHeight / 2 };
    const rim = (hub.offsetWidth / 2) * (RING_R / 100) + 3;

    const next = cardRefs.current.slice(0, count).map((card, index) => {
      if (!card) return null;
      const at = offsetWithin(card, root);
      const leftOfHub = at.x + card.offsetWidth <= centre.x - rim;
      const rightOfHub = at.x >= centre.x + rim;
      // Stacked layout: the basin sits above the cards, so no channel is drawn.
      if (!leftOfHub && !rightOfHub) return null;
      const start = { x: leftOfHub ? at.x + card.offsetWidth : at.x, y: at.y + card.offsetHeight / 2 };
      const perSide = index < half ? half : count - half;
      const rad = (inletTilt(index < half ? index : index - half, perSide) * Math.PI) / 180;
      const ux = (leftOfHub ? -1 : 1) * Math.cos(rad);
      const uy = Math.sin(rad);
      const inlet = { x: centre.x + ux * rim, y: centre.y + uy * rim };
      // Leaves the card level, arrives at the rim head-on.
      const reach = Math.abs(inlet.x - start.x);
      const c1 = { x: start.x + (inlet.x - start.x) * 0.5, y: start.y };
      const c2 = { x: inlet.x + ux * reach * 0.45, y: inlet.y + uy * reach * 0.45 };
      const d = `M ${px(start.x)} ${px(start.y)} C ${px(c1.x)} ${px(c1.y)}, ${px(c2.x)} ${px(c2.y)}, ${px(inlet.x)} ${px(inlet.y)}`;
      return { d, inlet };
    });

    setChannels((prev) => (prev.length === next.length && prev.every((c, i) => c?.d === next[i]?.d) ? prev : next));
  }, [count, half]);

  useLayoutEffect(() => {
    measure();
    const root = sceneRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(root);
    if (hubRef.current) observer.observe(hubRef.current);
    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, [measure]);

  /* ---- The showcase ---- */
  const basinStopped = stopped ?? reduced;
  const running = ready && inView && !held && !basinStopped && count > 1;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setActive((current) => (current + 1) % count), DWELL_MS);
    return () => window.clearInterval(id);
  }, [running, count]);

  const land = useCallback((index: number) => {
    setFilled((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
    setBurst((k) => k + 1);
  }, []);

  /* A drop leaves the active card and rides the tip of its channel into the basin; when it lands,
     the basin rises one tributary. Reduced motion skips the trip: the basin is simply full. */
  useEffect(() => {
    if (!ready) return;
    if (reduced) {
      setFilled(new Set(Array.from({ length: count }, (_, i) => i)));
      return;
    }
    const path = channelRefs.current[active];
    const drop = dropRef.current;
    if (!path || !drop || !channels[active]) {
      const id = window.setTimeout(() => land(active), 450);
      return () => window.clearTimeout(id);
    }
    const total = path.getTotalLength();
    drop.setAttribute('opacity', '1');
    const controls = animate(0, 1, {
      duration: PULSE_S,
      ease: smoothEase,
      onUpdate: (t) => {
        const p = path.getPointAtLength(t * total);
        drop.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
      },
      onComplete: () => {
        drop.setAttribute('opacity', '0');
        land(active);
      },
    });
    return () => {
      controls.stop();
      drop.setAttribute('opacity', '0');
    };
    // Channels re-measure on resize only; the trip in flight keeps its path.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ready, reduced, count, land]);

  /* Only a mouse resting on the scene, or keyboard focus inside it, holds the spotlight. */
  const holdProps = {
    onPointerEnter: (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse') setHeld(true);
    },
    onPointerLeave: (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse') setHeld(false);
    },
    onFocus: (event: FocusEvent<HTMLDivElement>) => {
      let keyboard = false;
      try {
        keyboard = event.target.matches(':focus-visible');
      } catch {
        keyboard = false;
      }
      if (keyboard) setHeld(true);
    },
    onBlur: (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeld(false);
    },
  };

  const peekProps = (index: number) => ({
    onPointerEnter: (event: PointerEvent<HTMLAnchorElement>) => {
      if (event.pointerType === 'mouse') setActive(index);
    },
    onFocus: () => setActive(index),
  });

  const level = count ? filled.size / count : 0;
  const full = count > 0 && filled.size === count;
  const ActiveIcon = wayIcons[active] ?? HandCoins;
  const stopNumber = String(active + 1).padStart(2, '0');

  /* Cards slide in from their outer side and settle; the basin swells up between them. */
  const cardVariants: Variants = {
    hidden: (custom: { outward: number }) => (reduced ? { opacity: 1 } : { opacity: 0, x: custom.outward, y: 12 }),
    show: (custom: { index: number }) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: reduced ? 0.01 : 0.7,
        delay: reduced ? 0 : 0.1 * (custom.index % half) + (custom.index < half ? 0 : 0.05),
        ease: smoothEase,
      },
    }),
  };

  const renderCard = (way: Way, index: number) => {
    const Icon = wayIcons[index] ?? HandCoins;
    const on = index === active;
    const outward = (index < half ? -1 : 1) * (isRtl ? -1 : 1) * 40;
    return (
      <motion.div
        key={way.title}
        ref={(el) => {
          cardRefs.current[index] = el;
        }}
        custom={{ index, outward }}
        variants={cardVariants}
        initial="hidden"
        animate={seen ? 'show' : 'hidden'}
        className="relative z-10 h-full"
      >
        <Link
          to={wayRoutes[index] ?? participateRoutes.index}
          {...peekProps(index)}
          data-active={on || undefined}
          className={`profile-card btn-border-run btn-border-run--sheen-tint group relative flex h-full flex-col overflow-hidden rounded-[22px] border bg-white p-5 transition-all duration-300 hover:-translate-y-1 md:px-6 ${
            on
              ? 'border-primary-300 shadow-[0_20px_48px_rgba(195,7,16,0.12)]'
              : 'border-primary-100/70 shadow-[0_14px_36px_rgba(40,12,18,0.05)] hover:border-primary-200 hover:shadow-[0_20px_48px_rgba(40,12,18,0.1)]'
          }`}
        >
          <span className="absolute end-4 top-4">
            <SprigGlyph />
          </span>
          <span className="flex items-center gap-3.5 pe-7">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-500 group-hover:bg-primary-600 group-hover:text-white ${
                on
                  ? 'bg-primary-600 text-white shadow-[0_8px_20px_rgba(195,7,16,0.22)]'
                  : 'bg-primary-50 text-primary-600'
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-brand text-lg font-bold leading-snug text-dark-900">{way.title}</h3>
          </span>
          <p className="mt-3 flex-1 pe-8 text-sm leading-relaxed text-dark-500">{way.text}</p>
          <span className="absolute bottom-4 end-4 inline-flex items-center text-primary-600 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            <ArrowIcon className="h-4 w-4" aria-hidden="true" />
          </span>
        </Link>
      </motion.div>
    );
  };

  const columnClass = 'contents lg:grid lg:gap-5 lg:self-stretch lg:grid-rows-[repeat(var(--rows),minmax(0,1fr))]';
  const columnStyle = { '--rows': half } as CSSProperties;

  return (
    <div
      ref={sceneRef}
      id="profile-participate-ways"
      {...holdProps}
      className={`relative grid gap-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_260px_minmax(0,1fr)] lg:items-center lg:gap-x-8 xl:gap-x-12 ${
        seen ? 'profile-inview' : ''
      }`}
    >
      {/* The channels: dotted streams that always drift toward the basin; the active one runs crimson. */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
        {channels.map((channel, index) =>
          channel ? (
            <g key={index}>
              <motion.path
                ref={(el) => {
                  channelRefs.current[index] = el;
                }}
                d={channel.d}
                fill="none"
                stroke="#ffc8ce"
                strokeWidth={1.6}
                strokeLinecap="round"
                className="profile-flow-channel"
                initial={{ opacity: 0 }}
                animate={{ opacity: seen ? 1 : 0 }}
                transition={{ duration: reduced ? 0.01 : 0.6, delay: reduced ? 0 : 0.55 + index * 0.06 }}
              />
              <motion.path
                d={channel.d}
                pathLength={1}
                fill="none"
                stroke="var(--profile-red, #da0812)"
                strokeWidth={2.4}
                strokeLinecap="round"
                initial={false}
                animate={ready && index === active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={
                  index === active
                    ? { pathLength: { duration: reduced ? 0 : PULSE_S, ease: smoothEase }, opacity: { duration: 0.15 } }
                    : { pathLength: { duration: 0.01, delay: 0.4 }, opacity: { duration: 0.4 } }
                }
              />
              <motion.circle
                cx={channel.inlet.x}
                cy={channel.inlet.y}
                strokeWidth={1.5}
                initial={false}
                animate={{
                  r: index === active ? 5.5 : 3.5,
                  fill: index === active ? '#da0812' : filled.has(index) ? '#ff9ba5' : '#ffffff',
                  stroke: index === active ? '#da0812' : '#ff9ba5',
                }}
                transition={{ duration: 0.35, ease: smoothEase }}
              />
            </g>
          ) : null
        )}
        <g ref={dropRef} opacity={0}>
          <circle r={12} fill="rgba(218, 8, 18, 0.14)" />
          <circle r={5.5} fill="var(--profile-red, #da0812)" />
        </g>
      </svg>

      <div className={columnClass} style={columnStyle}>
        {ways.slice(0, half).map((way, index) => renderCard(way, index))}
      </div>

      {/* The basin: a porcelain vessel ringed by one segment per tributary, filling as each arrives. */}
      <div className="order-first flex flex-col items-center sm:col-span-2 lg:order-none lg:col-span-1 lg:self-center">
        <div className="relative flex flex-col items-center">
          <div
            ref={hubRef}
            aria-hidden="true"
            className={`profile-basin relative z-10 ${full ? 'profile-basin--full' : ''}`}
            style={{ width: HUB_PX, height: HUB_PX }}
          >
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full overflow-visible">
              <circle cx="100" cy="100" r={RING_R} fill="none" stroke="#ffe1e4" strokeWidth="1" />
              {ways.map((way, index) => {
                const on = index === active;
                return (
                  <motion.path
                    key={way.title}
                    d={segmentArc(index, count, isRtl)}
                    pathLength={1}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: reduced ? 1 : 0 }}
                    animate={{
                      pathLength: seen ? 1 : reduced ? 1 : 0,
                      stroke: on ? '#da0812' : filled.has(index) ? '#ff9ba5' : '#ffe1e4',
                      strokeWidth: on ? 4 : 3,
                    }}
                    transition={{
                      pathLength: {
                        duration: reduced ? 0.01 : 0.7,
                        delay: reduced ? 0 : 0.3 + index * 0.08,
                        ease: smoothEase,
                      },
                      stroke: { duration: 0.4 },
                      strokeWidth: { duration: 0.3 },
                    }}
                  />
                );
              })}
            </svg>

            <motion.div
              initial={reduced ? false : { scale: 0.84, opacity: 0 }}
              animate={seen ? { scale: 1, opacity: 1 } : undefined}
              transition={{ duration: reduced ? 0.01 : 0.75, delay: reduced ? 0 : 0.2, ease: smoothEase }}
              className="absolute inset-[18px] overflow-hidden rounded-full bg-white shadow-[inset_0_2px_14px_rgba(40,12,18,0.06),0_16px_40px_rgba(40,12,18,0.08)] ring-1 ring-primary-100"
            >
              {/* The water: rises a tributary at a time, two crests drifting across it. */}
              <motion.div
                initial={false}
                animate={{ height: `${Math.round(level * 100)}%` }}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 46, damping: 14, mass: 1 }}
                className="absolute inset-x-0 bottom-0"
              >
                <WaveCrest
                  height={16}
                  fill="rgba(218, 8, 18, 0.1)"
                  className="profile-basin-wave profile-basin-wave--back absolute left-0 w-[200%]"
                />
                <WaveCrest
                  height={12}
                  fill="rgba(218, 8, 18, 0.16)"
                  className="profile-basin-wave absolute left-0 w-[200%]"
                />
                <div className="absolute inset-0 bg-[rgba(218,8,18,0.16)]" />
              </motion.div>

              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={active}
                    initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.7, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.8, y: -12 }}
                    transition={{ duration: reduced ? 0.01 : 0.3, ease: smoothEase }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary-600 shadow-[0_8px_24px_rgba(195,7,16,0.14)] ring-1 ring-primary-100"
                  >
                    <ActiveIcon className="h-7 w-7" />
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* The ripple a drop makes when it lands. */}
            {burst > 0 && !reduced && (
              <motion.span
                key={burst}
                initial={{ scale: 0.82, opacity: 0.55 }}
                animate={{ scale: 1.32, opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="pointer-events-none absolute inset-[18px] rounded-full border-2 border-primary-500"
              />
            )}
          </div>

          {/* Which tributary is flowing now, and the pause switch: hung under the basin on lg so the
            basin itself is what sits level with the columns. */}
          <div className="mt-4 flex w-[260px] flex-col items-center text-center lg:absolute lg:left-1/2 lg:top-full lg:mt-3 lg:-translate-x-1/2">
            <span className="font-brand text-xs font-bold tracking-wide text-primary-600" aria-hidden="true">
              {stopNumber} / {String(count).padStart(2, '0')}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduced ? 0.01 : 0.28, ease: smoothEase }}
                className="mt-0.5 max-w-[220px] text-balance font-brand text-sm font-bold text-dark-900"
                aria-hidden="true"
              >
                {ways[active]?.title}
              </motion.span>
            </AnimatePresence>
            {/* APG carousel pattern: announce only visitor-driven changes, stay silent while turning. */}
            <span className="sr-only" aria-live={running ? 'off' : 'polite'}>
              {stopNumber}: {ways[active]?.title}
            </span>

            <div className="mt-2.5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStopped(!basinStopped)}
                aria-label={basinStopped ? labels.playReel : labels.pauseReel}
                className="btn-border-run btn-border-run--sheen-tint flex h-9 w-9 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-600 shadow-[0_8px_20px_rgba(195,7,16,0.08)] transition-colors hover:bg-primary-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
              >
                {basinStopped ? (
                  <Play className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
              <span className="flex items-center gap-1.5" aria-hidden="true">
                {ways.map((way, index) => (
                  <span
                    key={way.title}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === active
                        ? 'w-6 bg-primary-600'
                        : filled.has(index)
                          ? 'w-1.5 bg-primary-300'
                          : 'w-1.5 bg-primary-200'
                    }`}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={columnClass} style={columnStyle}>
        {ways.slice(half).map((way, index) => renderCard(way, half + index))}
      </div>
    </div>
  );
}

/** Chapter 12 — آليات المشاركة: deliberate light relief after the vault. */
export default function ProfileParticipateChapter({ content }: { content: LibraryProfileContent }) {
  const shouldReduceMotion = useReducedMotion();
  const { participate, labels } = content;
  const reveal = revealVariants(shouldReduceMotion);

  return (
    <Chapter id="profile-participate" className="profile-stage--soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index={12}
          eyebrow={content.meta.title}
          heading={participate.heading}
          subheading={participate.subheading}
          className="mb-12"
        />

        <ParticipateConfluence ways={participate.ways} labels={labels} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-14 rounded-[26px] border border-primary-100 bg-[#faf8f8] p-8 md:p-10"
        >
          <motion.h3 variants={reveal} className="font-brand text-2xl font-bold text-dark-900">
            {participate.partners.heading}
          </motion.h3>
          <motion.p variants={reveal} className="mt-1.5 text-dark-500">
            {participate.partners.subheading}
          </motion.p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {participate.partners.items.map((item, index) => (
              <motion.div
                key={item.title}
                variants={reveal}
                className="rounded-[20px] bg-white p-5 ring-1 ring-primary-100"
              >
                <span className="font-brand text-sm font-bold text-primary-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className="mt-1.5 font-bold text-dark-900">{item.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-dark-500">{item.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.p variants={reveal} className="mt-5 text-sm font-bold text-dark-500">
            {participate.partners.note}
          </motion.p>
        </motion.div>
      </div>
    </Chapter>
  );
}
