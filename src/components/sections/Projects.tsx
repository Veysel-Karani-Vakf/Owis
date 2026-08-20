import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Project } from '@/i18n/content';
import { useI18n } from '@/i18n/useI18n';
import { useInView } from '@/hooks/useInView';

type CoverflowMetrics = {
  spacing: number;
  depth: number;
  rotate: number;
  sideScale: number;
  farScale: number;
  perspective: number;
};

const ease = [0.22, 1, 0.36, 1] as const;
const projectTransitionEase = [0.45, 0, 0.55, 1] as const;
const projectTransitionDuration = 0.65;
const projectImagePositions: Record<string, string> = {
  'waqf-share': '50% 27%',
  'blessed-tree': '50% 25%',
  'gold-portfolio': '50% 24%',
};

function normalizeIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function getCircularOffset(index: number, activeIndex: number, length: number) {
  let offset = index - activeIndex;
  const half = length / 2;

  if (offset > half) offset -= length;
  if (offset < -half) offset += length;

  return offset;
}

function useCoverflowMetrics(): CoverflowMetrics {
  const [width, setWidth] = useState(1280);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (width < 640) {
    return {
      spacing: Math.max(210, width * 0.58),
      depth: 70,
      rotate: 12,
      sideScale: 0.9,
      farScale: 0.82,
      perspective: 900,
    };
  }

  if (width < 1024) {
    return {
      spacing: 235,
      depth: 110,
      rotate: 26,
      sideScale: 0.88,
      farScale: 0.76,
      perspective: 1100,
    };
  }

  return {
    spacing: 305,
    depth: 170,
    rotate: 38,
    sideScale: 0.86,
    farScale: 0.72,
    perspective: 1400,
  };
}

function ProjectCard({
  project,
  index,
  activeIndex,
  offset,
  metrics,
  isRtl,
  reduceMotion,
  labels,
  onActivate,
}: {
  project: Project;
  index: number;
  activeIndex: number;
  offset: number;
  metrics: CoverflowMetrics;
  isRtl: boolean;
  reduceMotion: boolean;
  labels: {
    viewDetails: string;
    donateWithUs: string;
  };
  onActivate: (index: number) => void;
}) {
  const isActive = index === activeIndex;
  const absoluteOffset = Math.abs(offset);
  const signedDirection = offset === 0 ? 0 : offset > 0 ? 1 : -1;
  const visualDirection = isRtl ? -signedDirection : signedDirection;
  const isFar = absoluteOffset > 2;
  const isInternalDetails = project.detailsUrl.startsWith('/');
  const isExternalDetails = project.detailsUrl.startsWith('http');
  const scale = isActive ? 1 : absoluteOffset === 1 ? metrics.sideScale : metrics.farScale;
  const opacity = isActive ? 1 : absoluteOffset === 1 ? 0.72 : 0.34;
  const rotateY =
    reduceMotion || isActive
      ? 0
      : (isRtl ? 1 : -1) * signedDirection * metrics.rotate * Math.min(absoluteOffset, 1.35);
  const z = reduceMotion ? 0 : -Math.min(absoluteOffset, 2.4) * metrics.depth;
  const x = reduceMotion
    ? visualDirection * metrics.spacing * 0.82
    : visualDirection * metrics.spacing * Math.min(absoluteOffset, 2.15);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        zIndex: isActive ? 30 : 20 - absoluteOffset,
        pointerEvents: 'none',
      }}
    >
      <motion.article
        data-project-card={project.id}
        aria-current={isActive ? 'true' : undefined}
        aria-label={project.name}
        role={isActive ? 'group' : 'button'}
        tabIndex={isActive || isFar ? -1 : 0}
        onClick={() => {
          if (!isActive) onActivate(index);
        }}
        onKeyDown={(event) => {
          if (isActive || isFar) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onActivate(index);
          }
        }}
        animate={{
          x,
          z,
          rotateY,
          scale,
          opacity: isFar ? 0 : opacity,
        }}
        transition={{
          duration: projectTransitionDuration,
          ease: projectTransitionEase,
        }}
        style={{
          transformStyle: 'preserve-3d',
          filter: isActive ? 'saturate(1) brightness(1)' : 'saturate(0.82) brightness(0.78)',
          pointerEvents: isFar ? 'none' : 'auto',
        }}
        className={`flex h-[29rem] w-[min(80vw,19.5rem)] select-none flex-col overflow-hidden rounded-[1.4rem] border bg-white text-start shadow-2xl outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary-500 sm:h-[29rem] sm:w-[21rem] md:h-[30rem] md:w-[22rem] lg:h-[32.5rem] lg:w-[26rem] ${
          isActive
            ? 'border-primary-200 shadow-dark-950/25'
            : 'cursor-pointer border-dark-950/10 shadow-dark-950/10'
        }`}
      >
        <div className="relative aspect-[3/2] min-h-[10rem] w-full shrink-0 overflow-hidden bg-[#eaeaea]">
          <img
            src={project.image}
            alt={project.name}
            loading={isActive ? 'eager' : 'lazy'}
            className="h-full w-full object-cover"
            style={{ objectPosition: projectImagePositions[project.id] ?? '50% 26%' }}
            draggable={false}
            onError={(event) => {
              const target = event.target as HTMLImageElement;
              target.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 520"%3E%3Crect fill="%23111111" width="700" height="520"/%3E%3Cpath fill="%23da0812" opacity=".45" d="M0 0h700v150H0z"/%3E%3C/svg%3E';
            }}
          />
          <div className="absolute start-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-primary-700 shadow-lg">
            <DollarSign className="h-4 w-4" />
            {project.contribution}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-4 text-start md:p-5">
          <h3 className="font-brand text-xl font-black leading-snug text-dark-950 md:text-2xl">
            {project.name}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed text-dark-500">
            {project.description}
          </p>

          <div
            className={`mt-auto flex flex-wrap items-center gap-2.5 pt-4 ${
              isActive ? '' : 'pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            {isInternalDetails ? (
              <Link
                to={project.detailsUrl}
                tabIndex={isActive ? 0 : -1}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary-600 px-4 text-sm font-black text-white transition-all hover:bg-primary-700 focus-visible:outline-primary-600"
              >
                {labels.viewDetails}
                <ArrowIcon className="h-4 w-4" />
              </Link>
            ) : (
              <a
                href={project.detailsUrl}
                target={isExternalDetails ? '_blank' : undefined}
                rel={isExternalDetails ? 'noopener noreferrer' : undefined}
                tabIndex={isActive ? 0 : -1}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary-600 px-4 text-sm font-black text-white transition-all hover:bg-primary-700 focus-visible:outline-primary-600"
              >
                {labels.viewDetails}
                <ArrowIcon className="h-4 w-4" />
              </a>
            )}

            {project.contributionUrl ? (
              <Link
                to={project.contributionUrl}
                tabIndex={isActive ? 0 : -1}
                className="inline-flex h-10 items-center justify-center rounded-full border border-primary-100 bg-primary-50 px-4 text-sm font-black text-primary-700 transition-all hover:bg-primary-100 focus-visible:outline-primary-600"
              >
                {labels.donateWithUs}
              </Link>
            ) : (
              <button
                type="button"
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  const el = document.querySelector('#participate');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex h-10 items-center justify-center rounded-full border border-primary-100 bg-primary-50 px-4 text-sm font-black text-primary-700 transition-all hover:bg-primary-100 focus-visible:outline-primary-600"
              >
                {labels.donateWithUs}
              </button>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function Projects() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const metrics = useCoverflowMetrics();
  const shouldReduceMotion = useReducedMotion();
  const { content, t, isRtl } = useI18n();
  const projectsContent = content.projects;
  const projects = projectsContent.items;
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const wheelTimeoutRef = useRef<number | undefined>(undefined);

  const projectCount = projects.length;
  const reduceMotion = Boolean(shouldReduceMotion);

  useEffect(() => {
    setActiveIndex(0);
  }, [projects]);

  useEffect(() => {
    return () => {
      if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
    };
  }, []);

  const goToProject = useCallback(
    (index: number) => {
      setActiveIndex(normalizeIndex(index, projectCount));
    },
    [projectCount]
  );

  const goNext = useCallback(() => goToProject(activeIndex + 1), [activeIndex, goToProject]);
  const goPrevious = useCallback(() => goToProject(activeIndex - 1), [activeIndex, goToProject]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (isRtl) goNext();
      else goPrevious();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (isRtl) goPrevious();
      else goNext();
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('a, button')) return;

    dragStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;

    const deltaX = event.clientX - dragStart.current.x;
    const deltaY = event.clientY - dragStart.current.y;
    dragStart.current = null;

    if (Math.abs(deltaX) < 46 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0) {
      if (isRtl) goPrevious();
      else goNext();
    } else if (isRtl) {
      goNext();
    } else {
      goPrevious();
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 18) return;

    if (wheelTimeoutRef.current) return;

    if (event.deltaX > 0) {
      if (isRtl) goPrevious();
      else goNext();
    } else if (isRtl) {
      goNext();
    } else {
      goPrevious();
    }

    wheelTimeoutRef.current = window.setTimeout(() => {
      wheelTimeoutRef.current = undefined;
    }, projectTransitionDuration * 1000);
  };

  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-primary-950/[0.06] bg-cream py-16 md:py-20"
    >
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col items-center text-center md:mb-12"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-primary-400" />
            <span className="text-sm font-bold text-primary-600">{projectsContent.eyebrow}</span>
            <span className="h-px w-8 bg-primary-400" />
          </div>
          <h2 className="font-brand text-4xl font-black leading-tight text-dark-950 md:text-5xl lg:text-6xl">
            {projectsContent.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-dark-500 md:text-lg">
            {projectsContent.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.12, ease }}
          data-project-coverflow
          role="region"
          aria-label={t('accessibility.projectGallery')}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            dragStart.current = null;
          }}
          onWheel={handleWheel}
          className="relative mx-auto h-[32rem] max-w-[86rem] touch-pan-y select-none overflow-hidden rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:h-[33rem] lg:h-[36.5rem]"
          style={{
            perspective: reduceMotion ? 900 : metrics.perspective,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                activeIndex={activeIndex}
                offset={getCircularOffset(index, activeIndex, projectCount)}
                metrics={metrics}
                isRtl={isRtl}
                reduceMotion={reduceMotion}
                labels={{
                  viewDetails: t('common.viewDetails'),
                  donateWithUs: t('common.donateWithUs'),
                }}
                onActivate={goToProject}
              />
            ))}
          </div>

          {projectCount > 1 && (
            <>
              <button
                type="button"
                data-project-previous
                onClick={goPrevious}
                aria-label={t('accessibility.previousProject')}
                className={`absolute top-1/2 z-40 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-dark-950/10 bg-white/90 text-primary-700 shadow-xl shadow-dark-950/10 backdrop-blur-md transition-all hover:bg-white focus-visible:outline-primary-600 sm:flex ${
                  isRtl ? 'right-2 lg:right-6' : 'left-2 lg:left-6'
                }`}
              >
                {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>

              <button
                type="button"
                data-project-next
                onClick={goNext}
                aria-label={t('accessibility.nextProject')}
                className={`absolute top-1/2 z-40 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-dark-950/10 bg-white/90 text-primary-700 shadow-xl shadow-dark-950/10 backdrop-blur-md transition-all hover:bg-white focus-visible:outline-primary-600 sm:flex ${
                  isRtl ? 'left-2 lg:left-6' : 'right-2 lg:right-6'
                }`}
              >
                {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            </>
          )}
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-2" aria-label={t('accessibility.projectDots')}>
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => goToProject(index)}
              aria-label={`${t('accessibility.showProject')} ${project.name}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-all focus-visible:outline-primary-600 ${
                index === activeIndex
                  ? 'w-9 bg-primary-600'
                  : 'w-2.5 bg-dark-950/18 hover:bg-primary-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
