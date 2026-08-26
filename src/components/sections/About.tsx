import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'framer-motion';
import { Eye, Target, Compass, Gem, Landmark, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';
import { useI18n } from '@/i18n/useI18n';

type TabKey = 'vision' | 'mission' | 'methodology' | 'values' | 'sectors';

const tabIcons = {
  vision: Eye,
  mission: Target,
  methodology: Compass,
  values: Gem,
  sectors: Landmark,
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
  hidden: (direction = 1) => ({
    opacity: 0,
    x: direction * 18,
    scale: 0.985,
  }),
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.28, ease: smoothEase },
  },
  exit: (direction = 1) => ({
    opacity: 0,
    x: direction * -14,
    scale: 0.99,
    transition: { duration: 0.14, ease: smoothEase },
  }),
  reduced: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.01 } },
};

const tabItemsContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.035,
    },
  },
  reduced: {
    transition: {
      delayChildren: 0,
      staggerChildren: 0,
    },
  },
};

const tabItemVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: smoothEase },
  },
  reduced: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.01 } },
};

export default function About() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('vision');
  const [tabDirection, setTabDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useNarrowScreen(767);
  const { content, t, isRtl } = useI18n();
  const aboutContent = content.about;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const animateState = shouldReduceMotion ? 'reduced' : inView ? 'show' : 'hidden';
  const tabs = [
    { key: 'vision' as TabKey, label: aboutContent.tabs.vision, icon: tabIcons.vision },
    { key: 'mission' as TabKey, label: aboutContent.tabs.mission, icon: tabIcons.mission },
    { key: 'methodology' as TabKey, label: aboutContent.tabs.methodology, icon: tabIcons.methodology },
    { key: 'values' as TabKey, label: aboutContent.tabs.values, icon: tabIcons.values },
    { key: 'sectors' as TabKey, label: aboutContent.tabs.sectors, icon: tabIcons.sectors },
  ];

  const tabContent: Record<TabKey, string | string[]> = {
    vision: aboutContent.vision ?? '',
    mission: aboutContent.mission ?? [],
    methodology: aboutContent.methodology ?? [],
    values: aboutContent.values ?? [],
    sectors: aboutContent.sectors ?? [],
  };

  const renderTabContent = (tabKey: TabKey) => {
    const currentContent = tabContent[tabKey];

    if (tabKey === 'methodology') {
      return (
        <motion.div
          variants={tabItemsContainerVariants}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        >
          {(currentContent as string[]).map((value, index) => (
            <motion.span
              key={`${value}-${index}`}
              variants={tabItemVariants}
              className="flex items-center justify-center rounded-full bg-primary-50 px-2 py-2 text-center text-xs font-medium leading-snug text-primary-700 sm:px-3 sm:text-sm"
            >
              {value}
            </motion.span>
          ))}
        </motion.div>
      );
    }

    if (tabKey === 'values' || tabKey === 'sectors') {
      return (
        <motion.div variants={tabItemsContainerVariants} className="flex flex-wrap gap-2">
          {(currentContent as string[]).map((value, index) => (
            <motion.span
              key={`${value}-${index}`}
              variants={tabItemVariants}
              className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700"
            >
              {value}
            </motion.span>
          ))}
        </motion.div>
      );
    }

    if (Array.isArray(currentContent)) {
      return (
        <motion.ul variants={tabItemsContainerVariants} className="space-y-3">
          {currentContent.map((item, index) => (
            <motion.li
              key={`${item}-${index}`}
              variants={tabItemVariants}
              className="flex items-start gap-3 text-sm leading-relaxed text-dark-600 md:text-base"
            >
              <Check className="mt-1 h-4 w-4 flex-shrink-0 text-primary-600" aria-hidden="true" />
              <span>{item}</span>
            </motion.li>
          ))}
        </motion.ul>
      );
    }

    return (
      <motion.p variants={tabItemVariants} className="text-sm leading-relaxed text-dark-600 md:text-base">
        {currentContent}
      </motion.p>
    );
  };

  const selectTab = (nextKey: TabKey, indexDirection?: number) => {
    if (nextKey === activeTab) return;

    const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
    const nextIndex = tabs.findIndex((tab) => tab.key === nextKey);
    const direction = indexDirection ?? (nextIndex > currentIndex ? 1 : -1);

    setTabDirection(direction * (isRtl ? -1 : 1));
    setActiveTab(nextKey);
  };

  const focusTabAt = (index: number, indexDirection?: number) => {
    const nextTab = tabs[(index + tabs.length) % tabs.length];
    selectTab(nextTab.key, indexDirection);
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
    <section id="about" className="relative overflow-hidden bg-white py-20 md:py-28">
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
                alt={aboutContent.imageAlt || aboutContent.title}
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
              className="pointer-events-none absolute -bottom-4 -left-4 h-24 w-24 rounded-2xl border-2 border-gold-400/30 bg-white/70 backdrop-blur-sm"
            />
            <motion.div
              initial="hidden"
              animate={animateState}
              variants={ornamentVariants(5, 0.86)}
              className="pointer-events-none absolute -top-4 -right-4 h-20 w-20 rounded-full border-2 border-primary-400/20 bg-white/70 backdrop-blur-sm"
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
              {(aboutContent.goals ?? []).map((goal, i) => (
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
              <LayoutGroup id="about-tabs">
                <div
                  role="tablist"
                  aria-label={t('accessibility.aboutTabs')}
                  className="mb-4 flex flex-wrap gap-2"
                >
                  {tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;

                    return (
                      <motion.button
                        key={tab.key}
                        id={`about-tab-${tab.key}`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls="about-panel"
                        tabIndex={isActive ? 0 : -1}
                        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        onClick={() => selectTab(tab.key)}
                        onKeyDown={(event) => {
                          if (event.key === 'ArrowLeft') {
                            event.preventDefault();
                            const step = isRtl ? 1 : -1;
                            focusTabAt(index + step, step);
                          }

                          if (event.key === 'ArrowRight') {
                            event.preventDefault();
                            const step = isRtl ? -1 : 1;
                            focusTabAt(index + step, step);
                          }

                          if (event.key === 'ArrowDown') {
                            event.preventDefault();
                            focusTabAt(index + 1, 1);
                          }

                          if (event.key === 'ArrowUp') {
                            event.preventDefault();
                            focusTabAt(index - 1, -1);
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
                        className={`relative isolate flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-300 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                          isActive
                            ? 'z-10 text-white'
                            : 'bg-white text-dark-600 hover:bg-primary-50 hover:text-primary-700'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="about-active-tab"
                            className="pointer-events-none absolute inset-0 rounded-lg bg-primary-600 shadow-md"
                            transition={
                              shouldReduceMotion
                                ? { duration: 0.01 }
                                : { type: 'spring', stiffness: 420, damping: 34 }
                            }
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {tab.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                <motion.div
                  initial="hidden"
                  animate={animateState}
                  variants={makeFadeUp(1.44)}
                  layout={shouldReduceMotion ? false : 'size'}
                  transition={{ layout: { duration: 0.28, ease: smoothEase } }}
                  role="tabpanel"
                  id="about-panel"
                  aria-labelledby={`about-tab-${activeTab}`}
                  className="min-h-[92px] overflow-hidden rounded-xl border border-primary-100 bg-white p-5 shadow-sm sm:min-h-[10rem]"
                >
                  <AnimatePresence custom={tabDirection} mode="wait" initial={false}>
                    <motion.div
                      key={activeTab}
                      custom={tabDirection}
                      variants={tabPanelVariants}
                      layout={shouldReduceMotion ? false : true}
                      initial={shouldReduceMotion ? 'reduced' : 'hidden'}
                      animate={shouldReduceMotion ? 'reduced' : 'show'}
                      exit={shouldReduceMotion ? undefined : 'exit'}
                    >
                      {renderTabContent(activeTab)}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </LayoutGroup>
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
              onClick={() => navigate(aboutContent.learnMoreUrl || '/about/waqf')}
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
