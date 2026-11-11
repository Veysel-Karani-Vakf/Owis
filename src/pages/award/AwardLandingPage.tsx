import { useMemo } from 'react';
import PageSeo from '@/components/internal/PageSeo';
import AwardAbout from '@/components/award/AwardAbout';
import AwardCategories from '@/components/award/AwardCategories';
import AwardEligibilityOverview from '@/components/award/AwardEligibilityOverview';
import AwardFaq from '@/components/award/AwardFaq';
import AwardFinalCta from '@/components/award/AwardFinalCta';
import AwardHero from '@/components/award/AwardHero';
import AwardSteps from '@/components/award/AwardSteps';
import { awardMedia, getAwardContent } from '@/data/award/content';
import { awardRoutes } from '@/data/award/routes';
import { useI18n } from '@/i18n/useI18n';

/** /volunteer-award — landing page of the Owais Volunteer Award 2026. */
export default function AwardLandingPage() {
  const { locale, content: siteContent } = useI18n();
  const content = getAwardContent(locale);

  const structuredData = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: content.name,
      description: content.seo.description,
      url: `${origin}${awardRoutes.landing}`,
      inLanguage: locale,
      publisher: { '@type': 'Organization', name: siteContent.siteConfig.name, url: origin },
    };
  }, [content, locale, siteContent.siteConfig.name]);

  return (
    <>
      <PageSeo
        title={content.seo.title}
        description={content.seo.description}
        image={awardMedia.share}
        structuredData={structuredData}
      />
      <main className="award-page overflow-x-clip bg-award-cream-50 text-award-ink">
        <AwardHero content={content} />
        <AwardAbout content={content} />
        <AwardCategories content={content} />
        <AwardEligibilityOverview content={content} />
        <AwardSteps content={content} />
        <AwardFaq content={content} />
        <AwardFinalCta content={content} />
      </main>
    </>
  );
}
