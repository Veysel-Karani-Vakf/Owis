import { useMemo } from 'react';
import PageSeo from '@/components/internal/PageSeo';
import { LibraryPillNav } from '@/components/library/LibraryNav';
import ProfileRail from '@/components/library/profile/ProfileRail';
import { ProfileHeroChapter, ProfileCtaChapter } from '@/components/library/profile/ProfileHero';
import {
  ProfileIdentityChapter,
  ProfileProblemChapter,
  ProfileStoryChapter,
} from '@/components/library/profile/ProfileStoryChapters';
import { ProfilePillarsChapter } from '@/components/library/profile/ProfilePillarsDeck';
import {
  ProfileCreationChapter,
  ProfileCycleChapter,
  ProfileGovernanceChapter,
} from '@/components/library/profile/ProfileCycleChapters';
import { ProfilePioneersChapter } from '@/components/library/profile/ProfileTrackChapters';
import { ProfileTracksChapter } from '@/components/library/profile/ProfileTracksJourney';
import ProfileNumbersChapter from '@/components/library/profile/ProfileNumbers';
import ProfileParticipateChapter from '@/components/library/profile/ProfileParticipate';
import { getLibraryContent } from '@/data/library';
import { getLibraryProfileContent, libraryProfileRoute } from '@/data/library/profile';
import { useI18n } from '@/i18n/useI18n';

/**
 * «العرض التعريفي» — the library's cinematic presentation: one continuous
 * crimson reel of 13 chapters where scroll is the projector, closing on the
 * live "Owais in Numbers" record. Content is the `library-profile` site_pages
 * row (edited from the dashboard) layered over src/data/library/profile.ts.
 */
export default function LibraryProfilePage() {
  const { locale, content: siteContent, contentVersion } = useI18n();
  const content = getLibraryProfileContent(locale);
  const library = useMemo(() => getLibraryContent(locale), [locale, contentVersion]);

  const breadcrumbs = useMemo(
    () => [...library.breadcrumbs.index, { label: content.meta.title }],
    [library, content]
  );

  const chapterTitles = [
    content.hero.eyebrow,
    content.pillars.heading,
    content.problem.heading,
    content.story.heading,
    content.identity.heading,
    content.cycle.heading,
    content.creation.heading,
    content.investment.heading,
    content.tracks.heading,
    content.pioneers.heading,
    content.numbers.heading,
    content.participate.heading,
    content.cta.title,
  ];

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'PresentationDigitalDocument',
      name: content.meta.title,
      description: content.meta.seoDescription,
      inLanguage: locale,
      about: siteContent.siteConfig.name,
    }),
    [content, locale, siteContent]
  );

  return (
    <>
      <PageSeo
        title={`${content.meta.title} | ${siteContent.siteConfig.name}`}
        description={content.meta.seoDescription}
        canonical={libraryProfileRoute}
        image={content.hero.image}
        structuredData={structuredData}
      />

      <main className="profile-page bg-white">
        <ProfileRail titles={chapterTitles} chapterLabel={content.labels.chapter} />

        <ProfileHeroChapter content={content} breadcrumbs={breadcrumbs} />

        {/* In the flow (not pinned): the presentation keeps only its chapter rail fixed. */}
        <div className="mt-6">
          <LibraryPillNav active="profile" sticky={false} />
        </div>

        <ProfilePillarsChapter content={content} />
        <ProfileProblemChapter content={content} />
        <ProfileStoryChapter content={content} />
        <ProfileIdentityChapter content={content} />
        <ProfileCycleChapter content={content} />
        <ProfileCreationChapter content={content} />
        <ProfileGovernanceChapter content={content} />
        <ProfileTracksChapter content={content} />
        <ProfilePioneersChapter content={content} />
        <ProfileNumbersChapter content={content} />
        <ProfileParticipateChapter content={content} />
        <ProfileCtaChapter content={content} />
      </main>
    </>
  );
}
