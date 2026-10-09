import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MapPin,
  Building2,
  Compass,
} from 'lucide-react';
import Breadcrumbs from '@/components/internal/Breadcrumbs';
import PageSeo from '@/components/internal/PageSeo';
import PioneerPortrait from '@/components/pioneers/PioneerPortrait';
import { getPioneersContent, getPioneerBySlug } from '@/data/pioneers';
import { useI18n } from '@/i18n/useI18n';

export default function PioneerBioPage() {
  const { slug } = useParams<{ slug: string }>();
  const { locale, isRtl, contentVersion } = useI18n();
  const content = useMemo(() => getPioneersContent(locale), [locale, contentVersion]);
  const pioneer = useMemo(
    () => content.pioneers.find((p) => p.slug === slug),
    [content, slug],
  );

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  if (content.visible === false) {
    return <Navigate to="/programs/yemen-pioneers" replace />;
  }

  if (!pioneer) {
    return <Navigate to="/programs/yemen-pioneers/pioneers" replace />;
  }

  // Find previous and next pioneers for navigation
  const currentIndex = content.pioneers.findIndex((p) => p.slug === pioneer.slug);
  const prevPioneer = currentIndex > 0 ? content.pioneers[currentIndex - 1] : null;
  const nextPioneer =
    currentIndex < content.pioneers.length - 1 ? content.pioneers[currentIndex + 1] : null;

  const breadcrumbItems = [
    { label: content.breadcrumbs.home, href: '/' },
    { label: content.breadcrumbs.programs, href: content.breadcrumbs.programsHref },
    { label: content.breadcrumbs.yemenPioneers, href: content.breadcrumbs.yemenPioneersHref },
    { label: content.breadcrumbs.pioneers, href: '/programs/yemen-pioneers/pioneers' },
    { label: pioneer.name },
  ];

  return (
    <>
      <PageSeo
        title={`${pioneer.name} | ${content.seo.title}`}
        description={pioneer.shortIntro}
        image={pioneer.image}
      />

      <main className="min-h-screen bg-slate-50/50 pb-24 pt-24 md:pt-32">
        {/* Breadcrumbs Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Back Link to Gallery */}
        <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to={`/programs/yemen-pioneers/pioneers${pioneer.cohortId ? `?cohort=${pioneer.cohortId}` : ''}`}
            className="group inline-flex items-center gap-2 text-xs font-semibold text-dark-500 transition-colors hover:text-primary-700 sm:text-sm"
          >
            <PrevIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>{content.bioPage.backToGallery}</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="mt-6 py-6 md:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-100 sm:p-8 md:p-12">
              <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Large Portrait Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="lg:col-span-5"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-dark-900 shadow-md ring-1 ring-black/5 sm:rounded-3xl">
                    <PioneerPortrait
                      image={pioneer.image}
                      name={pioneer.name}
                      hasPortrait={pioneer.hasPortrait}
                      imagePosition={pioneer.imagePosition}
                      loading="eager"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent" />
                  </div>
                </motion.div>

                {/* Profile Overview and Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="flex flex-col justify-center text-start lg:col-span-7"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-700">
                      <UserCheck className="h-3.5 w-3.5 text-primary-600" />
                      <span>{pioneer.role}</span>
                    </div>
                    {pioneer.cohortName && (
                      <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold-300 bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-800">
                        <Award className="h-3.5 w-3.5 text-gold-600" />
                        <span>{pioneer.cohortName}</span>
                      </div>
                    )}
                  </div>

                  <h1 className="mt-4 font-brand text-3xl font-bold tracking-tight text-dark-950 sm:text-4xl md:text-5xl">
                    {pioneer.name}
                  </h1>

                  <div className="mt-5 rounded-2xl bg-slate-50/80 p-5 border border-slate-100">
                    <p className="text-sm font-medium leading-relaxed text-dark-700 sm:text-base">
                      {pioneer.shortIntro}
                    </p>
                  </div>

                  {/* Academic & Location Metadata Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                    {pioneer.origin && (
                      <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm sm:p-4">
                        <div className="flex items-center gap-2 text-primary-600">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-bold text-dark-500">
                            {content.bioPage.originLabel}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs font-bold text-dark-900 sm:text-sm">
                          {pioneer.origin}
                        </p>
                      </div>
                    )}

                    {pioneer.major && (
                      <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm sm:p-4">
                        <div className="flex items-center gap-2 text-primary-600">
                          <Compass className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-bold text-dark-500">
                            {content.bioPage.majorLabel}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs font-bold text-dark-900 sm:text-sm">
                          {pioneer.major}
                        </p>
                      </div>
                    )}

                    {pioneer.university && (
                      <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm sm:p-4">
                        <div className="flex items-center gap-2 text-primary-600">
                          <Building2 className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-bold text-dark-500">
                            {content.bioPage.universityLabel}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs font-bold text-dark-900 sm:text-sm">
                          {pioneer.university}
                        </p>
                      </div>
                    )}

                    {pioneer.degree && (
                      <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm sm:p-4">
                        <div className="flex items-center gap-2 text-primary-600">
                          <GraduationCap className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-bold text-dark-500">
                            {content.bioPage.degreeLabel}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs font-bold text-dark-900 sm:text-sm">
                          {pioneer.degree}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Main Content Column */}
              <div className="space-y-8 lg:col-span-8">
                {/* Full Biography */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h2 className="font-brand text-xl font-bold text-dark-900 sm:text-2xl">
                      {content.bioPage.overviewTitle}
                    </h2>
                  </div>

                  <div className="space-y-4 text-sm leading-relaxed text-dark-700 sm:text-base">
                    {pioneer.fullBio.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </motion.div>

                {/* Achievements */}
                {pioneer.achievements.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <Award className="h-5 w-5" />
                      </div>
                      <h2 className="font-brand text-xl font-bold text-dark-900 sm:text-2xl">
                        {content.bioPage.achievementsTitle}
                      </h2>
                    </div>

                    <ul className="space-y-3">
                      {pioneer.achievements.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-dark-700 sm:text-base">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-600" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Contribution to Yemen Pioneers Program */}
                {pioneer.programContribution.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50/50 via-white to-white p-6 shadow-sm sm:p-8"
                  >
                    <div className="mb-5 flex items-center gap-3 border-b border-primary-100 pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
                        <HeartHandshake className="h-5 w-5" />
                      </div>
                      <h2 className="font-brand text-xl font-bold text-dark-900 sm:text-2xl">
                        {content.bioPage.programContributionTitle}
                      </h2>
                    </div>

                    <ul className="space-y-3">
                      {pioneer.programContribution.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-dark-700 sm:text-base">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-600" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              {/* Sidebar Column: Education & Career */}
              <div className="space-y-8 lg:col-span-4">
                {/* Educational Background */}
                {pioneer.education.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7"
                  >
                    <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <GraduationCap className="h-5 w-5 text-primary-600" />
                      <h3 className="font-brand text-lg font-bold text-dark-900">
                        {content.bioPage.educationTitle}
                      </h3>
                    </div>

                    <ul className="space-y-3">
                      {pioneer.education.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-dark-600 sm:text-sm">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Professional Career */}
                {pioneer.career.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7"
                  >
                    <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3">
                      <Briefcase className="h-5 w-5 text-primary-600" />
                      <h3 className="font-brand text-lg font-bold text-dark-900">
                        {content.bioPage.careerTitle}
                      </h3>
                    </div>

                    <ul className="space-y-3">
                      {pioneer.career.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-dark-600 sm:text-sm">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Previous / Next Pioneer Navigation */}
        <section className="mt-8 border-t border-slate-200 py-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {prevPioneer ? (
              <Link
                to={`/programs/yemen-pioneers/pioneers/${prevPioneer.slug}`}
                className="group flex items-center gap-2 text-xs font-semibold text-dark-600 hover:text-primary-700 sm:text-sm"
              >
                <PrevIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <div className="text-start">
                  <span className="block text-[11px] text-dark-400">{content.bioPage.prevPioneer}</span>
                  <span>{prevPioneer.name}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            <Link
              to={`/programs/yemen-pioneers/pioneers${pioneer.cohortId ? `?cohort=${pioneer.cohortId}` : ''}`}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-700 sm:text-sm"
            >
              {content.bioPage.backToGallery}
            </Link>

            {nextPioneer ? (
              <Link
                to={`/programs/yemen-pioneers/pioneers/${nextPioneer.slug}`}
                className="group flex items-center gap-2 text-xs font-semibold text-dark-600 hover:text-primary-700 sm:text-sm"
              >
                <div className="text-end">
                  <span className="block text-[11px] text-dark-400">{content.bioPage.nextPioneer}</span>
                  <span>{nextPioneer.name}</span>
                </div>
                <NextIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      </main>
    </>
  );
}

