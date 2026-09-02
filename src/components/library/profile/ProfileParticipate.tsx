import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, Gift, HandCoins, Landmark, Share2, Users } from 'lucide-react';
import { participateRoutes } from '@/data/participate';
import type { LibraryProfileContent } from '@/data/library/profile';
import { useI18n } from '@/i18n/useI18n';
import { Chapter, SectionHeading, containerVariants, revealVariants } from './profileShared';
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

/** Chapter 12 — آليات المشاركة: deliberate light relief after the vault. */
export default function ProfileParticipateChapter({ content }: { content: LibraryProfileContent }) {
  const { isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const { participate } = content;
  const reveal = revealVariants(shouldReduceMotion);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <Chapter id="profile-participate" className="profile-stage--soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading index={12} eyebrow={content.meta.title} heading={participate.heading} subheading={participate.subheading} className="mb-12" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12, margin: '0px 0px -8% 0px' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {participate.ways.map((way, index) => {
            const Icon = wayIcons[index] ?? HandCoins;
            // Six ways in, dealt like invitations: a slight tilt that settles.
            const dealVariants = shouldReduceMotion
              ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
              : {
                  hidden: { opacity: 0, y: 32, rotate: index % 2 ? 2 : -2 },
                  show: {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    transition: { type: 'spring' as const, stiffness: 240, damping: 20 },
                  },
                };
            return (
              <motion.div key={way.title} variants={dealVariants} className="h-full">
                <Link
                  to={wayRoutes[index] ?? participateRoutes.index}
                  className="profile-card btn-border-run btn-border-run--sheen-tint group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-primary-100/70 bg-white p-6 shadow-[0_14px_36px_rgba(40,12,18,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_20px_48px_rgba(40,12,18,0.1)]"
                >
                  <span className="absolute end-4 top-4">
                    <SprigGlyph />
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-brand text-lg font-bold text-dark-900">{way.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-dark-500">{way.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

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
              <motion.div key={item.title} variants={reveal} className="rounded-[20px] bg-white p-5 ring-1 ring-primary-100">
                <span className="font-brand text-sm font-bold text-primary-600">{String(index + 1).padStart(2, '0')}</span>
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
