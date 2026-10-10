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

  // Resolve biography paragraphs without duplicating identical text
  const bioParagraphs = useMemo(() => {
    if (!activeMember) return [];
    const list: string[] = [];
    const shortText = activeMember.shortDescription?.trim() || '';
    const fullText = activeMember.biography?.trim() || '';

    if (shortText) {
      list.push(shortText);
    }
    if (fullText && fullText !== shortText) {
      const splitFull = fullText
        .split(/\n+/)
        .map((p) => p.trim())
        .filter((p) => p && p !== shortText);
      list.push(...splitFull);
    }
    return list;
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

      {/* 2. Main Editorial Leadership Showcase Stage */}
      <div
        id={activeSection ? `org-section-panel-${activeSection.slug}` : undefined}
        role="tabpanel"
        onMouseEnter={() => setIsStageHovered(true)}
        onMouseLeave={() => setIsStageHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative isolate w-full bg-gradient-to-b from-[#f4f6f8] via-[#eef2f5] to-[#e7ecef]"
      >
        {/* Subtle diagonal contour texture inspired by the Amber Aviation reference background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(125deg, rgba(148, 163, 184, 0.08) 0px, rgba(148, 163, 184, 0.08) 1px, transparent 1px, transparent 18px)',
          }}
        />

        {/* Soft studio radial glow on the portrait side */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 -z-10 w-full lg:w-2/3 ${
            isRtl ? 'left-0' : 'right-0'
          } bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.85)_0%,rgba(218,8,18,0.035)_45%,transparent_75%)]`}
        />

        {publishedMembers.length === 0 || !activeMember ? (
          /* Empty Section State */
          <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24 text-center">
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
          <>
            {/* Featured Member Stage Container */}
            <div className="relative mx-auto max-w-7xl px-4 pt-3 pb-4 sm:px-12 sm:pt-4 lg:px-20 lg:pt-4 lg:pb-0">
              {/* Previous Member Arrow (Start edge: Right in RTL, Left in LTR) */}
              {publishedMembers.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevMember}
                  aria-label={prevLabel}
                  title={prevLabel}
                  className="group absolute start-2 sm:start-4 lg:start-6 top-[165px] sm:top-[195px] lg:top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/70 lg:bg-transparent text-dark-700 hover:bg-white hover:text-primary-600 shadow-sm lg:shadow-none ring-1 ring-slate-200/80 lg:ring-0 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 cursor-pointer"
                >
                  <span
                    className={`transition-transform duration-200 ${
                      isRtl
                        ? 'group-hover:translate-x-1'
                        : 'group-hover:-translate-x-1'
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
                  className="group absolute end-2 sm:end-4 lg:end-6 top-[165px] sm:top-[195px] lg:top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/70 lg:bg-transparent text-dark-700 hover:bg-white hover:text-primary-600 shadow-sm lg:shadow-none ring-1 ring-slate-200/80 lg:ring-0 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 cursor-pointer"
                >
                  <span
                    className={`transition-transform duration-200 ${
                      isRtl
                        ? 'group-hover:-translate-x-1'
                        : 'group-hover:translate-x-1'
                    }`}
                  >
                    <EditorialArrow direction={isRtl ? 'left' : 'right'} />
                  </span>
                </button>
              )}

              {/* Main Grid:
                  Desktop (lg+):
                  - Text Column is order-1 (58% width): Placed on RIGHT in Arabic RTL, LEFT in Turkish/English LTR.
                  - Portrait Column is order-2 (42% width): Placed on LEFT in Arabic RTL, RIGHT in Turkish/English LTR.
                  Mobile (< lg):
                  - Portrait Column is order-1 (prominent at top).
                  - Text Column is order-2 (readable details below portrait).
              */}
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
                      : { duration: 0.4, ease: smoothEase }
                  }
                  className="grid grid-cols-1 lg:grid-cols-12 items-center lg:items-end gap-5 sm:gap-6 lg:gap-10"
                >
                  {/* TEXT COLUMN (58% width on desktop -> 7 of 12 cols) */}
                  <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center text-start lg:pb-6 lg:pt-2">
                    {/* Editorial Breadcrumb & Section Context Line inside the text column (saves ~55px vertical space so portrait starts immediately under tabs) */}
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-dark-500">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to="/"
                          aria-label={homeLabel}
                          className="inline-flex items-center text-dark-700 hover:text-primary-600 transition-colors"
                        >
                          <Home className="h-3.5 w-3.5" />
                        </Link>
                        <BreadcrumbSeparator className="h-3 w-3 text-slate-400" />
                        <span className="text-dark-500">{pageTitle}</span>
                        {activeSection?.title && (
                          <>
                            <BreadcrumbSeparator className="h-3 w-3 text-slate-400" />
                            <span className="font-semibold text-primary-700">
                              {activeSection.title}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Member counter pill */}
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-dark-600 ring-1 ring-slate-200/80">
                        <span className="text-primary-600 font-bold">
                          {String(activeMemberIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="text-slate-300">/</span>
                        <span>{String(publishedMembers.length).padStart(2, '0')}</span>
                      </div>
                    </div>

                    {/* Optional Section Description Subtitle */}
                    {activeSection?.description && (
                      <motion.p
                        initial={shouldReduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mb-2.5 text-xs sm:text-[13px] leading-relaxed text-dark-400 max-w-xl line-clamp-2"
                      >
                        {activeSection.description}
                      </motion.p>
                    )}

                    {/* Featured Member Full Name */}
                    <motion.h2
                      initial={
                        shouldReduceMotion ? false : { opacity: 0, y: 10 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0.01 : 0.38,
                        delay: shouldReduceMotion ? 0 : 0.03,
                        ease: smoothEase,
                      }}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-dark-950 tracking-tight leading-[1.18] text-balance break-words"
                    >
                      {activeMember.name}
                    </motion.h2>

                    {/* Featured Member Official Position */}
                    <motion.p
                      initial={
                        shouldReduceMotion ? false : { opacity: 0, y: 8 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0.01 : 0.38,
                        delay: shouldReduceMotion ? 0 : 0.08,
                        ease: smoothEase,
                      }}
                      className="mt-2 sm:mt-2.5 text-base sm:text-lg md:text-[20px] font-normal text-dark-600 leading-snug"
                    >
                      {activeMember.position}
                    </motion.p>

                    {/* Subtle brand accent rule */}
                    <motion.div
                      initial={
                        shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }
                      }
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{
                        duration: shouldReduceMotion ? 0.01 : 0.36,
                        delay: shouldReduceMotion ? 0 : 0.12,
                        ease: smoothEase,
                      }}
                      style={{ transformOrigin: isRtl ? 'right' : 'left' }}
                      className="mt-3.5 mb-4 h-[2px] w-14 bg-primary-600/80 rounded-full"
                    />

                    {/* Biography & Introduction Paragraphs */}
                    {bioParagraphs.length > 0 && (
                      <motion.div
                        initial={
                          shouldReduceMotion ? false : { opacity: 0, y: 10 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: shouldReduceMotion ? 0.01 : 0.4,
                          delay: shouldReduceMotion ? 0 : 0.14,
                          ease: smoothEase,
                        }}
                        className="space-y-2.5 max-w-2xl"
                      >
                        {bioParagraphs.map((paragraph, pIdx) => (
                          <p
                            key={pIdx}
                            className={`text-sm sm:text-[15px] leading-[1.75] ${
                              pIdx === 0 && bioParagraphs.length > 1
                                ? 'text-dark-800 font-medium'
                                : 'text-dark-600'
                            }`}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* PORTRAIT COLUMN (42% width on desktop -> 5 of 12 cols) */}
                  <div className="order-1 lg:order-2 lg:col-span-5 flex items-end justify-center lg:-mb-3">
                    <FeaturedMemberPortrait member={activeMember} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 3. Horizontal Bottom Thumbnail Navigation Strip */}
            <MemberThumbnailNavigation
              members={publishedMembers}
              activeMemberId={activeMember.id}
              onSelectMember={handleSelectMember}
              onInteractionChange={setIsThumbInteracting}
              autoplayPaused={isAutoplayPaused}
              autoplayIntervalMs={AUTOPLAY_INTERVAL_MS}
            />
          </>
        )}
      </div>
    </div>
  );
}
