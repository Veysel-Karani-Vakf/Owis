import { motion, useReducedMotion } from 'framer-motion';
import { Info, PenLine } from 'lucide-react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { awardSectionIds, type AwardContent } from '@/data/award/content';
import AwardSectionHeading from './AwardSectionHeading';
import { awardEase } from './awardUi';

type AwardFaqProps = {
  content: AwardContent;
};

/**
 * Section F — accessible accordion (WAI-ARIA pattern): each question is a
 * button with aria-expanded/aria-controls; Up/Down/Home/End move between
 * questions. Panels animate their height with a grid-rows transition and are
 * `visibility: hidden` while closed, so collapsed answers leave the
 * accessibility tree and the tab order.
 */
export default function AwardFaq({ content }: AwardFaqProps) {
  const { faq, labels } = content;
  const reduceMotion = useReducedMotion();
  const [openIds, setOpenIds] = useState<string[]>([]);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasDraft = faq.items.some((item) => item.draft);

  const toggle = (id: string) =>
    setOpenIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));

  const focusQuestion = (index: number) => {
    const count = faq.items.length;
    buttonRefs.current[(index + count) % count]?.focus();
  };

  const onQuestionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: faq.items.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    focusQuestion(moves[event.key]);
  };

  return (
    <section
      id={awardSectionIds.faq}
      tabIndex={-1}
      aria-labelledby="award-faq-title"
      className="relative bg-white py-20 focus:outline-none md:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <AwardSectionHeading id="award-faq-title" title={faq.title} description={faq.description} />

        <div className="mt-12 space-y-3">
          {faq.items.map((item, index) => {
            const open = openIds.includes(item.id);
            const buttonId = `award-faq-q-${item.id}`;
            const panelId = `award-faq-a-${item.id}`;

            return (
              <motion.div
                key={item.id}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.05, ease: awardEase }}
                className={`rounded-[20px] border bg-white transition-[border-color,box-shadow] duration-300 ${
                  open
                    ? 'border-award-green-200 shadow-[0_18px_40px_rgba(15,56,60,0.08)]'
                    : 'border-award-line hover:border-award-green-200/70'
                }`}
              >
                <h3>
                  <button
                    ref={(element) => {
                      buttonRefs.current[index] = element;
                    }}
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                    onKeyDown={(event) => onQuestionKeyDown(event, index)}
                    className="flex w-full items-center justify-between gap-4 rounded-[20px] px-5 py-4 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-award-green-600 sm:px-6 sm:py-5"
                  >
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[15px] font-bold leading-snug text-award-ink sm:text-base">
                      {item.question}
                      {item.draft && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-award-gold-300 bg-award-gold-50 px-2.5 py-0.5 text-[11px] font-bold text-award-gold-700">
                          <PenLine className="h-3 w-3" aria-hidden="true" />
                          {labels.draft}
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                        open ? 'bg-award-green-700 text-white' : 'bg-award-cream-100 text-award-green-700'
                      }`}
                    >
                      <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                      <span
                        className={`absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none ${
                          open ? 'rotate-90 scale-y-0' : ''
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-[1.95] text-award-body sm:px-6 sm:pb-6 sm:text-[15px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {hasDraft && (
          <p className="mt-6 flex items-start justify-center gap-2 text-center text-[13px] leading-relaxed text-award-body">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-award-gold-500" aria-hidden="true" />
            {labels.draftNotice}
          </p>
        )}
      </div>
    </section>
  );
}
