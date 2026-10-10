import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { AdministrativeMember } from '@/data/about';
import { getMemberInitials } from './FeaturedMemberPortrait';
import { useI18n } from '@/i18n/useI18n';

type MemberThumbnailNavigationProps = {
  members: AdministrativeMember[];
  activeMemberId: string;
  onSelectMember: (member: AdministrativeMember, index: number) => void;
  onInteractionChange?: (interacting: boolean) => void;
  autoplayPaused?: boolean;
  autoplayIntervalMs?: number;
};

/**
 * Normalizes verbose role titles into concise labels (e.g. "رئيس اللجنة", "عضو", "رئيس الفريق")
 * so neither the top thumbnail strip nor the role badge displays repetitive full sentences.
 */
export function getCompactRoleLabel(rawPosition: string): string {
  const cleaned = (rawPosition || '')
    .trim()
    .replace(/\s+في\s+(وقف أويس القرني|شركة أركان الدولية).*$/u, '')
    .replace(/\s+at\s+(Veysel Karani Waqf|Arkan International).*$/i, '')
    .replace(/^(Veysel Karani Vakfı|Arkan Uluslararası Şirketi)\s+/i, '')
    .trim();

  if (!cleaned) return '';

  // Arabic normalization
  if (/^رئيس لجنة الرقابة/u.test(cleaned)) return 'رئيس لجنة الرقابة';
  if (/^رئيس لجنة/u.test(cleaned)) return 'رئيس اللجنة';
  if (/^رئيس فريق/u.test(cleaned)) return 'رئيس الفريق';
  if (/^رئيس هيئة/u.test(cleaned)) return 'رئيس الهيئة';
  if (/^رئيس مجلس/u.test(cleaned)) return 'رئيس المجلس';
  if (/^نائب رئيس/u.test(cleaned)) return 'نائب الرئيس';
  if (/^عضو\s+(لجنة|فريق|هيئة|مجلس)/u.test(cleaned)) return 'عضو';

  // English normalization
  if (/^(Head|Chair|Chairman) of (the )?Oversight/i.test(cleaned)) return 'Oversight Committee Head';
  if (/^(Head|Chair|Chairman) of (the )?.*Committee/i.test(cleaned)) return 'Committee Head';
  if (/^(Head|Chair|Lead) of (the )?.*Team/i.test(cleaned)) return 'Team Head';
  if (/^(Head|Chair|Chairman) of (the )?.*Board/i.test(cleaned)) return 'Board Chair';
  if (/^Member of (the )?/i.test(cleaned)) return 'Member';

  // Turkish normalization
  if (/Denetim.*Komitesi Başkanı$/i.test(cleaned)) return 'Denetim Komitesi Başkanı';
  if (/Komitesi Başkanı$/i.test(cleaned)) return 'Komite Başkanı';
  if (/Ekibi Başkanı$/i.test(cleaned)) return 'Ekip Başkanı';
  if (/Heyeti Başkanı$/i.test(cleaned)) return 'Heyet Başkanı';
  if (/Kurulu Başkanı$/i.test(cleaned)) return 'Kurul Başkanı';
  if (/(Komitesi|Ekibi|Heyeti|Kurulu) Üyesi$/i.test(cleaned)) return 'Üye';

  return cleaned;
}

function ThumbnailAvatar({
  member,
  isActive,
}: {
  member: AdministrativeMember;
  isActive: boolean;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [member.image]);

  const hasImage = Boolean(member.image && member.image.trim() !== '' && !failed);
  const initials = getMemberInitials(member.name);

  if (!hasImage) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center rounded-full transition-colors duration-300 ${
          isActive
            ? 'bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white'
            : 'bg-gradient-to-br from-slate-200 via-slate-100 to-white text-dark-700 group-hover:from-primary-50 group-hover:to-white group-hover:text-primary-700'
        }`}
      >
        <span className="font-brand text-sm sm:text-base font-bold tracking-wide">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={member.image}
      alt={member.name}
      loading="lazy"
      style={{ objectPosition: member.imagePosition || 'center 18%' }}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
    />
  );
}

export default function MemberThumbnailNavigation({
  members,
  activeMemberId,
  onSelectMember,
  onInteractionChange,
  autoplayPaused = false,
  autoplayIntervalMs = 5000,
}: MemberThumbnailNavigationProps) {
  const { isRtl, locale } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const container = scrollRef.current;
    const activeEl = itemRefs.current[activeMemberId];
    if (!container || !activeEl) return;
    if (container.scrollWidth <= container.clientWidth + 4) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();
    const deltaX =
      itemRect.left +
      itemRect.width / 2 -
      (containerRect.left + containerRect.width / 2);

    container.scrollBy({
      left: deltaX,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }, [activeMemberId, shouldReduceMotion]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (members.length <= 1) return;
    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

    if (e.key === nextKey) {
      e.preventDefault();
      const nextIndex = (index + 1) % members.length;
      const nextMember = members[nextIndex];
      onSelectMember(nextMember, nextIndex);
      itemRefs.current[nextMember.id]?.focus();
    } else if (e.key === prevKey) {
      e.preventDefault();
      const prevIndex = (index - 1 + members.length) % members.length;
      const prevMember = members[prevIndex];
      onSelectMember(prevMember, prevIndex);
      itemRefs.current[prevMember.id]?.focus();
    }
  };

  const navLabel =
    locale === 'ar'
      ? 'اختيار عضو الهيئة'
      : locale === 'tr'
      ? 'Heyet üyesi seçimi'
      : 'Select team member';

  if (members.length === 0) return null;

  return (
    <div
      role="region"
      aria-label={navLabel}
      onMouseEnter={() => onInteractionChange?.(true)}
      onMouseLeave={() => onInteractionChange?.(false)}
      onFocusCapture={() => onInteractionChange?.(true)}
      onBlurCapture={() => onInteractionChange?.(false)}
      onTouchStart={() => onInteractionChange?.(true)}
      onTouchEnd={() => onInteractionChange?.(false)}
      className="relative z-20 w-full border-b border-slate-200/85 bg-white/85 backdrop-blur-md shadow-[0_4px_20px_-12px_rgba(15,23,42,0.06)]"
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="no-scrollbar flex items-start overflow-x-auto py-3 sm:py-3.5 px-2"
        >
          <div className="mx-auto flex w-full items-start justify-start md:justify-center gap-3 sm:gap-5 md:gap-6 lg:gap-8">
            {members.map((member, index) => {
              const isActive = member.id === activeMemberId;
              const compactRole = getCompactRoleLabel(member.position);

              return (
                <button
                  key={member.id}
                  ref={(el) => {
                    itemRefs.current[member.id] = el;
                  }}
                  type="button"
                  onClick={() => onSelectMember(member, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`${member.name} — ${compactRole}`}
                  title={`${member.name} — ${compactRole}`}
                  className="group relative flex w-[104px] sm:w-[120px] md:w-auto md:min-w-[108px] md:max-w-[150px] shrink-0 md:shrink flex-col items-center text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 rounded-xl cursor-pointer select-none px-1.5 py-0.5"
                >
                  {/* Fixed-height avatar stage so active scaling never shifts layout */}
                  <div className="relative flex h-[60px] sm:h-[68px] w-full items-center justify-center">
                    <div
                      className={`relative overflow-hidden rounded-full transition-all duration-300 ease-out ${
                        isActive
                          ? 'h-[56px] w-[56px] sm:h-[64px] sm:w-[64px] ring-[2.5px] ring-primary-600 ring-offset-[3px] ring-offset-white shadow-[0_8px_20px_rgba(218,8,18,0.22)]'
                          : 'h-[46px] w-[46px] sm:h-[52px] sm:w-[52px] ring-1 ring-slate-300/90 opacity-80 group-hover:opacity-100 group-hover:scale-105 group-hover:ring-primary-400 shadow-xs'
                      }`}
                    >
                      <ThumbnailAvatar member={member} isActive={isActive} />
                    </div>
                  </div>

                  {/* Member Official Position (Role) */}
                  <span
                    className={`mt-1.5 line-clamp-1 text-xs sm:text-[13px] leading-snug transition-colors duration-200 ${
                      isActive
                        ? 'font-bold text-primary-700'
                        : 'font-medium text-dark-600 group-hover:text-dark-950'
                    }`}
                  >
                    {compactRole}
                  </span>

                  {/* Animated Active Selection Bar with 5s Autoplay Progress */}
                  <div className="mt-1.5 flex h-1 w-full items-center justify-center">
                    {isActive && (
                      <motion.div
                        layoutId="org-member-active-thumb-indicator"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0.01 }
                            : { type: 'spring', stiffness: 400, damping: 32 }
                        }
                        className="relative h-[3px] w-8 overflow-hidden rounded-full bg-primary-600/25"
                      >
                        {!shouldReduceMotion && members.length > 1 && !autoplayPaused ? (
                          <motion.div
                            key={`progress-${member.id}`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: autoplayIntervalMs / 1000,
                              ease: 'linear',
                            }}
                            style={{ transformOrigin: isRtl ? 'right' : 'left' }}
                            className="h-full w-full bg-primary-600"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary-600" />
                        )}
                      </motion.div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
