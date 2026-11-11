import { motion, useReducedMotion } from 'framer-motion';
import { awardFormRules, fillTemplate, type ImpactId } from '@/data/award/form';
import { countWords, fieldDomId, type StepProps } from './applyState';
import { FieldError } from './controls';
import { controlClass } from './formStyles';

type WordCountFieldProps = StepProps & { questionId: ImpactId; index: number };

/**
 * One official impact question: title, the full question, an optional official
 * note, a textarea and a live word counter. Going over the limit is flagged as
 * soon as it happens (the step itself refuses to advance until it is fixed).
 */
export default function WordCountField({ questionId, index, values, update, errorOf, content }: WordCountFieldProps) {
  const reduceMotion = useReducedMotion();
  const question = content.fields.impact[questionId];
  const key = `answers.${questionId}`;
  const id = fieldDomId(key);
  const value = values.answers[questionId];
  const limit = awardFormRules.wordLimits[questionId];
  const words = countWords(value);
  const over = words - limit;
  const ratio = Math.min(words / limit, 1);
  // Over the limit is always shown live; other problems appear after "Next".
  const liveError = over > 0 ? fillTemplate(content.messages.wordsOver, { limit, over }) : undefined;
  const error = liveError ?? errorOf(key);
  const tone = over > 0 ? 'text-primary-700' : words >= limit * 0.9 ? 'text-amber-700' : 'text-dark-500';

  return (
    <div className="rounded-[22px] border border-dark-100 bg-white p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 font-latin text-sm font-bold text-primary-600"
        >
          {index + 1}
        </span>
        <div className="min-w-0">
          <label htmlFor={id} className="block text-base font-bold text-dark-900 sm:text-[17px]">
            {question.title}
            <span className="ms-1 text-primary-500" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> ({content.common.requiredMark})</span>
          </label>
          <p id={`${id}-question`} className="mt-1.5 text-[15px] leading-[1.85] text-dark-700">
            {question.question}
          </p>
          {question.note && (
            <p id={`${id}-note`} className="mt-1 text-[13px] font-semibold text-dark-500">
              {question.note}
            </p>
          )}
        </div>
      </div>

      <textarea
        id={id}
        value={value}
        rows={5}
        onChange={(event) => update('answers', { ...values.answers, [questionId]: event.target.value })}
        placeholder={content.fields.answerPlaceholder}
        aria-required="true"
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={[
          `${id}-question`,
          question.note ? `${id}-note` : '',
          `${id}-count`,
          error ? `${id}-error` : '',
        ]
          .filter(Boolean)
          .join(' ')}
        className={controlClass(error, 'mt-4 resize-y leading-[1.9]')}
      />

      <div className="mt-2 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-dark-100" aria-hidden="true">
          <motion.div
            className={`h-full rounded-full ltr:origin-left rtl:origin-right ${over > 0 ? 'bg-primary-700' : 'bg-primary-500'}`}
            initial={false}
            animate={{ scaleX: over > 0 ? 1 : ratio }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
          />
        </div>
        <span id={`${id}-count`} className={`shrink-0 text-[13px] font-bold tabular-nums ${tone}`}>
          {fillTemplate(content.fields.wordCounter, { count: words, limit })}
        </span>
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
