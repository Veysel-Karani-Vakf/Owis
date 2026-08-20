import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ExternalLink, Quote } from 'lucide-react';
import { useMemo, useRef } from 'react';
import type { Program } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

type InstitutionalManifestoProps = {
  program: Program;
  labels: {
    manifestoEyebrow: string;
    officialSource: string;
  };
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

function Word({
  word,
  index,
  total,
  progress,
  reduced,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Each word lights up over its own slice of the scroll range, slightly overlapping the next.
  const start = index / total;
  const end = Math.min(1, start + 1.6 / total);
  const opacity = useTransform(progress, [start, end], reduced ? [1, 1] : [0.14, 1]);
  const y = useTransform(progress, [start, end], reduced ? [0, 0] : [10, 0]);

  return (
    <motion.span style={{ opacity, y }} className="inline-block will-change-[opacity,transform]">
      {word}
    </motion.span>
  );
}

export default function InstitutionalManifesto({ program, labels }: InstitutionalManifestoProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.8', 'end 0.55'] });

  const words = useMemo(() => program.summary.split(/\s+/).filter(Boolean), [program.summary]);
  const intro = program.sections[0];

  return (
    <div ref={containerRef} className="relative mx-auto max-w-6xl px-4 md:px-8">
      <div className="relative">
        <Quote
          aria-hidden="true"
          className={`pointer-events-none absolute -top-8 text-primary-100/80 ${
            isRtl ? '-end-2' : '-start-2 -scale-x-100'
          } h-20 w-20 md:-top-12 md:h-28 md:w-28`}
        />

        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, ease: smoothEase }}
          className="relative mb-8 flex items-center gap-2 text-start"
        >
          <span className="h-2 w-2 rounded-full bg-primary-600" />
          <span className="text-sm font-semibold text-primary-700">{labels.manifestoEyebrow}</span>
        </motion.div>

        <p
          aria-label={program.summary}
          className="relative text-balance text-start text-3xl font-bold leading-[1.35] text-dark-950 sm:text-4xl md:text-5xl md:leading-[1.3] lg:text-[3.4rem]"
        >
          {words.map((word, index) => (
            <span key={`${word}-${index}`} aria-hidden="true">
              <Word word={word} index={index} total={words.length} progress={scrollYProgress} reduced={reduced} />
              {index < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>

        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.1 }}
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-start"
        >
          <motion.span
            aria-hidden="true"
            initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: smoothEase, delay: 0.2 }}
            className="hidden h-px w-24 origin-left bg-gradient-to-r from-primary-600 to-primary-200 rtl:origin-right sm:block"
          />
          {intro?.title && <span className="text-sm font-bold text-dark-900">{intro.title}</span>}
          <a
            href={program.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-200 bg-white px-5 py-2.5 text-sm font-bold text-primary-700 transition-all hover:-translate-y-0.5 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
          >
            {labels.officialSource}
            <ExternalLink
              className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'} group-hover:-translate-y-0.5`}
              aria-hidden="true"
            />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
