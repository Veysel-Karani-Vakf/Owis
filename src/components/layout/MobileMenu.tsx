import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAboutContent } from '@/data/about';
import { donateRoute } from '@/data/donate';
import { getLibraryContent } from '@/data/library';
import { getParticipateContent } from '@/data/participate';
import { getProgramsContent } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

type MobileMenuProps = {
  onClose: () => void;
  onNavClick: (href: string) => void;
};

export default function MobileMenu({ onClose, onNavClick }: MobileMenuProps) {
  const { content, t, isRtl, locale } = useI18n();
  const { navLinks, siteConfig } = content;
  const aboutNavItems = getAboutContent(locale).nav;
  const programNavItems = getProgramsContent(locale).nav;
  const participateNavItems = getParticipateContent(locale).nav;
  const libraryContent = getLibraryContent(locale);
  const libraryNavItems = libraryContent.nav;
  const location = useLocation();
  const [aboutOpen, setAboutOpen] = useState(location.pathname.startsWith('/about/'));
  const [programsOpen, setProgramsOpen] = useState(location.pathname.startsWith('/programs/'));
  const [participateOpen, setParticipateOpen] = useState(location.pathname.startsWith('/participate'));
  const [libraryOpen, setLibraryOpen] = useState(location.pathname.startsWith('/library'));
  const [activeLibraryGroup, setActiveLibraryGroup] = useState<string | null>(() => {
    const activeGroup = libraryNavItems.find((item) =>
      item.type === 'group' ? item.items.some((child) => location.pathname === child.href) : false
    );

    return activeGroup?.href ?? null;
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const desktopMediaQuery = window.matchMedia('(min-width: 1280px)');
    const handleDesktopViewport = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };

    desktopMediaQuery.addEventListener('change', handleDesktopViewport);

    return () => {
      document.body.style.overflow = '';
      desktopMediaQuery.removeEventListener('change', handleDesktopViewport);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ x: isRtl ? '100%' : '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: isRtl ? '100%' : '-100%' }}
      transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
      id="mobile-navigation"
      className="fixed inset-0 z-[200] flex flex-col bg-dark-950 xl:hidden"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <img
          src={siteConfig.logo}
          alt={siteConfig.name}
          className="h-10 w-auto brightness-0 invert"
          onError={(event) => {
            const target = event.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />

        <div className="flex items-center gap-2">
          <LanguageSwitcher tone="dark" compact />
          <button
            onClick={onClose}
            aria-label={t('accessibility.closeMenu')}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-4">
        {navLinks.map((link, index) => {
          if (link.href === '#about') {
            const active = location.pathname.startsWith('/about/');

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index + 0.1 }}
              >
                <button
                  type="button"
                  aria-expanded={aboutOpen}
                  aria-controls="mobile-about-menu"
                  onClick={() => {
                    setProgramsOpen(false);
                    setParticipateOpen(false);
                    setLibraryOpen(false);
                    setActiveLibraryGroup(null);
                    setAboutOpen((value) => !value);
                  }}
                  className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-4 py-4 text-start text-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
                    active
                      ? 'bg-primary-600 text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${aboutOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {aboutOpen && (
                    <motion.div
                      id="mobile-about-menu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 grid gap-1 ps-5">
                        {aboutNavItems.map((item) => {
                          const itemActive = location.pathname === item.href;

                          return (
                            <a
                              key={item.href}
                              href={item.href}
                              aria-current={itemActive ? 'page' : undefined}
                              onClick={(event) => {
                                event.preventDefault();
                                onNavClick(item.href);
                              }}
                              className={`flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
                                itemActive
                                  ? 'bg-white text-primary-700'
                                  : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {item.label}
                            </a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }

          if (link.href === '#programs') {
            const active = location.pathname.startsWith('/programs/');

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index + 0.1 }}
              >
                <button
                  type="button"
                  aria-expanded={programsOpen}
                  aria-controls="mobile-programs-menu"
                  onClick={() => {
                    setAboutOpen(false);
                    setParticipateOpen(false);
                    setLibraryOpen(false);
                    setActiveLibraryGroup(null);
                    setProgramsOpen((value) => !value);
                  }}
                  className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-4 py-4 text-start text-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
                    active
                      ? 'bg-primary-600 text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${programsOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {programsOpen && (
                    <motion.div
                      id="mobile-programs-menu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 grid gap-1 ps-5">
                        {programNavItems.map((item) => {
                          const itemActive = location.pathname === item.href;

                          return (
                            <a
                              key={item.href}
                              href={item.href}
                              aria-current={itemActive ? 'page' : undefined}
                              onClick={(event) => {
                                event.preventDefault();
                                onNavClick(item.href);
                              }}
                              className={`flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
                                itemActive
                                  ? 'bg-white text-primary-700'
                                  : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {item.label}
                            </a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }

          if (link.href === '/participate') {
            const active = location.pathname.startsWith('/participate');

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index + 0.1 }}
              >
                <button
                  type="button"
                  aria-expanded={participateOpen}
                  aria-controls="mobile-participate-menu"
                  onClick={() => {
                    setAboutOpen(false);
                    setProgramsOpen(false);
                    setLibraryOpen(false);
                    setActiveLibraryGroup(null);
                    setParticipateOpen((value) => !value);
                  }}
                  className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-4 py-4 text-start text-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
                    active
                      ? 'bg-primary-600 text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${participateOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {participateOpen && (
                    <motion.div
                      id="mobile-participate-menu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 grid gap-1 ps-5">
                        {participateNavItems.map((item) => {
                          const itemActive = location.pathname === item.href;

                          return (
                            <a
                              key={item.href}
                              href={item.href}
                              aria-current={itemActive ? 'page' : undefined}
                              onClick={(event) => {
                                event.preventDefault();
                                onNavClick(item.href);
                              }}
                              className={`flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
                                itemActive
                                  ? 'bg-white text-primary-700'
                                  : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {item.label}
                            </a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }

          if (link.href === '/library') {
            const active = location.pathname.startsWith('/library');

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index + 0.1 }}
              >
                <button
                  type="button"
                  aria-expanded={libraryOpen}
                  aria-controls="mobile-library-menu"
                  onClick={() => {
                    setAboutOpen(false);
                    setProgramsOpen(false);
                    setParticipateOpen(false);
                    setLibraryOpen((value) => !value);
                  }}
                  className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-4 py-4 text-start text-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
                    active
                      ? 'bg-primary-600 text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${libraryOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {libraryOpen && (
                    <motion.div
                      id="mobile-library-menu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 grid gap-1 ps-5">
                        {libraryNavItems.map((item) => {
                          if (item.type === 'link') {
                            const itemActive = location.pathname === item.href;

                            return (
                              <a
                                key={item.href}
                                href={item.href}
                                aria-current={itemActive ? 'page' : undefined}
                                onClick={(event) => {
                                  event.preventDefault();
                                  onNavClick(item.href);
                                }}
                                className={`flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
                                  itemActive
                                    ? 'bg-white text-primary-700'
                                    : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                {item.label}
                              </a>
                            );
                          }

                          const groupActive = item.items.some((child) => location.pathname === child.href);
                          const groupOpen = activeLibraryGroup === item.href;

                          return (
                            <div key={item.href} className="grid gap-1">
                              <button
                                type="button"
                                aria-expanded={groupOpen}
                                aria-controls={`mobile-library-${item.href.replace(/[^a-z0-9]+/gi, '-')}`}
                                onClick={() =>
                                  setActiveLibraryGroup((value) => (value === item.href ? null : item.href))
                                }
                                className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-start text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
                                  groupActive
                                    ? 'bg-white text-primary-700'
                                    : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                <span>{item.label}</span>
                                <ChevronDown
                                  className={`h-5 w-5 shrink-0 transition-transform ${groupOpen ? 'rotate-180' : ''}`}
                                  aria-hidden="true"
                                />
                              </button>

                              <AnimatePresence initial={false}>
                                {groupOpen && (
                                  <motion.div
                                    id={`mobile-library-${item.href.replace(/[^a-z0-9]+/gi, '-')}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                  >
                                    <div className="grid gap-1 ps-4">
                                      {item.items.map((child) => {
                                        const childActive = location.pathname === child.href;

                                        return (
                                          <a
                                            key={child.href}
                                            href={child.href}
                                            aria-current={childActive ? 'page' : undefined}
                                            onClick={(event) => {
                                              event.preventDefault();
                                              onNavClick(child.href);
                                            }}
                                            className={`flex min-h-11 items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
                                              childActive
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-white/5 text-white/65 hover:bg-white/10 hover:text-white'
                                            }`}
                                          >
                                            {child.label}
                                          </a>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }

          const active = link.href.startsWith('/') && location.pathname.startsWith(link.href);

          return (
            <motion.a
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index + 0.1 }}
              onClick={(event) => {
                event.preventDefault();
                onNavClick(link.href);
              }}
              className={`flex min-h-14 items-center justify-between rounded-xl px-4 py-4 text-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
                active ? 'bg-primary-600 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.label}
            </motion.a>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => onNavClick(donateRoute)}
          className="w-full rounded-full bg-primary-500 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-600"
        >
          {t('common.donateNow')}
        </button>
      </div>
    </motion.div>
  );
}
