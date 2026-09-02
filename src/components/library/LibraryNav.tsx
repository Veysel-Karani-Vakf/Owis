import { motion, useReducedMotion } from 'framer-motion';
import { Clapperboard, LayoutGrid } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getLibraryContent, getLibraryCounts, libraryRoutes, type LibraryCollectionSlug } from '@/data/library';
import { getLibraryProfileContent, libraryProfileRoute } from '@/data/library/profile';
import { useI18n } from '@/i18n/useI18n';
import { librarySectionIcons, librarySectionOrder } from './librarySections';

export type LibraryNavActive = LibraryCollectionSlug | 'gallery' | 'index' | 'profile';

/* ------------------------------------------------------------------ */
/* Floating pill (mobile / tablet, and pages without a sidebar)        */
/* ------------------------------------------------------------------ */

/** Hides on scroll-down, shows on scroll-up (after a small threshold). */
function useHideOnScroll(threshold = 12) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < threshold) return;
      setHidden(delta > 0 && y > 240);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return hidden;
}

type LibraryPillNavProps = {
  active: LibraryNavActive;
  /** Only render below the `xl` breakpoint (when a sidebar takes over). */
  mobileOnly?: boolean;
};

export function LibraryPillNav({ active, mobileOnly = false }: LibraryPillNavProps) {
  const { locale } = useI18n();
  const content = getLibraryContent(locale);
  const location = useLocation();
  const activeRef = useRef<HTMLAnchorElement>(null);
  const hidden = useHideOnScroll();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: 'auto',
    });
  }, [location.pathname]);

  const entries: {
    key: LibraryNavActive;
    label: string;
    href: string;
    Icon: typeof LayoutGrid;
  }[] = [
    {
      key: 'index',
      label: content.labels.library,
      href: libraryRoutes.index,
      Icon: LayoutGrid,
    },
    {
      key: 'profile',
      label: getLibraryProfileContent(locale).meta.shortTitle,
      href: libraryProfileRoute,
      Icon: Clapperboard,
    },
    ...librarySectionOrder.map((slug) => ({
      key: slug as LibraryNavActive,
      label: content.collections[slug].shortTitle,
      href: content.collections[slug].route,
      Icon: librarySectionIcons[slug],
    })),
  ];

  return (
    <div
      className={`pointer-events-none sticky top-[84px] z-30 flex justify-center px-3 transition-transform duration-300 ease-out md:top-[108px] xl:top-[120px] ${
        mobileOnly ? 'xl:hidden' : ''
      } ${hidden ? '-translate-y-[150%]' : 'translate-y-0'}`}
    >
      <nav
        aria-label={content.labels.sectionsNav}
        className="pointer-events-auto max-w-full rounded-full border border-white/70 bg-white/85 p-1.5 shadow-[0_14px_40px_rgba(40,12,18,0.14)] backdrop-blur-xl"
      >
        <ul className="no-scrollbar flex max-w-full items-center gap-0.5 overflow-x-auto text-sm font-bold">
          {entries.map(({ key, label, href, Icon }) => {
            const isActive = key === active;
            return (
              <li key={key} className="relative shrink-0">
                <Link
                  ref={isActive ? activeRef : undefined}
                  to={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`btn-border-run relative z-10 inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-3.5 transition-colors ${
                    isActive ? 'btn-border-run--light text-white' : 'btn-border-run--sheen-tint text-dark-600 hover:text-primary-700'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
                {isActive && (
                  <motion.span
                    layoutId="library-pill-indicator"
                    transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                    className="absolute inset-0 rounded-full bg-primary-600 shadow-[0_8px_18px_rgba(195,7,16,0.28)]"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar (desktop ≥ xl)                                              */
/* ------------------------------------------------------------------ */

export function LibrarySidebarNav({ active }: { active: LibraryNavActive }) {
  const { locale } = useI18n();
  const content = getLibraryContent(locale);
  const profile = getLibraryProfileContent(locale);
  const counts = getLibraryCounts(locale);

  return (
    <nav
      aria-label={content.labels.sectionsNav}
      className="rounded-[24px] border border-primary-100 bg-white p-3 shadow-[0_14px_36px_rgba(40,12,18,0.06)]"
    >
      <Link
        to={libraryRoutes.index}
        aria-current={active === 'index' ? 'page' : undefined}
        className={`btn-border-run flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors ${
          active === 'index' ? 'bg-primary-600 text-white' : 'btn-border-run--sheen-tint text-dark-900 hover:bg-primary-50 hover:text-primary-700'
        }`}
      >
        <LayoutGrid className="h-4 w-4" aria-hidden="true" />
        {content.labels.library}
      </Link>
      <Link
        to={libraryProfileRoute}
        aria-current={active === 'profile' ? 'page' : undefined}
        className={`btn-border-run mt-1 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors ${
          active === 'profile'
            ? 'bg-primary-600 text-white'
            : 'btn-border-run--sheen-tint text-dark-900 hover:bg-primary-50 hover:text-primary-700'
        }`}
      >
        <Clapperboard className="h-4 w-4" aria-hidden="true" />
        {profile.meta.shortTitle}
      </Link>
      <p className="mb-1 mt-3 px-3 text-[11px] font-bold uppercase tracking-wide text-dark-400">
        {content.labels.allSections}
      </p>
      <ul className="grid gap-0.5">
        {librarySectionOrder.map((slug) => {
          const Icon = librarySectionIcons[slug];
          const collection = content.collections[slug];
          const isActive = slug === active;
          return (
            <li key={slug}>
              <Link
                to={collection.route}
                aria-current={isActive ? 'page' : undefined}
                className={`btn-border-run group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-[0_10px_24px_rgba(195,7,16,0.24)]'
                    : 'btn-border-run--sheen-tint text-dark-700 hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isActive ? 'bg-white/15' : 'bg-primary-50 text-primary-700 group-hover:bg-white'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 truncate">{collection.shortTitle}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-warm text-dark-500 group-hover:bg-white'
                  }`}
                >
                  {counts[slug]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Layout: sidebar + filters on desktop, pill + filters above on small */
/* ------------------------------------------------------------------ */

type LibraryLayoutProps = {
  active: LibraryNavActive;
  /** Section heading; sits above the filters on small screens and at the top of the content column on xl. */
  heading?: ReactNode;
  /** Page-specific filters (search, chips, view toggle). Rendered in the sidebar on xl, above content otherwise. */
  filters?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Section background utility class. */
  background?: string;
};

export function LibraryLayout({
  active,
  heading,
  filters,
  children,
  className = '',
  background = 'bg-[#faf8f8]',
}: LibraryLayoutProps) {
  return (
    <>
      <LibraryPillNav active={active} mobileOnly />
      <section className={`${background} py-10 md:py-14 ${className}`}>
        <div className="mx-auto max-w-7xl px-4 md:px-8 xl:grid xl:grid-cols-[264px_minmax(0,1fr)] xl:grid-rows-[auto_1fr] xl:items-start xl:gap-x-8">
          {heading && <div className="mb-6 xl:col-start-2 xl:row-start-1">{heading}</div>}
          <aside className="mb-6 xl:sticky xl:top-[132px] xl:col-start-1 xl:row-span-2 xl:row-start-1 xl:mb-0 xl:max-h-[calc(100vh-150px)] xl:overflow-y-auto xl:pb-2 xl:[scrollbar-width:thin]">
            <div className="hidden xl:block">
              <LibrarySidebarNav active={active} />
            </div>
            {filters && <div className="xl:mt-4">{filters}</div>}
          </aside>
          <div className="min-w-0 xl:col-start-2 xl:row-start-2">{children}</div>
        </div>
      </section>
    </>
  );
}
