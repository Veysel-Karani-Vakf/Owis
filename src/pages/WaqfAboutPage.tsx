import {
  ArrowUpRight,
  Check,
  Download,
  Eye,
  FileText,
  Gem,
  HandHeart,
  Landmark,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumbs from '@/components/internal/Breadcrumbs';
import PageSeo from '@/components/internal/PageSeo';
import CreditTiltCard from '@/components/effects/CreditTiltCard';
import FadeContent from '@/components/effects/FadeContent';
import ScrollMask from '@/components/effects/ScrollMask';
import ScrollStack from '@/components/effects/ScrollStack';
import SpotlightCard from '@/components/effects/SpotlightCard';
import ParticipationCTA from '@/components/sections/ParticipationCTA';
import SectionHeading from '@/components/ui/SectionHeading';
import { getAboutContent } from '@/data/about';
import { useI18n } from '@/i18n/useI18n';

const phaseIcons: LucideIcon[] = [Landmark, TrendingUp, HandHeart];
const factIcons: LucideIcon[] = [FileText, Landmark, FileText, Check];
const sectionReveal = {
  duration: 520,
  easing: 'ease-out',
  initialOpacity: 0,
  yOffset: 10,
  threshold: 0.22,
} as const;

const softStagger = (index: number) => index * 35;

export default function WaqfAboutPage() {
  const { locale, isRtl } = useI18n();
  const page = getAboutContent(locale).waqf;
  const introVideoRef = useRef<HTMLDivElement>(null);
  const introVideoIframeRef = useRef<HTMLIFrameElement>(null);
  const introVideoInViewRef = useRef(false);
  const [introVideoStarted, setIntroVideoStarted] = useState(false);
  const embedOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const introVideoSrc = `https://www.youtube-nocookie.com/embed/${
    page.video.videoId
  }?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1&controls=1&enablejsapi=1${
    embedOrigin ? `&origin=${encodeURIComponent(embedOrigin)}` : ''
  }`;

  const identityCards: {
    title: string;
    icon: LucideIcon;
    body?: string;
    bullets?: string[];
    featured?: boolean;
  }[] = [
    {
      title: page.identity.visionTitle,
      icon: Eye,
      body: page.identity.vision,
      featured: true,
    },
    {
      title: page.identity.missionTitle,
      icon: Target,
      body: page.identity.mission,
    },
    {
      title: page.goals.title,
      icon: Landmark,
      bullets: page.goals.items,
    },
    {
      title: page.identity.valuesTitle,
      icon: Gem,
      bullets: page.identity.values,
    },
  ];

  const sendIntroVideoCommand = useCallback((command: 'playVideo' | 'pauseVideo') => {
    const iframeWindow = introVideoIframeRef.current?.contentWindow;
    if (!iframeWindow) return;

    iframeWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: command,
        args: [],
      }),
      'https://www.youtube-nocookie.com'
    );
  }, []);

  useEffect(() => {
    const element = introVideoRef.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      introVideoInViewRef.current = true;
      setIntroVideoStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        introVideoInViewRef.current = entry.isIntersecting;

        if (entry.isIntersecting) {
          setIntroVideoStarted(true);
          window.setTimeout(() => sendIntroVideoCommand('playVideo'), 160);
          return;
        }

        sendIntroVideoCommand('pauseVideo');
      },
      {
        threshold: 0.42,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [sendIntroVideoCommand]);

  return (
    <>
      <PageSeo
        title={page.seo.title}
        description={page.seo.description}
        canonical={page.seo.canonical}
        type="article"
      />
      <main className="bg-white">
        <ScrollMask
          src={page.hero.image}
          alt=""
          variant="wipe"
          angle={108}
          originY={52}
          zoom={1}
          fit="contain"
          radius={0}
          overlay={0.48}
          revealContent
          calm
        >
          <div className="mb-5">
            <Breadcrumbs items={page.breadcrumbs} light />
          </div>
          <div className="max-w-3xl text-start">
            <h1 className="text-balance text-2xl font-bold leading-tight text-white sm:text-3xl md:text-5xl lg:text-5xl">
              {page.intro.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {page.hero.description}
            </p>
          </div>
        </ScrollMask>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <FadeContent {...sectionReveal}>
              <div className="text-start">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{page.intro.eyebrow}</span>
                </div>
                <h2 className="text-3xl font-bold text-dark-900 md:text-4xl">{page.intro.title}</h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-dark-600">
                  {page.intro.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <a
                  href={page.intro.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-800 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-700"
                >
                  <Download className="h-4 w-4" />
                  {page.intro.downloadLabel}
                  <ArrowUpRight className={`h-4 w-4 ${isRtl ? '-scale-x-100' : ''}`} />
                </a>
              </div>
            </FadeContent>

            <FadeContent {...sectionReveal} delay={70}>
              <div
                ref={introVideoRef}
                data-video-trigger="waqf-intro"
                className="relative aspect-video w-full overflow-hidden rounded-[18px] border border-primary-100 bg-dark-950 text-start shadow-[0_22px_70px_rgba(35,15,20,0.18)]"
              >
                {introVideoStarted ? (
                  <iframe
                    ref={introVideoIframeRef}
                    src={introVideoSrc}
                    title={page.video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => {
                      if (introVideoInViewRef.current) {
                        window.setTimeout(() => sendIntroVideoCommand('playVideo'), 160);
                      }
                    }}
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <>
                    <img
                      src={page.hero.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/72 via-dark-950/30 to-dark-950/12" />
                  </>
                )}
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="bg-warm py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent {...sectionReveal}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {page.intro.facts.map((fact, index) => {
                  const FactIcon = factIcons[index] ?? FileText;

                  return (
                    <CreditTiltCard
                      key={fact.label}
                      rotationIntensity={5.5}
                      scaleOnHover={1.012}
                      shineColor="rgba(255, 235, 238, 0.78)"
                      className="rounded-[18px] border border-primary-100 bg-white p-5 text-start shadow-[0_14px_38px_rgba(35,15,20,0.06)] hover:border-primary-200 hover:shadow-[0_22px_54px_rgba(35,15,20,0.12)]"
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                        <FactIcon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-dark-500">{fact.label}</p>
                      <p className="mt-2 text-lg font-bold text-dark-900">{fact.value}</p>
                    </CreditTiltCard>
                  );
                })}
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent {...sectionReveal}>
              <SectionHeading title={page.goals.title} />
            </FadeContent>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {identityCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <FadeContent key={card.title} {...sectionReveal} delay={softStagger(index)}>
                    <SpotlightCard
                      spotlightColor="rgba(180, 35, 58, 0.12)"
                      className={`h-full rounded-[18px] border p-6 text-start shadow-[0_14px_38px_rgba(35,15,20,0.07)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_18px_42px_rgba(35,15,20,0.10)] motion-reduce:hover:translate-y-0 ${
                        card.featured
                          ? 'border-primary-100 bg-primary-700 text-white'
                          : 'border-primary-100 bg-white text-dark-900'
                      }`}
                    >
                      <div
                        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${
                          card.featured ? 'bg-white/10 text-white' : 'bg-primary-50 text-primary-700'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h2 className={`text-xl font-bold ${card.featured ? 'text-white' : 'text-dark-900'}`}>
                        {card.title}
                      </h2>
                      {card.body && (
                        <p className={`mt-4 leading-relaxed ${card.featured ? 'text-white/80' : 'text-dark-600'}`}>
                          {card.body}
                        </p>
                      )}
                      {card.bullets && (
                        <ul className="mt-5 space-y-3">
                          {card.bullets.map((item) => (
                            <li
                              key={item}
                              className={`flex gap-2 text-sm leading-relaxed ${
                                card.featured ? 'text-white/80' : 'text-dark-600'
                              }`}
                            >
                              <Check
                                className={`mt-1 h-4 w-4 shrink-0 ${
                                  card.featured ? 'text-white' : 'text-primary-700'
                                }`}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </SpotlightCard>
                  </FadeContent>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-warm py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
              <FadeContent {...sectionReveal}>
                <SectionHeading align="right" title={page.methodology.title} />
              </FadeContent>
              <FadeContent {...sectionReveal} delay={70}>
                <div className="grid gap-4">
                  {page.methodology.items.map((item) => (
                    <div
                      key={item}
                      className="flex gap-4 rounded-[18px] border border-primary-100 bg-white p-5 text-start shadow-[0_12px_30px_rgba(35,15,20,0.05)]"
                    >
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="leading-relaxed text-dark-600">{item}</p>
                    </div>
                  ))}
                </div>
              </FadeContent>
            </div>
          </div>
        </section>

        <section className="bg-dark-950 py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <FadeContent {...sectionReveal}>
              <div className="relative overflow-hidden rounded-[18px] shadow-2xl">
                <img
                  src={page.president.image}
                  alt={page.president.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent" />
              </div>
            </FadeContent>
            <FadeContent {...sectionReveal} delay={70}>
              <div className="text-start">
                <p className="mb-3 text-sm font-semibold text-primary-200">{page.president.title}</p>
                <h2 className="text-3xl font-bold md:text-4xl">{page.president.name}</h2>
                <p className="mt-2 text-primary-200">{page.president.role}</p>
                <div className="mt-8 space-y-4 text-base leading-relaxed text-white/75">
                  {page.president.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent {...sectionReveal}>
              <SectionHeading title={page.cycle.title} description={page.cycle.description} />
            </FadeContent>

            <ScrollStack
              variant="stack"
              scrollLength={0.62}
              peek={14}
              scaleStep={0.02}
              blur={0}
              dim={0.08}
              smooth={0.22}
              depth={3}
              cardWidth={960}
              cardHeight={0.52}
              borderRadius={22}
              perspective={1400}
              showProgress
              showCounter
            >
              {page.cycle.phases.map((phase, index) => {
                const PhaseIcon = phaseIcons[index] ?? Landmark;

                return (
                  <article
                    key={phase.title}
                    className="h-full min-h-[inherit] rounded-[22px] border border-primary-100 bg-white p-6 text-start shadow-[0_18px_48px_rgba(35,15,20,0.09)] md:p-8"
                  >
                    <div className="grid h-full gap-6 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
                      <div>
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                          <PhaseIcon className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-bold tracking-wide text-primary-700">
                          {String(index + 1).padStart(2, '0')} / 03
                        </p>
                        <h3 className="mt-3 text-2xl font-bold leading-tight text-dark-900">{phase.title}</h3>
                      </div>
                      <div>
                        <p className="text-base leading-relaxed text-dark-600">{phase.description}</p>
                        {phase.bullets && (
                          <ul className="mt-6 space-y-3">
                            {phase.bullets.map((bullet) => (
                              <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-dark-600">
                                <Check className="mt-1 h-4 w-4 shrink-0 text-primary-700" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </ScrollStack>
          </div>
        </section>

        <ParticipationCTA />
      </main>
    </>
  );
}
