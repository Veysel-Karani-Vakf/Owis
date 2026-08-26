import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ProgramSpotlight } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

type AwarenessSpotlightProps = {
  spotlight?: ProgramSpotlight;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
const linkClass =
  'group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-dark-950 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hover:translate-y-0';

/** A featured platform event, told with the real photos mirrored in this site's news. */
export default function AwarenessSpotlight({ spotlight }: AwarenessSpotlightProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // The admin may clear the block entirely; render nothing rather than an empty dark panel.
  if (!spotlight || (!spotlight.title && !spotlight.description)) return null;

  // The layout is drawn for one wide photo plus two small ones, so the cap of 3 stays.
  const images = (spotlight.images ?? []).filter((image) => image?.src).slice(0, 3);
  const linkTo = spotlight.route || '';
  const isExternal = /^https?:\/\//.test(linkTo);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <motion.article
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: smoothEase }}
        className="relative isolate overflow-hidden rounded-[32px] bg-dark-950 text-white shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(218,8,18,0.32),transparent_55%)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:48px_48px]"
        />

        <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12 lg:p-14">
          <div className="text-start">
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, ease: smoothEase, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/85 backdrop-blur"
            >
              <Newspaper className="h-4 w-4 text-primary-400" aria-hidden="true" />
              {spotlight.eyebrow}
            </motion.div>

            <motion.h2
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: smoothEase, delay: 0.18 }}
              className="mt-6 text-balance text-3xl font-bold leading-[1.25] md:text-4xl"
            >
              {spotlight.title}
            </motion.h2>

            <motion.p
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: smoothEase, delay: 0.26 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
            >
              {spotlight.description}
            </motion.p>

            {linkTo && spotlight.linkLabel && (
              <motion.div
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.55, ease: smoothEase, delay: 0.34 }}
                className="mt-8"
              >
                {isExternal ? (
                  <a
                    href={linkTo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {spotlight.linkLabel}
                    <ArrowIcon
                      className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                      aria-hidden="true"
                    />
                  </a>
                ) : (
                  <Link to={linkTo} className={linkClass}>
                    {spotlight.linkLabel}
                    <ArrowIcon
                      className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </motion.div>
            )}
          </div>

          {images.length > 0 && (
            <div className="relative mx-auto grid w-full max-w-lg grid-cols-2 gap-4 lg:max-w-none">
              {images.map((image, index) => (
                <motion.figure
                  key={`${image.src}-${index}`}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: reduced ? 0 : index === 1 ? 2 : -2 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, ease: smoothEase, delay: 0.15 + index * 0.12 }}
                  className={`overflow-hidden rounded-[22px] bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.4)] ring-1 ring-white/25 transition-transform duration-500 hover:rotate-0 hover:scale-[1.03] motion-reduce:hover:scale-100 ${
                    index === 0 ? 'col-span-2' : ''
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className={`w-full rounded-[16px] object-cover ${index === 0 ? 'aspect-[16/8]' : 'aspect-[4/3]'}`}
                  />
                </motion.figure>
              ))}
            </div>
          )}
        </div>
      </motion.article>
    </div>
  );
}
