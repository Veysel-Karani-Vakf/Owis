import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  Download,
  Eye,
  FileText,
  Gem,
  Landmark,
  PlayCircle,
  Target,
} from 'lucide-react';
import type { ReactNode } from 'react';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import SectionHeading from '@/components/ui/SectionHeading';
import { getAboutContent } from '@/data/about';
import { useI18n } from '@/i18n/useI18n';

const smoothEase = [0.22, 1, 0.36, 1] as const;

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.58, delay, ease: smoothEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function WaqfAboutPage() {
  const { locale, isRtl } = useI18n();
  const page = getAboutContent(locale).waqf;

  return (
    <>
      <PageSeo
        title={page.seo.title}
        description={page.seo.description}
        canonical={page.seo.canonical}
        type="article"
      />
      <main className="bg-white">
        <PageHero
          title={page.hero.title}
          description={page.hero.description}
          image={page.hero.image}
          breadcrumbs={page.breadcrumbs}
        />

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
            <FadeIn>
              <div className="mb-4 flex items-center gap-2 text-start">
                <span className="h-px w-8 bg-gold-400" />
                <span className="text-sm font-semibold text-gold-600">{page.intro.eyebrow}</span>
              </div>
              <h2 className="text-3xl font-bold text-dark-900 md:text-4xl">{page.intro.title}</h2>
              <div className="mt-6 space-y-4 text-start text-base leading-relaxed text-dark-600">
                {page.intro.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <a
                href={page.intro.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
              >
                <Download className="h-4 w-4" />
                {page.intro.downloadLabel}
                <ArrowUpRight className={`h-4 w-4 ${isRtl ? '-scale-x-100' : ''}`} />
              </a>
            </FadeIn>

            <FadeIn delay={0.08} className="grid gap-4 sm:grid-cols-2">
              {page.intro.facts.map((fact, index) => (
                <motion.div
                  key={fact.label}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.24 }}
                  className="rounded-2xl border border-primary-100 bg-warm p-5 text-start shadow-sm"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    {index === 0 ? <FileText className="h-5 w-5" /> : <Landmark className="h-5 w-5" />}
                  </div>
                  <p className="text-sm font-medium text-dark-500">{fact.label}</p>
                  <p className="mt-2 text-lg font-bold text-dark-900">{fact.value}</p>
                </motion.div>
              ))}
            </FadeIn>
          </div>
        </section>

        <section className="bg-warm py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <FadeIn>
                <SectionHeading
                  align="right"
                  eyebrow={page.video.title}
                  title={page.video.title}
                  description={page.video.description}
                />
              </FadeIn>

              <FadeIn delay={0.08}>
                <div className="relative overflow-hidden rounded-2xl border border-primary-100 bg-dark-950 shadow-2xl">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${page.video.videoId}?rel=0&modestbranding=1`}
                    title={page.video.title}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure"
                    allowFullScreen
                    className="aspect-video w-full"
                  />
                  <div className="pointer-events-none absolute start-4 top-4 flex items-center gap-2 rounded-full bg-dark-950/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    <PlayCircle className="h-4 w-4 text-primary-300" />
                    {page.video.title}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading title={page.goals.title} />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {page.goals.items.map((goal, index) => (
                <FadeIn key={goal} delay={index * 0.06}>
                  <div className="h-full rounded-2xl border border-primary-100 bg-white p-6 text-start shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <Target className="h-5 w-5" />
                    </div>
                    <p className="text-base font-semibold leading-relaxed text-dark-800">{goal}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-warm py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid gap-5 lg:grid-cols-3">
              <FadeIn>
                <div className="h-full rounded-2xl bg-primary-700 p-7 text-start text-white shadow-xl">
                  <Eye className="mb-5 h-8 w-8 text-gold-200" />
                  <h2 className="text-2xl font-bold">{page.identity.visionTitle}</h2>
                  <p className="mt-4 leading-relaxed text-white/78">{page.identity.vision}</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.08}>
                <div className="h-full rounded-2xl border border-primary-100 bg-white p-7 text-start shadow-sm">
                  <Target className="mb-5 h-8 w-8 text-primary-600" />
                  <h2 className="text-2xl font-bold text-dark-900">{page.identity.missionTitle}</h2>
                  <p className="mt-4 leading-relaxed text-dark-600">{page.identity.mission}</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.16}>
                <div className="h-full rounded-2xl border border-primary-100 bg-white p-7 text-start shadow-sm">
                  <Gem className="mb-5 h-8 w-8 text-primary-600" />
                  <h2 className="text-2xl font-bold text-dark-900">{page.identity.valuesTitle}</h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {page.identity.values.map((value) => (
                      <span
                        key={value}
                        className="rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
              <FadeIn>
                <SectionHeading align="right" title={page.methodology.title} />
              </FadeIn>
              <div className="grid gap-4">
                {page.methodology.items.map((item, index) => (
                  <FadeIn key={item} delay={index * 0.04}>
                    <div className="flex gap-4 rounded-2xl border border-primary-100 bg-white p-5 text-start shadow-sm">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="leading-relaxed text-dark-600">{item}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-dark-950 py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <FadeIn>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={page.president.image}
                  alt={page.president.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent" />
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="text-start">
                <p className="mb-3 text-sm font-semibold text-gold-300">{page.president.title}</p>
                <h2 className="text-3xl font-bold md:text-4xl">{page.president.name}</h2>
                <p className="mt-2 text-primary-200">{page.president.role}</p>
                <div className="mt-8 space-y-4 text-base leading-relaxed text-white/72">
                  {page.president.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading title={page.cycle.title} description={page.cycle.description} />
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {page.cycle.phases.map((phase, index) => (
                <FadeIn key={phase.title} delay={index * 0.08}>
                  <article className="h-full rounded-2xl border border-primary-100 bg-warm p-6 text-start shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-5 inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-primary-600 px-4 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-dark-900">{phase.title}</h3>
                    <p className="mt-4 leading-relaxed text-dark-600">{phase.description}</p>
                    {phase.bullets && (
                      <ul className="mt-5 space-y-3">
                        {phase.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-dark-600">
                            <Check className="mt-1 h-4 w-4 shrink-0 text-primary-600" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
