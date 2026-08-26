import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BreadcrumbItem } from '@/data/about';
import { useI18n } from '@/i18n/useI18n';

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  light?: boolean;
};

export default function Breadcrumbs({ items, light = false }: BreadcrumbsProps) {
  const { isRtl, t } = useI18n();
  const Separator = isRtl ? ChevronLeft : ChevronRight;

  return (
    <nav aria-label={t('accessibility.breadcrumb')} className="overflow-x-auto no-scrollbar">
      <ol className="flex min-h-11 items-center gap-2 whitespace-nowrap text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const textClass = light
            ? isLast
              ? 'text-white'
              : 'text-white/70 hover:text-white'
            : isLast
              ? 'text-dark-900'
              : 'text-dark-500 hover:text-primary-600';

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className={`rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${textClass}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={textClass} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}

              {!isLast && <Separator className={light ? 'h-4 w-4 text-white/35' : 'h-4 w-4 text-dark-300'} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
