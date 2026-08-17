import { useState } from 'react';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrolled } from '@/hooks/useScrolled';
import { useI18n } from '@/i18n/useI18n';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import MobileMenu from './MobileMenu';

export default function Header() {
  const scrolled = useScrolled(60);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { content, t } = useI18n();
  const { navLinks, siteConfig } = content;

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors duration-200 2xl:px-3 ${
                  scrolled
                    ? 'text-dark-700 hover:bg-primary-50 hover:text-primary-700'
                    : 'text-white drop-shadow-[0_1px_7px_rgba(0,0,0,0.7)] hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 xl:ms-5 2xl:ms-8">
            <div className="hidden xl:block">
              <LanguageSwitcher tone={scrolled ? 'light' : 'dark'} />
            </div>

            <button
              type="button"
              onClick={() => handleNavClick('#participate')}
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
