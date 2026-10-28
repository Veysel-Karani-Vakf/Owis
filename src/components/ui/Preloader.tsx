import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCmsSettled } from '@/cms/CmsProvider';
import { useI18n } from '@/i18n/useI18n';

// How long the splash stays once the CMS answer has landed, so the brand mark
// is actually seen rather than flashing past inside the fade-out.
const HOLD_AFTER_SETTLED_MS = 600;

/**
 * Splash screen shown until the published content has been fetched.
 *
 * The logo and site name are dashboard-editable, so they render only once the
 * CMS snapshot is in. Before that the splash shows the progress bar alone:
 * never the bundled default that an editor may have replaced.
 */
export default function Preloader() {
  const { content } = useI18n();
  const cmsSettled = useCmsSettled();
  const [holdDone, setHoldDone] = useState(false);
  const siteConfig = content.siteConfig;

  useEffect(() => {
    if (!cmsSettled) return undefined;
    const timer = setTimeout(() => setHoldDone(true), HOLD_AFTER_SETTLED_MS);
    return () => clearTimeout(timer);
  }, [cmsSettled]);

  const loading = !cmsSettled || !holdDone;

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
            {/* Reserves the logo's height so the bar does not jump when the logo appears. */}
            <div className="relative flex h-24 items-center justify-center md:h-32">
              {cmsSettled && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="relative"
                >
                  <img
                    src={siteConfig.logo}
                    alt={siteConfig.name}
                    className="h-24 w-auto brightness-0 invert md:h-32"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-16 items-center justify-center rounded-xl bg-primary-500 px-6 text-xl font-bold text-white md:h-20">
                    {siteConfig.name}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="relative h-1 w-40 overflow-hidden rounded-full bg-white/10">
              {/* Creeps most of the way while fetching, then completes once content is in. */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: cmsSettled ? '0%' : '-15%' }}
                transition={{ duration: cmsSettled ? 0.3 : 1.2, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-l from-primary-400 to-gold-400"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: cmsSettled ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-5 text-sm text-white/50"
            >
              {cmsSettled ? siteConfig.name : ''}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
