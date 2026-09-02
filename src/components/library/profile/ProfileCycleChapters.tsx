import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coins,
  Gem,
  Gift,
  HandCoins,
  HeartHandshake,
  Landmark,
  Recycle,
  Sprout,
  TreeDeciduous,
  TrendingUp,
  X,
} from 'lucide-react';
import type { LibraryProfileContent } from '@/data/library/profile';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';
import { BlessedTreeScene } from './BlessedTreeScene';
import { Chapter, SectionHeading, containerVariants, revealVariants, smoothEase } from './profileShared';

const cycleIcons = [HandCoins, TrendingUp, Recycle];
const formIcons = [Coins, TreeDeciduous, Landmark, Gem, Gift, HeartHandshake];

/* The asset itself: the waqf's revenue apartments in Istanbul. */
const apartmentPhotos = [
  '/library/profile/photos/apartments-1.jpg',
  '/library/profile/photos/apartments-3.jpg',
  '/library/profile/photos/apartments-4.jpg',
  '/library/profile/photos/apartments-2.jpg',
];

/** Node positions on the 400×400 cycle diagram (percentages of the box). */
const cycleNodes = [
  { x: 50, y: 12.5 },
  { x: 82.5, y: 68.75 },
  { x: 17.5, y: 68.75 },
];

const cycleArcs = [
  'M 200 50 A 150 150 0 0 1 329.9 275',
  'M 329.9 275 A 150 150 0 0 1 70.1 275',
  'M 70.1 275 A 150 150 0 0 1 200 50',
];

/** Chapter 06 — الدورة الوقفية: the cycle literally circulates. */
export function ProfileCycleChapter({ content }: { content: LibraryProfileContent }) {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.3 });
  const { cycle } = content;
  const reveal = revealVariants(shouldReduceMotion);
  const anchors = ['#profile-creation', '#profile-governance', '#profile-tracks'];

  // The stage cards light up in step with the sap dot circulating the ring
  // (9s per lap, three stages → one handoff every 3s).
  const [activeStage, setActiveStage] = useState(-1);
  useEffect(() => {
    if (!inView || shouldReduceMotion) return;
    setActiveStage(0);
    const id = window.setInterval(() => setActiveStage((stage) => (stage + 1) % 3), 3000);
    return () => window.clearInterval(id);
  }, [inView, shouldReduceMotion]);

  return (
    <Chapter id="profile-cycle" className="profile-stage--soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading index={6} eyebrow={content.meta.title} heading={cycle.heading} subheading={cycle.subheading} className="mb-12" />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* The animated ring: arcs draw in order, then the sap dot circulates forever. */}
          <div ref={ref} className="relative mx-auto w-full max-w-[480px]">
            <svg viewBox="0 0 400 400" fill="none" className="w-full" aria-hidden="true">
              <defs>
                <marker id="profile-cycle-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#b91c30" />
                </marker>
              </defs>
              <circle cx="200" cy="200" r="150" stroke="#b91c30" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="3 7" />
              {cycleArcs.map((d, index) => (
                <motion.path
                  key={d}
                  d={d}
                  stroke="#b91c30"
                  strokeWidth="3"
                  strokeLinecap="round"
                  markerEnd="url(#profile-cycle-arrow)"
                  initial={{ pathLength: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.01 }
                      : { delay: index * 0.38, duration: 0.85, ease: smoothEase }
                  }
                />
              ))}
              {/* SMIL ignores the reduced-motion CSS nuke — render the dot only when motion is allowed. */}
              {!shouldReduceMotion && inView && (
                <circle r="6" fill="#da0812">
                  <animateMotion dur="9s" repeatCount="indefinite" path="M200,50 a150,150 0 1,1 -0.1,0 z" />
                </circle>
              )}
            </svg>

            {cycle.stages.map((stage, index) => {
              const Icon = cycleIcons[index] ?? Recycle;
              const node = cycleNodes[index];
              return (
                <motion.div
                  key={stage.title}
                  initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.01 }
                      : { delay: 0.4 + index * 0.38, type: 'spring', stiffness: 260, damping: 20 }
                  }
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                >
                  <span
                    className={`flex h-16 w-16 items-center justify-center rounded-full shadow-[0_12px_30px_rgba(185,28,48,0.22)] ring-2 transition-all duration-500 ${
                      activeStage === index
                        ? 'scale-110 bg-primary-600 text-white ring-primary-300'
                        : 'bg-white text-primary-600 ring-primary-100'
                    }`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold shadow-sm ring-1 transition-colors duration-500 ${
                      activeStage === index ? 'bg-primary-600 text-white ring-primary-400' : 'bg-white text-dark-800 ring-primary-100'
                    }`}
                  >
                    {stage.title}
                  </span>
                </motion.div>
              );
            })}

            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={shouldReduceMotion ? { duration: 0.01 } : { delay: 1.5, type: 'spring', stiffness: 220, damping: 20 }}
              className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 text-center"
            >
              <p className="font-brand text-lg font-bold leading-snug text-primary-800">{cycle.heading}</p>
              <p className="mt-1 text-[11px] font-bold text-dark-400">{cycle.note}</p>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25, margin: '0px 0px -8% 0px' }}
            className="grid gap-4"
          >
            {cycle.stages.map((stage, index) => (
              <motion.a
                key={stage.title}
                href={anchors[index]}
                variants={reveal}
                className={`btn-border-run btn-border-run--sheen-tint group flex items-start gap-4 rounded-[22px] border bg-white p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-primary-200 ${
                  activeStage === index
                    ? 'border-primary-300 shadow-[0_18px_44px_rgba(218,8,18,0.16)]'
                    : 'border-primary-100 shadow-[0_14px_36px_rgba(40,12,18,0.05)]'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-brand text-base font-bold transition-colors duration-500 group-hover:bg-primary-600 group-hover:text-white ${
                    activeStage === index ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-dark-900">{stage.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-dark-500">{stage.text}</span>
                </span>
              </motion.a>
            ))}

            <motion.div variants={reveal} className="mt-2 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-dark-100 bg-white p-5">
                <h4 className="font-bold text-dark-700">{cycle.duality.direct.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-dark-500">{cycle.duality.direct.text}</p>
              </div>
              <div className="rounded-[22px] bg-primary-700 p-5 text-white shadow-[0_16px_40px_rgba(156,16,6,0.28)]">
                <h4 className="font-bold">{cycle.duality.waqf.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-white/80">{cycle.duality.waqf.text}</p>
              </div>
            </motion.div>
            <motion.p variants={reveal} className="text-sm font-bold text-dark-500">
              {cycle.duality.note}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </Chapter>
  );
}

/** Tiny corner sprig that "ripens" on hover — the page's growth motif. */
export function SprigGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
      <path d="M12 21V9" stroke="#c30710" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 13c0-3 2-5 5-5" stroke="#c30710" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="18.5" cy="7" r="3" className="profile-ripen" />
    </svg>
  );
}

/** Chapter 07 — إيجاد الوقف: the share ledger, six contribution forms, the blessed tree. */
export function ProfileCreationChapter({ content }: { content: LibraryProfileContent }) {
  const { isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const treeInView = useInView({ threshold: 0.35 });
  const { creation } = content;
  const reveal = revealVariants(shouldReduceMotion);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <Chapter id="profile-creation" className="bg-[#faf8f8] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading index={7} eyebrow={content.meta.title} heading={creation.heading} subheading={creation.subheading} className="mb-12" />

        {/* The is / is-not visual argument slides in from opposite sides. */}
        <div className="grid gap-5 md:grid-cols-2">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: isRtl ? 32 : -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.65, ease: smoothEase }}
            className="rounded-[24px] bg-primary-700 p-7 text-white shadow-[0_18px_46px_rgba(156,16,6,0.3)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Check className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-brand text-xl font-bold">
              {creation.share.heading} — {creation.share.what.title}
            </h3>
            <p className="mt-2 leading-relaxed text-white/85">{creation.share.what.text}</p>
          </motion.div>
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: isRtl ? -32 : 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.65, ease: smoothEase }}
            className="rounded-[24px] border border-primary-100 bg-white p-7"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf8f8] text-primary-600 ring-1 ring-primary-100">
              <X className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-brand text-xl font-bold text-dark-900">{creation.share.whatNot.title}</h3>
            <p className="mt-2 leading-relaxed text-dark-600">{creation.share.whatNot.text}</p>
          </motion.div>
        </div>
        <p className="mt-5 text-sm font-bold text-dark-500">{creation.share.note}</p>

        {/* The asset in pictures: the revenue apartments the shares actually buy into. */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -8% 0px' }}
          className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {apartmentPhotos.map((photo) => (
            <motion.div
              key={photo}
              variants={
                shouldReduceMotion
                  ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                  : {
                      // The asset "builds" from the ground up, photo by photo.
                      hidden: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
                      show: {
                        opacity: 1,
                        clipPath: 'inset(0% 0% 0% 0%)',
                        transition: { duration: 0.85, ease: smoothEase },
                      },
                    }
              }
              className="overflow-hidden rounded-[20px] shadow-[0_14px_36px_rgba(40,12,18,0.12)] ring-1 ring-primary-100/60"
            >
              <img
                src={photo}
                alt=""
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16">
          <h3 className="font-brand text-2xl font-bold text-dark-900 md:text-3xl">{creation.formsHeading}</h3>
          <p className="mt-2 text-dark-500">{creation.formsSubheading}</p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {creation.forms.map((form, index) => {
              const Icon = formIcons[index] ?? Coins;
              return (
                <motion.div
                  key={form.title}
                  variants={reveal}
                  className="profile-card group relative overflow-hidden rounded-[22px] border border-primary-100/70 bg-white p-6 shadow-[0_14px_36px_rgba(40,12,18,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_20px_48px_rgba(40,12,18,0.1)]"
                >
                  <span className="absolute end-4 top-4">
                    <SprigGlyph />
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h4 className="mt-4 font-brand text-lg font-bold text-dark-900">{form.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-dark-500">{form.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* The blessed tree: a working model. The bare tree photo leafs out into an olive tree as the card enters view. */}
        <div
          id="profile-blessed-tree"
          ref={treeInView.ref}
          className="mt-16 grid gap-8 overflow-hidden rounded-[26px] border border-primary-100 bg-white p-8 md:p-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center"
        >
          <BlessedTreeScene inView={treeInView.inView} alt={creation.tree.heading} />
          <div>
            <p className="text-sm font-bold text-primary-600">{creation.tree.subheading}</p>
            <h3 className="mt-1 font-brand text-2xl font-bold text-dark-900">{creation.tree.heading}</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {creation.tree.steps.map((step, index) => (
                <div key={step.title} className="rounded-[18px] bg-[#faf8f8] p-4 ring-1 ring-primary-100">
                  <span className="font-brand text-sm font-bold text-primary-600">{String(index + 1).padStart(2, '0')}</span>
                  <h4 className="mt-1 text-sm font-bold text-dark-900">{step.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-dark-500">{step.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm font-bold text-dark-600">{creation.tree.note}</p>
            <Link
              to="/donate"
              className="btn-border-run btn-border-run--sheen-tint mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-600 px-6 font-bold text-white shadow-[0_12px_30px_rgba(195,7,16,0.28)] transition-colors hover:bg-primary-700"
            >
              <Sprout className="h-4 w-4" aria-hidden="true" />
              {content.cta.donate}
              <ArrowIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

/** Chapter 08 — التثمير والحوكمة: principles, institutional separation, the decision chain. */
export function ProfileGovernanceChapter({ content }: { content: LibraryProfileContent }) {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.12 });
  const { investment } = content;
  const reveal = revealVariants(shouldReduceMotion);

  // The decision walkthrough: one stage is "in session" at a time — the token
  // rides the track to it, its copy lights up, the rest recede. Auto-advances
  // while the chapter is on stage; any node can be pressed to jump the queue.
  const [activeDecision, setActiveDecision] = useState(0);
  const stageCount = investment.stages.length;
  useEffect(() => {
    if (!inView || shouldReduceMotion || stageCount < 2) return;
    const id = window.setInterval(() => setActiveDecision((stage) => (stage + 1) % stageCount), 3200);
    return () => window.clearInterval(id);
  }, [inView, shouldReduceMotion, stageCount]);

  return (
    <Chapter id="profile-governance" className="profile-stage--soft overflow-hidden py-20 md:py-28">
      <div aria-hidden="true" className="profile-stage-pattern pattern-bg" />
      <div ref={ref} className={`mx-auto max-w-7xl px-4 md:px-8 ${inView ? 'profile-inview' : ''}`}>
        <SectionHeading
          index={8}
          eyebrow={content.meta.title}
          heading={investment.heading}
          subheading={investment.subheading}
          className="mb-12"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {investment.principles.map((principle, index) => (
            <div
              key={principle.title}
              style={{ '--profile-delay': `${index * 120}ms` } as React.CSSProperties}
              className="profile-ignite rounded-[20px] bg-[#faf8f8] p-5 ring-1 ring-primary-100"
            >
              <span className="font-brand text-sm font-bold text-primary-600">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 font-bold text-dark-900">{principle.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-dark-500">{principle.text}</p>
            </div>
          ))}
        </div>

        {/* Institutional separation: the divider itself draws the point. */}
        <div className="mt-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.h3 variants={reveal} className="font-brand text-2xl font-bold text-dark-900 md:text-3xl">
              {investment.governance.heading}
            </motion.h3>
            <motion.p variants={reveal} className="mt-2 text-dark-500">
              {investment.governance.subheading}
            </motion.p>
          </motion.div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {investment.governance.bodies.slice(0, 3).map((body, index) => (
              <div
                key={body.title}
                style={{ '--profile-delay': `${300 + index * 130}ms` } as React.CSSProperties}
                className="profile-ignite rounded-[20px] border border-primary-100 bg-[#faf8f8] p-5"
              >
                <h4 className="font-bold text-dark-900">{body.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-dark-500">{body.text}</p>
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="profile-track my-4 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
          <div className="grid gap-4 md:grid-cols-3">
            {investment.governance.bodies.slice(3).map((body, index) => (
              <div
                key={body.title}
                style={{ '--profile-delay': `${750 + index * 130}ms` } as React.CSSProperties}
                className="profile-ignite rounded-[20px] border border-primary-100 bg-[#faf8f8] p-5"
              >
                <h4 className="font-bold text-dark-900">{body.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-dark-500">{body.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm font-bold text-dark-500">{investment.governance.note}</p>
        </div>

        {/* Decision chain: nodes ignite in order while the track fills behind them. */}
        <div className="mt-16">
          <h3 className="font-brand text-2xl font-bold text-dark-900 md:text-3xl">{investment.stagesHeading}</h3>
          <div className="relative mt-8">
            <div aria-hidden="true" className="profile-track absolute inset-x-4 top-[26px] hidden h-0.5 bg-gradient-to-r from-primary-200 via-primary-500 to-primary-200 lg:block">
              {/* Filled up to the stage currently in session. */}
              <span
                className="absolute inset-y-0 start-0 bg-primary-600 transition-[width] duration-700 ease-out"
                style={{ width: `calc(${(activeDecision * 100) / stageCount}% + 26px)` }}
              />
            </div>
            {/* The decision token glides to whichever stage holds the file. */}
            <span
              aria-hidden="true"
              className="profile-token top-[21px] hidden lg:block"
              style={{ insetInlineStart: `calc(${(activeDecision * 100) / stageCount}% + 21px)` }}
            />
            <ol className="no-scrollbar flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible">
              {investment.stages.map((stage, index) => (
                <li
                  key={stage.title}
                  style={{ '--profile-delay': `${index * 170}ms` } as React.CSSProperties}
                  className="profile-ignite relative min-w-[190px] lg:min-w-0"
                >
                  <button
                    type="button"
                    onClick={() => setActiveDecision(index)}
                    aria-current={activeDecision === index ? 'step' : undefined}
                    className={`relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 font-brand text-base font-bold shadow-[0_8px_20px_rgba(195,7,16,0.12)] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${
                      activeDecision === index
                        ? 'scale-110 border-primary-600 bg-primary-600 text-white'
                        : index < activeDecision
                          ? 'border-primary-400 bg-primary-50 text-primary-700'
                          : 'border-primary-300 bg-white text-primary-700'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </button>
                  <div className={`transition-opacity duration-500 ${activeDecision === index ? 'opacity-100' : 'lg:opacity-45'}`}>
                    <h4 className="mt-3 text-sm font-bold text-dark-900">{stage.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-dark-500">{stage.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* The payoff: what actually reaches the tracks. */}
        <div className="mt-16 rounded-[26px] border border-primary-100 bg-[#faf8f8] p-7 md:p-9">
          <h3 className="font-brand text-2xl font-bold text-dark-900">{investment.yield.heading}</h3>
          <p className="mt-1 text-dark-500">{investment.yield.subheading}</p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {investment.yield.steps.map((step, index) => (
              <div
                key={step.title}
                style={{ '--profile-delay': `${index * 150}ms` } as React.CSSProperties}
                className={`profile-ignite rounded-[20px] p-5 ${
                  index === 2 ? 'bg-primary-600 shadow-[0_16px_40px_rgba(218,8,18,0.28)]' : 'bg-white ring-1 ring-primary-100'
                }`}
              >
                <span className={`font-brand text-sm font-bold ${index === 2 ? 'text-[#ffc8ce]' : 'text-primary-600'}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className={`mt-2 font-bold ${index === 2 ? 'text-white' : 'text-dark-900'}`}>{step.title}</h4>
                <p className={`mt-1.5 text-sm leading-relaxed ${index === 2 ? 'text-white/85' : 'text-dark-500'}`}>{step.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm font-bold text-dark-500">{investment.yield.note}</p>
        </div>
      </div>
    </Chapter>
  );
}
