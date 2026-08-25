import { motion, useReducedMotion } from 'framer-motion';
import { Check, HeartHandshake, Sparkles, Users, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { ProgramPillar, VolunteerCopy } from '@/data/programs';

type VolunteerFieldsProps = {
  fields: ProgramPillar[];
  copy: VolunteerCopy;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
const fieldIcons: LucideIcon[] = [HeartHandshake, Sparkles, Users];

/**
 * Expanding panels: on large screens the active field grows and the rest collapse
 * to a spine of vertical titles. Below that everything is simply stacked open.
 */
export default function VolunteerFields({ fields, copy }: VolunteerFieldsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = !!useReducedMotion();

  if (!fields.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="max-w-3xl text-start">
        <span className="text-sm font-black text-primary-700">{copy.fields.eyebrow}</span>
        <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
          {copy.fields.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{copy.fields.description}</p>
      </div>

      <div className="mt-10 flex flex-col gap-4 lg:h-[26rem] lg:flex-row">
        {fields.map((field, index) => {
          const Icon = fieldIcons[index % fieldIcons.length];
          const isActive = index === activeIndex;
          const number = String(index + 1).padStart(2, '0');

          return (
            <motion.button
              key={field.id}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              aria-expanded={isActive}
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: smoothEase, delay: reduced ? 0 : index * 0.1 }}
              animate={{ flexGrow: isActive ? 2.6 : 1 }}
              className={`group relative isolate flex flex-col overflow-hidden rounded-[28px] p-6 text-start transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 md:p-8 lg:min-w-0 lg:basis-0 ${
                isActive
                  ? 'bg-dark-950 text-white shadow-[0_30px_72px_rgba(0,0,0,0.28)]'
                  : 'border border-primary-100 bg-[#faf8f8] text-dark-950 hover:bg-primary-50/70'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                } bg-[radial-gradient(circle_at_82%_15%,rgba(218,8,18,0.42),transparent_58%)]`}
              />
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -bottom-8 select-none text-[9rem] font-black leading-none tabular-nums transition-colors duration-500 ${
                  isActive ? 'text-white/[0.06]' : 'text-primary-600/[0.06]'
                } end-3`}
                dir="ltr"
              >
                {number}
              </span>

              <div className="flex items-center justify-between gap-4">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-500 ${
                    isActive ? 'bg-primary-600 text-white' : 'bg-white text-primary-700 ring-1 ring-primary-100'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span
                  dir="ltr"
                  className={`text-xs font-black tabular-nums transition-colors duration-500 ${
                    isActive ? 'text-primary-300' : 'text-primary-300'
                  }`}
                >
                  {number}
                </span>
              </div>

              <h3 className="mt-6 text-balance text-xl font-bold leading-snug md:text-2xl">{field.title}</h3>

              <motion.div
                animate={{ opacity: isActive ? 1 : 0.85 }}
                transition={{ duration: 0.4, ease: smoothEase }}
                className="mt-auto pt-6"
              >
                <p className={`text-sm leading-relaxed md:text-[15px] ${isActive ? 'text-white/75' : 'text-dark-600'}`}>
                  {field.body}
                </p>

                <ul
                  className={`grid gap-2.5 overflow-hidden transition-[max-height,opacity,margin] duration-500 ${
                    isActive ? 'mt-5 max-h-48 opacity-100' : 'mt-0 max-h-0 opacity-0 lg:max-h-0'
                  }`}
                >
                  {field.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600/90 text-white">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
