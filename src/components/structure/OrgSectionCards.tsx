import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Users } from 'lucide-react';
import type { AdministrativeMember, OrganizationalSection } from '@/data/about';
import OrgChartCard from './OrgChartCard';
import MemberProfileModal from './MemberProfileModal';
import { useI18n } from '@/i18n/useI18n';

type OrgSectionCardsProps = {
  section: OrganizationalSection;
  onSelectMember?: (member: AdministrativeMember) => void;
};

export default function OrgSectionCards({ section, onSelectMember }: OrgSectionCardsProps) {
  const { locale } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const [selectedMember, setSelectedMember] = useState<AdministrativeMember | null>(null);

  const handleSelect = (member: AdministrativeMember) => {
    setSelectedMember(member);
    if (onSelectMember) onSelectMember(member);
  };

  const publishedMembers = section.members
    .filter((m) => m.published !== false)
    .sort((a, b) => a.order - b.order);

  const leader = publishedMembers.find((m) => m.level === 1);
  const otherMembers = leader ? publishedMembers.filter((m) => m.id !== leader.id) : publishedMembers;

  const ease = [0.22, 1, 0.36, 1] as const;
  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.45,
        delay: shouldReduceMotion ? 0 : customDelay,
        ease,
      },
    }),
  };

  const emptyNotice =
    locale === 'ar'
      ? 'يتم تحديث واعتماد قائمة أعضاء الهيئة رسمياً وفق اللوائح المعتمدة لوقف أويس القرني.'
      : locale === 'tr'
      ? 'Heyet üye listesi, Veysel Karani Vakfı onaylı yönetmelikleri doğrultusunda güncellenmektedir.'
      : 'The official member roster is currently being updated in accordance with foundation regulations.';

  if (publishedMembers.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 shadow-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Users className="h-6 w-6" />
          </div>
          <p className="text-sm leading-relaxed text-dark-500">{emptyNotice}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      {/* Optional Section Leader / Chairperson at top center */}
      {leader && (
        <motion.div
          custom={0.1}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mb-8 flex justify-center w-full"
        >
          <OrgChartCard
            member={leader}
            onSelect={handleSelect}
            className="hover:scale-[1.01]"
          />
        </motion.div>
      )}

      {/* Grid of members */}
      {otherMembers.length > 0 && (
        <div
          className={`grid gap-6 justify-items-center ${
            otherMembers.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : otherMembers.length === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
          }`}
        >
          {otherMembers.map((member, index) => (
            <motion.div
              key={member.id}
              custom={0.15 + index * 0.08}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="w-full flex justify-center"
            >
              <OrgChartCard
                member={member}
                onSelect={handleSelect}
                className="w-full"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Member Profile Modal Dialog */}
      <MemberProfileModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
