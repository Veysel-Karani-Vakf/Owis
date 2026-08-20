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
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Breadcrumbs from '@/components/internal/Breadcrumbs';
import PageSeo from '@/components/internal/PageSeo';
import CreditTiltCard from '@/components/effects/CreditTiltCard';
import FadeContent from '@/components/effects/FadeContent';
import ScrollMask from '@/components/effects/ScrollMask';
import ScrollStack from '@/components/effects/ScrollStack';
import ParticipationCTA from '@/components/sections/ParticipationCTA';
import WaqfIdentityTabs, { type IdentityTab } from '@/components/sections/WaqfIdentityTabs';
import WaqfMethodologyTimeline from '@/components/sections/WaqfMethodologyTimeline';
import { aboutRoutes, getAboutContent } from '@/data/about';
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

const creditLayerStyle = (factor: number, depth: number): CSSProperties => ({
  transform: `translate3d(calc(var(--credit-parallax-x, 0px) * ${factor}), calc(var(--credit-parallax-y, 0px) * ${factor}), ${depth}px)`,
});

export default function WaqfAboutPage() {
  const { locale, isRtl, t } = useI18n();
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

  const identityTabs: IdentityTab[] = [
    {
      key: 'vision',
      title: page.identity.visionTitle,
      icon: Eye,
      body: page.identity.vision,
      href: '/projects',
    },
    {
      key: 'mission',
      title: page.identity.missionTitle,
      icon: Target,
      body: page.identity.mission,
      href: '/participate',
    },
    {
      key: 'goals',
      title: page.goals.title,
      icon: Landmark,
      bullets: page.goals.items,
      href: '/participate',
    },
    {
      key: 'values',
      title: page.identity.valuesTitle,
      icon: Gem,
      chips: page.identity.values,
      href: aboutRoutes.governance,
    },
  ];
  const cycleStepLabels = page.cycle.phases.map((phase) => {
    const [, ...labelParts] = phase.title.split(/[:：]/);
    const label = labelParts.join(':').trim();
    return label || phase.title;
  });

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
                      hoverShadow="0 26px 62px rgba(35, 15, 20, 0.14)"
                      parallaxIntensity={1.08}
                      rotationIntensity={8}
                      scaleOnHover={1.026}
                      shadowColor="rgba(35, 15, 20, 0.16)"
                      shineColor="rgba(180, 35, 58, 0.16)"
                      className="min-h-[172px] rounded-[18px] border border-primary-100 bg-white p-5 text-center ring-1 ring-white/80 hover:border-primary-200"
                    >
                      <div className="flex h-full min-h-[132px] flex-col items-center justify-between">
                        <div
                          className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 will-change-transform group-hover:bg-primary-100"
                          style={creditLayerStyle(0.72, 46)}
                        >
                          <FactIcon className="h-5 w-5" />
                        </div>
                        <div className="will-change-transform" style={creditLayerStyle(0.36, 32)}>
                          <p className="text-sm font-medium text-dark-500">{fact.label}</p>
                          <p className="mt-2 text-lg font-bold leading-tight text-dark-900">{fact.value}</p>
                        </div>
                      </div>
                    </CreditTiltCard>
                  );
                })}
              </div>
            </FadeContent>
          </div>
        </section>

        <WaqfIdentityTabs
          eyebrow={page.goals.eyebrow}
          title={page.goals.title}
          description={page.goals.description}
          tabs={identityTabs}
          ctaLabel={page.identity.ctaLabel}
          ariaLabel={t('accessibility.aboutTabs')}
        />

        <section className="bg-warm py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <WaqfMethodologyTimeline
              eyebrow={page.methodology.eyebrow}
              title={page.methodology.title}
              description={page.methodology.description}
              stepLabel={page.methodology.stepLabel}
              itemTitles={page.methodology.itemTitles}
              items={page.methodology.items}
            />
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

        <section className="bg-white pt-20 pb-0 md:pt-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <ScrollStack
              header={
                <div className="mx-auto max-w-3xl text-center">
                  <FadeContent
                    blur={false}
                    duration={650}
                    initialOpacity={0}
                    yOffset={16}
                    threshold={0.2}
                    once
                  >
                    <h2 className="text-3xl font-bold leading-tight text-dark-900 md:text-4xl lg:text-5xl">
                      {page.cycle.title}
                    </h2>
                  </FadeContent>
                  <FadeContent
                    blur={false}
                    duration={650}
                    initialOpacity={0}
                    yOffset={16}
                    delay={85}
                    threshold={0.2}
                    once
                  >
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-dark-500 md:text-lg">
                      {page.cycle.description}
                    </p>
                  </FadeContent>
                </div>
              }
              variant="flip"
              bookSpine="right"
              bookSpiral
              scrollLength={0.75}
              peek={0}
              scaleStep={0.02}
              blur={0}
              dim={0.08}
              smooth={0.14}
              depth={1}
              cardWidth={1040}
              cardHeight={0.42}
              borderRadius={24}
              perspective={2000}
              stepLabels={cycleStepLabels}
              indicatorLabel={page.cycle.title}
              topSpacing="clamp(20px, 3vw, 36px)"
              stickyTop={128}
              className="waqf-cycle-scroll-stack"
              showProgress
              showCounter
            >
              {page.cycle.phases.map((phase, index) => {
                const PhaseIcon = phaseIcons[index] ?? Landmark;

                return (
                  <article
                    key={phase.title}
                    className="waqf-cycle-card text-start"
                  >
                    <div className="waqf-cycle-card-grid">
                      <div className="waqf-cycle-stage-side">
                        <div
                          className="waqf-cycle-reveal flex items-center gap-4"
                          style={{ '--cycle-reveal-delay': '0ms' } as CSSProperties}
                        >
                          <div className="waqf-cycle-icon">
                            <PhaseIcon className="h-7 w-7" />
                          </div>
                          <p className="waqf-cycle-counter" dir="ltr">
                            {String(index + 1).padStart(2, '0')} /{' '}
                            {String(page.cycle.phases.length).padStart(2, '0')}
                          </p>
                        </div>
                        <h3
                          className="waqf-cycle-reveal mt-5 text-2xl font-bold leading-tight text-dark-900 md:text-3xl"
                          style={{ '--cycle-reveal-delay': '70ms' } as CSSProperties}
                        >
                          {phase.title}
                        </h3>
                      </div>
                      <div className="waqf-cycle-detail-side">
                        <p
                          className="waqf-cycle-reveal text-base leading-relaxed text-dark-600 md:text-lg"
                          style={{ '--cycle-reveal-delay': '140ms' } as CSSProperties}
                        >
                          {phase.description}
                        </p>
                        {phase.bullets && (
                          <ul className="mt-6 space-y-3">
                            {phase.bullets.map((bullet, bulletIndex) => (
                              <li
                                key={bullet}
                                className="waqf-cycle-reveal flex gap-3 text-sm leading-relaxed text-dark-600 md:text-base"
                                style={
                                  {
                                    '--cycle-reveal-delay': `${210 + Math.min(bulletIndex, 4) * 30}ms`,
                                  } as CSSProperties
                                }
                              >
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

        <ParticipationCTA standalone />
      </main>
    </>
  );
}
