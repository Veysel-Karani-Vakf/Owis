import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { OrganizationalSection } from '@/data/about';
import { useI18n } from '@/i18n/useI18n';

type OrganizationSectionTabsProps = {
  sections: OrganizationalSection[];
  activeSectionId: string;
  onSelectSection: (section: OrganizationalSection) => void;
};

export default function OrganizationSectionTabs({
  sections,
  activeSectionId,
  onSelectSection,
}: OrganizationSectionTabsProps) {
  const { isRtl, locale } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const container = scrollContainerRef.current;
    const activeTab = tabRefs.current[activeSectionId];
    if (!container || !activeTab) return;
    if (container.scrollWidth <= container.clientWidth + 4) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const currentScroll = container.scrollLeft;
    const targetScroll =
      currentScroll +
      (tabRect.left - containerRect.left) -
      containerRect.width / 2 +
      tabRect.width / 2;

    container.scrollTo({
      left: targetScroll,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }, [activeSectionId, shouldReduceMotion]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (sections.length <= 1) return;
    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

    if (e.key === nextKey) {
      e.preventDefault();
      const nextIndex = (index + 1) % sections.length;
      const nextSec = sections[nextIndex];
      onSelectSection(nextSec);
      tabRefs.current[nextSec.id || nextSec.slug]?.focus();
    } else if (e.key === prevKey) {
      e.preventDefault();
      const prevIndex = (index - 1 + sections.length) % sections.length;
      const prevSec = sections[prevIndex];
      onSelectSection(prevSec);
      tabRefs.current[prevSec.id || prevSec.slug]?.focus();
    }
  };

  const navAriaLabel =
    locale === 'ar'
      ? 'الهيئات والمجالس التنظيمية'
      : locale === 'tr'
      ? 'Kurumsal Heyetler ve Kurullar'
      : 'Organizational Bodies and Boards';

  if (sections.length === 0) return null;

  return (
    <div className="relative w-full bg-[#f4f6f8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="relative border-b border-slate-300/85">
          <div
            ref={scrollContainerRef}
            role="tablist"
            aria-label={navAriaLabel}
            className="no-scrollbar flex items-center justify-start md:justify-center gap-1.5 sm:gap-3 md:gap-5 overflow-x-auto py-1.5"
          >
            {sections.map((section, index) => {
              const key = section.id || section.slug;
              const isActive = key === activeSectionId;

              return (
                <button
                  key={key}
                  ref={(el) => {
                    tabRefs.current[key] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`org-section-panel-${section.slug}`}
                  id={`org-section-tab-${section.slug}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onSelectSection(section)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`group relative shrink-0 whitespace-nowrap rounded-xl px-3.5 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base md:text-[16px] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-600 cursor-pointer select-none ${
                    isActive
                      ? 'font-bold text-primary-700'
                      : 'font-medium text-dark-500 hover:bg-white/50 hover:text-dark-900'
                  }`}
                >
                  {/* Animated pill background for active tab */}
                  {isActive && (
                    <motion.span
                      layoutId="org-section-active-pill"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0.01 }
                          : { type: 'spring', stiffness: 380, damping: 32 }
                      }
                      className="absolute inset-0 z-0 rounded-xl bg-white shadow-[0_2px_12px_-3px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.06]"
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    <span>{section.title}</span>
                  </span>

                  {/* Active bottom bar indicator */}
                  {isActive ? (
                    <motion.div
                      layoutId="org-section-active-bar"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0.01 }
                          : { type: 'spring', stiffness: 380, damping: 32 }
                      }
                      className="absolute inset-x-2.5 -bottom-[7px] z-20 h-[3px] rounded-t-full bg-primary-600"
                    />
                  ) : (
                    <span className="absolute inset-x-3 -bottom-[7px] h-[2px] scale-x-0 rounded-t-full bg-slate-400/50 transition-transform duration-200 group-hover:scale-x-100" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
