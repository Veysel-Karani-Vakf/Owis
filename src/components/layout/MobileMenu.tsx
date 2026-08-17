import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useI18n } from '@/i18n/useI18n';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

type MobileMenuProps = {
  onClose: () => void;
  onNavClick: (href: string) => void;
};

export default function MobileMenu({ onClose, onNavClick }: MobileMenuProps) {
  const { content, t, isRtl } = useI18n();
  const { navLinks, siteConfig } = content;

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

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navLinks.map((link, index) => (
          <motion.a
            key={link.href}
            href={link.href}
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index + 0.1 }}
            onClick={(event) => {
              event.preventDefault();
              onNavClick(link.href);
            }}
            className="flex items-center justify-between rounded-xl px-4 py-4 text-lg font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            {link.label}
          </motion.a>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => onNavClick('#participate')}
          className="w-full rounded-full bg-primary-500 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-600"
        >
          {t('common.donateNow')}
        </button>
      </div>
    </motion.div>
  );
}
