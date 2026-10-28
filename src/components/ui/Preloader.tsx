import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { useCmsSettled } from '@/cms/CmsProvider';
import type { Locale } from '@/i18n/content';
import { useI18n } from '@/i18n/useI18n';
import { getHeroMediaState, subscribeHeroMedia } from '@/lib/heroMedia';

// The splash never shows for less than this, so its entrance animation
// completes even when the CMS answers at once.
const MIN_VISIBLE_MS = 700;

type SplashBrand = { logo: string; name: string };

// The logo and site name are dashboard-editable, yet the splash has to show
// them before the CMS answer is in. The brand resolved on the previous visit is
// remembered per locale, so a logo changed in the dashboard reaches repeat
// visitors from the first frame; only a first visit shows the bundled default.
const cacheKey = (locale: Locale) => `vkv-splash-brand:${locale}`;

function readCachedBrand(locale: Locale): SplashBrand | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(locale));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SplashBrand>;
    return typeof parsed.logo === 'string' && typeof parsed.name === 'string'
      ? { logo: parsed.logo, name: parsed.name }
      : null;
  } catch {
    return null;
  }
}

function writeCachedBrand(locale: Locale, brand: SplashBrand) {
  try {
    window.localStorage.setItem(cacheKey(locale), JSON.stringify(brand));
  } catch {
    // Private mode or blocked storage: the next visit simply starts from the default.
  }
}

/**
 * Splash screen shown until the published content has been fetched and, on the
 * landing route, until the hero's visual is settled (its video playing, or the
 * poster when no video applies), so the poster is never seen standing in for
 * the video. It shows once per load and never comes back.
 */
export default function Preloader() {
  const { content, locale } = useI18n();
  const { pathname } = useLocation();
  const cmsSettled = useCmsSettled();
  const heroMedia = useSyncExternalStore(subscribeHeroMedia, getHeroMediaState, getHeroMediaState);
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const logo = content.siteConfig.logo;
  const name = content.siteConfig.name;
  const cached = useMemo(() => readCachedBrand(locale), [locale]);
  const brand: SplashBrand = cmsSettled || !cached ? { logo, name } : cached;

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeDone(true), MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (cmsSettled) writeCachedBrand(locale, { logo, name });
  }, [cmsSettled, locale, logo, name]);

  const heroReady = pathname !== '/' || heroMedia !== 'pending';
  const ready = cmsSettled && heroReady;
  const loading = !dismissed && (!ready || !minTimeDone);

  useEffect(() => {
    if (!loading) setDismissed(true);
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-950"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-24 w-auto brightness-0 invert md:h-32"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden h-16 items-center justify-center rounded-xl bg-primary-500 px-6 text-xl font-bold text-white md:h-20">
                {brand.name}
              </div>
            </motion.div>

            <div className="relative h-1 w-40 overflow-hidden rounded-full bg-white/10">
              {/* Creeps most of the way while loading, then completes once everything is ready. */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: ready ? '0%' : cmsSettled ? '-8%' : '-15%' }}
                transition={{ duration: ready ? 0.3 : 1.2, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-l from-primary-400 to-gold-400"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-white/50"
            >
              {brand.name}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
