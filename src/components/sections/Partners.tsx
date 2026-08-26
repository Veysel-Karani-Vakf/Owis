import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import type { Partner } from '@/i18n/content';
import { useI18n } from '@/i18n/useI18n';

const FALLBACK_LOGO =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 80"%3E%3Crect fill="%23e2e6e3" width="128" height="80" rx="8"/%3E%3C/svg%3E';

function LogoTrack({
  partners,
  isRtl,
  colored,
}: {
  partners: Partner[];
  isRtl: boolean;
  colored: boolean;
}) {
  return (
    <div
      className={`flex w-max animate-marquee gap-12 py-4 [animation-duration:90s] group-hover:[animation-play-state:paused] ${
        isRtl ? '' : '[animation-direction:reverse]'
      }`}
      aria-hidden={colored ? true : undefined}
    >
      {partners.map((partner, i) => {
        const logo = (
          <img
            src={partner.logo || FALLBACK_LOGO}
            alt={colored ? '' : partner.name}
            loading="lazy"
            className={`max-h-20 max-w-32 object-contain ${
              colored ? '' : 'opacity-40 grayscale'
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_LOGO;
            }}
          />
        );

        return (
          <div
            key={`${partner.logo}-${i}`}
            className="flex h-20 w-32 flex-shrink-0 items-center justify-center"
          >
            {/* Only the readable (base) layer gets the link; the colour overlay is decorative. */}
            {partner.url && !colored ? (
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={partner.name}
                className="flex h-full w-full items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                {logo}
              </a>
            ) : (
              logo
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Partners() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { content, isRtl } = useI18n();
  const partnersContent = content.partners;
  const items = partnersContent.items ?? [];
  // Repeat the set enough times so the strip is always full edge-to-edge,
  // then duplicate once more so the -50% loop is seamless.
  const baseSet = [...items, ...items];
  const marqueePartners = [...baseSet, ...baseSet];

  // The editor may unpublish every partner; hide the section instead of an empty strip.
  if (items.length === 0) return null;

  return (
    <section id="partners" className="overflow-hidden bg-cream py-16 md:py-20">
      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-gold-400" />
            <span className="text-sm font-medium text-gold-600">{partnersContent.eyebrow}</span>
            <span className="h-px w-8 bg-gold-400" />
          </div>
          <h2 className="font-brand text-2xl font-bold text-dark-900 md:text-3xl lg:text-4xl">
            {partnersContent.title}
          </h2>
        </motion.div>
      </div>

      {/* dir="ltr" keeps the track anchored to the left edge so it stays full while translating */}
      <div className="group relative overflow-hidden" dir="ltr">
        {/* Base layer: muted / grayscale logos */}
        <LogoTrack partners={marqueePartners} isRtl={isRtl} colored={false} />

        {/* Focus layer: full-colour logos, masked to the ~3 logos in the centre */}
        <div className="partners-focus pointer-events-none absolute inset-0">
          <LogoTrack partners={marqueePartners} isRtl={isRtl} colored />
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cream to-transparent" />
      </div>
    </section>
  );
}
