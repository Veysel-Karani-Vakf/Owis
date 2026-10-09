import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShieldCheck, Scale, FileText, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import SectionHeading from '@/components/ui/SectionHeading';
import OrgChartTree from '@/components/structure/OrgChartTree';
import OrgSectionCards from '@/components/structure/OrgSectionCards';
import ParticipationCTA from '@/components/sections/ParticipationCTA';
import { getAboutContent, aboutRoutes } from '@/data/about';
import { useI18n } from '@/i18n/useI18n';
import { supabase } from '@/lib/supabase';
import { isPreviewFrame } from '@/cms/preview';

export default function AdministrativeStructurePage() {
  const { locale, isRtl, contentVersion } = useI18n();
  const page = getAboutContent(locale).structure;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setIsAdminUser(true);
      }
    });
  }, []);

  const isPreview = isPreviewFrame() || isAdminUser;
  const isHidden = page.published === false;

  const governanceHeading =
    locale === 'ar'
      ? 'الحوكمة المؤسسية والشفافية'
      : locale === 'tr'
      ? 'Kurumsal Yönetişim ve Şeffaflık'
      : 'Corporate Governance & Transparency';

  const governanceText =
    locale === 'ar'
      ? 'تخضع كافة أعمال الهيكل الإداري لمنظومة الحوكمة والسياسات المعتمدة في وقف أويس القرني لضمان النزاهة والامتثال وإدارة المخاطر.'
      : locale === 'tr'
      ? 'İdari yapının tüm faaliyetleri, dürüstlük, uyum ve risk yönetimini güvence altına alan Veysel Karani Vakfı onaylı yönetişim sistemine tabidir.'
      : 'All administrative operations comply with the approved governance framework and policies of Veysel Karani Waqf to safeguard integrity and compliance.';

  const governanceCta =
    locale === 'ar'
      ? 'الاطلاع على نظام الحوكمة والسياسات'
      : locale === 'tr'
      ? 'Yönetişim Sistemi ve Politikaları İnceleyin'
      : 'Explore Governance System & Policies';

  if (isHidden && !isPreview) {
    return (
      <>
        <PageSeo
          title={page.seo.title}
          description={page.seo.description}
          canonical={page.seo.canonical}
        />
        <main className="min-h-screen bg-slate-50/70 py-24 sm:py-32 px-4 flex items-center justify-center">
          <div className="mx-auto max-w-xl w-full text-center bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200/80">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-xs">
              <EyeOff className="h-10 w-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-950 mb-4 tracking-tight">
              {locale === 'ar'
                ? 'صفحة الهيكل الإداري قيد التحديث'
                : locale === 'tr'
                ? 'İdari Yapı Sayfası Güncelleniyor'
                : 'Administrative Structure Under Update'}
            </h1>
            <p className="text-dark-600 text-base leading-relaxed mb-8">
              {locale === 'ar'
                ? 'يجري حالياً تحديث واعتماد تشكيلات الهيئات التنظيمية ومجالس الوقف المؤسسية. سيتم إتاحة الصفحة مجدداً فور اكتمال التحديثات.'
                : locale === 'tr'
                ? 'Veysel Karani Vakfı idari ve kurumsal heyet yapılanması güncellenmektedir. Sayfa en kısa sürede tekrar yayına alınacaktır.'
                : 'The administrative structure and organizational bodies of Veysel Karani Waqf are currently undergoing updates and will be available soon.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-700 transition-colors"
              >
                {locale === 'ar' ? 'العودة للرئيسية' : locale === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
              </Link>
              <Link
                to="/about/waqf"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-dark-700 hover:bg-slate-50 transition-colors"
              >
                {locale === 'ar' ? 'التعريف بالوقف' : locale === 'tr' ? 'Vakıf Hakkında' : 'About Waqf'}
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageSeo
        title={page.seo.title}
        description={page.seo.description}
        canonical={page.seo.canonical}
      />

      {isHidden && (
        <div className="sticky top-0 z-50 bg-amber-500 text-white px-4 py-2 text-center text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2">
          <EyeOff className="h-4 w-4 shrink-0" />
          <span>
            {locale === 'ar'
              ? 'تنبيه إداري: هذه الصفحة مخفية حالياً عن الزوار على الموقع ومتاحة للمعاينة فقط.'
              : locale === 'tr'
              ? 'Yönetici Uyarısı: Bu sayfa şu anda ziyaretçilerden gizlidir ve yalnızca önizleme modunda görünmektedir.'
              : 'Admin Notice: This page is currently hidden from public visitors and visible in preview mode only.'}
          </span>
        </div>
      )}

      <main className="min-h-screen bg-slate-50/60 pb-20">
        {/* Page Hero */}
        <PageHero
          id="cms-structure-hero"
          title={page.hero.title}
          description={page.hero.description}
          image={page.hero.image}
          imageAlt={page.hero.imageAlt}
          breadcrumbs={page.breadcrumbs}
        />

        {/* Introduction Section */}
        <section id="cms-structure-intro" className="relative pt-16 pb-6 md:pt-20 md:pb-8">
          <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
            <SectionHeading
              eyebrow={page.intro.eyebrow}
              title={page.intro.title}
              description={page.intro.subtitle}
              align="center"
            />

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg leading-relaxed text-dark-600 max-w-3xl mx-auto"
            >
              {page.intro.description}
            </motion.p>
          </div>
        </section>

        {/* Organizational Sections (All bodies rendered in configured order) */}
        {page.sections && page.sections.length > 0 ? (
          page.sections
            .filter((section) => section.published !== false)
            .sort((a, b) => a.order - b.order)
            .map((section, index) => {
              const isFirst = index === 0;
              return (
                <section
                  key={section.id || section.slug}
                  id={`cms-structure-${section.slug}`}
                  className={`relative ${
                    isFirst
                      ? 'py-4 md:py-8'
                      : 'pt-16 pb-8 md:pt-20 md:pb-12 border-t border-slate-200/80'
                  }`}
                >
                  {isFirst ? (
                    <div className="mx-auto max-w-4xl px-4 text-center md:px-8 mb-6">
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1 text-xs font-bold text-primary-700 border border-primary-100 shadow-xs">
                        <span>01</span>
                        <span>•</span>
                        <span>{section.title}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto max-w-4xl px-4 text-center md:px-8 mb-8 md:mb-12">
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1 text-xs font-bold text-primary-700 border border-primary-100 mb-3 shadow-xs">
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <span>•</span>
                        <span>{section.title}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight">
                        {section.title}
                      </h2>
                      {section.description && (
                        <p className="mt-3 text-base sm:text-lg leading-relaxed text-dark-600 max-w-3xl mx-auto">
                          {section.description}
                        </p>
                      )}
                    </div>
                  )}

                  {section.layoutType === 'chart' ? (
                    <OrgChartTree members={section.members} />
                  ) : (
                    <OrgSectionCards section={section} />
                  )}
                </section>
              );
            })
        ) : (
          <section id="cms-structure-chart" className="py-4 md:py-8">
            <OrgChartTree members={page.members} />
          </section>
        )}

        {/* Governance & Institutional Integrity Card */}
        <section className="mx-auto max-w-5xl px-4 py-10 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 p-6 sm:p-8 md:p-10 text-white shadow-xl">
            <div className="absolute -end-24 -top-24 h-64 w-64 rounded-full bg-primary-600/15 blur-3xl" />
            <div className="absolute -start-24 -bottom-24 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl text-start">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-gold-300 backdrop-blur-md mb-3">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{governanceHeading}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                  {governanceHeading}
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/80">
                  {governanceText}
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  to={aboutRoutes.governance}
                  className="btn-border-run btn-border-run--light inline-flex items-center gap-2.5 rounded-xl bg-white px-5 py-3 text-sm font-bold text-dark-950 transition-all hover:bg-gold-50 hover:text-primary-700 shadow-md"
                >
                  <Scale className="h-4 w-4 text-primary-600" />
                  <span>{governanceCta}</span>
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Participation Call to Action */}
        <ParticipationCTA />
      </main>
    </>
  );
}

