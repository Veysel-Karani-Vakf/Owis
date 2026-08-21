import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Handshake, Lightbulb, MessageSquare, PhoneCall } from 'lucide-react';
import { useMemo } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import ContactCard from '@/components/participate/ContactCard';
import ParticipateForm from '@/components/participate/ParticipateForm';
import {
  getParticipateContent,
  getParticipatePageBySlug,
  participateRoutes,
  type ParticipatePageKey,
} from '@/data/participate';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';
import { useI18n } from '@/i18n/useI18n';

const navIcons = {
  shareIdeas: Lightbulb,
  complaintsSuggestions: MessageSquare,
  volunteer: Handshake,
  contact: PhoneCall,
} satisfies Record<ParticipatePageKey, typeof Lightbulb>;

function phoneFromWhatsapp(href: string) {
  const match = href.match(/wa\.me\/(\d+)/i);
  return match ? `+${match[1]}` : undefined;
}

export default function ParticipatePage() {
  const { slug } = useParams();
  const location = useLocation();
  const { locale, isRtl, content: siteContent } = useI18n();
  const participate = getParticipateContent(locale);
  const page = getParticipatePageBySlug(locale, slug);
  const shouldReduceMotion = useReducedMotion();
  const isNarrow = useNarrowScreen();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const structuredData = useMemo(() => {
    if (!page?.contact) return undefined;
    const origin = typeof window === 'undefined' ? '' : window.location.origin;

    return {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: page.hero.title,
      description: page.hero.description,
      url: `${origin}${page.route}`,
      mainEntity: {
        '@type': 'Organization',
        name: siteContent.siteConfig.name,
        url: origin,
        sameAs: page.contact.socialLinks.map((link) => link.href),
        contactPoint: page.contact.directLinks.map((link) => ({
          '@type': 'ContactPoint',
          contactType: link.label,
          telephone: phoneFromWhatsapp(link.href),
          availableLanguage: ['Arabic', 'Turkish'],
        })),
      },
    };
  }, [page, siteContent.siteConfig.name]);

  if (!page) {
    return <Navigate to={participateRoutes.shareIdeas} replace />;
  }

  return (
    <>
      <PageSeo
        title={`${page.hero.title} | ${siteContent.siteConfig.name}`}
        description={page.seo.description}
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
          <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
            <FadeContent blur={false} duration={650} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <div className="text-start">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{page.intro.eyebrow}</span>
                </div>
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{page.intro.title}</h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-dark-600">
                  {page.intro.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </FadeContent>

            <FadeContent blur={false} duration={650} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <aside className="rounded-[22px] border border-primary-100 bg-[#faf8f8] p-5 text-start shadow-[0_18px_48px_rgba(40,12,18,0.06)] md:p-6">
                <h2 className="text-xl font-bold text-dark-950">{participate.labels.sectionTitle}</h2>
                <div className="mt-5 grid gap-3">
                  {participate.nav.map((item) => {
                    const Icon = navIcons[item.key];
                    const active = location.pathname === item.href;
                    const targetHash = item.key === 'contact' ? '#participate-contact' : '#participate-form';

                    return (
                      <Link
                        key={item.href}
                        to={`${item.href}${targetHash}`}
                        onClick={() => {
                          if (!active) return;
                          const target = document.getElementById(targetHash.slice(1));
                          if (!target) return;
                          const top = target.getBoundingClientRect().top + window.scrollY - 96;
                          window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
                        }}
                        aria-current={active ? 'page' : undefined}
                        className={`group flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-start transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 ${
                          active
                            ? 'border-primary-500 bg-primary-600 text-white shadow-[0_14px_30px_rgba(156,16,6,0.2)]'
                            : 'border-white bg-white text-dark-800 hover:border-primary-200 hover:text-primary-700'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              active ? 'bg-white/15 text-white' : 'bg-primary-50 text-primary-700'
                            }`}
                          >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span className="text-sm font-bold leading-snug">{item.label}</span>
                        </span>
                        <ArrowIcon
                          className={`h-4 w-4 shrink-0 transition-transform ${
                            isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                          }`}
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </div>
              </aside>
            </FadeContent>
          </div>
        </section>

        {page.form && (
          <section id="participate-form" className="bg-[#faf8f8] py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-8">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isNarrow ? 12 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: isNarrow ? 0.12 : 0.18,
                  margin: isNarrow ? '0px 0px -8% 0px' : '0px 0px -10% 0px',
                }}
                transition={{ duration: shouldReduceMotion ? 0.01 : isNarrow ? 0.44 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <ParticipateForm
                  form={page.form}
                  sourceUrl={page.sourceUrl}
                  labels={participate.labels}
                  isRtl={isRtl}
                />
              </motion.div>
            </div>
          </section>
        )}

        {page.contact && (
          <>
            <section id="participate-contact" className="bg-[#faf8f8] py-16 md:py-24">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={16} threshold={0.18} once>
                  <div className="mb-10 max-w-3xl text-start">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-px w-8 bg-primary-200" />
                      <span className="text-sm font-semibold text-primary-700">{page.contact.directTitle}</span>
                    </div>
                    <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                      {page.contact.directTitle}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-dark-600">{page.contact.directDescription}</p>
                  </div>
                </FadeContent>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {page.contact.directLinks.map((link, index) => (
                    <ContactCard key={link.id} link={link} labels={participate.labels} index={index} />
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white py-16 md:py-24">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={16} threshold={0.18} once>
                  <div className="mb-10 max-w-3xl text-start">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-px w-8 bg-primary-200" />
                      <span className="text-sm font-semibold text-primary-700">{page.contact.socialTitle}</span>
                    </div>
                    <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                      {page.contact.socialTitle}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-dark-600">{page.contact.socialDescription}</p>
                  </div>
                </FadeContent>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {page.contact.socialLinks.map((link, index) => (
                    <ContactCard key={link.id} link={link} labels={participate.labels} index={index} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
