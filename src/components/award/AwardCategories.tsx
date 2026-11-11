import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { awardSectionIds, type AwardContent } from '@/data/award/content';
import { useI18n } from '@/i18n/useI18n';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';
import AwardSectionHeading from './AwardSectionHeading';
import { categoryIcons, categoryTints } from './awardIcons';
import { awardEase } from './awardUi';

type AwardCategoriesProps = {
  content: AwardContent;
};

/**
 * Section C — the five participation fields. Cards are informational (not
 * links): an icon chip, the field and a short line, over a small landscape
 * of soft waves tinted per field.
 */
export default function AwardCategories({ content }: AwardCategoriesProps) {
  const { categories } = content;
  const { formatNumber } = useI18n();
  const reduceMotion = useReducedMotion();
  const isNarrow = useNarrowScreen();

  return (
    <section
      id={awardSectionIds.categories}
      tabIndex={-1}
      aria-labelledby="award-categories-title"
      className="relative bg-white py-20 focus:outline-none md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <AwardSectionHeading
          id="award-categories-title"
          title={categories.title}
          description={categories.description}
        />

        {/* 2 columns on phones (the fifth card spans both), 3+2 centred on tablets, 5 in a row on desktop. */}
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:mt-14 md:grid-cols-6 lg:grid-cols-5 lg:gap-5">
          {categories.items.map((category, index) => {
            const Icon = categoryIcons[category.id];
            const tint = categoryTints[category.id];
            const isLast = index === categories.items.length - 1;
            const placement = [
              'md:col-span-2 lg:col-span-1',
              index === 3 ? 'md:col-start-2 lg:col-start-auto' : '',
              isLast ? 'col-span-2' : '',
            ].join(' ');

            return (
              <motion.li
                key={category.id}
                className={placement}
                initial={reduceMotion ? false : { opacity: 0, y: isNarrow ? 14 : 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: reduceMotion ? 0 : (isNarrow ? index % 2 : index) * 0.08,
                  ease: awardEase,
                }}
              >
                <article
                  style={{ '--award-tint-edge': tint.edge } as CSSProperties}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-award-line bg-white text-center shadow-[0_10px_30px_rgba(15,56,60,0.05)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[color:var(--award-tint-edge)] hover:shadow-[0_24px_46px_rgba(15,56,60,0.11)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute end-4 top-4 font-latin text-[11px] font-semibold tracking-[0.18em] text-award-gold-500/80"
                  >
                    {formatNumber(index + 1).padStart(2, '0')}
                  </span>

                  <div className="relative z-10 flex flex-1 flex-col items-center px-3 pb-3 pt-7 sm:px-5 sm:pt-8">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-full ring-[6px] ring-white transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none sm:h-16 sm:w-16"
                      style={{ backgroundColor: tint.chip, color: tint.ink, boxShadow: `0 0 0 1px ${tint.edge}` }}
                    >
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-bold leading-snug text-award-ink sm:text-lg">
                      {category.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-award-body sm:text-sm">
                      {category.description}
                    </p>
                  </div>

                  <CategoryScene tint={tint} Icon={Icon} />
                </article>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

type SceneProps = {
  tint: (typeof categoryTints)[keyof typeof categoryTints];
  Icon: (typeof categoryIcons)[keyof typeof categoryIcons];
};

/** Decorative foot of each card: two soft hills in the field's tint and a large outline of its icon. */
function CategoryScene({ tint, Icon }: SceneProps) {
  return (
    <div aria-hidden="true" className="relative h-16 overflow-hidden sm:h-20">
      <svg
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-full w-full translate-y-1 transition-transform duration-500 group-hover:translate-y-0 motion-reduce:transition-none"
      >
        <path d="M0 46 C30 34 62 38 94 46 S154 40 200 30 L200 80 L0 80 Z" fill={tint.wave} />
        <path d="M0 60 C44 50 82 62 122 58 S174 48 200 54 L200 80 L0 80 Z" fill={tint.waveDeep} />
      </svg>
      <Icon
        className="absolute -bottom-4 end-3 h-16 w-16 opacity-[0.16] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:-rotate-6 motion-reduce:transition-none"
        style={{ color: tint.ink }}
        strokeWidth={1.2}
      />
    </div>
  );
}
