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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  scrolled
                    ? 'text-dark-700 hover:bg-primary-50 hover:text-primary-700'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
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
