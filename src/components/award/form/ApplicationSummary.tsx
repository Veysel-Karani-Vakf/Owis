import { PenLine } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  awardFormRules,
  fillTemplate,
  formLocaleTag,
  impactIds,
  yemenGovernorates,
  type ApplyStepId,
  type AwardFormContent,
} from '@/data/award/form';
import type { Locale } from '@/i18n/content';
import { countWords, formatPhone, parseLink, type ApplyValues, type AttachedImage } from './applyState';

type SummaryProps = {
  values: ApplyValues;
  images: AttachedImage[];
  content: AwardFormContent;
  locale: Locale;
  onEdit: (step: ApplyStepId) => void;
};

function Row({ label, children, ltr }: { label: string; children: ReactNode; ltr?: boolean }) {
  return (
    <div className="grid gap-1 border-b border-dark-100 py-3 last:border-b-0 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-4">
      <dt className="text-[13px] font-bold text-dark-500">{label}</dt>
      <dd className="min-w-0 break-words text-[15px] font-semibold text-dark-900" dir={ltr ? 'ltr' : undefined}>
        {children}
      </dd>
    </div>
  );
}

function Card({
  title,
  step,
  edit,
  onEdit,
  children,
}: {
  title: string;
  step: ApplyStepId;
  edit: string;
  onEdit: SummaryProps['onEdit'];
  children: ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-dark-100 bg-white p-4 sm:p-6">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h4 className="text-base font-bold text-dark-900">{title}</h4>
        <button
          type="button"
          onClick={() => onEdit(step)}
          aria-label={`${edit}: ${title}`}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <PenLine className="h-4 w-4" aria-hidden="true" />
          {edit}
        </button>
      </div>
      <dl>{children}</dl>
    </section>
  );
}

/** Read-only summary of everything entered, with a way back to each step. */
export default function ApplicationSummary({ values, images, content, locale, onEdit }: SummaryProps) {
  const fields = content.fields;
  const review = content.review;
  const empty = <span className="font-normal text-dark-400">{review.empty}</span>;
  const text = (value: string) => (value.trim() ? value.trim() : empty);

  const monthName = (month: string, year: string) =>
    month && year
      ? new Intl.DateTimeFormat(formLocaleTag[locale], { month: 'long', year: 'numeric' }).format(
          new Date(Number(year), Number(month) - 1, 1)
        )
      : '';
  const start = monthName(values.startMonth, values.startYear);
  const end = values.ongoing ? review.ongoing : monthName(values.endMonth, values.endYear);
  const governorate = yemenGovernorates.find((item) => item.code === values.governorate)?.name[locale] ?? '';
  const category = values.category
    ? values.category === 'other'
      ? `${fields.category.options.other}: ${values.categoryOther.trim()}`
      : fields.category.options[values.category]
    : '';
  const socials = values.social.filter((row) => row.platform || row.url.trim());

  return (
    <div className="space-y-4">
      <Card title={review.sections.basic} step="basic" edit={content.common.edit} onEdit={onEdit}>
        <Row label={fields.initiativeName.label}>{text(values.initiativeName)}</Row>
        <Row label={fields.representative.label}>{text(values.representative)}</Row>
        <Row label={fields.phone.label} ltr>
          {formatPhone(values) || empty}
        </Row>
        <Row label={fields.email.label} ltr>
          {text(values.email)}
        </Row>
        <Row label={fields.nationality.label}>
          {values.allYemeni ? (values.allYemeni === 'yes' ? fields.nationality.yes : fields.nationality.no) : empty}
        </Row>
        <Row label={fields.teamSize.label}>{text(values.teamSize)}</Row>
      </Card>

      <Card title={review.sections.details} step="details" edit={content.common.edit} onEdit={onEdit}>
        <Row label={fields.location.label}>
          {governorate || values.district.trim()
            ? [governorate, values.district.trim()].filter(Boolean).join(' — ')
            : empty}
        </Row>
        <Row label={fields.period.label}>{start ? `${start} – ${end || '…'}` : empty}</Row>
        <Row label={fields.category.label}>{category || empty}</Row>
        <Row label={fields.social.label}>
          {socials.length ? (
            <ul className="space-y-1.5">
              {socials.map((row) => (
                <li key={row.id} className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[13px] font-bold text-dark-600">
                    {row.platform === 'other'
                      ? row.name.trim() || fields.social.platforms.other
                      : row.platform
                        ? fields.social.platforms[row.platform]
                        : '—'}
                  </span>
                  <span dir="ltr" className="break-all text-[14px] font-medium text-primary-700">
                    {parseLink(row.url)?.toString() ?? row.url}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            empty
          )}
        </Row>
      </Card>

      <Card title={review.sections.impact} step="impact" edit={content.common.edit} onEdit={onEdit}>
        {impactIds.map((id) => (
          <Row key={id} label={fields.impact[id].title}>
            {values.answers[id].trim() ? (
              <>
                <span className="block whitespace-pre-line font-medium leading-[1.85]">
                  {values.answers[id].trim()}
                </span>
                <span className="mt-1 block text-xs font-bold text-dark-500">
                  {fillTemplate(review.words, { count: countWords(values.answers[id]) })} /{' '}
                  {awardFormRules.wordLimits[id]}
                </span>
              </>
            ) : (
              empty
            )}
          </Row>
        ))}
      </Card>

      <Card title={review.sections.attachments} step="review" edit={content.common.edit} onEdit={onEdit}>
        <div className="py-3">
          {images.length ? (
            <ul className="flex flex-wrap gap-2">
              {images.map((image) => (
                <li key={image.id} className="h-16 w-20 overflow-hidden rounded-xl border border-dark-100 bg-warm">
                  <img src={image.url} alt={image.file.name} className="h-full w-full object-cover" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[15px] text-dark-500">{review.noImages}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
