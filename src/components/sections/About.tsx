import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { Eye, Target, Gem, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';

type TabKey = 'vision' | 'mission' | 'values';

const tabIcons = {
  vision: Eye,
  mission: Target,
  values: Gem,
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

const makeFadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: smoothEase },
  },
  reduced: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.01, delay: 0 },
  },
});

const eyebrowVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.52, ease: smoothEase },
  },
  reduced: { opacity: 1, y: 0, transition: { duration: 0.01 } },
};

const titleMaskVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
  reduced: { opacity: 1 },
};

const titleTextVariants: Variants = {
  hidden: { opacity: 0, y: 42 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.66, ease: smoothEase },
  },
  reduced: { opacity: 1, y: 0, transition: { duration: 0.01 } },
};

const goalsContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 1,
      staggerChildren: 0.12,
    },
  },
  reduced: {
    transition: {
      delayChildren: 0,
      staggerChildren: 0,
    },
  },
};

const goalItemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.52, ease: smoothEase },
  },
  reduced: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.01 } },
};

const checkVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
  reduced: { scale: 1, opacity: 1, transition: { duration: 0.01 } },
};

const tabPanelVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: smoothEase },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18, ease: smoothEase },
  },
  reduced: { opacity: 1, y: 0, transition: { duration: 0.01 } },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isMobile;
}

export default function About() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const [activeTab, setActiveTab] = useState<TabKey>('vision');
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { content, t, isRtl } = useI18n();
  const aboutContent = content.about;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const animateState = shouldReduceMotion ? 'reduced' : inView ? 'show' : 'hidden';
  const tabs = [
    { key: 'vision' as TabKey, label: aboutContent.tabs.vision, icon: tabIcons.vision },
    { key: 'mission' as TabKey, label: aboutContent.tabs.mission, icon: tabIcons.mission },
    { key: 'values' as TabKey, label: aboutContent.tabs.values, icon: tabIcons.values },
  ];

  const tabContent: Record<TabKey, string | string[]> = {
    vision: aboutContent.vision,
    mission: aboutContent.mission,
    values: aboutContent.values,
  };

  const focusTabAt = (index: number) => {
    const nextTab = tabs[(index + tabs.length) % tabs.length];
    setActiveTab(nextTab.key);
    window.requestAnimationFrame(() => {
      document.getElementById(`about-tab-${nextTab.key}`)?.focus();
    });
  };

  const imageVariants: Variants = {
    hidden: {
      opacity: 0,
      x: isMobile ? 0 : 70,
      y: isMobile ? 30 : 0,
      scale: 0.94,
      filter: `blur(${isMobile ? 2 : 6}px)`,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: isMobile ? 0.72 : 1.05, delay: 0.18, ease: smoothEase },
    },
    reduced: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.01, delay: 0 },
    },
  };

  const ornamentVariants = (rotate: number, delay: number): Variants => ({
    hidden: {
      opacity: 0,
      y: isMobile ? 0 : 18,
      scale: 0.7,
      rotate: isMobile ? 0 : rotate,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.55, delay, ease: smoothEase },
    },
    reduced: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.01, delay: 0 },
    },
  });

  return (
    <section id="about" className="relative overflow-hidden bg-cream py-20 md:py-28">
      <motion.div
        className="pattern-bg absolute inset-0"
        initial="hidden"
        animate={animateState}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 0.5, transition: { duration: 0.9, ease: smoothEase } },
          reduced: { opacity: 0.5, transition: { duration: 0.01 } },
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial="hidden"
            animate={animateState}
            variants={imageVariants}
            className="relative order-2 lg:order-1"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={aboutContent.image}
                alt={aboutContent.title}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%232c6147" width="400" height="300"/%3E%3C/svg%3E';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/30 to-transparent" />
            </div>

            <motion.div
              initial="hidden"
              animate={animateState}
              variants={ornamentVariants(-5, 0.74)}
              className="pointer-events-none absolute -bottom-4 -left-4 h-24 w-24 rounded-2xl border-2 border-gold-400/30 bg-cream/50 backdrop-blur-sm"
            />
            <motion.div
              initial="hidden"
              animate={animateState}
              variants={ornamentVariants(5, 0.86)}
              className="pointer-events-none absolute -top-4 -right-4 h-20 w-20 rounded-full border-2 border-primary-400/20 bg-cream/50 backdrop-blur-sm"
            />
          </motion.div>

          <div className="order-1 lg:order-2">
            <motion.div
              initial="hidden"
              animate={animateState}
              variants={eyebrowVariants}
              className="mb-4 flex items-center gap-2"
            >
              <motion.span
                className="h-px w-8 origin-right bg-gold-400"
                variants={{
                  hidden: { scaleX: 0 },
                  show: {
                    scaleX: 1,
                    transition: { duration: 0.45, delay: 0.62, ease: smoothEase },
                  },
                  reduced: { scaleX: 1, transition: { duration: 0.01 } },
                }}
              />
              <span className="text-sm font-medium text-gold-600">{aboutContent.eyebrow}</span>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={animateState}
              variants={titleMaskVariants}
              className="mb-5 overflow-hidden"
            >
              <motion.h2
                variants={titleTextVariants}
                className="text-3xl font-bold text-dark-900 md:text-4xl"
              >
                {aboutContent.title}
              </motion.h2>
            </motion.div>

            <motion.p
              initial="hidden"
              animate={animateState}
              variants={makeFadeUp(0.82)}
              className="mb-8 text-base leading-relaxed text-dark-500 md:text-lg"
            >
              {aboutContent.description}
            </motion.p>

            <motion.div
              initial="hidden"
              animate={animateState}
              variants={goalsContainerVariants}
              className="mb-8 flex flex-col gap-3"
            >
              {aboutContent.goals.map((goal, i) => (
                <motion.div key={i} variants={goalItemVariants} className="flex items-start gap-3">
                  <motion.div
                    variants={checkVariants}
                    className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100"
                  >
                    <Check className="h-3 w-3 text-primary-600" />
                  </motion.div>
                  <p className="text-sm leading-relaxed text-dark-600">{goal}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              animate={animateState}
              variants={makeFadeUp(1.3)}
            >
              <div
                role="tablist"
                aria-label={t('accessibility.aboutTabs')}
                className="mb-4 flex flex-wrap gap-2"
              >
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      id={`about-tab-${tab.key}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`about-panel-${tab.key}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => setActiveTab(tab.key)}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                          event.preventDefault();
                          focusTabAt(index + 1);
                        }

                        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                          event.preventDefault();
                          focusTabAt(index - 1);
                        }

                        if (event.key === 'Home') {
                          event.preventDefault();
                          focusTabAt(0);
                        }

                        if (event.key === 'End') {
                          event.preventDefault();
                          focusTabAt(tabs.length - 1);
                        }
                      }}
                      className={`relative flex items-center gap-2 overflow-hidden rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                        isActive
                          ? 'text-white'
                          : 'bg-white text-dark-600 hover:bg-primary-50 hover:text-primary-700'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="about-active-tab"
                          className="absolute inset-0 rounded-lg bg-primary-600 shadow-md"
                          transition={{ duration: shouldReduceMotion ? 0.01 : 0.28, ease: smoothEase }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <motion.div
                initial="hidden"
                animate={animateState}
                variants={makeFadeUp(1.44)}
                layout
                role="tabpanel"
                id={`about-panel-${activeTab}`}
                aria-labelledby={`about-tab-${activeTab}`}
                className="min-h-[92px] rounded-xl border border-primary-100 bg-white p-5 shadow-sm"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeTab}
                    variants={tabPanelVariants}
                    initial={shouldReduceMotion ? 'reduced' : 'hidden'}
                    animate={shouldReduceMotion ? 'reduced' : 'show'}
                    exit={shouldReduceMotion ? undefined : 'exit'}
                    layout
                  >
                    {activeTab === 'values' ? (
                      <div className="flex flex-wrap gap-2">
                        {(tabContent[activeTab] as string[]).map((value, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed text-dark-600 md:text-base">
                        {tabContent[activeTab] as string}
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>

            <motion.button
              initial="hidden"
              animate={animateState}
              variants={{
                hidden: { opacity: 0, x: 16 },
                show: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.55, delay: 1.62, ease: smoothEase },
                },
                reduced: { opacity: 1, x: 0, transition: { duration: 0.01 } },
              }}
              type="button"
              onClick={() => {
                const el = document.querySelector('#projects');
                if (el) el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
              }}
              className="group mt-6 flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
            >
              {t('common.learnMore')}
              <ArrowIcon
                className={`h-4 w-4 transition-transform motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 ${
                  isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                }`}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
