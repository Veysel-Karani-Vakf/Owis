import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Plus,
  Share2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LocalizedWaqfProject, ProjectSlug, ProjectsPageContent } from '@/data/projects';

const revealEase = [0.22, 1, 0.36, 1] as const;
const AUTOPLAY_INTERVAL_MS = 5000;

type ProjectShowcaseProps = {
  projects: LocalizedWaqfProject[];
  labels: ProjectsPageContent['labels'];
  isRtl: boolean;
};

function useShareLink(project: LocalizedWaqfProject, labels: ProjectsPageContent['labels']) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const share = async () => {
    const url = `${window.location.origin}${project.route}`;
    const payload = { title: project.title, text: project.shortDescription, url };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        // fall through to clipboard when the user cancels or share is unavailable
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt(labels.share, url);
    }
  };

  return { share, copied };
}

export default function ProjectShowcase({ projects, labels, isRtl }: ProjectShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState<ProjectSlug>(projects[0]?.slug ?? 'blessed-tree');
  const [quantity, setQuantity] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  // Bumped on every manual selection so the autoplay timer restarts from zero.
  const [autoplayCycle, setAutoplayCycle] = useState(0);

  const activeIndex = Math.max(
    0,
    projects.findIndex((project) => project.slug === activeSlug),
  );
  const project = projects[activeIndex] ?? projects[0];
  const { share, copied } = useShareLink(project, labels);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const DecrementIcon = isRtl ? ChevronRight : ChevronLeft;
  const IncrementIcon = isRtl ? ChevronLeft : ChevronRight;

  const total = useMemo(() => project.unitAmount * quantity, [project.unitAmount, quantity]);
  // Per-project visual correction so every product appears the same size.
  const imageScale = project.imageScale ?? 1;

  const selectProject = useCallback(
    (slug: ProjectSlug) => {
      setAutoplayCycle((cycle) => cycle + 1);
      if (slug === activeSlug) return;
      setActiveSlug(slug);
      setQuantity(1);
    },
    [activeSlug],
  );

  // Auto-advance every few seconds; paused on hover/focus, while the tab is
  // hidden, or when the user prefers reduced motion.
  useEffect(() => {
    if (isPaused || shouldReduceMotion || projects.length < 2) return;

    let timer: number | undefined;
    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => {
        setActiveSlug((current) => {
          const index = projects.findIndex((item) => item.slug === current);
          return projects[(index + 1) % projects.length].slug;
        });
        setQuantity(1);
      }, AUTOPLAY_INTERVAL_MS);
    };
    const handleVisibility = () => {
      if (document.hidden) window.clearInterval(timer);
      else start();
    };

    start();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isPaused, shouldReduceMotion, projects, autoplayCycle]);

  const panelTransition = {
    duration: shouldReduceMotion ? 0.01 : 0.5,
    ease: revealEase,
  };

  return (
    <div className="relative">
      {/* Diagonal brand accent behind the card */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-x-6 -bottom-8 top-1/3 -z-0 rounded-[40px] bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 opacity-95 md:-inset-x-10 md:-bottom-12 md:top-1/2 ${
          isRtl
            ? '[clip-path:polygon(0_0,100%_28%,100%_100%,0_100%)]'
            : '[clip-path:polygon(0_28%,100%_0,100%_100%,0_100%)]'
        }`}
      />

      <motion.section
        aria-label={labels.selectProject}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsPaused(false);
          }
        }}
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, ease: revealEase }}
        className="relative z-10 overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_32px_90px_rgba(40,12,18,0.18)]"
      >
        {/* Watermark title */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`watermark-${project.slug}`}
            aria-hidden="true"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={panelTransition}
            className="pointer-events-none absolute -top-4 start-0 select-none whitespace-nowrap font-brand text-[clamp(3.5rem,11vw,9rem)] font-black leading-none tracking-tight text-dark-950/[0.03] md:-top-6"
          >
            {project.title}
          </motion.span>
        </AnimatePresence>

        <div className="relative grid gap-8 px-6 pb-6 pt-8 md:px-8 md:pb-7 md:pt-10 lg:min-h-[27rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-6">
          {/* Info column */}
          <div className="order-2 text-start lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${project.slug}`}
                initial={{ opacity: 0, x: isRtl ? 18 : -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? -18 : 18 }}
                transition={panelTransition}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50/70 px-3 py-1.5 text-xs font-bold text-primary-700">
                  <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                  {project.category}
                </span>

                <h3 className="mt-4 text-3xl font-black leading-[1.45] text-dark-950 text-balance md:text-4xl xl:text-[2.6rem]">
                  {project.title}
                </h3>

                <p className="mt-3 text-2xl font-bold text-dark-500 md:text-3xl">
                  {project.contributionValue}
                  <span className="ms-2 align-middle text-sm font-semibold text-dark-400">
                    {labels.unitHint}
                  </span>
                </p>

                <ul className="mt-4 flex min-h-[4.75rem] flex-wrap content-start gap-1.5">
                  {project.facts.slice(0, 3).map((fact) => (
                    <li
                      key={fact.label}
                      className="whitespace-nowrap rounded-full bg-warm px-2.5 py-1 text-[11px] font-semibold text-dark-600"
                    >
                      <span className="text-dark-400">{fact.label}: </span>
                      {fact.value}
                    </li>
                  ))}
                </ul>

                <Link
                  to={project.route}
                  className="group/link mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700 transition-colors hover:text-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                >
                  {labels.details}
                  <ArrowIcon
                    className={`h-4 w-4 transition-transform motion-reduce:transition-none ${
                      isRtl ? 'group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Product image */}
          <div className="order-1 flex items-center justify-center lg:order-2">
            <div className="relative aspect-square w-full max-w-[280px] md:max-w-[320px]">
              <div
                aria-hidden="true"
                className="absolute inset-6 rounded-full bg-[radial-gradient(circle_at_center,rgba(244,242,242,0.9)_0%,rgba(244,242,242,0.5)_45%,rgba(255,255,255,0)_70%)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-12 bottom-6 h-10 rounded-[100%] bg-dark-950/20 blur-2xl"
              />
              <AnimatePresence mode="wait">
                <motion.img
                  key={`image-${project.slug}`}
                  src={project.image}
                  alt={project.imageAlt}
                  width={1080}
                  height={1080}
                  loading="eager"
                  decoding="async"
                  initial={{ opacity: 0, scale: imageScale * 0.92, y: 16 }}
                  animate={{ opacity: 1, scale: imageScale, y: 0 }}
                  exit={{ opacity: 0, scale: imageScale * 0.96, y: -12 }}
                  transition={{ ...panelTransition, duration: shouldReduceMotion ? 0.01 : 0.55 }}
                  className="relative h-full w-full object-contain mix-blend-multiply [mask-image:radial-gradient(circle_at_center,black_52%,transparent_74%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_52%,transparent_74%)]"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Action column */}
          <div className="order-3 flex flex-col items-center text-center lg:items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${project.slug}`}
                initial={{ opacity: 0, x: isRtl ? -18 : 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 18 : -18 }}
                transition={panelTransition}
                className="min-h-[4.5rem] max-w-xs text-sm leading-relaxed text-dark-600 md:text-[15px]"
              >
                {project.shortDescription}
              </motion.p>
            </AnimatePresence>

            {/* Quantity stepper */}
            <div className="mt-5 flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-dark-700">
                {labels.quantity}
              </span>
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  aria-label={`${labels.quantity} -`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-dark-300 transition-colors hover:text-dark-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  <DecrementIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <output
                  aria-live="polite"
                  className="min-w-[2.25rem] text-center text-xl font-bold tabular-nums text-dark-950"
                >
                  {quantity}
                </output>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                  aria-label={`${labels.quantity} +`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-dark-300 transition-colors hover:text-dark-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  <IncrementIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>

            <p className="mt-2 text-sm text-dark-500">
              {labels.total}:{' '}
              <span className="font-bold tabular-nums text-dark-950">
                {total.toLocaleString('en-US')}{' '}
                {labels.currency}
              </span>
            </p>

            <Link
              to={project.officialContributionUrl}
              aria-label={`${labels.contribute}: ${project.title}. ${labels.externalNotice}`}
              className="group/cta mt-4 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-8 py-3 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(218,8,18,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(218,8,18,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 motion-reduce:hover:translate-y-0"
            >
              <Plus className="h-4 w-4 transition-transform group-hover/cta:rotate-90 motion-reduce:transition-none" aria-hidden="true" />
              {labels.contribute}
            </Link>

            <div className="relative mt-4">
              <button
                type="button"
                onClick={share}
                aria-label={labels.share}
                title={labels.share}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dark-100 bg-white text-dark-500 shadow-[0_8px_20px_rgba(40,12,18,0.08)] transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 motion-reduce:hover:translate-y-0"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-primary-600" aria-hidden="true" />
                ) : (
                  <Share2 className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    role="status"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute start-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-dark-950 px-3 py-1 text-xs font-semibold text-white"
                  >
                    {labels.linkCopied}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="relative border-t border-dark-50 bg-white/80 px-6 py-4 md:px-8">
          <p className="sr-only" id="project-showcase-thumbs">
            {labels.selectProject}
          </p>
          <div
            role="tablist"
            aria-labelledby="project-showcase-thumbs"
            className="flex items-center justify-center gap-4"
          >
            {projects.map((item) => {
              const isActive = item.slug === project.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={item.title}
                  title={item.title}
                  onClick={() => selectProject(item.slug)}
                  className={`group/thumb relative h-14 w-14 overflow-hidden rounded-full border-2 bg-white p-1 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 md:h-16 md:w-16 ${
                    isActive
                      ? 'scale-105 border-dark-950 shadow-[0_10px_24px_rgba(40,12,18,0.16)]'
                      : 'border-dark-100 hover:border-dark-300 hover:shadow-[0_8px_18px_rgba(40,12,18,0.1)]'
                  }`}
                >
                  <img
                    src={item.image}
                    alt=""
                    width={144}
                    height={144}
                    loading="lazy"
                    className={`h-full w-full rounded-full object-cover transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover/thumb:scale-105'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
