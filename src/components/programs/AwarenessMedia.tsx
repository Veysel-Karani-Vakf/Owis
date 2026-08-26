import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Clapperboard, MessagesSquare, Mic, PenLine, Sparkles, type LucideIcon } from 'lucide-react';
import type { ProgramMediaProduct } from '@/data/programs';

type AwarenessMediaProps = {
  eyebrow: string;
  title: string;
  description: string;
  products: ProgramMediaProduct[];
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
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

  if (!products.length) return null;

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
          const Icon = productIcons[product.id] ?? Sparkles;
          const dark = index === 0;
          const number = String(index + 1).padStart(2, '0');

          return (
            <motion.article
              key={product.id}
              variants={cardVariants(reduced)}
              className={`group relative isolate flex flex-col overflow-hidden rounded-[28px] p-7 text-start transition-transform duration-500 hover:-translate-y-1.5 motion-reduce:hover:translate-y-0 md:p-9 ${
                dark
                  ? 'bg-dark-950 text-white shadow-[0_30px_80px_rgba(0,0,0,0.26)]'
                  : 'border border-primary-100 bg-white text-dark-950 shadow-[0_22px_60px_rgba(40,12,18,0.08)]'
              }`}
            >
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
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500 ${
                    dark
                      ? 'bg-white/10 text-white group-hover:bg-primary-600'
                      : 'bg-primary-50 text-primary-700 group-hover:bg-primary-600 group-hover:text-white'
                  }`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
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

              {dark ? (
                <div className="mt-6">
                  <WaveLine reduced={reduced} />
                </div>
              ) : (
                <span
                  aria-hidden="true"
                  className="mt-6 block h-1 w-12 rounded-full bg-primary-100 transition-all duration-500 group-hover:w-24 group-hover:bg-primary-600 motion-reduce:group-hover:w-12"
                />
              )}
            </motion.article>
          );
        })}
      </motion.div>
    </div>
  );
}
