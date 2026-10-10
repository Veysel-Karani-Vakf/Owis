import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Scale, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import FeaturedMemberSlider from '@/components/structure/FeaturedMemberSlider';
import ParticipationCTA from '@/components/sections/ParticipationCTA';
import { getAboutContent, aboutRoutes } from '@/data/about';
import { useI18n } from '@/i18n/useI18n';
import { supabase } from '@/lib/supabase';
import { isPreviewFrame } from '@/cms/preview';

export default function AdministrativeStructurePage() {
  const { locale, isRtl } = useI18n();
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

      <main className="min-h-screen bg-[#f4f6f8] pb-20">
        {/* Page Hero */}
        <PageHero
          id="cms-structure-hero"
          title={page.hero.title}
          description={page.hero.description}
          image={page.hero.image}
          imageAlt={page.hero.imageAlt}
          breadcrumbs={page.breadcrumbs}
        />

        {/* Editorial Leadership Showcase (Section Navigation + Featured Member Slider + Thumbnails) */}
        <section id="cms-structure-chart" className="relative">
          <div id="cms-structure-intro" className="sr-only">
            <h2>{page.intro.title}</h2>
            <p>{page.intro.description}</p>
          </div>

          <FeaturedMemberSlider
            sections={page.sections}
            fallbackMembers={page.members}
            pageTitle={page.hero.title}
          />
        </section>

        {/* Governance & Institutional Integrity Card */}
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 md:px-8">
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
