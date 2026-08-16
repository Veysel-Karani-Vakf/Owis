import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { type Program } from '@/i18n/content';
import { useI18n } from '@/i18n/useI18n';

function ProgramActions({
  program,
  label,
  isRtl,
}: {
  program: Program;
  label: string;
  isRtl: boolean;
}) {
  const ArrowIcon = isRtl ? ArrowUpLeft : ArrowUpRight;

  return (
    <a
      href={program.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-primary-500 px-6 text-sm font-black text-white shadow-xl shadow-dark-950/25 transition-all hover:bg-primary-600 focus-visible:outline-white"
    >
      {label}
      <ArrowIcon className="h-4 w-4" />
    </a>
  );
}

function ProgramCardContent({
  program,
  index,
  actionLabel,
  isRtl,
}: {
  program: Program;
  index: number;
  actionLabel: string;
  isRtl: boolean;
}) {
  return (
    <>
      <img
        src={program.image}
        alt={program.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src =
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700"%3E%3Crect fill="%23111111" width="1200" height="700"/%3E%3Cpath fill="%23da0812" opacity=".45" d="M0 0h1200v210H0z"/%3E%3C/svg%3E';
        }}
      />

      <div className="absolute inset-0 bg-dark-950/28" />
      <div className="absolute inset-x-0 bottom-0 h-5/6 bg-gradient-to-t from-dark-950 via-dark-950/76 to-transparent" />
      <div
        className={`absolute inset-y-0 w-4/5 ${
          isRtl
            ? 'right-0 bg-gradient-to-l from-dark-950/62 via-dark-950/24 to-transparent'
            : 'left-0 bg-gradient-to-r from-dark-950/62 via-dark-950/24 to-transparent'
        }`}
      />

      <div className="absolute start-5 top-5 flex h-14 min-w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 text-lg font-black text-white backdrop-blur-md md:start-8 md:top-8 md:h-16 md:min-w-16 md:text-2xl">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 md:p-10 lg:p-12">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl text-start">
            <h3 className="font-brand text-3xl font-black leading-tight text-white text-balance sm:text-4xl md:text-5xl lg:text-6xl">
              {program.title}
            </h3>
            <p className="mt-4 max-w-3xl text-sm font-semibold leading-relaxed text-white/90 sm:text-base md:text-lg lg:text-xl">
              {program.description}
            </p>
          </div>

          <ProgramActions program={program} label={actionLabel} isRtl={isRtl} />
        </div>
      </div>
    </>
  );
}

function StackedProgramCard({
  program,
  index,
  total,
  progress,
  actionLabel,
  isRtl,
}: {
  program: Program;
  index: number;
  total: number;
  progress: MotionValue<number>;
  actionLabel: string;
  isRtl: boolean;
}) {
  const segment = total > 1 ? 1 / (total - 1) : 1;
  const enterStart = index === 0 ? 0 : (index - 1) * segment;
  const enterEnd = index === 0 ? 0.001 : index * segment;
  const dimStart = index * segment;
  const dimEnd = index < total - 1 ? (index + 1) * segment : 1;
  const enterY = useTransform(progress, [enterStart, enterEnd], ['105%', '0%']);
  const scale = useTransform(
    progress,
    index < total - 1 ? [dimStart, dimEnd] : [0, 1],
    index < total - 1 ? [1, 0.965] : [1, 1]
  );
  const opacity = useTransform(
    progress,
    index < total - 1 ? [dimStart, dimEnd] : [0, 1],
    index < total - 1 ? [1, 0.76] : [1, 1]
  );
  const y = index === 0 ? 0 : enterY;

  return (
    <motion.article
      data-program-card={program.id}
      style={{ y, scale, opacity, zIndex: index + 1 }}
      className="absolute inset-0 origin-center overflow-hidden bg-dark-950 will-change-transform"
    >
      <ProgramCardContent
        program={program}
        index={index}
        actionLabel={actionLabel}
        isRtl={isRtl}
      />
    </motion.article>
  );
}

function StaticProgramCard({
  program,
  index,
  actionLabel,
  isRtl,
}: {
  program: Program;
  index: number;
  actionLabel: string;
  isRtl: boolean;
}) {
  return (
    <article
      data-program-card={program.id}
      className="relative min-h-[31rem] overflow-hidden rounded-[1.5rem] border border-white/12 bg-dark-950 shadow-xl shadow-dark-950/15 md:min-h-[34rem]"
    >
      <ProgramCardContent
        program={program}
        index={index}
        actionLabel={actionLabel}
        isRtl={isRtl}
      />
    </article>
  );
}

function ProgramsHeading({
  eyebrow,
  title,
  description,
  staticMode = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  staticMode?: boolean;
}) {
  const Component = staticMode ? 'div' : motion.div;

  return (
    <Component
      {...(!staticMode && {
        initial: { opacity: 0, y: 36 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      })}
      className="mb-12 flex flex-col items-center text-center md:mb-16"
    >
      <span className="mb-3 text-2xl font-black tracking-wide text-white/80 md:text-4xl">
        {eyebrow}
      </span>
      <h2 className="font-brand text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
        {title}
      </h2>
      <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-white/75 md:text-xl">
        {description}
      </p>
    </Component>
  );
}

export default function Programs() {
  const { content, t, isRtl } = useI18n();
  const stackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const programsContent = content.programs;
  const programs = programsContent.items;
  const actionLabel = t('common.learnMore');
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    mass: 0.6,
  });

  if (shouldReduceMotion) {
    return (
      <section id="programs" className="relative bg-primary-800 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-700 via-primary-800 to-primary-900" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-dark-950/35 to-transparent" />

        <div className="relative mx-auto max-w-[116rem] px-4 sm:px-6 lg:px-10">
          <ProgramsHeading
            eyebrow={programsContent.eyebrow}
            title={programsContent.title}
            description={programsContent.description}
            staticMode
          />
          <div className="space-y-6 md:space-y-8">
            {programs.map((program, index) => (
              <StaticProgramCard
                key={program.id}
                program={program}
                index={index}
                actionLabel={actionLabel}
                isRtl={isRtl}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="programs" className="relative bg-primary-800 py-16 text-white md:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-700 via-primary-800 to-primary-900" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-dark-950/35 to-transparent" />

      <div className="relative mx-auto max-w-[116rem] px-4 sm:px-6 lg:px-10">
        <ProgramsHeading
          eyebrow={programsContent.eyebrow}
          title={programsContent.title}
          description={programsContent.description}
        />

        <div className="space-y-6 md:hidden">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <StaticProgramCard
                program={program}
                index={index}
                actionLabel={actionLabel}
                isRtl={isRtl}
              />
            </motion.div>
          ))}
        </div>

        <div
          ref={stackRef}
          data-programs-stack
          className="relative hidden md:block"
          style={{ height: `calc(${programs.length * 90}svh)` }}
        >
          <div
            className="sticky top-20 lg:top-24"
            style={{ height: 'calc(100svh - 7rem)', minHeight: '34rem' }}
          >
            <div className="relative h-full overflow-hidden rounded-[1.75rem] border-[10px] border-dark-950/25 bg-dark-950 shadow-2xl shadow-dark-950/25 md:rounded-[2.1rem]">
              {programs.map((program, index) => (
                <StackedProgramCard
                  key={program.id}
                  program={program}
                  index={index}
                  total={programs.length}
                  progress={smoothProgress}
                  actionLabel={actionLabel}
                  isRtl={isRtl}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
