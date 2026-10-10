import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import type { AdministrativeMember, OrganizationalSection } from '@/data/about';
import { useI18n } from '@/i18n/useI18n';
import OrganizationSectionTabs from './OrganizationSectionTabs';
import FeaturedMemberPortrait from './FeaturedMemberPortrait';

type FeaturedMemberSliderProps = {
  sections: OrganizationalSection[];
  fallbackMembers: AdministrativeMember[];
  pageTitle: string;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

/**
 * Displays the role/position saved by the Admin (e.g. "عضو هيئة المتولين")
 * without unnecessary organization suffixes ("في وقف أويس القرني").
 * If the saved position is just "عضو" / "Member" / "Üye", it appends the section title.
 */
function resolveMemberRoleLabel(
  rawPosition: string,
  sectionTitle?: string,
): string {
  const cleaned = (rawPosition || '')
    .trim()
    .replace(/\s+في\s+(وقف أويس القرني|شركة أركان الدولية).*$/u, '')
    .replace(/\s+at\s+(Veysel Karani Waqf|Arkan International).*$/i, '')
    .replace(/^(Veysel Karani Vakfı|Arkan Uluslararası Şirketi)\s+/i, '')
    .trim();

  const sec = (sectionTitle || '').trim();
  if (!cleaned) return sec;
  if (!sec) return cleaned;

  if (cleaned === 'عضو') return `عضو ${sec}`;
  if (/^member$/i.test(cleaned)) return `Member of ${sec}`;
  if (/^üye$/i.test(cleaned)) return `${sec} Üyesi`;

  if (
    (cleaned === 'رئيس اللجنة' ||
      cleaned === 'رئيس الفريق' ||
      cleaned === 'رئيس الهيئة' ||
      cleaned === 'رئيس المجلس') &&
    !cleaned.includes(sec)
  ) {
    return `رئيس ${sec}`;
  }

  return cleaned;
}

export default function FeaturedMemberSlider({
  sections,
  fallbackMembers,
  pageTitle,
}: FeaturedMemberSliderProps) {
  const { locale } = useI18n();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Filter published organizational sections in their configured order
  const publishedSections = useMemo<OrganizationalSection[]>(() => {
    const valid = (sections ?? [])
      .filter((s) => s.published !== false)
      .sort((a, b) => a.order - b.order);

    if (valid.length > 0) return valid;

    return [
      {
        id: 'administrative-body',
        slug: 'administrative-body',
        title: pageTitle,
        description: '',
        layoutType: 'cards',
        order: 1,
        published: true,
        members: fallbackMembers ?? [],
      },
    ];
  }, [sections, fallbackMembers, pageTitle]);

  const [activeSectionId, setActiveSectionId] = useState<string>(() => {
    return publishedSections[0]?.id || publishedSections[0]?.slug || '';
  });

  // Sync activeSectionId if URL hash targets a section or if sections reload from CMS
  useEffect(() => {
    const rawHash = location.hash.replace(/^#/, '').replace(/^cms-structure-/, '');
    if (rawHash) {
      const matched = publishedSections.find(
        (s) => s.slug === rawHash || s.id === rawHash,
      );
      if (matched) {
        setActiveSectionId(matched.id || matched.slug);
        return;
      }
    }

    const stillExists = publishedSections.some(
      (s) => (s.id || s.slug) === activeSectionId,
    );
    if (!stillExists && publishedSections.length > 0) {
      setActiveSectionId(publishedSections[0].id || publishedSections[0].slug);
    }
  }, [publishedSections, location.hash, activeSectionId]);

  const activeSection = useMemo(() => {
    return (
      publishedSections.find((s) => (s.id || s.slug) === activeSectionId) ??
      publishedSections[0]
    );
  }, [publishedSections, activeSectionId]);

  // Published members of the active section sorted by saved order
  const publishedMembers = useMemo(() => {
    if (!activeSection) return [];
    return (activeSection.members ?? [])
      .filter((m) => m.published !== false)
      .sort((a, b) => a.order - b.order);
  }, [activeSection]);

  const handleSelectSection = useCallback((section: OrganizationalSection) => {
    const nextKey = section.id || section.slug;
    setActiveSectionId(nextKey);
  }, []);

  const emptyNotice =
    locale === 'ar'
      ? 'يتم تحديث واعتماد قائمة أعضاء هذه الهيئة رسمياً وفق اللوائح المعتمدة لوقف أويس القرني.'
      : locale === 'tr'
      ? 'Bu heyetin üye listesi, Veysel Karani Vakfı onaylı yönetmelikleri doğrultusunda güncellenmektedir.'
      : 'The official member roster for this body is currently being updated in accordance with foundation regulations.';

  return (
    <div className="relative w-full overflow-x-clip">
      {/* Hidden anchors so CMS preview or hash links to any section slug work */}
      {publishedSections.map((sec) => (
        <span
          key={`anchor-${sec.id || sec.slug}`}
          id={`cms-structure-${sec.slug}`}
          className="sr-only"
          aria-hidden="true"
        />
      ))}

      {/* 1. Top Organizational Section Navigation Bar */}
      <OrganizationSectionTabs
        sections={publishedSections}
        activeSectionId={activeSection?.id || activeSection?.slug || ''}
        onSelectSection={handleSelectSection}
      />

      {/* 2. Team Cards Grid with Overlapping Bottom White Card (Name + Role Only) */}
      <div
        id={activeSection ? `org-section-panel-${activeSection.slug}` : undefined}
        role="tabpanel"
        className="relative isolate w-full bg-white py-10 sm:py-12 lg:py-14"
      >
        {publishedMembers.length === 0 ? (
          /* Empty Section State */
          <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 text-center">
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-8 sm:p-12 shadow-xs">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Users className="h-7 w-7" />
              </div>
              {activeSection?.title && (
                <h2 className="text-xl sm:text-2xl font-bold text-dark-900 mb-2">
                  {activeSection.title}
                </h2>
              )}
              {activeSection?.description && (
                <p className="text-sm sm:text-base text-dark-600 mb-4 max-w-xl mx-auto leading-relaxed">
                  {activeSection.description}
                </p>
              )}
              <p className="text-sm leading-relaxed text-dark-500 max-w-lg mx-auto">
                {emptyNotice}
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`section-gallery-${activeSection?.id || activeSection?.slug}`}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.01 }
                    : { duration: 0.35, ease: smoothEase }
                }
              >
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 sm:gap-y-10 sm:gap-x-7 lg:grid-cols-3 lg:gap-x-8">
                  {publishedMembers.map((member, index) => {
                    const roleLabel = resolveMemberRoleLabel(
                      member.position,
                      activeSection?.title,
                    );

                    return (
                      <motion.article
                        key={member.id}
                        initial={
                          shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0.01 }
                            : {
                                duration: 0.4,
                                delay: index * 0.05,
                                ease: smoothEase,
                              }
                        }
                        className="group relative flex flex-col items-center select-none"
                      >
                        {/* Rounded Portrait Image Container */}
                        <div className="relative h-[340px] sm:h-[360px] md:h-[380px] w-full overflow-hidden rounded-[1.5rem] bg-slate-100 shadow-sm">
                          <FeaturedMemberPortrait
                            member={member}
                            loading={index < 3 ? 'eager' : 'lazy'}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform scale-100 group-hover:scale-105"
                          />
                        </div>

                        {/* Overlapping White Info Box at Bottom Center (Name + Role Only) */}
                        <div className="relative z-10 -mt-14 w-[86%] rounded-2xl bg-white px-4 py-4 sm:px-5 sm:py-5 text-center shadow-[0_12px_32px_-6px_rgba(15,23,42,0.10)] ring-1 ring-slate-900/[0.05] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_38px_-6px_rgba(15,23,42,0.14)]">
                          {/* Member Full Name */}
                          <h3 className="font-brand text-base sm:text-lg md:text-[19px] font-bold tracking-tight text-dark-950 leading-snug">
                            {member.name}
                          </h3>

                          {/* Official Role / Position Only (e.g. عضو هيئة المتولين) */}
                          {roleLabel && (
                            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 leading-normal">
                              {roleLabel}
                            </p>
                          )}
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}


