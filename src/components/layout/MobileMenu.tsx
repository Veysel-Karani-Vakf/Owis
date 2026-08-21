import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAboutContent } from '@/data/about';
import { donateRoute } from '@/data/donate';
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
  const location = useLocation();
  const [aboutOpen, setAboutOpen] = useState(location.pathname.startsWith('/about/'));
  const [programsOpen, setProgramsOpen] = useState(location.pathname.startsWith('/programs/'));

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const desktopMediaQuery = window.matchMedia('(min-width: 1280px)');
    const handleDesktopViewport = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    const handleLegacyDesktopViewport = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) onClose();
    };

    if (typeof desktopMediaQuery.addEventListener === 'function') {
      desktopMediaQuery.addEventListener('change', handleDesktopViewport);
    } else {
      desktopMediaQuery.addListener(handleLegacyDesktopViewport);
    }

    return () => {
      document.body.style.overflow = '';
      if (typeof desktopMediaQuery.removeEventListener === 'function') {
        desktopMediaQuery.removeEventListener('change', handleDesktopViewport);
      } else {
        desktopMediaQuery.removeListener(handleLegacyDesktopViewport);
      }
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
                    setProgramsOpen(false);                    setAboutOpen((value) => !value);
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
                    setAboutOpen(false);                    setProgramsOpen((value) => !value);
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
