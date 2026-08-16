import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useScrolled } from '@/hooks/useScrolled';
import { useI18n } from '@/i18n/useI18n';
import { getAboutContent } from '@/data/about';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import MobileMenu from './MobileMenu';

export default function Header() {
  const scrolled = useScrolled(60);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { content, t, locale } = useI18n();
  const { navLinks, siteConfig } = content;
  const aboutNavItems = getAboutContent(locale).nav;
  const location = useLocation();
  const navigate = useNavigate();
  const aboutMenuRef = useRef<HTMLDivElement>(null);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);
  const aboutItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const closeTimerRef = useRef<number | null>(null);
  const isAboutRoute = location.pathname.startsWith('/about/');

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleAboutClose = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => setAboutOpen(false), 140);
  };

  useEffect(() => {
    return clearCloseTimer;
  }, []);

  useEffect(() => {
    if (!aboutOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!aboutMenuRef.current?.contains(event.target as Node)) {
        setAboutOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAboutOpen(false);
        aboutButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [aboutOpen]);

  useEffect(() => {
    setAboutOpen(false);
  }, [location.pathname, location.hash]);

  const focusAboutItem = (index: number) => {
    const nextIndex = (index + aboutNavItems.length) % aboutNavItems.length;
    aboutItemRefs.current[nextIndex]?.focus();
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setAboutOpen(false);

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
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
      active
        ? scrolled
          ? 'bg-primary-50 text-primary-700'
          : 'bg-white/15 text-white'
        : scrolled
          ? 'text-dark-700 hover:bg-primary-50 hover:text-primary-700'
          : 'text-white/90 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 1.8, ease: 'easeOut' }}
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${
          scrolled ? 'bg-cream/90 shadow-md backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
          <a
            href="#hero"
            onClick={(event) => {
              event.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex items-center gap-2"
          >
            <img
              src={siteConfig.logo}
              alt={siteConfig.name}
              className={`h-9 w-auto transition-all duration-300 md:h-12 ${
                scrolled ? '' : 'brightness-0 invert'
              }`}
              onError={(event) => {
                const target = event.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <span
              className={`hidden items-center rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-bold text-white ${
                scrolled ? 'md:hidden' : ''
              }`}
              style={{ display: 'none' }}
            >
              {siteConfig.name}
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              if (link.href === '#about') {
                return (
                  <div
                    key={link.href}
                    ref={aboutMenuRef}
                    className="relative"
                    onMouseEnter={() => {
                      clearCloseTimer();
                      setAboutOpen(true);
                    }}
                    onMouseLeave={scheduleAboutClose}
                  >
                    <button
                      ref={aboutButtonRef}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={aboutOpen}
                      onClick={() => setAboutOpen((value) => !value)}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                          event.preventDefault();
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
                          className="absolute top-full z-[180] mt-2 w-[210px] rounded-2xl border border-white/10 bg-dark-950/95 p-2 text-white shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-md"
                          onMouseEnter={clearCloseTimer}
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

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={navItemClass(false)}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-3 lg:ms-8 xl:ms-16 2xl:ms-28">
            <div className="hidden lg:block">
              <LanguageSwitcher scrolled={scrolled} />
            </div>

            <button
              onClick={() => handleNavClick('#participate')}
              className={`hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 sm:block ${
                scrolled
                  ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700 hover:shadow-lg'
                  : 'bg-white text-primary-700 shadow-lg hover:bg-gold-50'
              }`}
            >
              {t('common.donateNow')}
            </button>

            <div className="lg:hidden">
              <LanguageSwitcher scrolled={scrolled} compact />
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label={t('accessibility.openMenu')}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors lg:hidden ${
                scrolled ? 'text-dark-800 hover:bg-primary-50' : 'text-white hover:bg-white/10'
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
