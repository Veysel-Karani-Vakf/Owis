import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { Cohort, Pioneer } from '@/data/pioneers';
import { useI18n } from '@/i18n/useI18n';
import PioneerPortrait from '@/components/pioneers/PioneerPortrait';

type PioneersAccordionGalleryProps = {
  cohorts?: Cohort[];
  pioneers: Pioneer[];
  ctaLabel?: string;
  className?: string;
};

/**
 * Splits items into balanced horizontal rows of roughly 4-5 cards each,
 * avoiding any awkward single-item orphan rows.
 */
function chunkIntoBalancedRows<T>(items: T[], targetPerRow = 5): T[][] {
  if (!items || items.length === 0) return [];
  const n = items.length;
  if (n <= targetPerRow) return [items];

  const rowCount = Math.ceil(n / targetPerRow);
  const baseSize = Math.floor(n / rowCount);
  const remainder = n % rowCount;

  const rows: T[][] = [];
  let startIndex = 0;

  for (let i = 0; i < rowCount; i++) {
    const size = baseSize + (i < remainder ? 1 : 0);
    rows.push(items.slice(startIndex, startIndex + size));
    startIndex += size;
  }

  return rows;
}

/**
 * Resolves the short display name (First Name + Family Name / Surname) for collapsed cards:
 * 1. Prefers dedicated `shortName` or `displayName` if set in data model (allowing admin override)
 * 2. Otherwise intelligently derives First Name + Family Name without mutating source full name:
 *    - Supports Arabic compound first names ('عبد الله', 'عبد الرحمن', 'أمة الرحمن', 'هبة الرحمن', etc.)
 *    - Supports Arabic compound family names ('آل فلان', 'بن فلان', 'ابن فلان', 'أبو فلان', 'با فلان', etc.)
 *    - Supports Latin compound surnames ('Bin', 'Al-', 'El-')
 *    - Never modifies, shortens, or overwrites original full name in data source
 */
export function getPioneerShortName(pioneer: Pioneer, isRtl: boolean = true): string {
  if (pioneer.shortName && pioneer.shortName.trim()) {
    return pioneer.shortName.trim();
  }
  if (pioneer.displayName && pioneer.displayName.trim()) {
    return pioneer.displayName.trim();
  }

  const fullName = pioneer.name;
  if (!fullName) return '';
  const trimmed = fullName.trim();
  const tokens = trimmed.split(/\s+/);
  if (tokens.length <= 2) return trimmed;

  if (isRtl) {
    // Compound Arabic first names (e.g., عبد الله, عبد الرحمن, أمة الرحمن, هبة الرحمن)
    let firstCount = 1;
    const compoundFirst = ['عبد', 'أمة', 'امة', 'هبة', 'سيف', 'نور', 'صلاح', 'علاء', 'ضياء', 'جمال', 'بدر'];
    if (compoundFirst.includes(tokens[0]) && tokens.length > 2) {
      if (['الدين', 'الإسلام', 'الهدى'].includes(tokens[1]) || ['عبد', 'أمة', 'امة', 'هبة'].includes(tokens[0])) {
        firstCount = 2;
      }
    }
    const firstName = tokens.slice(0, firstCount).join(' ');

    const remaining = tokens.slice(firstCount);
    if (remaining.length === 1) {
      return `${firstName} ${remaining[0]}`;
    }

    const rLen = remaining.length;
    let lastNameTokens = [remaining[rLen - 1]];

    // Support compound family names: 'بن فلان', 'آل فلان', 'ابن فلان', 'أبو فلان', 'با فلان', 'ذو فلان'
    if (rLen >= 3 && remaining[rLen - 3] === 'بن') {
      lastNameTokens = remaining.slice(rLen - 3);
    } else if (rLen >= 2 && ['بن', 'ابن', 'آل', 'ال', 'أبو', 'ابو', 'با', 'ذو'].includes(remaining[rLen - 2])) {
      lastNameTokens = remaining.slice(rLen - 2);
    }

    return `${firstName} ${lastNameTokens.join(' ')}`;
  } else {
    // Latin / English / Turkish
    const firstName = tokens[0];
    const len = tokens.length;
    if (len >= 4 && tokens[len - 3].toLowerCase() === 'bin') {
      return `${firstName} ${tokens.slice(len - 3).join(' ')}`;
    }
    if (len >= 3 && ['bin', 'al-', 'el-', 'aal', 'ibn', 'ben'].some((p) => tokens[len - 2].toLowerCase().startsWith(p))) {
      return `${firstName} ${tokens[len - 2]} ${tokens[len - 1]}`;
    }
    return `${firstName} ${tokens[len - 1]}`;
  }
}

/**
 * Extracts clean specialization text from major or role
 */
function getPioneerSpecialization(p: Pioneer): string {
  if (p.major && p.major.trim()) return p.major.trim();
  if (p.role) {
    const parts = p.role.split('—');
    return (parts[1] || parts[0]).trim();
  }
  return '';
}

/**
 * Extracts clean city text from city, origin, or university
 */
function getPioneerCity(p: Pioneer): string {
  if (p.city && p.city.trim()) return p.city.trim();
  if (p.origin && p.origin.trim()) return p.origin.trim();
  if (p.university && p.university.includes('—')) {
    const parts = p.university.split('—');
    return parts[parts.length - 1].trim();
  }
  return '';
}

export default function PioneersAccordionGallery({
  cohorts,
  pioneers,
  ctaLabel = 'عرض السيرة الذاتية',
  className = '',
}: PioneersAccordionGalleryProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const cohortParam = searchParams.get('cohort');
  const shouldReduceMotion = useReducedMotion();
  const { isRtl, locale } = useI18n();
  const navigate = useNavigate();

  // 1. Available cohorts fallback
  const availableCohorts = useMemo(() => {
    if (cohorts && cohorts.length > 0) return cohorts;
    const map = new Map<string, Cohort>();
    pioneers.forEach((p) => {
      if (p.cohortId && !map.has(p.cohortId)) {
        map.set(p.cohortId, {
          id: p.cohortId,
          title: p.cohortName || p.cohortId,
          shortTitle: p.cohortName || p.cohortId,
          year: '',
          order: map.size + 1,
        });
      }
    });
    return Array.from(map.values());
  }, [cohorts, pioneers]);

  // 2. Selected cohort state
  const [selectedCohortId, setSelectedCohortId] = useState<string>(() => {
    if (cohortParam && availableCohorts.some((c) => c.id === cohortParam)) {
      return cohortParam;
    }
    return availableCohorts[0]?.id || '';
  });

  // Ensure selected cohort remains valid when cohorts change (e.g. locale change)
  useEffect(() => {
    if (availableCohorts.length > 0 && !availableCohorts.some((c) => c.id === selectedCohortId)) {
      setSelectedCohortId(availableCohorts[0].id);
    }
  }, [availableCohorts, selectedCohortId]);

  // Count pioneers in each cohort for badges
  const cohortCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    pioneers.forEach((p) => {
      if (p.cohortId) {
        counts[p.cohortId] = (counts[p.cohortId] || 0) + 1;
      }
    });
    return counts;
  }, [pioneers]);

  // Filter all pioneers for the selected cohort
  const cohortPioneers = useMemo(() => {
    const portraitsFirst = (items: Pioneer[]) =>
      [...items].sort((a, b) => {
        const portraitDifference = Number(b.hasPortrait !== false) - Number(a.hasPortrait !== false);
        return portraitDifference || a.order - b.order;
      });

    if (!selectedCohortId) return portraitsFirst(pioneers);
    const filtered = pioneers.filter((p) => p.cohortId === selectedCohortId);
    return portraitsFirst(filtered);
  }, [pioneers, selectedCohortId]);

  // 3. SINGLE GLOBALLY CONTROLLED ACTIVE PIONEER STATE ACROSS ALL ROWS
  // The first pioneer in the cohort is expanded by default.
  const [activePioneerId, setActivePioneerId] = useState<string>(() => {
    const first = cohortPioneers[0];
    return first ? (first.id || first.slug) : '';
  });

  // Whenever cohort changes, automatically reset active pioneer to the first pioneer of that cohort
  useEffect(() => {
    const first = cohortPioneers[0];
    if (first) {
      setActivePioneerId(first.id || first.slug);
    }
  }, [selectedCohortId, cohortPioneers]);

  // Break cohort pioneers into balanced horizontal rows of 4-5 portraits
  const rows = useMemo(() => {
    return chunkIntoBalancedRows(cohortPioneers, 5);
  }, [cohortPioneers]);

  // Touch device detection
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };
    checkTouch();
  }, []);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleSelectCohort = (cohortId: string) => {
    if (cohortId === selectedCohortId) return;
    setSelectedCohortId(cohortId);
    setSearchParams({ cohort: cohortId }, { replace: true });
  };

  const handleCardInteraction = useCallback(
    (pioneerKey: string, isExplicitClick = false) => {
      if (activePioneerId === pioneerKey && isExplicitClick) {
        // Tapping already active card on mobile/touch navigates to bio
        return;
      }
      setActivePioneerId(pioneerKey);
    },
    [activePioneerId]
  );

  const handleKeyDown = (event: React.KeyboardEvent, currentPioneer: Pioneer) => {
    const currentKey = currentPioneer.id || currentPioneer.slug;
    const flatIndex = cohortPioneers.findIndex(
      (p) => (p.id || p.slug) === currentKey
    );

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = isRtl
        ? Math.max(0, flatIndex - 1)
        : Math.min(cohortPioneers.length - 1, flatIndex + 1);
      const nextPioneer = cohortPioneers[nextIndex];
      if (nextPioneer) {
        const nextKey = nextPioneer.id || nextPioneer.slug;
        setActivePioneerId(nextKey);
        cardElementsRef.current.get(nextKey)?.focus();
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex = isRtl
        ? Math.min(cohortPioneers.length - 1, flatIndex + 1)
        : Math.max(0, flatIndex - 1);
      const prevPioneer = cohortPioneers[prevIndex];
      if (prevPioneer) {
        const prevKey = prevPioneer.id || prevPioneer.slug;
        setActivePioneerId(prevKey);
        cardElementsRef.current.get(prevKey)?.focus();
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (currentKey === activePioneerId) {
        navigate(`/programs/yemen-pioneers/pioneers/${currentPioneer.slug}`);
      } else {
        setActivePioneerId(currentKey);
      }
    }
  };

  // Determine row container max width based on cards per row
  const maxRowLength = Math.max(...rows.map((r) => r.length), 4);
  const containerMaxWidth =
    maxRowLength <= 3 ? 'max-w-3xl' : maxRowLength === 4 ? 'max-w-4xl' : 'max-w-5xl';

  return (
    <div className="w-full">
      {/* 1. Elegant Cohort Selection Tabs */}
      {availableCohorts.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div
            role="tablist"
            aria-label="اختيار دفعة رواد اليمن"
            className="no-scrollbar flex items-center justify-start gap-2 overflow-x-auto px-2 py-1 sm:justify-center"
          >
            {availableCohorts.map((cohort) => {
              const isSelected = cohort.id === selectedCohortId;
              const count = cohortCounts[cohort.id] || 0;

              return (
                <button
                  key={cohort.id}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelectCohort(cohort.id)}
                  className={`group relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${
                    isSelected
                      ? 'bg-primary-700 text-white shadow-lg shadow-primary-700/25 ring-2 ring-primary-500/20'
                      : 'bg-white text-dark-700 hover:bg-slate-50 hover:text-primary-700 ring-1 ring-slate-200/80 shadow-xs'
                  }`}
                >
                  <span>{cohort.title}</span>
                  {count > 0 && (
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-dark-500 group-hover:bg-primary-50 group-hover:text-primary-700'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Multi-Row Gallery Container with Smooth Cohort Cross-Fade */}
      {cohortPioneers.length === 0 && (
        <p role="status" className="py-12 text-center text-dark-500">
          {locale === 'ar'
            ? 'لا يوجد رواد منشورون في هذه الدفعة حالياً.'
            : locale === 'tr'
              ? 'Bu kafilede henüz yayımlanan öncü yok.'
              : 'There are currently no published pioneers in this cohort.'}
        </p>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={`cohort-gallery-${selectedCohortId}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3 sm:gap-4 md:gap-5 w-full"
        >
          {rows.map((row, rowIndex) => {
            const hasActiveCardInThisRow = row.some(
              (p) => (p.id || p.slug) === activePioneerId
            );
            const rowCardCount = row.length;
            const activeFlex = rowCardCount <= 3 ? '2.8 1 0%' : '3.2 1 0%';

            return (
              <div
                key={`row-${selectedCohortId}-${rowIndex}`}
                role="region"
                aria-label={`صف رواد اليمن ${rowIndex + 1}`}
                className={`relative mx-auto flex h-[340px] w-full ${containerMaxWidth} items-stretch gap-2 overflow-hidden p-1.5 sm:h-[360px] sm:gap-2.5 sm:p-2 md:h-[380px] md:gap-3 lg:h-[400px] ${className}`}
              >
                {row.map((pioneer) => {
                  const pioneerKey = pioneer.id || pioneer.slug;
                  const isActive = pioneerKey === activePioneerId;
                  const shortName = getPioneerShortName(pioneer, isRtl);
                  const specialization = getPioneerSpecialization(pioneer);
                  const city = getPioneerCity(pioneer);

                  return (
                    <div
                      key={pioneerKey}
                      ref={(el) => {
                        if (el) cardElementsRef.current.set(pioneerKey, el);
                        else cardElementsRef.current.delete(pioneerKey);
                      }}
                      role="tab"
                      aria-selected={isActive}
                      aria-expanded={isActive}
                      tabIndex={0}
                      onMouseEnter={() => {
                        if (!isTouchDevice) {
                          handleCardInteraction(pioneerKey);
                        }
                      }}
                      onClick={() => handleCardInteraction(pioneerKey, true)}
                      onKeyDown={(e) => handleKeyDown(e, pioneer)}
                      style={{
                        // If this row has the active card, the active card expands and others collapse.
                        // If this row has NO active card, all cards remain collapsed and share the row evenly!
                        flex: hasActiveCardInThisRow
                          ? isActive
                            ? activeFlex
                            : '1 1 0%'
                          : '1 1 0%',
                        transition: shouldReduceMotion
                          ? 'none'
                          : 'flex 550ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 550ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 550ms cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                      className={`group relative h-full cursor-pointer select-none overflow-hidden outline-none will-change-[flex,border-radius] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                        isActive
                          ? 'rounded-[1.75rem] sm:rounded-[2rem] md:rounded-[2.25rem] shadow-[0_16px_40px_rgba(0,0,0,0.3)] z-10 ring-1 ring-white/20'
                          : 'rounded-full hover:rounded-[2rem] shadow-md z-0 opacity-90 hover:opacity-100 hover:ring-1 hover:ring-white/30'
                      }`}
                    >
                      {/* Background Portrait Image */}
                      <div className="absolute inset-0 h-full w-full overflow-hidden bg-dark-900">
                        <PioneerPortrait
                          image={pioneer.image}
                          name={pioneer.name}
                          hasPortrait={pioneer.hasPortrait}
                          imagePosition={pioneer.imagePosition}
                          loading="lazy"
                          className={`h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform ${
                            isActive
                              ? 'scale-[1.03]'
                              : 'scale-100 group-hover:scale-105'
                          }`}
                        />

                        {/* Collapsed subtle tint overlay */}
                        <div
                          className={`absolute inset-0 transition-opacity duration-500 ${
                            isActive
                              ? 'opacity-0 pointer-events-none'
                              : 'bg-dark-950/20 group-hover:bg-dark-950/10'
                          }`}
                        />

                        {/* Collapsed Card Bottom Gradient for 3-Line Text Legibility (Lower 48% only, face stays clear above) */}
                        <div
                          className={`absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-dark-950/95 via-dark-950/65 via-50% to-transparent transition-opacity duration-500 ${
                            isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                          }`}
                        />

                        {/* Active Card Bottom Dark Gradient for High Readability */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 via-40% to-transparent transition-opacity duration-500 ${
                            isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                          }`}
                        />
                      </div>

                      {/* 3-Line Information Overlay on Collapsed Portrait Cards (Always visible by default without hovering) */}
                      <AnimatePresence>
                        {!isActive && (
                          <motion.div
                            key={`collapsed-info-${pioneerKey}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end px-1 pb-2.5 text-center sm:px-2 sm:pb-3.5 md:px-2.5 md:pb-4"
                          >
                            {/* Line 1: First Name + Family Name (الاسم واللقب) */}
                            <h4
                              title={pioneer.name}
                              className="w-full truncate font-brand text-[11px] font-bold leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] sm:text-xs md:text-sm"
                            >
                              {shortName}
                            </h4>

                            {/* Line 2: Specialization (التخصص) */}
                            {specialization && (
                              <p
                                title={specialization}
                                className="mt-0.5 w-full truncate text-[9px] font-medium leading-tight text-gold-200/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-[11px]"
                              >
                                {specialization}
                              </p>
                            )}

                            {/* Line 3: City (المدينة) */}
                            {city && (
                              <p
                                title={city}
                                className="mt-0.5 w-full truncate text-[8.5px] font-normal leading-tight text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-[10px]"
                              >
                                {city}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Expanded Card Details (Only rendered for the ONE active card across the whole gallery) */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            key={`content-${pioneerKey}`}
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                            transition={{
                              duration: 0.35,
                              delay: 0.1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-4 text-start sm:p-5 md:p-6"
                          >
                            {/* Pioneer Name */}
                            <motion.h3
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.32, delay: 0.14 }}
                              className="font-brand text-lg font-bold tracking-tight text-white drop-shadow-md sm:text-xl md:text-2xl"
                            >
                              {pioneer.name}
                            </motion.h3>

                            {/* Role / Position */}
                            <motion.p
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.32, delay: 0.19 }}
                              className="mt-0.5 text-xs font-semibold text-gold-300 drop-shadow-sm sm:text-xs md:text-sm"
                            >
                              {pioneer.role}
                              {city ? ` • ${city}` : ''}
                            </motion.p>

                            {/* Short Description */}
                            {pioneer.shortIntro && (
                              <motion.p
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.32, delay: 0.24 }}
                                className="mt-2 line-clamp-2 max-w-xl text-xs leading-relaxed text-white/90 drop-shadow md:text-sm"
                              >
                                {pioneer.shortIntro}
                              </motion.p>
                            )}

                            {/* View Biography Call to Action */}
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.32, delay: 0.29 }}
                              className="mt-3 sm:mt-3.5"
                            >
                              <Link
                                to={`/programs/yemen-pioneers/pioneers/${pioneer.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="btn-border-run btn-border-run--light group/btn inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-primary-700 sm:px-4 sm:py-2"
                              >
                                <span>{ctaLabel}</span>
                                <ArrowIcon
                                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                                    isRtl
                                      ? 'group-hover/btn:-translate-x-1'
                                      : 'group-hover/btn:translate-x-1'
                                  }`}
                                />
                              </Link>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* 3. Subtle Cohort Statistics Summary Badge (No pagination) */}
      <div className="mt-6 flex justify-center sm:mt-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/90 px-4 py-1.5 text-xs font-semibold text-dark-600 shadow-2xs">
          <span>
            {locale === 'ar'
              ? `إجمالي رواد هذه الدفعة: ${cohortPioneers.length} رائد ورائدة`
              : locale === 'tr'
              ? `Bu dönem toplamı: ${cohortPioneers.length} Öncü`
              : `Total Pioneers in this Cohort: ${cohortPioneers.length}`}
          </span>
        </div>
      </div>
    </div>
  );
}
