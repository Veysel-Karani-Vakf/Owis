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

function isLeaderRole(member: AdministrativeMember, roleLabel: string): boolean {
  if (member.level === 1 && member.order === 1) return true;
  return /^(رئيس|نائب رئيس|Head of|Chair|Chairman|President|.*Başkanı)/i.test(
    roleLabel.trim(),
  );
}

/**
 * Authentic Yemeni Qamariya Arch Watermark (القمرية اليمنية المعمارية).
 * Features a semicircular Yemeni arch with radiating stained-glass fan ribs and a slowly rotating center rosette.
 */
function YemeniQamariyaWatermark({
  className = '',
  reverse = false,
  shouldReduceMotion = false,
}: {
  className?: string;
  reverse?: boolean;
  shouldReduceMotion?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      {/* Warm sunlight glow filtering through the Qamariya */}
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [0.95, 1.08, 0.95],
                opacity: [0.5, 0.85, 0.5],
              }
        }
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-8 rounded-full bg-primary-500/[0.04] blur-3xl"
      />

      <svg
        viewBox="0 0 280 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full text-primary-700/[0.075]"
      >
        {/* Outer Yemeni Semicircular Qamariya Arch Frame (عقد القمرية الخارجي المزخرف) */}
        <path
          d="M 16 168 A 124 124 0 0 1 264 168 Z"
          stroke="currentColor"
          strokeWidth="1.75"
          fill="currentColor"
          fillOpacity="0.06"
        />
        {/* Stepped Yajour / Gypsum outer trim */}
        <path
          d="M 8 168 A 132 132 0 0 1 272 168"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        <path
          d="M 26 168 A 114 114 0 0 1 254 168"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.7"
        />
        {/* Inner Arch Rings */}
        <path
          d="M 52 168 A 88 88 0 0 1 228 168"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeDasharray="2 4"
        />
        <path
          d="M 82 168 A 58 58 0 0 1 198 168"
          stroke="currentColor"
          strokeWidth="1.1"
        />

        {/* Radiating Yemeni Qamariya Stained-Glass Fan Ribs (أشعة وعقود القمرية) */}
        <motion.g
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: [0.45, 0.95, 0.45],
                }
          }
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          stroke="currentColor"
          strokeWidth="0.95"
        >
          {/* 30°, 60°, 90°, 120°, 150° fan rays from center (140, 168) */}
          <line x1="140" y1="168" x2="33" y2="106" />
          <line x1="140" y1="168" x2="78" y2="61" />
          <line x1="140" y1="168" x2="140" y2="44" />
          <line x1="140" y1="168" x2="202" y2="61" />
          <line x1="140" y1="168" x2="247" y2="106" />
          {/* Secondary intermediate rays */}
          <line x1="140" y1="168" x2="52" y2="80" strokeDasharray="3 4" />
          <line x1="140" y1="168" x2="108" y2="48" strokeDasharray="3 4" />
          <line x1="140" y1="168" x2="172" y2="48" strokeDasharray="3 4" />
          <line x1="140" y1="168" x2="228" y2="80" strokeDasharray="3 4" />
        </motion.g>

        {/* Decorative Diamond Window Panes along the Qamariya Rim */}
        <circle cx="52" cy="80" r="3" fill="currentColor" fillOpacity="0.45" />
        <circle cx="108" cy="48" r="3" fill="currentColor" fillOpacity="0.45" />
        <circle cx="140" cy="44" r="3.5" fill="currentColor" fillOpacity="0.6" />
        <circle cx="172" cy="48" r="3" fill="currentColor" fillOpacity="0.45" />
        <circle cx="228" cy="80" r="3" fill="currentColor" fillOpacity="0.45" />

        {/* Base Sill of the Qamariya (عتبة القمرية المزخرفة) */}
        <line
          x1="4"
          y1="168"
          x2="276"
          y2="168"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="20"
          y1="174"
          x2="260"
          y2="174"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="6 4"
        />

        {/* Slowly Rotating Yemeni Star Medallion inside the Qamariya Heart */}
        <motion.g
          animate={
            shouldReduceMotion ? undefined : { rotate: reverse ? -360 : 360 }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 48, repeat: Infinity, ease: 'linear' }
          }
          style={{ transformOrigin: '140px 132px' }}
        >
          <rect
            x="122"
            y="114"
            width="36"
            height="36"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="currentColor"
            fillOpacity="0.12"
          />
          <rect
            x="122"
            y="114"
            width="36"
            height="36"
            rx="2"
            transform="rotate(45 140 132)"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="currentColor"
            fillOpacity="0.12"
          />
          <circle
            cx="140"
            cy="132"
            r="9"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="140" cy="132" r="2.5" fill="currentColor" />
        </motion.g>
      </svg>
    </div>
  );
}

/**
 * Option 5 + Yemeni Heritage: Flowing Yemeni Terraces, Ribbons & Qamariya Arches.
 * Combines the flowing crimson silk ribbons with Yemeni Qamariya arches and a drifting Yajour geometric frieze.
 */
function WaqfFlowingRibbonsBackdrop({
  shouldReduceMotion = false,
}: {
  shouldReduceMotion?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-primary-50/[0.18] select-none"
    >
      {/* 1. Top Drifting Yemeni Yajour / Gypsum Frieze Band (إفريز الآجر والجص اليمني) */}
      <div className="absolute inset-x-0 top-0 h-5 overflow-hidden opacity-60 [mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
        <motion.div
          animate={shouldReduceMotion ? undefined : { x: [0, -48] }}
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 16, repeat: Infinity, ease: 'linear' }
          }
          className="flex h-full w-[calc(100%+96px)]"
        >
          <svg
            className="h-full w-full text-primary-700/[0.12]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="yemeni-yajour-frieze"
                width="48"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                {/* Yemeni Chevron / Zigzag Brick Motif */}
                <path
                  d="M 0 14 L 12 4 L 24 14 L 36 4 L 48 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                {/* Diamond gypsum dots */}
                <circle cx="12" cy="14" r="1.5" fill="currentColor" />
                <circle cx="36" cy="14" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#yemeni-yajour-frieze)" />
          </svg>
        </motion.div>
      </div>

      {/* 2. Yemeni Qamariya Arch Watermarks in Top & Bottom Corners */}
      <YemeniQamariyaWatermark
        shouldReduceMotion={shouldReduceMotion}
        className="absolute -start-12 top-4 h-[210px] w-[320px] sm:-start-8 sm:top-6 sm:h-[260px] sm:w-[400px] opacity-95"
      />
      <YemeniQamariyaWatermark
        reverse
        shouldReduceMotion={shouldReduceMotion}
        className="absolute -end-12 bottom-0 h-[230px] w-[350px] sm:-end-8 sm:h-[290px] sm:w-[440px] opacity-90"
      />

      {/* 3. Flowing Yemeni Mountain Terraces & Silk Ribbons */}
      <svg
        viewBox="0 0 1440 700"
        fill="none"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="waqf-ribbon-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#da0812" stopOpacity="0" />
            <stop offset="35%" stopColor="#da0812" stopOpacity="0.085" />
            <stop offset="65%" stopColor="#9c1006" stopOpacity="0.115" />
            <stop offset="100%" stopColor="#da0812" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="waqf-ribbon-grad-2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#e30513" stopOpacity="0" />
            <stop offset="50%" stopColor="#da0812" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#e30513" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Terrace Horizon 1 (Primary Silk Wave) */}
        <motion.path
          d="M -100 180 C 320 60, 720 310, 1540 140"
          stroke="url(#waqf-ribbon-grad-1)"
          strokeWidth="2"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  d: [
                    'M -100 180 C 320 60, 720 310, 1540 140',
                    'M -100 140 C 380 280, 780 70, 1540 200',
                    'M -100 180 C 320 60, 720 310, 1540 140',
                  ],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Parallel Yemeni Terrace Echo Line 1 */}
        <motion.path
          d="M -100 202 C 320 82, 720 332, 1540 162"
          stroke="url(#waqf-ribbon-grad-2)"
          strokeWidth="1"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  d: [
                    'M -100 202 C 320 82, 720 332, 1540 162',
                    'M -100 162 C 380 302, 780 92, 1540 222',
                    'M -100 202 C 320 82, 720 332, 1540 162',
                  ],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Terrace Horizon 2 (Dashed Yemeni Caravan / Heritage Trail) */}
        <motion.path
          d="M -100 360 C 420 480, 920 220, 1540 390"
          stroke="url(#waqf-ribbon-grad-2)"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  strokeDashoffset: [0, -160],
                }
          }
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        />

        {/* Terrace Horizon 3 */}
        <motion.path
          d="M -100 540 C 480 400, 960 640, 1540 490"
          stroke="url(#waqf-ribbon-grad-1)"
          strokeWidth="1.75"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  d: [
                    'M -100 540 C 480 400, 960 640, 1540 490',
                    'M -100 490 C 440 620, 920 410, 1540 550',
                    'M -100 540 C 480 400, 960 640, 1540 490',
                  ],
                }
          }
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Parallel Yemeni Terrace Echo Line 3 */}
        <motion.path
          d="M -100 562 C 480 422, 960 662, 1540 512"
          stroke="url(#waqf-ribbon-grad-2)"
          strokeWidth="0.95"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  d: [
                    'M -100 562 C 480 422, 960 662, 1540 512',
                    'M -100 512 C 440 642, 920 432, 1540 572',
                    'M -100 562 C 480 422, 960 662, 1540 512',
                  ],
                }
          }
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
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
  const [slideDirection, setSlideDirection] = useState<number>(0);

  // Sync activeSectionId if URL hash targets a section or if sections reload from CMS
  useEffect(() => {
    const rawHash = location.hash.replace(/^#/, '').replace(/^cms-structure-/, '');
    if (rawHash) {
      const matched = publishedSections.find(
        (s) => s.slug === rawHash || s.id === rawHash,
      );
      if (matched) {
        const nextKey = matched.id || matched.slug;
        if (nextKey !== activeSectionId) {
          const prevIdx = publishedSections.findIndex(
            (s) => (s.id || s.slug) === activeSectionId,
          );
          const nextIdx = publishedSections.findIndex(
            (s) => (s.id || s.slug) === nextKey,
          );
          if (prevIdx !== -1 && nextIdx !== -1) {
            setSlideDirection(nextIdx > prevIdx ? 1 : -1);
          }
          setActiveSectionId(nextKey);
        }
        return;
      }
    }

    const stillExists = publishedSections.some(
      (s) => (s.id || s.slug) === activeSectionId,
    );
    if (!stillExists && publishedSections.length > 0) {
      setSlideDirection(0);
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

  const handleSelectSection = useCallback(
    (section: OrganizationalSection) => {
      const nextKey = section.id || section.slug;
      if (nextKey === activeSectionId) return;

      const prevIdx = publishedSections.findIndex(
        (s) => (s.id || s.slug) === activeSectionId,
      );
      const nextIdx = publishedSections.findIndex(
        (s) => (s.id || s.slug) === nextKey,
      );
      const nextDirection =
        prevIdx !== -1 && nextIdx !== -1 ? (nextIdx > prevIdx ? 1 : -1) : 1;

      setSlideDirection(nextDirection);
      setActiveSectionId(nextKey);
    },
    [activeSectionId, publishedSections],
  );

  // In RTL, higher tab index is to the left (-x); in LTR, higher tab index is to the right (+x)
  const dirMultiplier = isRtl ? -1 : 1;

  const panelVariants = useMemo(
    () => ({
      enter: (dir: number) =>
        shouldReduceMotion
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : {
              opacity: 0,
              x: dir === 0 ? 0 : dir * dirMultiplier * 48,
              y: dir === 0 ? 14 : 0,
              scale: 0.99,
            },
      center: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      },
      exit: (dir: number) =>
        shouldReduceMotion
          ? { opacity: 0, x: 0, y: 0, scale: 1 }
          : {
              opacity: 0,
              x: dir === 0 ? 0 : -dir * dirMultiplier * 36,
              y: dir === 0 ? -10 : 0,
              scale: 0.99,
            },
    }),
    [dirMultiplier, shouldReduceMotion],
  );

  const emptyNotice =
    locale === 'ar'
      ? 'يتم تحديث واعتماد قائمة أعضاء هذه الهيئة رسمياً وفق اللوائح المعتمدة لوقف أويس القرني.'
      : locale === 'tr'
      ? 'Bu heyetin üye listesi, Veysel Karani Vakfı onaylı yönetmelikleri doğrultusunda güncellenmektedir.'
      : 'The official member roster for this body is currently being updated in accordance with foundation regulations.';

  const activeKey = activeSection?.id || activeSection?.slug || 'default';

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
        className="relative isolate w-full overflow-hidden bg-white py-10 sm:py-12 lg:py-14"
      >
        {/* Option 5: Flowing Waqf Architectural Ribbons Backdrop */}
        <WaqfFlowingRibbonsBackdrop
          shouldReduceMotion={Boolean(shouldReduceMotion)}
        />

        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={`section-panel-${activeKey}`}
            custom={slideDirection}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : { duration: 0.36, ease: smoothEase }
            }
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
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 sm:gap-y-10 sm:gap-x-7 lg:grid-cols-3 lg:gap-x-8">
                  {publishedMembers.map((member, index) => {
                    const roleLabel = resolveMemberRoleLabel(
                      member.position,
                      activeSection?.title,
                    );
                    const isLeader = isLeaderRole(member, roleLabel);

                    return (
                      <motion.article
                        key={member.id}
                        initial={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : {
                                opacity: 0,
                                x:
                                  slideDirection === 0
                                    ? 0
                                    : slideDirection * dirMultiplier * 20,
                                y: 16,
                              }
                        }
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0.01 }
                            : {
                                duration: 0.42,
                                delay: index * 0.045,
                                ease: smoothEase,
                              }
                        }
                        className="group relative flex flex-col items-center select-none"
                      >
                        {/* Portrait Box with Brand Frame Depth (Option 3 + Option 5 Leader Highlight) */}
                        <div className="relative w-full">
                          {/* Offset Brand Identity Frame behind portrait */}
                          <div
                            aria-hidden="true"
                            className={`pointer-events-none absolute inset-0 rounded-[1.5rem] border transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:border-primary-600/35 rtl:group-hover:-translate-x-2 ${
                              isLeader
                                ? 'translate-x-1.5 -translate-y-1.5 border-primary-600/25 rtl:-translate-x-1.5'
                                : 'border-primary-600/0'
                            }`}
                          />

                          {/* Main Rounded Portrait Image Container */}
                          <div
                            className={`relative h-[340px] sm:h-[360px] md:h-[380px] w-full overflow-hidden rounded-[1.5rem] bg-slate-100 shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:ring-primary-600/30 group-hover:shadow-[0_24px_48px_-12px_rgba(156,16,6,0.22)] ${
                              isLeader
                                ? 'ring-2 ring-primary-600/20 shadow-[0_16px_36px_-12px_rgba(156,16,6,0.16)]'
                                : 'ring-1 ring-slate-900/[0.06]'
                            }`}
                          >
                            <FeaturedMemberPortrait
                              member={member}
                              loading={index < 3 ? 'eager' : 'lazy'}
                              className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform scale-100 group-hover:scale-105"
                            />

                            {/* Warm Crimson-Dark Bottom Vignette for 3D contrast behind the white box */}
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-primary-950/65 via-primary-950/20 to-transparent opacity-45 transition-opacity duration-500 ease-out group-hover:opacity-90"
                            />

                            {/* Subtle Inner Rim Highlight */}
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-2.5 rounded-[1.15rem] border border-white/0 transition-colors duration-500 ease-out group-hover:border-white/25"
                            />
                          </div>
                        </div>

                        {/* Overlapping White Info Box with Brand Hover Micro-Interaction (Option 2 + Option 5 Leader Highlight) */}
                        <div
                          className={`relative z-10 -mt-14 w-[86%] overflow-hidden rounded-2xl bg-white px-4 py-4 sm:px-5 sm:py-5 text-center shadow-[0_12px_32px_-6px_rgba(15,23,42,0.10)] transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:bg-[#fffdfd] group-hover:ring-primary-600/25 group-hover:shadow-[0_22px_44px_-8px_rgba(218,8,18,0.14),0_8px_20px_-6px_rgba(15,23,42,0.08)] ${
                            isLeader
                              ? 'ring-1 ring-primary-600/20'
                              : 'ring-1 ring-slate-900/[0.06]'
                          }`}
                        >
                          {/* Brand Crimson Top Accent Line (persistently visible at 45% width for leader, expands to 100% on hover) */}
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute inset-x-6 top-0 z-10 h-[3px] origin-center rounded-b-full bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                              isLeader ? 'scale-x-50' : 'scale-x-0'
                            }`}
                          />

                          {/* Diagonal Brand Sheen Sweep */}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-y-10 -start-1/2 z-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-primary-500/[0.09] to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[420%] group-hover:opacity-100 rtl:group-hover:-translate-x-[420%]"
                          />

                          {/* Member Full Name */}
                          <h3 className="relative z-10 font-brand text-base sm:text-lg md:text-[19px] font-bold tracking-tight text-dark-950 leading-snug transition-colors duration-300 group-hover:text-primary-950">
                            {member.name}
                          </h3>

                          {/* Official Role / Position Only (e.g. عضو هيئة المتولين) */}
                          {roleLabel && (
                            <p
                              className={`relative z-10 mt-1.5 inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium leading-normal transition-colors duration-300 group-hover:text-primary-700 ${
                                isLeader ? 'text-primary-700' : 'text-slate-500'
                              }`}
                            >
                              <span
                                aria-hidden="true"
                                className={`h-1.5 w-1.5 rounded-full bg-primary-600 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 ${
                                  isLeader
                                    ? 'scale-100 opacity-100'
                                    : 'scale-0 opacity-0'
                                }`}
                              />
                              <span>{roleLabel}</span>
                            </p>
                          )}
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


