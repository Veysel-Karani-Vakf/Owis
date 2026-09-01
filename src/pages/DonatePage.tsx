import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HandHeart } from 'lucide-react';
import { useMemo } from 'react';
import FadeContent from '@/components/effects/FadeContent';
import SpotlightCard from '@/components/effects/SpotlightCard';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import { getDonateContent, type DonationOpportunity } from '@/data/donate';
import { useDonateContent } from '@/hooks/useCmsContent';
import { useRevealMotion } from '@/hooks/useResponsiveMotion';
import { useI18n } from '@/i18n/useI18n';

function DonationCard({
  opportunity,
  labels,
  isRtl,
  index,
}: {
  opportunity: DonationOpportunity;
  labels: ReturnType<typeof getDonateContent>['labels'];
  isRtl: boolean;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const revealMotion = useRevealMotion({
    y: 18,
    scale: 0.985,
    duration: 0.52,
    delay: index * 0.04,
    amount: 0.18,
    mobileY: 12,
    mobileDuration: 0.44,
  });
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <motion.article id={opportunity.id} {...revealMotion} className="h-full">
      <SpotlightCard
        disabled={Boolean(shouldReduceMotion)}
        spotlightColor="rgba(180, 35, 58, 0.08)"
        contentClassName="flex flex-1 flex-col"
        className="group/card flex h-full flex-col overflow-hidden rounded-[22px] border border-[rgba(127,29,45,0.11)] bg-white text-start shadow-[0_18px_48px_rgba(40,12,18,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_24px_58px_rgba(40,12,18,0.12)] motion-reduce:hover:translate-y-0"
      >
        <div className="relative">
          <div className="relative aspect-square overflow-hidden bg-primary-50">
            <img
              src={opportunity.image}
              alt={opportunity.imageAlt}
              width={600}
              height={600}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-[-30%] w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover/card:translate-x-[560%] motion-reduce:hidden"
            />
            <span className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-primary-700 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-600" />
              </span>
              {labels.available}
            </span>
          </div>

          <div className="absolute -bottom-5 start-5 z-10 flex flex-col rounded-2xl border border-primary-100 bg-white px-4 py-2 shadow-[0_12px_28px_rgba(40,12,18,0.14)] transition-all duration-300 group-hover/card:-translate-y-0.5 group-hover/card:border-primary-300 motion-reduce:group-hover/card:translate-y-0">
            <span className="text-[10px] font-semibold leading-tight text-primary-700">
              {labels.contributionValue}
            </span>
            <span className="text-lg font-black leading-tight text-dark-950">
              {opportunity.price}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 pt-9">
          <h2 className="text-lg font-bold leading-snug text-dark-950 transition-colors duration-300 group-hover/card:text-primary-700 md:text-xl">
            {opportunity.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-dark-600">
            {opportunity.description}
          </p>

          <div className="mt-auto pt-5">
            {opportunity.available && opportunity.url ? (
              <Link
                to={opportunity.url}
                aria-label={`${labels.contribute}: ${opportunity.title}`}
                className="group/link inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
              >
                <HandHeart className="h-4 w-4" aria-hidden="true" />
                {labels.contribute}
                <ArrowIcon
                  className={`h-4 w-4 transition-transform motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0 ${
                    isRtl ? 'group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-dark-200 bg-dark-50 px-5 py-2.5 text-sm font-bold text-dark-400"
              >
                {labels.unavailable}
              </button>
            )}
          </div>
        </div>
      </SpotlightCard>
    </motion.article>
  );
}

function FeaturedDonationCard({
  opportunity,
  labels,
  isRtl,
}: {
  opportunity: DonationOpportunity;
  labels: ReturnType<typeof getDonateContent>['labels'];
  isRtl: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const revealMotion = useRevealMotion({
    y: 22,
    scale: 0.99,
    duration: 0.6,
    amount: 0.2,
    mobileY: 14,
    mobileDuration: 0.46,
  });
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <motion.article id={opportunity.id} {...revealMotion}>
      <SpotlightCard
        disabled={Boolean(shouldReduceMotion)}
        spotlightColor="rgba(180, 35, 58, 0.07)"
        contentClassName="grid lg:grid-cols-[440px_minmax(0,1fr)]"
        className="group/card overflow-hidden rounded-[26px] border border-[rgba(127,29,45,0.11)] bg-white text-start shadow-[0_20px_52px_rgba(40,12,18,0.09)] transition-all duration-300 hover:border-primary-200 hover:shadow-[0_26px_64px_rgba(40,12,18,0.13)]"
      >
        <div className="relative aspect-square overflow-hidden bg-primary-50 lg:aspect-auto lg:h-full lg:min-h-[420px]">
          <img
            src={opportunity.image}
            alt={opportunity.imageAlt}
            width={880}
            height={880}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[-30%] w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover/card:translate-x-[560%] motion-reduce:hidden"
          />
          <span className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-primary-700 shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-600" />
            </span>
            {labels.available}
          </span>
        </div>

        <div className="relative flex flex-col justify-center overflow-hidden p-6 md:p-10 lg:p-12">
          <div aria-hidden="true" className="geometric-pattern absolute inset-0 opacity-40" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-primary-200" />
              <span className="text-sm font-semibold text-primary-700">{labels.featured}</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-dark-950 md:text-3xl">
              {opportunity.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-dark-600">
              {opportunity.description}
            </p>

            <div className="mt-6 flex w-fit flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl border border-primary-100 bg-primary-50/60 px-5 py-3.5">
              <span className="text-xs font-semibold text-primary-700">{labels.contributionValue}</span>
              <span className="text-3xl font-black leading-none text-dark-950">{opportunity.price}</span>
            </div>

            <div className="mt-8">
              {opportunity.available && opportunity.url ? (
                <Link
                  to={opportunity.url}
                  aria-label={`${labels.contribute}: ${opportunity.title}`}
                  className="group/link inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-600 px-8 py-3 text-base font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                >
                  <HandHeart className="h-5 w-5" aria-hidden="true" />
                  {labels.contribute}
                  <ArrowIcon
                    className={`h-5 w-5 transition-transform motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0 ${
                      isRtl ? 'group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-dark-200 bg-dark-50 px-8 py-3 text-base font-bold text-dark-400"
                >
                  {labels.unavailable}
                </button>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.article>
  );
}

export default function DonatePage() {
  const { locale, isRtl } = useI18n();
  const page = useDonateContent(locale);

  const structuredData = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: page.hero.title,
      description: page.hero.description,
      itemListElement: page.opportunities.map((opportunity, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: opportunity.title,
        url: `${origin}${opportunity.available && opportunity.url ? opportunity.url : `/donate#${opportunity.id}`}`,
      })),
    };
  }, [page.hero.description, page.hero.title, page.opportunities]);

  return (
    <>
      <PageSeo
        title={page.seo.title}
        description={page.seo.description}
        canonical={page.seo.canonical}
        image={page.hero.image}
        structuredData={structuredData}
      />
      <main className="bg-white">
        <PageHero
          id="cms-donate-hero"
          title={page.hero.title}
          description={page.hero.description}
          image={page.hero.image}
          imageAlt={page.hero.imageAlt}
          breadcrumbs={page.breadcrumbs}
        />

        <section id="cms-donate-intro" className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
            <FadeContent blur={false} duration={650} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <div className="mb-4 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-primary-200" />
                <span className="text-sm font-semibold text-primary-700">{page.intro.eyebrow}</span>
                <span className="h-px w-8 bg-primary-200" />
              </div>
              <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                {page.intro.title}
              </h2>
              <div className="mx-auto mt-5 max-w-3xl space-y-3 text-base leading-relaxed text-dark-600 md:text-lg">
                {(page.intro.paragraphs ?? []).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </FadeContent>
          </div>
        </section>

        <section id="cms-donate-grid" className="relative overflow-hidden bg-[#faf8f8] py-16 md:py-24">
          <div aria-hidden="true" className="pattern-bg absolute inset-0 opacity-35" />
          <div className="relative mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={14} threshold={0.18} once>
              <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{page.grid.eyebrow}</span>
                  <span className="h-px w-8 bg-primary-200" />
                </div>
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                  {page.grid.title}
                </h2>
                {page.grid.description && (
                  <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{page.grid.description}</p>
                )}
              </div>
            </FadeContent>

            {(page.opportunities ?? []).length === 0 ? (
              <p className="mx-auto max-w-xl rounded-[22px] border border-primary-100 bg-white p-8 text-center text-base leading-relaxed text-dark-600 shadow-[0_14px_36px_rgba(40,12,18,0.06)]">
                {page.labels.emptyState}
              </p>
            ) : (
              <>
                <FeaturedDonationCard
                  opportunity={page.opportunities[0]}
                  labels={page.labels}
                  isRtl={isRtl}
                />

                {page.opportunities.length > 1 && (
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-8">
                    {page.opportunities.slice(1).map((opportunity, index) => (
                      <DonationCard
                        key={opportunity.id}
                        opportunity={opportunity}
                        labels={page.labels}
                        isRtl={isRtl}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
