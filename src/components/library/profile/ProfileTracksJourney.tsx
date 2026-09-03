import { AnimatePresence, motion, useInView as useStageInView, useReducedMotion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { ArrowLeft, ArrowRight, Building2, GraduationCap, Megaphone, Pause, Play, Users } from 'lucide-react';
import pioneersHero from '@/assets/programs/yemen-pioneers-hero.jpeg';
import awarenessPlatform from '@/assets/programs/awareness-owais-platform.jpg';
import type { LibraryProfileContent } from '@/data/library/profile';
import { useI18n } from '@/i18n/useI18n';
import { Chapter, SectionHeading, smoothEase } from './profileShared';

/* One glyph per track, in deck order, and the built-in photographs a track falls back to
   when the dashboard leaves its picture empty. */
const trackIcons = [GraduationCap, Users, Building2, Megaphone];
const fallbackTrackImages = [
  pioneersHero,
  '/library/profile/photos/inst-4.jpg',
  '/library/profile/photos/inst-2.jpg',
  awarenessPlatform,
];

/* Connector geometry, in SVG viewBox units. The line shares the picture grid's box, so
   the four stations sit exactly over the four picture columns (centres at 1/8, 3/8, 5/8,
   7/8 of the width); ghost stations continue the wave off-canvas on both sides so the
   line runs to the screen edges and never ends on screen. */
const VIEW_W = 1600;
const VIEW_H = 160;
const STATION_GAP = VIEW_W / 4;
const GHOST_STATIONS = 4;
/* The reel advances on its own; a visitor's choice holds it for a while, then it resumes. */
const AUTOPLAY_MS = 5200;
const HOLD_MS = 9000;
const springy = { type: 'spring' as const, stiffness: 110, damping: 20, mass: 0.9 };

type Point = { x: number; y: number };

/** Wave depth by distance from the active station: the active one dips to its picture. */
function stationY(distance: number, k: number) {
  const depths = [126, 80, 53, 40];
  const base = depths[Math.min(distance, depths.length - 1)];
  return distance === 0 ? base : base + Math.sin(k * 2.1) * 6;
}

/** Catmull-Rom through the stations, emitted as cubic Béziers (same token count every state, so it morphs). */
function smoothPath(points: Point[]) {
  if (!points.length) return '';
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function buildJourney(count: number, active: number, mirrored: boolean) {
  const first = STATION_GAP / 2;
  const points: Point[] = [];
  for (let k = -GHOST_STATIONS; k < count + GHOST_STATIONS; k += 1) {
    const x = first + k * STATION_GAP;
    points.push({ x: mirrored ? VIEW_W - x : x, y: stationY(Math.abs(k - active), k) });
  }
  const stations = points.slice(GHOST_STATIONS, GHOST_STATIONS + count);
  return { path: smoothPath(points), stations };
}

/**
 * Chapter 09 — المصارف الأربعة as a journey in two parts: the details (chapter
 * heading beside the active track's two-weight title, line and controls) above,
 * the four photographs below, and the crimson station line between them as the
 * connector — each station stands over its picture, and the active one dips
 * down to it. Pictures are the stops: click one to travel. The reel also
 * advances on its own while in view, pausing while a mouse rests on a control
 * or keyboard focus sits on one, holding briefly after the visitor picks a
 * stop, and stopping for good only via its own pause switch.
 */
export function ProfileTracksChapter({ content }: { content: LibraryProfileContent }) {
  const { isRtl, formatNumber } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const { tracks, labels, numbers } = content;
  const count = tracks.items.length;
  const trackImages = useMemo(
    () => tracks.items.map((item, index) => item.image || fallbackTrackImages[index] || pioneersHero),
    [tracks.items]
  );

  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  /* The visitor's own pause/play switch; null = not touched (reduced-motion users start paused). */
  const [stopped, setStopped] = useState<boolean | null>(null);
  const [seen, setSeen] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const holdTimer = useRef<number>();
  const inView = useStageInView(stageRef, { amount: 0.35 });

  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  useEffect(() => () => window.clearTimeout(holdTimer.current), []);

  const go = useCallback(
    (index: number, byUser = false) => {
      setActive(((index % count) + count) % count);
      if (!byUser) return;
      setHeld(true);
      window.clearTimeout(holdTimer.current);
      holdTimer.current = window.setTimeout(() => {
        setHeld(false);
        // A touch tap can leave a compat mouseenter behind; the hold's end clears it.
        setHovered(false);
      }, HOLD_MS);
    },
    [count]
  );

  const reelStopped = stopped ?? Boolean(shouldReduceMotion);
  const running = inView && !hovered && !focused && !held && !reelStopped;
  /* Geometry (line morph, station springs) snaps instantly under reduced motion. */
  const move = shouldReduceMotion ? { duration: 0 } : springy;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setActive((current) => (current + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [running, count]);

  // Narrow screens scroll the picture row: keep the active picture centred. A relative,
  // rect-based scrollBy is direction-agnostic (RTL scrollLeft conventions vary) and,
  // unlike scrollIntoView, can never drag the page while the reel advances. On wider
  // screens the row is a grid that does not scroll, so this is a no-op.
  useEffect(() => {
    const gallery = galleryRef.current;
    const card = cardRefs.current[active];
    if (!gallery || !card || gallery.scrollWidth <= gallery.clientWidth) return;
    const galleryRect = gallery.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const delta = cardRect.left + cardRect.width / 2 - (galleryRect.left + galleryRect.width / 2);
    gallery.scrollBy({ left: delta, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  }, [active, shouldReduceMotion]);

  const journey = useMemo(() => buildJourney(count, active, isRtl), [count, active, isRtl]);
  const track = tracks.items[active];
  const [firstWord, ...restWords] = track.title.split(' ');
  const restOfTitle = restWords.join(' ');
  const stopNumber = String(active + 1).padStart(2, '0');

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const forward = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = isRtl ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward) {
      event.preventDefault();
      go(active + 1, true);
    } else if (event.key === backward) {
      event.preventDefault();
      go(active - 1, true);
    }
  };

  const PrevIcon = isRtl ? ArrowRight : ArrowLeft;
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;
  const arrowClass =
    'btn-border-run btn-border-run--light flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-dark-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';
  /* Only a mouse resting on a control, or keyboard focus on one, holds the reel. A click
     also focuses the button in most browsers and a tap fires a compat mouseenter, so plain
     focus/mouse events would park the reel for good after the first pick. */
  const controlHandlers = {
    onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === 'mouse') setHovered(true);
    },
    onPointerLeave: () => setHovered(false),
    onFocus: (event: FocusEvent<HTMLButtonElement>) => {
      let keyboard = false;
      try {
        keyboard = event.currentTarget.matches(':focus-visible');
      } catch {
        keyboard = false;
      }
      setFocused(keyboard);
    },
    onBlur: () => setFocused(false),
  };

  return (
    <Chapter id="profile-tracks" scrollOffset={0} className="relative overflow-hidden bg-dark-950">
      {/* On large screens the stage is a full screen: it reserves its own band under the
          floating header (nothing but ambience sits there), hash jumps land on its very top
          (scrollOffset 0), the details follow, and the connector line and the pictures are
          pinned at the foot. */}
      <div ref={stageRef} className="relative flex flex-col lg:min-h-[100svh] lg:pt-28">
        {/* Ambience: the active photograph, blurred wide and dimmed, tints the stage. */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          {trackImages.map((image, index) => (
            <motion.img
              key={index}
              src={image}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              initial={false}
              animate={{ opacity: index === active ? 1 : 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 1.2, ease: smoothEase }}
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(5, 8, 16, 0.82) 0%, rgba(5, 8, 16, 0.66) 45%, rgba(18, 4, 6, 0.94) 100%)',
            }}
          />
          <div className="geometric-pattern absolute inset-0 opacity-10" />
        </div>

        {/* Part one — the details: chapter heading beside the active track's marquee. */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 px-4 pb-5 pt-8 md:px-8 lg:grid-cols-2 lg:items-start lg:gap-12 lg:pe-32">
          <SectionHeading
            index={9}
            eyebrow={content.meta.title}
            heading={tracks.heading}
            subheading={tracks.subheading}
            tone="light"
          />

          <div className="lg:pt-2">
            <div className="grid">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -24 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.6, ease: smoothEase }}
                  className="[grid-area:1/1]"
                >
                  <p className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide text-[#fb7185]">
                    <span className="font-brand text-base">{stopNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{labels.track}</span>
                  </p>
                  <h3 className="text-balance font-brand text-4xl leading-[1.12] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-[clamp(40px,5.2svh,52px)]">
                    {restOfTitle ? (
                      <>
                        <span className="font-normal text-white/85">{firstWord}</span>{' '}
                        <span className="font-bold">{restOfTitle}</span>
                      </>
                    ) : (
                      <span className="font-bold">{track.title}</span>
                    )}
                  </h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">{track.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* APG carousel pattern: announce only visitor-driven changes, stay silent while rotating. */}
            <span className="sr-only" aria-live={running ? 'off' : 'polite'}>
              {labels.track} {stopNumber}: {track.title}
            </span>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(active - 1, true)}
                aria-label={labels.previousTrack}
                className={arrowClass}
                {...controlHandlers}
              >
                <PrevIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1, true)}
                aria-label={labels.nextTrack}
                className={arrowClass}
                {...controlHandlers}
              >
                <NextIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setStopped(!reelStopped)}
                aria-label={reelStopped ? labels.playReel : labels.pauseReel}
                className={arrowClass}
                {...controlHandlers}
              >
                {reelStopped ? (
                  <Play className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Pause className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <span className="ms-2 font-brand text-sm font-bold text-white/60" aria-hidden="true">
                {stopNumber} / {String(count).padStart(2, '0')}
              </span>
              {/* Autoplay gauge: fills across one dwell, drains while the reel is held. */}
              <span aria-hidden="true" className="relative h-1 w-20 overflow-hidden rounded-full bg-white/20">
                <motion.span
                  key={`${active}-${running}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: running ? 1 : 0 }}
                  transition={{ duration: running ? AUTOPLAY_MS / 1000 : 0.3, ease: 'linear' }}
                  style={{ transformOrigin: isRtl ? '100% 50%' : '0% 50%' }}
                  className="absolute inset-0 rounded-full bg-[#fb7185]"
                />
              </span>
            </div>
          </div>

          {/* Edge figures, spine-wise, in the gutter the grid reserves (lg:pe-32). Two columns
              side by side keep the block shorter than the details band. */}
          <div className="pointer-events-none absolute end-0 top-1/2 z-10 hidden -translate-y-1/2 flex-row gap-4 lg:flex">
            {[numbers.programsStat, numbers.beneficiariesStat].map((stat) => (
              <div key={stat.label} className="profile-journey-stat flex items-center gap-3 text-white">
                <span className="font-brand text-2xl font-bold">
                  {formatNumber(stat.value)}
                  {stat.suffix ?? ''}
                </span>
                <span className="text-[11px] font-bold tracking-[0.18em] text-white/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The connector — the station line between the details and the pictures (tablet and
            up). Its box is the picture grid's box, so every station stands over its picture;
            the clip is the full stage width, so the line still runs edge to edge. */}
        <div aria-hidden="true" className="relative z-10 mt-auto hidden w-full md:block">
          <div className="profile-journey-viewport relative w-full">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
              <div className="relative w-full">
                <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="block h-auto w-full overflow-visible">
                  <defs>
                    <linearGradient id="profile-journey-stroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#fb7185" />
                      <stop offset="0.5" stopColor="#da0812" />
                      <stop offset="1" stopColor="#fb7185" />
                    </linearGradient>
                  </defs>
                  {/* Glow as two soft strokes rather than a blur filter, which would be
                      re-rasterised every frame while the dash below is animating. */}
                  <motion.path
                    initial={false}
                    animate={{ d: journey.path }}
                    transition={move}
                    fill="none"
                    stroke="#da0812"
                    strokeWidth="26"
                    strokeOpacity="0.1"
                    strokeLinecap="round"
                  />
                  <motion.path
                    initial={false}
                    animate={{ d: journey.path }}
                    transition={move}
                    fill="none"
                    stroke="#da0812"
                    strokeWidth="12"
                    strokeOpacity="0.22"
                    strokeLinecap="round"
                  />
                  <motion.path
                    initial={{ d: journey.path, pathLength: shouldReduceMotion ? 1 : 0 }}
                    animate={{ d: journey.path, pathLength: seen ? 1 : 0 }}
                    transition={{
                      d: move,
                      pathLength: { duration: shouldReduceMotion ? 0.01 : 1.6, ease: smoothEase },
                    }}
                    fill="none"
                    stroke="url(#profile-journey-stroke)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <motion.path
                    initial={false}
                    animate={{ d: journey.path, opacity: seen ? 1 : 0 }}
                    transition={{ d: move, opacity: { duration: 0.8, delay: 1.2 } }}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeOpacity="0.55"
                    strokeLinecap="round"
                    strokeDasharray="8 24"
                    className={inView ? 'profile-journey-dash' : undefined}
                  />
                </svg>

                {/* Stations are decorative here — the pictures below are the real stops. */}
                {journey.stations.map((station, index) => {
                  const isActive = index === active;
                  const Icon = trackIcons[index] ?? GraduationCap;
                  return (
                    <motion.div
                      key={tracks.items[index].title}
                      initial={false}
                      animate={{ top: `${(station.y / VIEW_H) * 100}%` }}
                      transition={move}
                      style={{ left: `${(station.x / VIEW_W) * 100}%` }}
                      className="pointer-events-none absolute z-10"
                    >
                      <div className="relative flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                        <span
                          className={`absolute inset-0 rounded-full bg-primary-500/40 blur-md ${
                            isActive ? (inView ? 'profile-station-halo' : '') : 'opacity-0'
                          }`}
                        />
                        <motion.span
                          initial={false}
                          animate={{ scale: isActive ? 1 : 0.22, opacity: isActive ? 1 : 0 }}
                          transition={move}
                          className="absolute inset-[5px] flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-[0_16px_40px_rgba(218,8,18,0.45)] ring-2 ring-white/70"
                        >
                          <Icon className="h-6 w-6" />
                        </motion.span>
                        <motion.span
                          initial={false}
                          animate={{ scale: isActive ? 0.4 : 1, opacity: isActive ? 0 : 1 }}
                          transition={move}
                          className="absolute h-[20px] w-[20px] rounded-full border-[3px] border-primary-500 bg-white shadow-[0_0_0_6px_rgba(218,8,18,0.2)]"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Part two — the pictures: the four tracks as a row of photo cards, each the stop
            under its station. A scrolling, snapping row on phones; a four-column grid from
            tablet up. */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 pt-1 md:px-8 md:pb-8 md:pt-2">
          <div
            ref={galleryRef}
            onKeyDown={onKeyDown}
            className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:h-[clamp(140px,22svh,200px)] md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0"
          >
            {tracks.items.map((item, index) => {
              const isActive = index === active;
              const Icon = trackIcons[index] ?? GraduationCap;
              return (
                <button
                  key={item.title}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  type="button"
                  onClick={() => go(index, true)}
                  aria-pressed={isActive}
                  className={`group relative aspect-[16/10] w-[72vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-[20px] bg-dark-900 text-start transition-[opacity,transform,box-shadow] duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:aspect-auto md:h-full md:w-auto md:max-w-none ${
                    isActive
                      ? 'opacity-100 shadow-[0_24px_60px_rgba(218,8,18,0.35)] ring-2 ring-primary-500 md:-translate-y-1'
                      : 'opacity-70 ring-1 ring-white/15 hover:opacity-100'
                  }`}
                  {...controlHandlers}
                >
                  <img
                    src={trackImages[index] ?? pioneersHero}
                    alt=""
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-dark-950/90 via-dark-950/45 to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute start-3 top-3 flex h-10 min-w-10 items-center justify-center rounded-xl border px-2.5 font-brand text-sm font-black backdrop-blur-md transition-colors duration-500 ${
                      isActive
                        ? 'border-primary-400/60 bg-primary-600 text-white'
                        : 'border-white/25 bg-white/15 text-white'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-md">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold tracking-[0.18em] text-white/65">
                        {labels.track} {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="mt-0.5 block font-brand text-base font-bold leading-tight text-white md:text-lg">
                        {item.title}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Chapter>
  );
}
