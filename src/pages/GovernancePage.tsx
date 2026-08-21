import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, FileText } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import SectionHeading from '@/components/ui/SectionHeading';
import { getAboutContent, type Policy } from '@/data/about';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';
import { useI18n } from '@/i18n/useI18n';

const smoothEase = [0.22, 1, 0.36, 1] as const;

function PolicyBody({ policy }: { policy: Policy }) {
  return (
    <div className="space-y-7 px-5 pb-6 pt-1 md:px-7">
      {policy.blocks.map((block, index) => (
        <div key={`${policy.id}-${block.heading ?? index}`} className="space-y-3 text-start">
          {block.heading && <h3 className="text-lg font-bold text-dark-900">{block.heading}</h3>}
          {block.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-dark-600 md:text-base">
              {paragraph}
            </p>
          ))}
          {block.bullets && (
            <ul className="space-y-2.5">
              {block.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-dark-600 md:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default function GovernancePage() {
  const { locale } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const isNarrow = useNarrowScreen();
  const page = getAboutContent(locale).governance;
  const policyIds = useMemo(() => page.policies.map((policy) => policy.id), [page.policies]);
  const [openPolicy, setOpenPolicy] = useState(page.policies[0]?.id ?? '');
  const policyRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollTimersRef = useRef<number[]>([]);

  const clearPolicyScrollTimers = useCallback(() => {
    scrollTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    scrollTimersRef.current = [];
  }, []);

  const scrollToPolicyStart = useCallback(
    (policyId: string) => {
      clearPolicyScrollTimers();

      const runScroll = () => {
        const target = policyRefs.current[policyId] ?? document.getElementById(policyId);
        if (!target) return;

        const header = document.querySelector('header');
        const headerHeight = header instanceof HTMLElement ? header.getBoundingClientRect().height : 80;
        const offset = headerHeight + 24;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: Math.max(top, 0),
          behavior: shouldReduceMotion ? 'auto' : 'smooth',
        });
      };

      window.requestAnimationFrame(runScroll);
      scrollTimersRef.current = [window.setTimeout(runScroll, shouldReduceMotion ? 0 : 80)];
    },
    [clearPolicyScrollTimers, shouldReduceMotion]
  );

  const openPolicyFromNav = useCallback(
    (policyId: string) => {
      setOpenPolicy(policyId);
      navigate({ pathname: location.pathname, hash: `#${policyId}` }, { replace: false });

      if (policyId === openPolicy) {
        scrollToPolicyStart(policyId);
      }
    },
    [location.pathname, navigate, openPolicy, scrollToPolicyStart]
  );

  useEffect(() => {
    const hashId = decodeURIComponent(location.hash.replace('#', ''));
    if (policyIds.includes(hashId)) {
      setOpenPolicy(hashId);
    }
  }, [location.hash, policyIds]);

  useEffect(() => {
    const hashId = decodeURIComponent(location.hash.replace('#', ''));
    if (hashId && hashId === openPolicy && policyIds.includes(hashId)) {
      scrollToPolicyStart(hashId);
    }
  }, [location.hash, openPolicy, policyIds, scrollToPolicyStart]);

  useEffect(() => clearPolicyScrollTimers, [clearPolicyScrollTimers]);

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
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              eyebrow={page.intro.eyebrow}
              title={page.intro.title}
              description={page.intro.description}
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
              <motion.aside
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isNarrow ? 12 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: isNarrow ? 0.12 : 0.2,
                  margin: isNarrow ? '0px 0px -8% 0px' : '0px 0px -10% 0px',
                }}
                transition={{ duration: shouldReduceMotion ? 0.01 : isNarrow ? 0.42 : 0.55, ease: smoothEase }}
                className="rounded-2xl border border-primary-100 bg-warm p-4 shadow-sm lg:sticky lg:top-24"
              >
                <h2 className="mb-4 px-2 text-start text-sm font-bold text-dark-900">{page.intro.navTitle}</h2>
                <div className="grid gap-2">
                  {page.policies.map((policy) => {
                    const active = policy.id === openPolicy;

                    return (
                      <a
                        key={policy.id}
                        href={`#${policy.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          openPolicyFromNav(policy.id);
                        }}
                        aria-current={active ? 'true' : undefined}
                        className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                          active
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-white text-dark-700 hover:bg-primary-50 hover:text-primary-700'
                        }`}
                      >
                        <FileText className="h-4 w-4 shrink-0" />
                        <span>{policy.title}</span>
                      </a>
                    );
                  })}
                </div>
              </motion.aside>

              <div className="space-y-4">
                {page.policies.map((policy, index) => {
                  const open = policy.id === openPolicy;
                  const contentId = `${policy.id}-content`;

                  return (
                    <motion.article
                      key={policy.id}
                      id={policy.id}
                      data-governance-policy
                      ref={(element) => {
                        policyRefs.current[policy.id] = element;
                      }}
                      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isNarrow ? 12 : 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{
                        once: true,
                        amount: isNarrow ? 0.08 : 0.12,
                        margin: isNarrow ? '0px 0px -8% 0px' : '0px 0px -10% 0px',
                      }}
                      transition={{
                        duration: shouldReduceMotion ? 0.01 : isNarrow ? 0.4 : 0.48,
                        delay: shouldReduceMotion ? 0 : index * 0.02,
                        ease: smoothEase,
                      }}
                      className="scroll-mt-28 overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={contentId}
                        onClick={() => {
                          if (open) {
                            setOpenPolicy('');
                            return;
                          }

                          openPolicyFromNav(policy.id);
                        }}
                        className="flex min-h-[64px] w-full items-center justify-between gap-4 px-5 py-4 text-start transition-colors hover:bg-primary-50/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 md:px-7"
                      >
                        <span>
                          <span className="block text-lg font-bold text-dark-900">{policy.title}</span>
                          <span className="mt-1 block text-sm leading-relaxed text-dark-500">{policy.summary}</span>
                        </span>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                          <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
                        </span>
                      </button>

                      <div
                        id={contentId}
                        hidden={!open}
                        aria-hidden={!open}
                        className="overflow-hidden"
                      >
                        <PolicyBody policy={policy} />
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
