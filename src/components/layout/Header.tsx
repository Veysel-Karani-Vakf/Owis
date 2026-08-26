import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useScrolled } from '@/hooks/useScrolled';
import { useI18n } from '@/i18n/useI18n';
import { getAboutContent } from '@/data/about';
import { donateRoute } from '@/data/donate';
import { getProgramsContent } from '@/data/programs';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import MobileMenu from './MobileMenu';
import { navMenuFor } from '@/i18n/content';

export default function Header() {
  const scrolled = useScrolled(60);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const { content, t, locale } = useI18n();
  const { siteConfig } = content;
  const navLinks = content.navLinks ?? [];
  const donateUrl = siteConfig.donateUrl || donateRoute;
  const aboutNavItems = getAboutContent(locale).nav;
  const programNavItems = getProgramsContent(locale).nav;
  const location = useLocation();
  const navigate = useNavigate();
  const aboutMenuRef = useRef<HTMLDivElement>(null);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);
  const aboutItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const programsMenuRef = useRef<HTMLDivElement>(null);
  const programsButtonRef = useRef<HTMLButtonElement>(null);
  const programsItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const aboutCloseTimerRef = useRef<number | null>(null);
  const programsCloseTimerRef = useRef<number | null>(null);
  const isAboutRoute = location.pathname.startsWith('/about/');
  const isProgramsRoute = location.pathname.startsWith('/programs/');

  const clearAboutCloseTimer = () => {
    if (aboutCloseTimerRef.current) {
      window.clearTimeout(aboutCloseTimerRef.current);
      aboutCloseTimerRef.current = null;
    }
  };

  const clearProgramsCloseTimer = () => {
    if (programsCloseTimerRef.current) {
      window.clearTimeout(programsCloseTimerRef.current);
      programsCloseTimerRef.current = null;
    }
  };

  const scheduleAboutClose = () => {
    clearAboutCloseTimer();
    aboutCloseTimerRef.current = window.setTimeout(() => setAboutOpen(false), 140);
  };

  const scheduleProgramsClose = () => {
    clearProgramsCloseTimer();
    programsCloseTimerRef.current = window.setTimeout(() => setProgramsOpen(false), 140);
  };

  const focusAboutItem = (index: number) => {
    const nextIndex = (index + aboutNavItems.length) % aboutNavItems.length;
    aboutItemRefs.current[nextIndex]?.focus();
  };

  const focusProgramItem = (index: number) => {
    const nextIndex = (index + programNavItems.length) % programNavItems.length;
    programsItemRefs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    return () => {
      clearAboutCloseTimer();
      clearProgramsCloseTimer();
    };
  }, []);

  useEffect(() => {
    if (!aboutOpen && !programsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (aboutOpen && !aboutMenuRef.current?.contains(target)) {
        setAboutOpen(false);
      }

      if (programsOpen && !programsMenuRef.current?.contains(target)) {
        setProgramsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      const activeElement = document.activeElement;
      const aboutHasFocus = activeElement instanceof Node && aboutMenuRef.current?.contains(activeElement);
      const programsHasFocus = activeElement instanceof Node && programsMenuRef.current?.contains(activeElement);

      if (aboutOpen) {
        setAboutOpen(false);
        if (aboutHasFocus) aboutButtonRef.current?.focus();
      }

      if (programsOpen) {
        setProgramsOpen(false);
        if (programsHasFocus) programsButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [aboutOpen, programsOpen]);

  useEffect(() => {
    setAboutOpen(false);
    setProgramsOpen(false);
  }, [location.pathname, location.hash]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setAboutOpen(false);
    setProgramsOpen(false);

    if (href.startsWith('/')) {
      navigate(href);
      return;
    }

    if (!href.startsWith('#')) {
      // A full URL typed by the editor (e.g. an external payment page).
      if (href) window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (location.pathname !== '/') {
      navigate({ pathname: '/', hash: href });
      return;
    }

    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItemClass = (active = false) =>
    `whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 2xl:px-3 ${
      active
        ? scrolled
          ? 'bg-primary-50 text-primary-700'
          : 'bg-white/15 text-white drop-shadow-[0_1px_7px_rgba(0,0,0,0.7)]'
        : scrolled
          ? 'text-dark-700 hover:bg-primary-50 hover:text-primary-700'
          : 'text-white drop-shadow-[0_1px_7px_rgba(0,0,0,0.7)] hover:bg-white/10'
    }`;

  return (
    <>
      <motion.header
        initial={{ y: -120 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 1.05, ease: 'easeOut' }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-4 md:px-8 md:pt-5 xl:px-16 xl:pt-8 2xl:px-20"
      >
        <div
          className={`pointer-events-auto mx-auto flex h-16 w-full max-w-[1712px] items-center justify-between rounded-[18px] border px-3 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 sm:px-5 md:h-20 md:rounded-[22px] md:px-7 ${
            scrolled
              ? 'border-white/55 bg-white/[0.60] shadow-[0_12px_32px_rgba(20,0,4,0.14)] backdrop-blur-lg'
              : 'border-transparent bg-transparent shadow-none backdrop-blur-none'
          }`}
        >
          <a
            href="#hero"
            onClick={(event) => {
              event.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex shrink-0 items-center gap-2"
          >
            <img
              src={siteConfig.logo}
              alt={siteConfig.name}
              className={`h-9 w-auto transition-all duration-300 hover:scale-[1.02] sm:h-10 md:h-12 ${
                scrolled ? '' : 'brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]'
              }`}
              onError={(event) => {
                const target = event.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <span
              className="hidden items-center rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-bold text-white"
              style={{ display: 'none' }}
            >
              {siteConfig.name}
            </span>
          </a>

          <nav className="hidden items-center gap-0.5 xl:flex 2xl:gap-1">
            {navLinks.map((link, index) => {
              const menu = navMenuFor(link);
              const linkKey = `${link.href}-${index}`;

              if (menu === 'about') {
                return (
                  <div
                    key={linkKey}
                    ref={aboutMenuRef}
                    className="relative"
                    onMouseEnter={() => {
                      clearAboutCloseTimer();
                      setProgramsOpen(false);
                      setAboutOpen(true);
                    }}
                    onMouseLeave={scheduleAboutClose}
                  >
                    <button
                      ref={aboutButtonRef}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={aboutOpen}
                      onClick={() => {
                        clearAboutCloseTimer();
                        setProgramsOpen(false);
                        setAboutOpen((value) => !value);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                          event.preventDefault();
                          setProgramsOpen(false);
                          setAboutOpen(true);
                          window.requestAnimationFrame(() => {
                            focusAboutItem(event.key === 'ArrowDown' ? 0 : aboutNavItems.length - 1);
                          });
                        }
                      }}
                      className={`${navItemClass(isAboutRoute)} inline-flex items-center gap-1.5`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence>
                      {aboutOpen && (
                        <motion.div
                          role="menu"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          style={{ insetInlineStart: 0 }}
                          className="absolute top-full z-[180] mt-2 w-[230px] rounded-2xl border border-white/10 bg-dark-950/95 p-2 text-white shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-md"
                          onMouseEnter={clearAboutCloseTimer}
                          onMouseLeave={scheduleAboutClose}
                        >
                          {aboutNavItems.map((item, index) => {
                            const active = location.pathname === item.href;

                            return (
                              <Link
                                key={item.href}
                                ref={(element) => {
                                  aboutItemRefs.current[index] = element;
                                }}
                                role="menuitem"
                                aria-current={active ? 'page' : undefined}
                                to={item.href}
                                onClick={() => setAboutOpen(false)}
                                onKeyDown={(event) => {
                                  if (event.key === 'ArrowDown') {
                                    event.preventDefault();
                                    focusAboutItem(index + 1);
                                  }

                                  if (event.key === 'ArrowUp') {
                                    event.preventDefault();
                                    focusAboutItem(index - 1);
                                  }

                                  if (event.key === 'Home') {
                                    event.preventDefault();
                                    focusAboutItem(0);
                                  }

                                  if (event.key === 'End') {
                                    event.preventDefault();
                                    focusAboutItem(aboutNavItems.length - 1);
                                  }
                                }}
                                className={`relative flex min-h-11 items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                                  active
                                    ? 'bg-primary-600 text-white'
                                    : 'text-white/80 hover:bg-primary-600/20 hover:text-white'
                                }`}
                              >
                                {active && (
                                  <span className="absolute inset-y-2 start-1 w-1 rounded-full bg-gold-300" />
                                )}
                                <span className="ps-2">{item.label}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              if (menu === 'programs') {
                return (
                  <div
                    key={linkKey}
                    ref={programsMenuRef}
                    className="relative"
                    onMouseEnter={() => {
                      clearProgramsCloseTimer();
                      setAboutOpen(false);
                      setProgramsOpen(true);
                    }}
                    onMouseLeave={scheduleProgramsClose}
                  >
                    <button
                      ref={programsButtonRef}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={programsOpen}
                      onClick={() => {
                        clearProgramsCloseTimer();
                        setAboutOpen(false);
                        setProgramsOpen((value) => !value);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                          event.preventDefault();
                          setAboutOpen(false);
                          setProgramsOpen(true);
                          window.requestAnimationFrame(() => {
                            focusProgramItem(event.key === 'ArrowDown' ? 0 : programNavItems.length - 1);
                          });
                        }
                      }}
                      className={`${navItemClass(isProgramsRoute)} inline-flex items-center gap-1.5`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${programsOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence>
                      {programsOpen && (
                        <motion.div
                          role="menu"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          style={{ insetInlineStart: 0 }}
                          className="absolute top-full z-[180] mt-2 w-[260px] rounded-2xl border border-white/10 bg-dark-950/95 p-2 text-white shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-md"
                          onMouseEnter={clearProgramsCloseTimer}
                          onMouseLeave={scheduleProgramsClose}
                        >
                          {programNavItems.map((item, index) => {
                            const active = location.pathname === item.href;

                            return (
                              <Link
                                key={item.href}
                                ref={(element) => {
                                  programsItemRefs.current[index] = element;
                                }}
                                role="menuitem"
                                aria-current={active ? 'page' : undefined}
                                to={item.href}
                                onClick={() => setProgramsOpen(false)}
                                onKeyDown={(event) => {
                                  if (event.key === 'ArrowDown') {
                                    event.preventDefault();
                                    focusProgramItem(index + 1);
                                  }

                                  if (event.key === 'ArrowUp') {
                                    event.preventDefault();
                                    focusProgramItem(index - 1);
                                  }

                                  if (event.key === 'Home') {
                                    event.preventDefault();
                                    focusProgramItem(0);
                                  }

                                  if (event.key === 'End') {
                                    event.preventDefault();
                                    focusProgramItem(programNavItems.length - 1);
                                  }
                                }}
                                className={`relative flex min-h-11 items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                                  active
                                    ? 'bg-primary-600 text-white'
                                    : 'text-white/80 hover:bg-primary-600/20 hover:text-white'
                                }`}
                              >
                                {active && (
                                  <span className="absolute inset-y-2 start-1 w-1 rounded-full bg-gold-300" />
                                )}
                                <span className="ps-2">{item.label}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const active = link.href.startsWith('/') && location.pathname.startsWith(link.href);

              return (
                <a
                  key={linkKey}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={navItemClass(active)}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 xl:ms-5 2xl:ms-8">
            <div className="hidden xl:block">
              <LanguageSwitcher tone={scrolled ? 'light' : 'dark'} />
            </div>

            <button
              type="button"
              onClick={() => handleNavClick(donateUrl)}
              className={`hidden min-h-11 items-center justify-center whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold shadow-[0_8px_18px_rgba(20,0,4,0.18)] transition-all duration-300 hover:-translate-y-0.5 sm:inline-flex ${
                scrolled
                  ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-[0_10px_22px_rgba(156,16,6,0.28)]'
                  : 'bg-white text-primary-700 hover:bg-primary-50 hover:shadow-[0_10px_22px_rgba(20,0,4,0.24)]'
              }`}
            >
              {t('common.donateNow')}
            </button>

            <div className="xl:hidden">
              <LanguageSwitcher tone={scrolled ? 'light' : 'dark'} compact />
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={t('accessibility.openMenu')}
              aria-controls="mobile-navigation"
              aria-expanded={mobileOpen}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors xl:hidden ${
                scrolled
                  ? 'text-dark-800 hover:bg-primary-50 hover:text-primary-700'
                  : 'text-white drop-shadow-[0_1px_7px_rgba(0,0,0,0.7)] hover:bg-white/10'
              }`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            onClose={() => setMobileOpen(false)}
            onNavClick={handleNavClick}
          />
        )}
      </AnimatePresence>
    </>
  );
}
