import { useMemo } from 'react';
import { ArrowLeft, ArrowRight, Award, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import PioneersAccordionGallery from '@/components/pioneers/PioneersAccordionGallery';
import { getPioneersContent } from '@/data/pioneers';
import { useI18n } from '@/i18n/useI18n';

export default function PioneersGalleryPage() {
  const { locale, isRtl, contentVersion } = useI18n();
  const content = useMemo(() => getPioneersContent(locale), [locale, contentVersion]);

  if (content.visible === false) {
    return <Navigate to="/programs/yemen-pioneers" replace />;
  }

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const breadcrumbItems = [
    { label: content.breadcrumbs.home, href: '/' },
    { label: content.breadcrumbs.programs, href: content.breadcrumbs.programsHref },
    { label: content.breadcrumbs.yemenPioneers, href: content.breadcrumbs.yemenPioneersHref },
    { label: content.breadcrumbs.pioneers },
  ];

  return (
    <>
      <PageSeo
        title={content.seo.title}
        description={content.seo.description}
        image="/programs/yemen-pioneers-hero.jpeg"
      />

      <main className="min-h-screen bg-slate-50/50 pb-14">
        <PageHero
          title={content.header.title}
          description={content.header.description}
          image="/programs/yemen-pioneers-hero.jpeg"
          imageAlt={content.header.title}
          breadcrumbs={breadcrumbItems}
        />

        {/* Program context and link back to the main program page. */}
        <section className="border-b border-slate-200/80 bg-white py-6 md:py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:px-6 md:flex-row md:text-start lg:px-8">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span>{content.header.eyebrow}</span>
            </div>
            <Link
              to={content.header.programConceptUrl}
              className="btn-border-run group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-dark-800 shadow-sm ring-1 ring-dark-200 transition-all hover:bg-slate-50 hover:text-primary-700 sm:text-sm"
            >
              <span>{content.header.viewProgramConcept}</span>
              <ArrowIcon
                className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
              />
            </Link>
          </div>
        </section>

        {/* The Interactive Accordion Gallery Section */}
        <section className="py-8 md:py-10">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <PioneersAccordionGallery
              cohorts={content.cohorts}
              pioneers={content.pioneers}
              ctaLabel={content.gallery.viewBiography}
            />
          </div>
        </section>

        {/* Supporting Context & Pillars */}
        <section className="mt-10 border-t border-slate-200/80 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-brand text-2xl font-bold text-dark-900 md:text-3xl">
                {locale === 'ar'
                  ? 'رؤية الريادة والتمكين في وقف أويس القرني'
                  : locale === 'tr'
                  ? 'Veysel Karani Vakfı’nda Öncülük ve Güçlendirme Vizyonu'
                  : 'The Vision of Leadership & Empowerment at Veysel Karani Waqf'}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-dark-600 md:text-base">
                {locale === 'ar'
                  ? 'يعمل برنامج رواد اليمن على اكتشاف الكفاءات المتميزة ورعايتها أكاديمياً وقيادياً، لتكون ركيزة أساسية في بناء اليمن ونهضته.'
                  : locale === 'tr'
                  ? 'Yemen Öncüleri Programı, seçkin yetenekleri keşfedip onları akademik ve liderlik açısından destekleyerek Yemen’in kalkınmasında temel bir yapı taşı haline getirmeyi hedefler.'
                  : 'The Yemen Pioneers Program identifies exceptional talent, nurturing them academically and professionally to serve as the pillars of Yemen’s renewal.'}
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/70 p-6 text-center transition-all hover:border-primary-100 hover:bg-white hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-dark-900">
                  {locale === 'ar' ? 'التعليم والبحث النوعي' : locale === 'tr' ? 'Nitelikli Eğitim ve Araştırma' : 'Quality Education & Research'}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-dark-500 md:text-sm">
                  {locale === 'ar'
                    ? 'ابتعاث وتأهيل الطلاب المتميزين في أرقى الجامعات العالمية المتخصصة.'
                    : locale === 'tr'
                    ? 'Başarılı öğrencilerin dünyanın önde gelen üniversitelerinde burslu eğitimi.'
                    : 'Scholarships and sponsorship for top students at world-class universities.'}
                </p>
              </div>

              <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/70 p-6 text-center transition-all hover:border-primary-100 hover:bg-white hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-dark-900">
                  {locale === 'ar' ? 'بناء القيادات والقيم' : locale === 'tr' ? 'Liderlik ve Değerler İnşası' : 'Leadership & Values Development'}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-dark-500 md:text-sm">
                  {locale === 'ar'
                    ? 'ملتقيات سنوية ودورات تدريبية مكثفة في مهارات القيادة والمبادرة المجتمعية.'
                    : locale === 'tr'
                    ? 'Yıllık liderlik kampları ve toplumsal girişimcilik becerileri eğitimleri.'
                    : 'Annual leadership forums and intensive workshops in civic empowerment.'}
                </p>
              </div>

              <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/70 p-6 text-center transition-all hover:border-primary-100 hover:bg-white hover:shadow-md sm:col-span-2 lg:col-span-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-dark-900">
                  {locale === 'ar' ? 'الوقف التشاركي المستدام' : locale === 'tr' ? 'Sürdürülebilir Katılımcı Vakıf' : 'Sustainable Participatory Waqf'}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-dark-500 md:text-sm">
                  {locale === 'ar'
                    ? 'تأمين الموارد الاستثمارية الوقفية الدائمة لضمان استمرار رعاية الأجيال القادمة.'
                    : locale === 'tr'
                    ? 'Gelecek nesillerin eğitimini güvence altına alan kalıcı vakıf yatırımları.'
                    : 'Securing enduring endowment yields to empower future generations continuously.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

