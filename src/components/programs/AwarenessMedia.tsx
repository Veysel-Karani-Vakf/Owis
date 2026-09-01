import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight, Clapperboard, MessagesSquare, Mic, PenLine, Sparkles, type LucideIcon } from 'lucide-react';
import type { ProgramMediaProduct } from '@/data/programs';
import { resolveIcon } from '@/lib/icons';

type AwarenessMediaProps = {
  eyebrow: string;
  title: string;
  description: string;
  products: ProgramMediaProduct[];
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
// Defaults keyed by the seeded product ids; an editor-chosen icon name wins over them.
const productIcons: Record<string, LucideIcon> = {
  podcast: Mic,
  visuals: Clapperboard,
  diwaniya: MessagesSquare,
  blog: PenLine,
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};

const cardVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0.01 : 0.6, ease: smoothEase },
  },
});

/** Soundwave line that keeps drifting inside the featured (dark) card. */
function WaveLine({ reduced }: { reduced: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 48" className="h-10 w-full" preserveAspectRatio="none">
      <motion.path
        d="M0 24 Q 20 4 40 24 T 80 24 T 120 24 T 160 24 T 200 24 T 240 24 T 280 24 T 320 24"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: reduced ? 1 : 0, opacity: 0.7 }}
        animate={reduced ? { pathLength: 1 } : { pathLength: [0, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={reduced ? { duration: 0.01 } : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export default function AwarenessMedia({ eyebrow, title, description, products }: AwarenessMediaProps) {
  const reduced = !!useReducedMotion();

  if (!products?.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-primary-200" />
          <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
          <span className="h-px w-8 bg-primary-200" />
        </div>
        <h2 className="text-balance text-3xl font-bold leading-[1.3] text-dark-950 md:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{description}</p>
      </div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-6 md:grid-cols-2"
      >
        {products.map((product, index) => {
          const Icon = resolveIcon(product.icon, [productIcons[product.id] ?? Sparkles], index);
          const dark = index === 0;
          const number = String(index + 1).padStart(2, '0');
          const url = product.url?.trim();
          const isExternal = !!url && /^https?:\/\//.test(url);

          const cardClass = `group relative isolate flex h-full flex-col overflow-hidden rounded-[28px] p-7 text-start transition-transform duration-500 hover:-translate-y-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 motion-reduce:hover:translate-y-0 md:p-9 ${
            dark
              ? 'bg-dark-950 text-white shadow-[0_30px_80px_rgba(0,0,0,0.26)]'
              : 'border border-primary-100 bg-white text-dark-950 shadow-[0_22px_60px_rgba(40,12,18,0.08)]'
          }`;

          const body = (
            <>
              {dark && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_15%,rgba(218,8,18,0.35),transparent_55%)]"
                />
              )}
              <span
                aria-hidden="true"
                dir="ltr"
                className={`pointer-events-none absolute -top-7 end-4 select-none text-[7.5rem] font-black leading-none tabular-nums transition-transform duration-700 group-hover:scale-110 motion-reduce:group-hover:scale-100 ${
                  dark ? 'text-white/[0.06]' : 'text-primary-600/[0.07]'
                }`}
              >
                {number}
              </span>

              <div className="flex items-center justify-between gap-4">
                <motion.span
                  animate={reduced ? undefined : { y: [0, -4, 0], rotate: [0, -3, 3, 0] }}
                  transition={
                    reduced
                      ? undefined
                      : { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.45 }
                  }
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500 ${
                    dark
                      ? 'bg-white/10 text-white group-hover:bg-primary-600'
                      : 'bg-primary-50 text-primary-700 group-hover:bg-primary-600 group-hover:text-white'
                  }`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </motion.span>
                <span
                  className={`rounded-full px-3.5 py-1.5 text-xs font-black ${
                    dark ? 'bg-white/10 text-white/80' : 'bg-primary-50 text-primary-700'
                  }`}
                >
                  {product.tagline}
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold leading-tight md:text-3xl">{product.title}</h3>
              <p
                className={`mt-3 flex-1 text-base leading-relaxed ${dark ? 'text-white/70' : 'text-dark-600'}`}
              >
                {product.description}
              </p>

              <div className="mt-6 flex items-end justify-between gap-4">
                {dark ? (
                  <div className="min-w-0 flex-1">
                    <WaveLine reduced={reduced} />
                  </div>
                ) : (
                  <span
                    aria-hidden="true"
                    className="mb-2 block h-1 w-12 rounded-full bg-primary-100 transition-all duration-500 group-hover:w-24 group-hover:bg-primary-600 motion-reduce:group-hover:w-12"
                  />
                )}
                {url && (
                  <motion.span
                    aria-hidden="true"
                    animate={reduced ? undefined : { scale: [1, 1.1, 1] }}
                    transition={
                      reduced
                        ? undefined
                        : { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }
                    }
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
                      dark
                        ? 'bg-white/10 text-white group-hover:bg-primary-600'
                        : 'bg-primary-50 text-primary-700 group-hover:bg-primary-600 group-hover:text-white'
                    }`}
                  >
                    <ArrowUpRight className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
                  </motion.span>
                )}
              </div>
            </>
          );

          const key = product.id || `${product.title}-${index}`;

          // A product with a destination becomes one big link; without one it stays a plain card.
          let card: ReactNode;
          if (url && isExternal) {
            card = (
              <a href={url} target="_blank" rel="noopener noreferrer" className={cardClass}>
                {body}
              </a>
            );
          } else if (url) {
            card = (
              <Link to={url} className={cardClass}>
                {body}
              </Link>
            );
          } else {
            card = <article className={cardClass}>{body}</article>;
          }

          // Entrance variants stay on the outer wrapper; the endless idle float lives on its own
          // inner wrapper so the explicit `animate` doesn't break the grid's variant inheritance.
          return (
            <motion.div key={key} variants={cardVariants(reduced)} className="h-full">
              <motion.div
                className="h-full"
                animate={reduced ? undefined : { y: [0, -6, 0] }}
                transition={
                  reduced
                    ? undefined
                    : { duration: 5 + index * 0.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }
                }
              >
                {card}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
