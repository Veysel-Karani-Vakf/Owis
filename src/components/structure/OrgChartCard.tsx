import React from 'react';
import type { AdministrativeMember } from '@/data/about';
import MemberPortrait from './MemberPortrait';
import { useI18n } from '@/i18n/useI18n';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type OrgChartCardProps = {
  member: AdministrativeMember;
  onSelect: (member: AdministrativeMember) => void;
  className?: string;
};

export default function OrgChartCard({ member, onSelect, className = '' }: OrgChartCardProps) {
  const { isRtl, locale } = useI18n();

  // Distinct sizing according to level hierarchy
  const isLevel1 = member.level === 1;
  const isLevel2 = member.level === 2;
  const isLevel3 = member.level === 3;

  const cardWidthClass = isLevel1
    ? 'w-full max-w-[470px]'
    : isLevel2
    ? 'w-full max-w-[440px]'
    : 'w-full max-w-[370px]';

  const portraitSizeClass = isLevel1
    ? 'w-24 h-24 sm:w-28 sm:h-28'
    : isLevel2
    ? 'w-20 h-20 sm:w-24 sm:h-24'
    : 'w-20 h-20 sm:w-22 sm:h-22';

  const titleSizeClass = isLevel1
    ? 'text-lg sm:text-xl'
    : isLevel2
    ? 'text-base sm:text-lg'
    : 'text-base sm:text-[17px]';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(member);
    }
  };

  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;
  const detailsHint = locale === 'ar' ? 'عرض السيرة' : locale === 'tr' ? 'Profili Gör' : 'View Profile';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(member)}
      onKeyDown={handleKeyDown}
      aria-label={`${member.name} - ${member.position}`}
      className={`group relative flex items-stretch overflow-hidden rounded-2xl bg-white border border-slate-200/90 text-start transition-all duration-300 ease-out cursor-pointer select-none hover:-translate-y-1.5 hover:border-primary-400/80 shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_36px_rgba(218,8,18,0.12),0_4px_12px_rgba(15,23,42,0.06)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 ${cardWidthClass} ${className}`}
    >
      {/* Decorative Brand Accent Stripe (matches reference image red bar) */}
      <div
        className="w-2 sm:w-2.5 shrink-0 bg-primary-600 transition-colors duration-300 group-hover:bg-primary-500"
        aria-hidden="true"
      />

      {/* Main Card Body */}
      <div className="flex flex-1 items-center gap-3 sm:gap-4 p-3.5 sm:p-4">
        {/* Member Portrait */}
        <div
          className={`relative ${portraitSizeClass} shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm`}
        >
          <MemberPortrait
            name={member.name}
            image={member.image}
            imagePosition={member.imagePosition}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Pointer indicator triangle (matches the pointer from the reference template) */}
        <div
          className={`hidden sm:flex shrink-0 items-center text-primary-600 transition-transform duration-300 group-hover:scale-125 ${
            isRtl ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <svg className="h-4 w-2.5 fill-current" viewBox="0 0 10 16">
            <polygon points="0,0 10,8 0,16" />
          </svg>
        </div>

        {/* Member Details */}
        <div className="flex flex-1 min-w-0 flex-col justify-center">
          {/* Level / Department Tag */}
          <div className="mb-0.5">
            <span
              className={`inline-block font-semibold uppercase tracking-wider text-primary-600 ${
                isLevel1 ? 'text-[11px] sm:text-xs' : 'text-[10px] sm:text-[11px]'
              }`}
            >
              {member.position}
            </span>
          </div>

          {/* Member Name */}
          <h3
            className={`font-bold text-dark-900 leading-snug break-words transition-colors duration-200 group-hover:text-primary-600 ${titleSizeClass}`}
          >
            {member.name}
          </h3>

          {/* Short description */}
          <p className="mt-1 line-clamp-2 text-xs sm:text-[13px] leading-relaxed text-dark-500">
            {member.shortDescription}
          </p>

          {/* Subtle click cue on hover */}
          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-slate-400 group-hover:text-primary-600 transition-colors">
            <span>{detailsHint}</span>
            <ArrowIcon className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

