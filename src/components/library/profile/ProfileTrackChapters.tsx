import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Flag, HeartHandshake, Star } from 'lucide-react';
import type { LibraryProfileContent } from '@/data/library/profile';
import { useInView } from '@/hooks/useInView';
import { PioneerPathsRadar, PioneerPillarsStrip } from './ProfilePioneerBlueprint';
import { Chapter, SectionHeading, containerVariants, revealVariants } from './profileShared';

const philosophyIcons = [BookOpen, Star, HeartHandshake, Flag];

/** Chapter 10 — رواد اليمن: the flagship — idea and goal, the hall photographs, the
 *  cornerstones strip and the five-path radar, closing on the philosophy chain. */
export function ProfilePioneersChapter({ content }: { content: LibraryProfileContent }) {
  const shouldReduceMotion = useReducedMotion();
  const chain = useInView({ threshold: 0.3 });
  const { pioneers } = content;
  const reveal = revealVariants(shouldReduceMotion);

  return (
    <Chapter id="profile-pioneers" className="profile-stage--soft overflow-hidden py-20 md:py-28">
      <div aria-hidden="true" className="profile-stage-pattern pattern-bg" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading index={10} heading={pioneers.heading} subheading={pioneers.subheading} className="mb-12" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-5 md:grid-cols-2"
        >
          {[pioneers.idea, pioneers.goal].map((block) => (
            <motion.div key={block.title} variants={reveal} className="rounded-[24px] border border-primary-100 bg-[#faf8f8] p-7">
              <h3 className="font-brand text-xl font-bold text-primary-700">{block.title}</h3>
              <p className="mt-2.5 leading-relaxed text-dark-600">{block.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* The chain, photographed: pioneers inside the Sphere training rooms. */}
        {pioneers.photos.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2, margin: '0px 0px -8% 0px' }}
            className="mt-16 grid gap-5 sm:grid-cols-2"
          >
            {pioneers.photos.map((photo, index) => (
              <motion.div
                key={`${photo.src}-${index}`}
                variants={reveal}
                className="overflow-hidden rounded-[24px] shadow-[0_18px_46px_rgba(40,12,18,0.14)] ring-1 ring-primary-100/60"
              >
                <img
                  src={photo.src}
                  alt={photo.alt ?? ''}
                  loading="lazy"
                  className="aspect-[16/9] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* The cornerstones strip and the five-path radar (ProfilePioneerBlueprint). */}
        <PioneerPillarsStrip heading={pioneers.pillarsHeading} pillars={pioneers.pillars} className="mt-16" />
        <PioneerPathsRadar heading={pioneers.pathsHeading} paths={pioneers.paths} className="mt-16" />

        {/* The philosophy chain: العلم → القيادة → المجتمع → الوطن lights in sequence. */}
        <div ref={chain.ref} className={`mt-16 ${chain.inView ? 'profile-inview' : ''}`}>
          <h3 className="text-center font-brand text-2xl font-bold text-dark-900 md:text-3xl">{pioneers.philosophyHeading}</h3>
          <div className="relative mx-auto mt-10 max-w-4xl">
            <div aria-hidden="true" className="profile-track absolute inset-x-10 top-[34px] hidden h-0.5 bg-gradient-to-r from-primary-200 via-primary-500 to-primary-200 md:block" />
            <ol className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {pioneers.philosophy.map((step, index) => {
                const Icon = philosophyIcons[index] ?? Star;
                return (
                  <li
                    key={step.title}
                    style={{ '--profile-delay': `${index * 220}ms` } as React.CSSProperties}
                    className="profile-ignite flex flex-col items-center text-center"
                  >
                    <span
                      style={{ '--chain-delay': `${index * 1.1}s` } as React.CSSProperties}
                      className="profile-chain-icon relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-primary-200 bg-white text-primary-600 shadow-[0_12px_30px_rgba(218,8,18,0.14)]"
                    >
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <h4 className="mt-3 font-brand text-lg font-bold text-dark-900">{step.title}</h4>
                    <p className="mt-1 text-sm text-dark-500">{step.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="mt-8 text-center text-sm font-bold text-dark-500">{pioneers.note}</p>
        </div>
      </div>
    </Chapter>
  );
}
