import { useMemo } from 'react';
import PageSeo from '@/components/internal/PageSeo';
import AwardAbout from '@/components/award/AwardAbout';
import AwardCategories from '@/components/award/AwardCategories';
import AwardEligibilityOverview from '@/components/award/AwardEligibilityOverview';
import AwardFaq from '@/components/award/AwardFaq';
import AwardFinalCta from '@/components/award/AwardFinalCta';
import AwardHero from '@/components/award/AwardHero';
import AwardSteps from '@/components/award/AwardSteps';
import { awardSectionHidden, getAwardContent, type AwardHideableSection } from '@/data/award/content';
import { awardRoutes } from '@/data/award/routes';
import { useI18n } from '@/i18n/useI18n';

/** /volunteer-award — landing page of the Owais Volunteer Award 2026. */
export default function AwardLandingPage() {
  const { locale, content: siteContent } = useI18n();
  const content = getAwardContent(locale);
  // Every section after the hero can be taken off the page from the dashboard.
  const show = (section: AwardHideableSection) => !awardSectionHidden(content, section);

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
        image={content.media.share}
        structuredData={structuredData}
      />
      <main className="award-page overflow-x-clip bg-white text-dark-900">
        <AwardHero content={content} />
        {show('about') && <AwardAbout content={content} />}
        {show('categories') && <AwardCategories content={content} />}
        {show('eligibility') && <AwardEligibilityOverview content={content} />}
        {show('steps') && <AwardSteps content={content} />}
        {show('faq') && <AwardFaq content={content} />}
        {show('cta') && <AwardFinalCta content={content} />}
      </main>
    </>
  );
}
