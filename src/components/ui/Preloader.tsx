import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/useI18n';

export default function Preloader() {
  const { content } = useI18n();
  const [loading, setLoading] = useState(true);
  const siteConfig = content.siteConfig;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

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

            <div className="relative h-1 w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-l from-primary-400 to-gold-400"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-white/50"
            >
              {siteConfig.name}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
