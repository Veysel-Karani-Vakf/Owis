import { motion, useInView as useStageInView, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type FocusEvent, type PointerEvent } from 'react';
import { Building2, GraduationCap, Landmark, Pause, Play, TrendingUp } from 'lucide-react';
import type { LibraryProfileContent } from '@/data/library/profile';
import { useI18n } from '@/i18n/useI18n';
import { Chapter, SectionHeading, smoothEase } from './profileShared';

const pillarIcons = [Landmark, TrendingUp, GraduationCap, Building2];

/* The deck turns on its own every four seconds; a visitor's pick holds it a while, then it resumes. */
const AUTOPLAY_MS = 4000;
const HOLD_MS = 9000;
/* How much of each queued card shows above the one in front: the card's top padding (24px)
   plus its title row (40px). Keep in step with the pt-6 / h-10 classes on the card. */
const PEEK_PX = 64;
/* The front card drops away and fades in this long; the instant after, it sits at the back. */
const LEAVE_MS = 420;
const settle = { type: 'spring' as const, stiffness: 170, damping: 24, mass: 0.9 };

/** Where a card rests by its place in the queue: 0 is the front, higher is further back and up.
    Cards stay opaque so nothing bleeds through the stack; a white veil inside each one dims it. */
function restingPose(slot: number) {
  return { y: -slot * PEEK_PX, scale: 1 - slot * 0.045, opacity: 1 };
}

function veilOpacity(slot: number) {
  return Math.min(0.72, slot * 0.22);
}

/**
 * Chapter 02 — من الفكرة إلى الأثر as a deck of cards: the front card is read in
 * full, the other pillars wait behind it showing only their title rows, and every
 * four seconds the front card drops away while the next one settles forward.
 * A visitor can pull any waiting card to the front; the deck pauses while a mouse
 * rests on it or keyboard focus sits inside, holds briefly after a pick, and stops
 * for good only via its own pause switch (reduced-motion users start stopped).
 */
export function ProfilePillarsChapter({ content }: { content: LibraryProfileContent }) {
  const { isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const { pillars, labels } = content;
  const count = pillars.items.length;

  const [active, setActive] = useState(0);
  /* The card that just left the front: it fades out on top before joining the back of the deck. */
  const [leaving, setLeaving] = useState(-1);
  const [held, setHeld] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  /* The visitor's own pause/play switch; null = not touched. */
  const [stopped, setStopped] = useState<boolean | null>(null);

  const deckRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const holdTimer = useRef<number>();
  const leaveTimer = useRef<number>();
  const inView = useStageInView(deckRef, { amount: 0.5 });

  useEffect(
    () => () => {
      window.clearTimeout(holdTimer.current);
      window.clearTimeout(leaveTimer.current);
    },
    []
  );

  const go = useCallback(
    (index: number, byUser = false) => {
      const next = ((index % count) + count) % count;
      const current = activeRef.current;
      if (next === current) return;
      activeRef.current = next;
      setActive(next);
      setLeaving(current);
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => setLeaving(-1), LEAVE_MS);
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

  const deckStopped = stopped ?? Boolean(shouldReduceMotion);
  const running = inView && !hovered && !focused && !held && !deckStopped;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => go(activeRef.current + 1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [running, go]);

  /* Cards settle into their new places on a spring; the one fading back in does so on a tween. */
  const move = shouldReduceMotion ? { duration: 0 } : { ...settle, opacity: { duration: 0.55, ease: smoothEase } };
  const front = pillars.items[active];
  const stopNumber = String(active + 1).padStart(2, '0');

  /* Only a mouse resting on the deck, or keyboard focus inside it, holds the turn. A tap
     fires a compat mouseenter and a click focuses the button, so plain events would park
     the deck for good after the first pick. */
  const deckHandlers = {
    onPointerEnter: (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse') setHovered(true);
    },
    onPointerLeave: () => setHovered(false),
    onFocus: (event: FocusEvent<HTMLDivElement>) => {
      let keyboard = false;
      try {
        keyboard = event.target.matches(':focus-visible');
      } catch {
        keyboard = false;
      }
      setFocused(keyboard);
    },
    onBlur: () => setFocused(false),
  };

  return (
    <Chapter id="profile-pillars" className="profile-stage--soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[132px]">
            <SectionHeading index={2} eyebrow={content.meta.title} heading={pillars.heading} subheading={pillars.subheading} />
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.6, delay: 0.25, ease: smoothEase }}
              className="mt-6 hidden max-w-md border-s-2 border-primary-200 ps-4 text-sm leading-relaxed text-dark-500 lg:block"
            >
              {pillars.outro}
            </motion.p>
          </div>
        </div>

        <div className="relative mt-12 lg:col-span-7 lg:mt-0">
          <motion.div
            ref={deckRef}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3, margin: '0px 0px -10% 0px' }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, ease: smoothEase }}
            {...deckHandlers}
          >
            {/* The deck: every card shares one grid cell (so one height); the waiting ones are
                lifted, eased back and dimmed behind the front card, showing their title rows. */}
            <div className="relative grid" style={{ paddingTop: (count - 1) * PEEK_PX }}>
              {pillars.items.map((item, index) => {
                const slot = (index - active + count) % count;
                const isFront = slot === 0;
                const isLeaving = index === leaving;
                const pose = restingPose(slot);
                const Icon = pillarIcons[index] ?? Landmark;
                return (
                  <motion.article
                    key={item.title}
                    aria-current={isFront ? 'true' : undefined}
                    initial={false}
                    animate={
                      isLeaving
                        ? { opacity: [null, 0, 0], y: [null, 30, pose.y], scale: [null, 0.975, pose.scale] }
                        : pose
                    }
                    transition={
                      isLeaving
                        ? { duration: shouldReduceMotion ? 0 : LEAVE_MS / 1000, times: [0, 0.94, 1], ease: 'easeIn' }
                        : move
                    }
                    style={{ zIndex: isLeaving ? count + 1 : count - slot, transformOrigin: '50% 0%', gridArea: '1 / 1' }}
                    className="profile-card relative rounded-[24px] border border-primary-100/70 bg-[#faf8f8] px-6 pb-7 pt-6 shadow-[0_14px_36px_rgba(40,12,18,0.06)] md:px-8 md:pb-8"
                  >
                    <motion.span
                      aria-hidden="true"
                      animate={{ opacity: isFront ? 0.7 : 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
                      className="profile-ghost pointer-events-none absolute -top-3 end-4 font-brand text-7xl font-bold leading-none"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </motion.span>
                    {/* Title row — exactly the strip a waiting card shows. */}
                    <div className="relative z-10 flex h-10 items-center gap-4">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-[0_8px_20px_rgba(195,7,16,0.12)] ring-1 ring-primary-100 transition-colors duration-500 ${
                          isFront ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="truncate font-brand text-xl font-bold text-dark-900 md:text-2xl">{item.title}</h3>
                    </div>
                    <p className="relative z-10 mt-5 max-w-xl text-base leading-relaxed text-dark-500 md:text-lg">{item.text}</p>
                    {/* The veil: the further back a card waits, the more it fades into the paper. */}
                    <motion.span
                      aria-hidden="true"
                      animate={{ opacity: veilOpacity(slot) }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: smoothEase }}
                      className="pointer-events-none absolute inset-0 z-[15] rounded-[24px] bg-white"
                    />
                    {!isFront && (
                      <button
                        type="button"
                        onClick={() => go(index, true)}
                        aria-label={item.title}
                        className="absolute inset-0 z-20 rounded-[24px] transition-colors hover:bg-primary-600/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                      />
                    )}
                  </motion.article>
                );
              })}
            </div>

            {/* APG carousel pattern: announce only visitor-driven changes, stay silent while turning. */}
            <span className="sr-only" aria-live={running ? 'off' : 'polite'}>
              {stopNumber}: {front.title}
            </span>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStopped(!deckStopped)}
                aria-label={deckStopped ? labels.playReel : labels.pauseReel}
                className="btn-border-run btn-border-run--sheen-tint flex h-11 w-11 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-600 shadow-[0_8px_20px_rgba(195,7,16,0.08)] transition-colors hover:bg-primary-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
              >
                {deckStopped ? (
                  <Play className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Pause className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <span className="font-brand text-sm font-bold text-dark-500" aria-hidden="true">
                {stopNumber} / {String(count).padStart(2, '0')}
              </span>
              {/* Dwell gauge: fills across one turn, drains while the deck is held. */}
              <span aria-hidden="true" className="relative h-1 w-24 overflow-hidden rounded-full bg-primary-100">
                <motion.span
                  key={`${active}-${running}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: running ? 1 : 0 }}
                  transition={{ duration: running ? AUTOPLAY_MS / 1000 : 0.3, ease: 'linear' }}
                  style={{ transformOrigin: isRtl ? '100% 50%' : '0% 50%' }}
                  className="absolute inset-0 rounded-full bg-primary-600"
                />
              </span>
              <span className="ms-auto flex items-center gap-1.5" aria-hidden="true">
                {pillars.items.map((item, index) => (
                  <span
                    key={item.title}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === active ? 'w-6 bg-primary-600' : 'w-1.5 bg-primary-200'
                    }`}
                  />
                ))}
              </span>
            </div>
          </motion.div>
          <p className="mt-6 text-sm leading-relaxed text-dark-500 lg:hidden">{pillars.outro}</p>
        </div>
      </div>
    </Chapter>
  );
}
