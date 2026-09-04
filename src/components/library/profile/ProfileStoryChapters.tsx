import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Building2, Compass, Lightbulb, RefreshCw, Scale, Sparkles, Users } from 'lucide-react';
import type { LibraryProfileContent } from '@/data/library/profile';
import { useInView } from '@/hooks/useInView';
import { Chapter, SectionHeading, WordReveal, containerVariants, revealVariants, smoothEase } from './profileShared';

const problemIcons = [Users, Building2, Sparkles];
const experienceIcons = [Compass, Lightbulb, Users, Scale];

/* Each need flips over to reveal the track that answers it:
   الإنسان → قيادات المستقبل، المؤسسات → تطوير المؤسسات، الوعي → الوعي والهوية. */
const responseTrackIndex = [0, 2, 3];

type ProblemFlipCardProps = {
  index: number;
  card: { title: string; text: string };
  response?: { title: string; text: string };
  hint: string;
  responseLabel: string;
  reduced: boolean;
  className?: string;
};

function ProblemFlipCard({ index, card, response, hint, responseLabel, reduced, className = '' }: ProblemFlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const Icon = problemIcons[index] ?? Users;

  const front = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-brand text-xl font-bold text-dark-900">{card.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-dark-500">{card.text}</p>
    </>
  );

  if (!response) {
    return (
      <div
        style={{ '--profile-delay': `${index * 160}ms` } as React.CSSProperties}
        className={`profile-ignite profile-glass rounded-[22px] p-6 ${className}`}
      >
        {front}
      </div>
    );
  }

  return (
    <div
      style={{ perspective: 1200, '--profile-delay': `${index * 160}ms` } as React.CSSProperties}
      className={`profile-ignite ${className}`}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${card.title} — ${hint}`}
        onClick={() => setFlipped((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setFlipped((value) => !value);
          }
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduced ? { duration: 0.01 } : { type: 'spring', stiffness: 170, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full cursor-pointer rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        <div style={{ backfaceVisibility: 'hidden' }} className="profile-glass flex h-full flex-col rounded-[22px] p-6">
          {front}
          <span className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-bold text-primary-600">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {hint}
          </span>
        </div>
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 flex flex-col overflow-hidden rounded-[22px] bg-dark-950 p-6 ring-1 ring-gold-400/50"
        >
          <span className="inline-flex w-fit items-center rounded-full bg-gold-400/15 px-3 py-1 text-xs font-bold text-gold-300">
            {responseLabel}
          </span>
          <h3 className="mt-4 font-brand text-xl font-bold text-white">{response.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/75">{response.text}</p>
          <span aria-hidden="true" className="mt-auto flex items-center pt-4 text-white/40">
            <RefreshCw className="h-3.5 w-3.5" />
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/** Chapter 03 — المشكلة: the first dark scene. */
export function ProfileProblemChapter({ content }: { content: LibraryProfileContent }) {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.2 });
  const { problem } = content;
  const spans = ['lg:col-span-5', 'lg:col-span-4', 'lg:col-span-3'];

  return (
    <Chapter id="profile-problem" className="relative overflow-hidden bg-primary-800 py-20 text-white md:py-28">
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-primary-700 via-primary-800 to-primary-900" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-dark-950/35 to-transparent" />
      <div aria-hidden="true" className="geometric-pattern absolute inset-0 opacity-20" />
      {/* A white curtain lifts off the dark plate — the reel's first scene change. */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: smoothEase }}
          className="pointer-events-none absolute inset-0 z-20 origin-top bg-white"
        />
      )}
      <div ref={ref} className={`relative mx-auto max-w-7xl px-4 md:px-8 ${inView ? 'profile-inview' : ''}`}>
        <p className="mb-3 text-sm font-bold tracking-wide text-gold-400">{problem.heading}</p>
        <WordReveal
          text={problem.subheading}
          className="max-w-4xl text-balance font-brand text-3xl/[1.6] font-bold text-white md:text-5xl/[1.6]"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3 lg:grid-cols-12">
          {problem.cards.map((card, index) => (
            <ProblemFlipCard
              key={card.title}
              index={index}
              card={card}
              response={content.tracks.items[responseTrackIndex[index] ?? -1]}
              hint={content.labels.flipHint}
              responseLabel={content.labels.flipResponse}
              reduced={Boolean(shouldReduceMotion)}
              className={`md:col-span-1 ${spans[index] ?? 'lg:col-span-4'}`}
            />
          ))}
        </div>

        <motion.p
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.6, delay: 0.4, ease: smoothEase }}
          className="mt-10 max-w-2xl border-s-2 border-gold-400 ps-4 font-brand text-base font-bold leading-relaxed text-white/85 md:text-lg"
        >
          {problem.note}
        </motion.p>
      </div>
    </Chapter>
  );
}

/** A milestone node that "ages a ring" when the spine tip reaches it. */
function GrowthRingNode({ reduced }: { reduced: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const rings = [
    { r: 8, width: 3, opacity: 0.95 },
    { r: 17, width: 1.8, opacity: 0.5 },
    { r: 26, width: 1.2, opacity: 0.26 },
  ];

  return (
    <span ref={ref} aria-hidden="true" className="relative block h-14 w-14">
      <svg viewBox="0 0 56 56" className="h-full w-full">
        {rings.map((ring, index) => (
          <motion.circle
            key={ring.r}
            cx="28"
            cy="28"
            r={ring.r}
            fill={index === 0 ? '#da0812' : 'none'}
            stroke="#da0812"
            strokeOpacity={ring.opacity}
            strokeWidth={ring.width}
            style={{ transformOrigin: '28px 28px' }}
            initial={reduced ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={
              reduced
                ? { duration: 0.01 }
                : { delay: index * 0.15, type: 'spring', stiffness: 240, damping: 18 }
            }
          />
        ))}
      </svg>
    </span>
  );
}

/** Chapter 04 — قصة التأسيس: scrubbed spine, growth-ring milestones, formative experiences. */
export function ProfileStoryChapter({ content }: { content: LibraryProfileContent }) {
  const shouldReduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 0.8', 'end 0.55'] });
  const { story } = content;
  const reveal = revealVariants(shouldReduceMotion);

  return (
    <Chapter id="profile-story" className="profile-stage--soft overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading index={4} heading={story.heading} subheading={story.subheading} className="mb-14" />

        <div ref={timelineRef} className="relative">
          {/* The spine grows just ahead of reading. */}
          <motion.span
            aria-hidden="true"
            style={{ scaleY: shouldReduceMotion ? 1 : scrollYProgress }}
            className="absolute inset-y-0 start-[27px] w-0.5 origin-top bg-gradient-to-b from-primary-500 via-primary-600 to-primary-200 lg:start-1/2 lg:-translate-x-1/2"
          />
          <ol className="grid gap-10">
            {story.milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              return (
                <li key={milestone.title} className="relative grid grid-cols-[56px_1fr] items-start gap-5 lg:grid-cols-[1fr_56px_1fr] lg:gap-8">
                  <div className="lg:order-2">
                    <GrowthRingNode reduced={Boolean(shouldReduceMotion)} />
                  </div>
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -36 : 36, y: 12 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.4, margin: '0px 0px -8% 0px' }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 0.62, ease: smoothEase }}
                    className={`relative rounded-[24px] border border-primary-100/70 bg-[#faf8f8] p-6 shadow-[0_14px_36px_rgba(40,12,18,0.05)] ${
                      isEven ? 'lg:order-1 lg:text-end' : 'lg:order-3'
                    }`}
                  >
                    <span className="font-brand text-2xl font-bold text-primary-600">{milestone.year}</span>
                    <h3 className="mt-1 font-brand text-xl font-bold text-dark-900">{milestone.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-dark-500">{milestone.text}</p>
                  </motion.div>
                  <div aria-hidden="true" className={`hidden lg:block ${isEven ? 'lg:order-3' : 'lg:order-1'}`} />
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3, margin: '0px 0px -8% 0px' }}
          >
            <motion.h3 variants={reveal} className="font-brand text-2xl font-bold text-dark-900 md:text-3xl">
              {story.experiencesHeading}
            </motion.h3>
            <motion.p variants={reveal} className="mt-2 text-dark-500">
              {story.experiencesSubheading}
            </motion.p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {story.experiences.map((experience, index) => {
                const Icon = experienceIcons[index] ?? Compass;
                return (
                  <motion.div
                    key={experience.title}
                    variants={{
                      hidden: shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92, y: 14 },
                      show: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: shouldReduceMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 260, damping: 20 },
                      },
                    }}
                    className="rounded-[20px] border border-primary-100 bg-[#faf8f8] p-5"
                  >
                    <Icon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                    <h4 className="mt-3 font-bold text-dark-900">{experience.title}</h4>
                    <p className="mt-1 text-sm text-dark-500">{experience.text}</p>
                  </motion.div>
                );
              })}
            </div>
            <motion.p
              variants={reveal}
              className="mt-8 max-w-2xl border-s-2 border-primary-500 ps-4 font-bold leading-relaxed text-dark-700"
            >
              {story.conclusion}
            </motion.p>
          </motion.div>
        </div>

        {/* The story in frames: the journey the milestones describe, photographed. */}
        {story.photos.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2, margin: '0px 0px -8% 0px' }}
            className="mt-16 grid gap-5 sm:grid-cols-3"
          >
            {story.photos.map((photo, index) => (
              <motion.div
                key={`${photo.src}-${index}`}
                variants={
                  shouldReduceMotion
                    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                    : {
                        hidden: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
                        show: {
                          opacity: 1,
                          clipPath: 'inset(0% 0% 0% 0%)',
                          transition: { duration: 0.85, ease: smoothEase },
                        },
                      }
                }
                className={`overflow-hidden rounded-[24px] shadow-[0_18px_46px_rgba(40,12,18,0.14)] ring-1 ring-primary-100/60 ${
                  index === 1 ? 'sm:translate-y-6' : ''
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt ?? ''}
                  loading="lazy"
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Chapter>
  );
}

/** Chapter 05 — الهوية والمعنى: parallax figure, definition, vision/mission/values. */
export function ProfileIdentityChapter({ content }: { content: LibraryProfileContent }) {
  const shouldReduceMotion = useReducedMotion();
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ['0%', '0%'] : ['-7%', '7%']);
  const { identity } = content;
  const reveal = revealVariants(shouldReduceMotion);

  return (
    <Chapter id="profile-identity" className="bg-[#faf8f8] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading index={5} heading={identity.heading} subheading={identity.subheading} className="mb-14" />

        <div className="grid gap-8 lg:grid-cols-12">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, ease: smoothEase }}
            className="lg:col-span-5"
          >
            <div ref={imageRef} className="relative h-full min-h-[380px] overflow-hidden rounded-[26px] shadow-[0_24px_60px_rgba(40,12,18,0.16)]">
              <motion.img
                src={identity.image}
                alt={identity.why.title}
                loading="lazy"
                style={{ y: parallaxY, scale: shouldReduceMotion ? 1 : 1.12 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="font-brand text-2xl font-bold text-white">{identity.why.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{identity.why.text}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2, margin: '0px 0px -8% 0px' }}
            className="grid content-start gap-5 lg:col-span-7"
          >
            <motion.div variants={reveal} className="rounded-[24px] border border-primary-100 bg-white p-7 shadow-[0_14px_36px_rgba(40,12,18,0.05)]">
              <h3 className="font-brand text-xl font-bold text-primary-700">{identity.what.title}</h3>
              <p className="mt-3 leading-relaxed text-dark-600">{identity.what.text}</p>
            </motion.div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[identity.vision, identity.mission].map((item) => (
                <motion.div key={item.title} variants={reveal} className="rounded-[24px] border border-primary-100 bg-white p-6 shadow-[0_14px_36px_rgba(40,12,18,0.05)]">
                  <h4 className="font-brand text-lg font-bold text-dark-900">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-dark-500">{item.text}</p>
                </motion.div>
              ))}
            </div>
            <motion.div variants={reveal} className="rounded-[24px] border border-primary-100 bg-white p-6 shadow-[0_14px_36px_rgba(40,12,18,0.05)]">
              <h4 className="font-brand text-lg font-bold text-dark-900">{identity.values.title}</h4>
              {/* The values orbit the waqf's core — a slow, living constellation.
                  Hovering the sky holds it still; chips counter-rotate to stay upright. */}
              <div className="relative mx-auto mt-4 aspect-square w-full max-w-[340px]">
                <div aria-hidden="true" className="absolute inset-[10%] rounded-full border border-dashed border-primary-200" />
                <div aria-hidden="true" className="absolute inset-[30%] rounded-full bg-[#faf8f8] ring-1 ring-primary-100" />
                <div className="absolute inset-[30%] flex items-center justify-center p-4 text-center">
                  <span className="font-brand text-base font-bold leading-snug text-primary-700">{identity.values.title}</span>
                </div>
                <div className="profile-orbit absolute inset-0">
                  {identity.values.items.map((value, index) => {
                    const angle = (index * 360) / identity.values.items.length;
                    return (
                      <div key={value} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                        <span className="absolute left-1/2 top-[10%]" style={{ transform: `translate(-50%, -50%) rotate(${-angle}deg)` }}>
                          <span className="profile-orbit-unspin inline-flex min-h-9 items-center whitespace-nowrap rounded-full bg-primary-50 px-3.5 text-xs font-bold text-primary-700 shadow-sm ring-1 ring-primary-100 sm:text-sm">
                            {value}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="mt-4 text-sm text-dark-400">{identity.note}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Chapter>
  );
}
