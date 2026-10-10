import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Home, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { AdministrativeMember, OrganizationalSection } from '@/data/about';
import { useI18n } from '@/i18n/useI18n';
import OrganizationSectionTabs from './OrganizationSectionTabs';
import FeaturedMemberPortrait from './FeaturedMemberPortrait';
import MemberThumbnailNavigation from './MemberThumbnailNavigation';

type FeaturedMemberSliderProps = {
  sections: OrganizationalSection[];
  fallbackMembers: AdministrativeMember[];
  pageTitle: string;
};

const AUTOPLAY_INTERVAL_MS = 5000;
const smoothEase = [0.22, 1, 0.36, 1] as const;

/** Slender editorial long-stem arrow matching the Amber Aviation reference screenshot */
function EditorialArrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 36 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-4 w-8 sm:w-9 transition-transform duration-300"
    >
      {direction === 'left' ? (
        <path
          d="M34 8H2M2 8L8.5 1.5M2 8L8.5 14.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M2 8H34M34 8L27.5 1.5M34 8L27.5 14.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function FeaturedMemberSlider({
  sections,
  fallbackMembers,
  pageTitle,
}: FeaturedMemberSliderProps) {
  const { locale, isRtl } = useI18n();
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

  // Track active member ID, slide direction (-1 = previous, +1 = next), and interaction counter
  const [activeMemberId, setActiveMemberId] = useState<string>('');
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [interactionTick, setInteractionTick] = useState<number>(0);

  // Pause states for 5-second autoplay
  const [isStageHovered, setIsStageHovered] = useState(false);
  const [isThumbInteracting, setIsThumbInteracting] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);

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

  // Whenever the active section changes or members list updates, ensure valid selection
  // (automatically selects the first published member when switching sections)
  useEffect(() => {
    if (publishedMembers.length === 0) {
      setActiveMemberId('');
      return;
    }
    const existsInSection = publishedMembers.some((m) => m.id === activeMemberId);
    if (!existsInSection) {
      setActiveMemberId(publishedMembers[0].id);
    }
  }, [activeSectionId, publishedMembers, activeMemberId]);

  // Preload member portraits in the active section to prevent any image flicker during autoplay
  useEffect(() => {
    publishedMembers.forEach((m) => {
      if (m.image && m.image.trim() !== '') {
        const img = new Image();
        img.src = m.image;
      }
    });
  }, [publishedMembers]);

  // Track document visibility so autoplay pauses when browser tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const activeMemberIndex = useMemo(() => {
    if (publishedMembers.length === 0) return -1;
    const idx = publishedMembers.findIndex((m) => m.id === activeMemberId);
    return idx >= 0 ? idx : 0;
  }, [publishedMembers, activeMemberId]);

  const activeMember =
    activeMemberIndex >= 0 ? publishedMembers[activeMemberIndex] : null;

  const isAutoplayPaused =
    Boolean(shouldReduceMotion) ||
    publishedMembers.length <= 1 ||
    isStageHovered ||
    isThumbInteracting ||
    isTouching ||
    isDocumentHidden;

  // 5-Second Autoplay Timer: loops continuously and resets automatically on any manual interaction
  useEffect(() => {
    if (isAutoplayPaused || activeMemberIndex < 0) return;

    const timerId = window.setTimeout(() => {
      setSlideDirection(1);
      const nextIdx = (activeMemberIndex + 1) % publishedMembers.length;
      const nextMember = publishedMembers[nextIdx];
      if (nextMember) {
        setActiveMemberId(nextMember.id);
      }
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [
    activeMemberIndex,
    activeSectionId,
    publishedMembers,
    isAutoplayPaused,
    interactionTick,
  ]);

  const handleSelectSection = useCallback((section: OrganizationalSection) => {
    const nextKey = section.id || section.slug;
    setSlideDirection(1);
    setActiveSectionId(nextKey);
    const firstPublished = (section.members ?? [])
      .filter((m) => m.published !== false)
      .sort((a, b) => a.order - b.order)[0];
    setActiveMemberId(firstPublished?.id ?? '');
    setInteractionTick((t) => t + 1);
  }, []);

  const handleSelectMember = useCallback(
    (member: AdministrativeMember, index: number) => {
      setInteractionTick((t) => t + 1);
      if (member.id === activeMemberId) return;
      setSlideDirection(index >= activeMemberIndex ? 1 : -1);
      setActiveMemberId(member.id);
    },
    [activeMemberId, activeMemberIndex],
  );

  const handlePrevMember = useCallback(() => {
    if (publishedMembers.length <= 1) return;
    setSlideDirection(-1);
    const prevIdx =
      (activeMemberIndex - 1 + publishedMembers.length) % publishedMembers.length;
    setActiveMemberId(publishedMembers[prevIdx].id);
    setInteractionTick((t) => t + 1);
  }, [publishedMembers, activeMemberIndex]);

  const handleNextMember = useCallback(() => {
    if (publishedMembers.length <= 1) return;
    setSlideDirection(1);
    const nextIdx = (activeMemberIndex + 1) % publishedMembers.length;
    setActiveMemberId(publishedMembers[nextIdx].id);
    setInteractionTick((t) => t + 1);
  }, [publishedMembers, activeMemberIndex]);

  // Touch swipe handling for mobile/tablet
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsTouching(false);
    if (!touchStartRef.current || publishedMembers.length <= 1) return;
    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return;
    }

    // In RTL: swiping right (deltaX > 0) advances to next (which is to the left)
    // In LTR: swiping left (deltaX < 0) advances to next (which is to the right)
    if (isRtl) {
      if (deltaX > 0) handleNextMember();
      else handlePrevMember();
    } else {
      if (deltaX < 0) handleNextMember();
      else handlePrevMember();
    }
  };

  // Resolve a single concise 1-line summary (no long multi-paragraph biography)
  const conciseSummary = useMemo(() => {
    if (!activeMember) return '';
    const shortText = activeMember.shortDescription?.trim();
    if (shortText) return shortText;
    const firstBioLine = activeMember.biography
      ?.split(/\n+/)[0]
      ?.trim();
    return firstBioLine || '';
  }, [activeMember]);

  const prevLabel =
    locale === 'ar'
      ? 'العضو السابق'
      : locale === 'tr'
      ? 'Önceki Üye'
      : 'Previous Member';

  const nextLabel =
    locale === 'ar'
      ? 'العضو التالي'
      : locale === 'tr'
      ? 'Sonraki Üye'
      : 'Next Member';

  const homeLabel =
    locale === 'ar' ? 'الرئيسية' : locale === 'tr' ? 'Ana Sayfa' : 'Home';

  const emptyNotice =
    locale === 'ar'
      ? 'يتم تحديث واعتماد قائمة أعضاء هذه الهيئة رسمياً وفق اللوائح المعتمدة لوقف أويس القرني.'
      : locale === 'tr'
      ? 'Bu heyetin üye listesi, Veysel Karani Vakfı onaylı yönetmelikleri doğrultusunda güncellenmektedir.'
      : 'The official member roster for this body is currently being updated in accordance with foundation regulations.';

  // Horizontal motion offset adjusted for RTL / LTR and slide direction
  const slideOffset = shouldReduceMotion
    ? 0
    : (isRtl ? -1 : 1) * slideDirection * 24;

  const BreadcrumbSeparator = isRtl ? ChevronLeft : ChevronRight;

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

      {/* 2. Top Member Thumbnail & Role Bar */}
      {publishedMembers.length > 0 && activeMember && (
        <MemberThumbnailNavigation
          members={publishedMembers}
          activeMemberId={activeMember.id}
          onSelectMember={handleSelectMember}
          onInteractionChange={setIsThumbInteracting}
          autoplayPaused={isAutoplayPaused}
          autoplayIntervalMs={AUTOPLAY_INTERVAL_MS}
        />
      )}

      {/* 3. Compact Horizontal Card Showcase Stage */}
      <div
        id={activeSection ? `org-section-panel-${activeSection.slug}` : undefined}
        role="tabpanel"
        onMouseEnter={() => setIsStageHovered(true)}
        onMouseLeave={() => setIsStageHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative isolate w-full bg-gradient-to-b from-[#f4f6f8] via-[#eef2f5] to-[#e7ecef] py-6 sm:py-8 lg:py-10"
      >
        {/* Subtle diagonal contour texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(125deg, rgba(148, 163, 184, 0.08) 0px, rgba(148, 163, 184, 0.08) 1px, transparent 1px, transparent 18px)',
          }}
        />

        {publishedMembers.length === 0 || !activeMember ? (
          /* Empty Section State */
          <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 text-center">
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-8 sm:p-12 shadow-sm">
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
          <div className="relative mx-auto max-w-5xl px-4 sm:px-14 lg:px-16">
            {/* Previous Member Arrow (Start edge: Right in RTL, Left in LTR) */}
            {publishedMembers.length > 1 && (
              <button
                type="button"
                onClick={handlePrevMember}
                aria-label={prevLabel}
                title={prevLabel}
                className="group absolute start-2 sm:start-2 lg:start-1 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/95 text-dark-700 hover:bg-primary-600 hover:text-white shadow-md ring-1 ring-slate-200/90 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 cursor-pointer"
              >
                <span
                  className={`transition-transform duration-200 ${
                    isRtl
                      ? 'group-hover:translate-x-0.5'
                      : 'group-hover:-translate-x-0.5'
                  }`}
                >
                  <EditorialArrow direction={isRtl ? 'right' : 'left'} />
                </span>
              </button>
            )}

            {/* Next Member Arrow (End edge: Left in RTL, Right in LTR) */}
            {publishedMembers.length > 1 && (
              <button
                type="button"
                onClick={handleNextMember}
                aria-label={nextLabel}
                title={nextLabel}
                className="group absolute end-2 sm:end-2 lg:end-1 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/95 text-dark-700 hover:bg-primary-600 hover:text-white shadow-md ring-1 ring-slate-200/90 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 cursor-pointer"
              >
                <span
                  className={`transition-transform duration-200 ${
                    isRtl
                      ? 'group-hover:-translate-x-0.5'
                      : 'group-hover:translate-x-0.5'
                  }`}
                >
                  <EditorialArrow direction={isRtl ? 'left' : 'right'} />
                </span>
              </button>
            )}

            {/* Compact Horizontal White Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_-20px_rgba(15,23,42,0.10)] px-5 pt-5 pb-6 sm:px-8 sm:pt-6 sm:pb-6 lg:px-10 lg:py-6">
              {/* Soft radial accent inside the card */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-0 -z-10 w-full lg:w-1/2 ${
                  isRtl ? 'left-0' : 'right-0'
                } bg-[radial-gradient(circle_at_50%_50%,rgba(218,8,18,0.04)_0%,transparent_70%)]`}
              />

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${activeSection?.id || activeSection?.slug}-${activeMember.id}`}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0, x: slideOffset }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: -slideOffset * 0.65 }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.01 }
                      : { duration: 0.36, ease: smoothEase }
                  }
                  className="grid grid-cols-1 lg:grid-cols-12 items-center gap-5 sm:gap-6 lg:gap-8"
                >
                  {/* TEXT COLUMN (Right in RTL, Left in LTR) */}
                  <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-center lg:items-start justify-center text-center lg:text-start">
                    {/* Compact Section & Counter Pill */}
                    <div className="mb-3 inline-flex flex-wrap items-center gap-2 rounded-full bg-slate-100/90 px-3 py-1 text-xs text-dark-500 ring-1 ring-slate-200/80">
                      <Link
                        to="/"
                        aria-label={homeLabel}
                        className="inline-flex items-center text-dark-600 hover:text-primary-600 transition-colors"
                      >
                        <Home className="h-3.5 w-3.5" />
                      </Link>
                      {activeSection?.title && (
                        <>
                          <BreadcrumbSeparator className="h-3 w-3 text-slate-400" />
                          <span className="font-semibold text-primary-700">
                            {activeSection.title}
                          </span>
                        </>
                      )}
                      <span className="text-slate-300">•</span>
                      <span className="font-semibold text-dark-600">
                        <span className="text-primary-600 font-bold">
                          {String(activeMemberIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="mx-0.5 text-slate-300">/</span>
                        <span>{String(publishedMembers.length).padStart(2, '0')}</span>
                      </span>
                    </div>

                    {/* Member Full Name */}
                    <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-dark-950 tracking-tight leading-snug text-balance break-words">
                      {activeMember.name}
                    </h2>

                    {/* Official Position Badge */}
                    <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary-50/90 px-3.5 py-1 text-sm sm:text-base font-semibold text-primary-700 ring-1 ring-primary-600/15">
                      <span>{activeMember.position}</span>
                    </div>

                    {/* Subtle brand accent rule */}
                    <div className="mt-3.5 mb-3 h-[2px] w-12 bg-primary-600/80 rounded-full" />

                    {/* Single Concise Summary Line (clamped to max 2 lines) */}
                    {conciseSummary && (
                      <p className="text-sm sm:text-[15px] leading-relaxed text-dark-600 max-w-xl line-clamp-2">
                        {conciseSummary}
                      </p>
                    )}
                  </div>

                  {/* PORTRAIT COLUMN (Left in RTL, Right in LTR) */}
                  <div className="order-1 lg:order-2 lg:col-span-5 flex items-end justify-center lg:-mb-4">
                    <FeaturedMemberPortrait member={activeMember} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
