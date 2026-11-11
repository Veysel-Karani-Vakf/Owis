import { motion } from 'framer-motion';
import { useRevealMotion } from '@/hooks/useResponsiveMotion';

type Tone = 'light' | 'dark';

type AwardSectionHeadingProps = {
  /** Used as the heading id, so the section can point aria-labelledby at it. */
  id: string;
  title: string;
  /** Part of the title shown in the brand red. */
  highlight?: string;
  description?: string;
  align?: 'center' | 'start';
  /** `dark` for headings sitting on a dark section. */
  tone?: Tone;
};

/** Renders `title` with its `highlight` (when present in the title) in the official red. */
export function AwardHighlight({ title, highlight }: { title: string; highlight?: string }) {
  const index = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || index < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, index)}
      <span className="text-primary-500">{highlight}</span>
      {title.slice(index + highlight.length)}
    </>
  );
}

/** The site's eyebrow mark: a short red rule with a small red diamond. */
export function AwardMark({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`flex items-center gap-2 ${className}`}>
      <span className="h-px w-8 bg-primary-200" />
      <span className="h-1.5 w-1.5 rotate-45 bg-primary-500" />
      <span className="h-px w-8 bg-primary-200" />
    </span>
  );
}

export default function AwardSectionHeading({
  id,
  title,
  highlight,
  description,
  align = 'center',
  tone = 'light',
}: AwardSectionHeadingProps) {
  const mark = useRevealMotion({ y: 10, duration: 0.5 });
  const heading = useRevealMotion({ y: 18, duration: 0.6, delay: 0.06 });
  const text = useRevealMotion({ y: 14, duration: 0.6, delay: 0.12 });
  const centered = align === 'center';
  const dark = tone === 'dark';

  return (
    <div className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : 'items-start text-start'}`}>
      <motion.div {...mark}>
        <AwardMark />
      </motion.div>
      <motion.h2
        id={id}
        {...heading}
        className={`font-brand text-[1.85rem] font-bold leading-tight sm:text-4xl lg:text-[2.6rem] ${
          dark ? 'text-white' : 'text-dark-900'
        }`}
      >
        <AwardHighlight title={title} highlight={highlight} />
      </motion.h2>
      {description && (
        <motion.p
          {...text}
          className={`max-w-2xl text-[15px] leading-relaxed sm:text-lg ${dark ? 'text-white/70' : 'text-dark-500'}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
