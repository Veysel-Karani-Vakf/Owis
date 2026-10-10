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
      className="relative z-20 w-full border-t border-white/80 bg-[#e6ebee]/85 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="no-scrollbar flex items-start overflow-x-auto py-3 sm:py-3.5 px-2"
        >
          <div className="mx-auto flex w-full items-start justify-start md:justify-center gap-3 sm:gap-4 md:gap-3 lg:gap-5">
            {members.map((member, index) => {
              const isActive = member.id === activeMemberId;

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
                  aria-label={`${member.name} — ${member.position}`}
                  className="group relative flex w-[112px] sm:w-[126px] md:w-auto md:flex-1 md:min-w-[104px] md:max-w-[148px] shrink-0 md:shrink flex-col items-center text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 rounded-xl cursor-pointer select-none px-1"
                >
                  {/* Fixed-height avatar stage so active scaling never shifts layout */}
                  <div className="relative flex h-[66px] sm:h-[76px] w-full items-center justify-center">
                    <div
                      className={`relative overflow-hidden rounded-full transition-all duration-300 ease-out ${
                        isActive
                          ? 'h-[62px] w-[62px] sm:h-[72px] sm:w-[72px] ring-[2.5px] ring-primary-600 ring-offset-[3px] ring-offset-[#e8ecef] shadow-[0_10px_22px_rgba(218,8,18,0.22)]'
                          : 'h-[50px] w-[50px] sm:h-[58px] sm:w-[58px] ring-1 ring-slate-300/90 opacity-80 group-hover:opacity-100 group-hover:scale-105 group-hover:ring-primary-400 shadow-sm'
                      }`}
                    >
                      <ThumbnailAvatar member={member} isActive={isActive} />
                    </div>
                  </div>

                  {/* Member Name */}
                  <span
                    className={`mt-1.5 line-clamp-1 sm:line-clamp-2 text-xs sm:text-[13px] leading-snug transition-colors duration-200 ${
                      isActive
                        ? 'font-extrabold text-dark-950'
                        : 'font-bold text-dark-800 group-hover:text-primary-600'
                    }`}
                  >
                    {member.name}
                  </span>

                  {/* Member Official Position */}
                  <span
                    className={`mt-0.5 line-clamp-1 text-[11px] sm:text-xs leading-tight transition-colors duration-200 ${
                      isActive
                        ? 'font-semibold text-primary-700'
                        : 'font-normal text-dark-500 group-hover:text-dark-700'
                    }`}
                  >
                    {member.position}
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
