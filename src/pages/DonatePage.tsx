import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, HandHeart, ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import { getDonateContent, type DonationOpportunity } from '@/data/donate';
import { useI18n } from '@/i18n/useI18n';

const revealEase = [0.22, 1, 0.36, 1] as const;

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
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <motion.article
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.52,
        delay: shouldReduceMotion ? 0 : index * 0.04,
        ease: revealEase,
      }}
      className="flex h-full flex-col overflow-hidden rounded-[22px] border border-primary-100 bg-white text-start shadow-[0_16px_42px_rgba(40,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(40,12,18,0.1)] motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-square overflow-hidden bg-primary-50">
        <img
          src={opportunity.image}
          alt={opportunity.imageAlt}
          width={300}
          height={300}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
        />
        <span
          className={`absolute start-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
            opportunity.available
              ? 'bg-white text-primary-700'
              : 'bg-dark-950/82 text-white backdrop-blur'
          }`}
        >
          {opportunity.available ? labels.available : labels.closed}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-xl font-bold leading-tight text-dark-950">{opportunity.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-dark-600">{opportunity.description}</p>

        <div className="mt-5 rounded-2xl border border-primary-100 bg-primary-50/55 p-4">
          <p className="text-xs font-bold text-primary-700">{labels.contributionValue}</p>
          <p className="mt-1 text-2xl font-black text-dark-950">{opportunity.price}</p>
        </div>

        <div className="mt-auto pt-6">
          {opportunity.available && opportunity.url ? (
            <a
              href={opportunity.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labels.contribute}: ${opportunity.title}. ${labels.externalNotice}`}
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
            >
              <HandHeart className="h-4 w-4" aria-hidden="true" />
              {labels.contribute}
              <ArrowIcon
                className={`h-4 w-4 transition-transform ${
                  isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                }`}
                aria-hidden="true"
              />
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-dark-200 bg-dark-50 px-5 py-2.5 text-sm font-bold text-dark-400"
            >
              {labels.unavailable}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function DonatePage() {
  const { locale, isRtl } = useI18n();
  const page = getDonateContent(locale);

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
        url: opportunity.url ?? `${origin}/donate#${opportunity.id}`,
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
          title={page.hero.title}
          description={page.hero.description}
          image={page.hero.image}
          imageAlt={page.hero.imageAlt}
          breadcrumbs={page.breadcrumbs}
        />

        <section className="bg-white py-16 md:py-24">
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
                {page.intro.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-4 py-2 text-sm font-bold text-primary-700">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {page.labels.officialNotice}
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="bg-[#faf8f8] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={14} threshold={0.18} once>
              <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{page.labels.opportunities}</span>
                  <span className="h-px w-8 bg-primary-200" />
                </div>
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                  {page.labels.opportunities}
                </h2>
              </div>
            </FadeContent>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {page.opportunities.map((opportunity, index) => (
                <DonationCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  labels={page.labels}
                  isRtl={isRtl}
                  index={index}
                />
              ))}
            </div>

            <div className="mt-8 rounded-[22px] border border-primary-100 bg-white p-5 text-start text-sm leading-relaxed text-dark-600 shadow-[0_14px_36px_rgba(40,12,18,0.06)]">
              <ExternalLink className="mb-3 h-5 w-5 text-primary-600" aria-hidden="true" />
              {page.labels.externalNotice}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
