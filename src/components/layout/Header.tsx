import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useScrolled } from '@/hooks/useScrolled';
import { useI18n } from '@/i18n/useI18n';
import { getAboutContent } from '@/data/about';
import { donateRoute } from '@/data/donate';
import { getLibraryContent } from '@/data/library';
import { getParticipateContent } from '@/data/participate';
import { getProgramsContent } from '@/data/programs';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import MobileMenu from './MobileMenu';

export default function Header() {
  const scrolled = useScrolled(60);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [participateOpen, setParticipateOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [activeLibraryGroup, setActiveLibraryGroup] = useState<string | null>(null);
  const { content, t, locale, isRtl } = useI18n();
  const { navLinks, siteConfig } = content;
  const aboutNavItems = getAboutContent(locale).nav;
  const programNavItems = getProgramsContent(locale).nav;
  const participateNavItems = getParticipateContent(locale).nav;
  const libraryContent = getLibraryContent(locale);
  const libraryNavItems = libraryContent.nav;
  const location = useLocation();
  const navigate = useNavigate();
  const aboutMenuRef = useRef<HTMLDivElement>(null);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);
  const aboutItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const programsMenuRef = useRef<HTMLDivElement>(null);
  const programsButtonRef = useRef<HTMLButtonElement>(null);
  const programsItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const participateMenuRef = useRef<HTMLDivElement>(null);
  const participateButtonRef = useRef<HTMLButtonElement>(null);
  const participateItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const libraryMenuRef = useRef<HTMLDivElement>(null);
  const libraryButtonRef = useRef<HTMLButtonElement>(null);
  const libraryItemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);
  const aboutCloseTimerRef = useRef<number | null>(null);
  const programsCloseTimerRef = useRef<number | null>(null);
  const participateCloseTimerRef = useRef<number | null>(null);
  const libraryCloseTimerRef = useRef<number | null>(null);
  const isAboutRoute = location.pathname.startsWith('/about/');
  const isProgramsRoute = location.pathname.startsWith('/programs/');
  const isParticipateRoute = location.pathname.startsWith('/participate');
  const isLibraryRoute = location.pathname.startsWith('/library');

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

  const clearParticipateCloseTimer = () => {
    if (participateCloseTimerRef.current) {
      window.clearTimeout(participateCloseTimerRef.current);
      participateCloseTimerRef.current = null;
    }
  };

  const clearLibraryCloseTimer = () => {
    if (libraryCloseTimerRef.current) {
      window.clearTimeout(libraryCloseTimerRef.current);
      libraryCloseTimerRef.current = null;
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

  const scheduleParticipateClose = () => {
    clearParticipateCloseTimer();
    participateCloseTimerRef.current = window.setTimeout(() => setParticipateOpen(false), 140);
  };

  const scheduleLibraryClose = () => {
    clearLibraryCloseTimer();
    libraryCloseTimerRef.current = window.setTimeout(() => {
      setLibraryOpen(false);
      setActiveLibraryGroup(null);
    }, 140);
  };

  const focusAboutItem = (index: number) => {
    const nextIndex = (index + aboutNavItems.length) % aboutNavItems.length;
    aboutItemRefs.current[nextIndex]?.focus();
  };

  const focusProgramItem = (index: number) => {
    const nextIndex = (index + programNavItems.length) % programNavItems.length;
    programsItemRefs.current[nextIndex]?.focus();
  };

  const focusParticipateItem = (index: number) => {
    const nextIndex = (index + participateNavItems.length) % participateNavItems.length;
    participateItemRefs.current[nextIndex]?.focus();
  };

  const focusLibraryItem = (index: number) => {
    const itemCount = libraryNavItems.length;
    if (itemCount === 0) return;
    const nextIndex = (index + itemCount) % itemCount;
    libraryItemRefs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    return () => {
      clearAboutCloseTimer();
      clearProgramsCloseTimer();
      clearParticipateCloseTimer();
      clearLibraryCloseTimer();
    };
  }, []);

  useEffect(() => {
    if (!aboutOpen && !programsOpen && !participateOpen && !libraryOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (aboutOpen && !aboutMenuRef.current?.contains(target)) {
        setAboutOpen(false);
      }

      if (programsOpen && !programsMenuRef.current?.contains(target)) {
        setProgramsOpen(false);
      }

      if (participateOpen && !participateMenuRef.current?.contains(target)) {
        setParticipateOpen(false);
      }

      if (libraryOpen && !libraryMenuRef.current?.contains(target)) {
        setLibraryOpen(false);
        setActiveLibraryGroup(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      const activeElement = document.activeElement;
      const aboutHasFocus = activeElement instanceof Node && aboutMenuRef.current?.contains(activeElement);
      const programsHasFocus = activeElement instanceof Node && programsMenuRef.current?.contains(activeElement);
      const participateHasFocus =
        activeElement instanceof Node && participateMenuRef.current?.contains(activeElement);
      const libraryHasFocus = activeElement instanceof Node && libraryMenuRef.current?.contains(activeElement);

      if (aboutOpen) {
        setAboutOpen(false);
        if (aboutHasFocus) aboutButtonRef.current?.focus();
      }

      if (programsOpen) {
        setProgramsOpen(false);
        if (programsHasFocus) programsButtonRef.current?.focus();
      }

      if (participateOpen) {
        setParticipateOpen(false);
        if (participateHasFocus) participateButtonRef.current?.focus();
      }

      if (libraryOpen) {
        setLibraryOpen(false);
        setActiveLibraryGroup(null);
        if (libraryHasFocus) libraryButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [aboutOpen, libraryOpen, participateOpen, programsOpen]);

  useEffect(() => {
    setAboutOpen(false);
    setProgramsOpen(false);
    setParticipateOpen(false);
    setLibraryOpen(false);
    setActiveLibraryGroup(null);
  }, [location.pathname, location.hash]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setAboutOpen(false);
    setProgramsOpen(false);
    setParticipateOpen(false);
    setLibraryOpen(false);
    setActiveLibraryGroup(null);

    if (href.startsWith('/')) {
      navigate(href);
      return;
    }

    if (!href.startsWith('#')) return;

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
            {navLinks.map((link) => {
              if (link.href === '#about') {
                return (
                  <div
                    key={link.href}
                    ref={aboutMenuRef}
                    className="relative"
                    onMouseEnter={() => {
                      clearAboutCloseTimer();
                      setProgramsOpen(false);
                      setParticipateOpen(false);
                      setLibraryOpen(false);
                      setActiveLibraryGroup(null);
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
                        setParticipateOpen(false);
                        setLibraryOpen(false);
                        setActiveLibraryGroup(null);
                        setAboutOpen((value) => !value);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                          event.preventDefault();
                          setProgramsOpen(false);
                          setParticipateOpen(false);
                          setLibraryOpen(false);
                          setActiveLibraryGroup(null);
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

              if (link.href === '#programs') {
                return (
                  <div
                    key={link.href}
                    ref={programsMenuRef}
                    className="relative"
                    onMouseEnter={() => {
                      clearProgramsCloseTimer();
                      setAboutOpen(false);
                      setParticipateOpen(false);
                      setLibraryOpen(false);
                      setActiveLibraryGroup(null);
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
                        setParticipateOpen(false);
                        setLibraryOpen(false);
                        setActiveLibraryGroup(null);
                        setProgramsOpen((value) => !value);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                          event.preventDefault();
                          setAboutOpen(false);
                          setParticipateOpen(false);
                          setLibraryOpen(false);
                          setActiveLibraryGroup(null);
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

              if (link.href === '/participate') {
                return (
                  <div
                    key={link.href}
                    ref={participateMenuRef}
                    className="relative"
                    onMouseEnter={() => {
                      clearParticipateCloseTimer();
                      setAboutOpen(false);
                      setProgramsOpen(false);
                      setLibraryOpen(false);
                      setActiveLibraryGroup(null);
                      setParticipateOpen(true);
                    }}
                    onMouseLeave={scheduleParticipateClose}
                  >
                    <button
                      ref={participateButtonRef}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={participateOpen}
                      aria-controls="participate-navigation-menu"
                      onClick={() => {
                        clearParticipateCloseTimer();
                        setAboutOpen(false);
                        setProgramsOpen(false);
                        setLibraryOpen(false);
                        setActiveLibraryGroup(null);
                        setParticipateOpen((value) => !value);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                          event.preventDefault();
                          setAboutOpen(false);
                          setProgramsOpen(false);
                          setLibraryOpen(false);
                          setActiveLibraryGroup(null);
                          setParticipateOpen(true);
                          window.requestAnimationFrame(() => {
                            focusParticipateItem(event.key === 'ArrowDown' ? 0 : participateNavItems.length - 1);
                          });
                        }
                      }}
                      className={`${navItemClass(isParticipateRoute)} inline-flex items-center gap-1.5`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${participateOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence>
                      {participateOpen && (
                        <motion.div
                          id="participate-navigation-menu"
                          role="menu"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          style={{ insetInlineStart: 0 }}
                          className="absolute top-full z-[180] mt-2 w-[270px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-dark-950/95 p-2 text-white shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-md"
                          onMouseEnter={clearParticipateCloseTimer}
                          onMouseLeave={scheduleParticipateClose}
                        >
                          {participateNavItems.map((item, index) => {
                            const active = location.pathname === item.href;

                            return (
                              <Link
                                key={item.href}
                                ref={(element) => {
                                  participateItemRefs.current[index] = element;
                                }}
                                role="menuitem"
                                aria-current={active ? 'page' : undefined}
                                to={item.href}
                                onClick={() => setParticipateOpen(false)}
                                onKeyDown={(event) => {
                                  if (event.key === 'ArrowDown') {
                                    event.preventDefault();
                                    focusParticipateItem(index + 1);
                                  }

                                  if (event.key === 'ArrowUp') {
                                    event.preventDefault();
                                    focusParticipateItem(index - 1);
                                  }

                                  if (event.key === 'Home') {
                                    event.preventDefault();
                                    focusParticipateItem(0);
                                  }

                                  if (event.key === 'End') {
                                    event.preventDefault();
                                    focusParticipateItem(participateNavItems.length - 1);
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

              if (link.href === '/library') {
                const NestedChevron = isRtl ? ChevronRight : ChevronLeft;

                return (
                  <div
                    key={link.href}
                    ref={libraryMenuRef}
                    className="relative"
                    onMouseEnter={() => {
                      clearLibraryCloseTimer();
                      setAboutOpen(false);
                      setProgramsOpen(false);
                      setParticipateOpen(false);
                      setLibraryOpen(true);
                    }}
                    onMouseLeave={scheduleLibraryClose}
                  >
                    <button
                      ref={libraryButtonRef}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={libraryOpen}
                      onClick={() => {
                        clearLibraryCloseTimer();
                        setAboutOpen(false);
                        setProgramsOpen(false);
                        setParticipateOpen(false);
                        setLibraryOpen((value) => !value);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                          event.preventDefault();
                          setAboutOpen(false);
                          setProgramsOpen(false);
                          setParticipateOpen(false);
                          setLibraryOpen(true);
                          window.requestAnimationFrame(() => {
                            focusLibraryItem(event.key === 'ArrowDown' ? 0 : libraryNavItems.length - 1);
                          });
                        }
                      }}
                      className={`${navItemClass(isLibraryRoute)} inline-flex items-center gap-1.5`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${libraryOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence>
                      {libraryOpen && (
                        <motion.div
                          role="menu"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          style={isRtl ? { insetInlineStart: 0 } : { insetInlineEnd: 0 }}
                          className="absolute top-full z-[180] mt-2 w-[300px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-dark-950/95 p-2 text-white shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-md"
                          onMouseEnter={clearLibraryCloseTimer}
                          onMouseLeave={scheduleLibraryClose}
                        >
                          {libraryNavItems.map((item, index) => {
                            const focusIndex = index;

                            if (item.type === 'link') {
                              const active = location.pathname === item.href;

                              return (
                                <Link
                                  key={item.href}
                                  ref={(element) => {
                                    libraryItemRefs.current[focusIndex] = element;
                                  }}
                                  role="menuitem"
                                  aria-current={active ? 'page' : undefined}
                                  to={item.href}
                                  onFocus={() => setActiveLibraryGroup(null)}
                                  onClick={() => {
                                    setLibraryOpen(false);
                                    setActiveLibraryGroup(null);
                                  }}
                                  onKeyDown={(event) => {
                                    if (event.key === 'ArrowDown') {
                                      event.preventDefault();
                                      focusLibraryItem(focusIndex + 1);
                                    }

                                    if (event.key === 'ArrowUp') {
                                      event.preventDefault();
                                      focusLibraryItem(focusIndex - 1);
                                    }

                                    if (event.key === 'Home') {
                                      event.preventDefault();
                                      focusLibraryItem(0);
                                    }

                                    if (event.key === 'End') {
                                      event.preventDefault();
                                      focusLibraryItem(libraryNavItems.length - 1);
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
                            }

                            const active = item.items.some((child) => location.pathname === child.href);
                            const groupOpen = activeLibraryGroup === item.href;

                            return (
                              <div
                                key={item.href}
                                className="relative"
                                onMouseEnter={() => setActiveLibraryGroup(item.href)}
                              >
                                <button
                                  ref={(element) => {
                                    libraryItemRefs.current[focusIndex] = element;
                                  }}
                                  type="button"
                                  role="menuitem"
                                  aria-haspopup="menu"
                                  aria-expanded={groupOpen}
                                  onFocus={() => setActiveLibraryGroup(item.href)}
                                  onClick={() => setActiveLibraryGroup((value) => (value === item.href ? null : item.href))}
                                  onKeyDown={(event) => {
                                    if (event.key === 'ArrowDown') {
                                      event.preventDefault();
                                      focusLibraryItem(focusIndex + 1);
                                    }

                                    if (event.key === 'ArrowUp') {
                                      event.preventDefault();
                                      focusLibraryItem(focusIndex - 1);
                                    }

                                    if (event.key === 'Home') {
                                      event.preventDefault();
                                      focusLibraryItem(0);
                                    }

                                    if (event.key === 'End') {
                                      event.preventDefault();
                                      focusLibraryItem(libraryNavItems.length - 1);
                                    }

                                    if (
                                      event.key === 'Enter' ||
                                      event.key === ' ' ||
                                      event.key === 'ArrowLeft' ||
                                      event.key === 'ArrowRight'
                                    ) {
                                      event.preventDefault();
                                      setActiveLibraryGroup(item.href);
                                    }
                                  }}
                                  className={`relative flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                                    active
                                      ? 'bg-primary-600 text-white'
                                      : 'text-white/80 hover:bg-primary-600/20 hover:text-white'
                                  }`}
                                >
                                  {active && (
                                    <span className="absolute inset-y-2 start-1 w-1 rounded-full bg-gold-300" />
                                  )}
                                  <span className="ps-2">{item.label}</span>
                                  <NestedChevron className="h-4 w-4 shrink-0" aria-hidden="true" />
                                </button>

                                <AnimatePresence>
                                  {groupOpen && (
                                    <motion.div
                                      role="menu"
                                      initial={{ opacity: 0, x: isRtl ? -6 : 6 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: isRtl ? -6 : 6 }}
                                      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                                      style={
                                        isRtl
                                          ? { insetInlineStart: 'calc(100% + 0.5rem)' }
                                          : { insetInlineEnd: 'calc(100% + 0.5rem)' }
                                      }
                                      className="absolute top-0 z-[190] w-[250px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-dark-950/95 p-2 text-white shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-md"
                                    >
                                      {item.items.map((child) => {
                                        const childActive = location.pathname === child.href;

                                        return (
                                          <Link
                                            key={child.href}
                                            role="menuitem"
                                            aria-current={childActive ? 'page' : undefined}
                                            to={child.href}
                                            onClick={() => {
                                              setLibraryOpen(false);
                                              setActiveLibraryGroup(null);
                                            }}
                                            className={`relative flex min-h-11 items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                                              childActive
                                                ? 'bg-primary-600 text-white'
                                                : 'text-white/80 hover:bg-primary-600/20 hover:text-white'
                                            }`}
                                          >
                                            {childActive && (
                                              <span className="absolute inset-y-2 start-1 w-1 rounded-full bg-gold-300" />
                                            )}
                                            <span className="ps-2">{child.label}</span>
                                          </Link>
                                        );
                                      })}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
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
                  key={link.href}
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
              onClick={() => handleNavClick(donateRoute)}
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
