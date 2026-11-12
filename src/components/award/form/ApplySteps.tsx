import { Info, PenLine } from 'lucide-react';
import { categoryIcons } from '@/components/award/awardIcons';
import { categoryValues, impactIds, yemenGovernorates, type ApplyStepId, type CategoryValue } from '@/data/award/form';
import { useI18n } from '@/i18n/useI18n';
import { fieldDomId, type ApplyValues, type AttachedImage, type StepProps } from './applyState';
import ApplicationSummary from './ApplicationSummary';
import { PeriodField, PhoneField, SocialLinksField } from './compositeFields';
import { Checkbox, ChoiceGroup, FieldError, FieldShell, SelectInput, TextInput } from './controls';
import ImageAttachments from './ImageAttachments';
import WordCountField from './WordCountField';

/* ------------------------------------------------------------------------- */
/* Step 1 — basic information                                                */
/* ------------------------------------------------------------------------- */

export function StepBasic(props: StepProps) {
  const { values, update, errorOf, content } = props;
  const f = content.fields;
  const req = content.common.requiredMark;
  const nationalityError = errorOf('allYemeni');

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <FieldShell
        id={fieldDomId('initiativeName')}
        label={f.initiativeName.label}
        required
        requiredLabel={req}
        error={errorOf('initiativeName')}
      >
        <TextInput
          id={fieldDomId('initiativeName')}
          value={values.initiativeName}
          onValue={(value) => update('initiativeName', value)}
          placeholder={f.initiativeName.placeholder}
          aria-required="true"
          maxLength={160}
          error={errorOf('initiativeName')}
        />
      </FieldShell>
      <FieldShell
        id={fieldDomId('representative')}
        label={f.representative.label}
        required
        requiredLabel={req}
        error={errorOf('representative')}
      >
        <TextInput
          id={fieldDomId('representative')}
          value={values.representative}
          onValue={(value) => update('representative', value)}
          placeholder={f.representative.placeholder}
          autoComplete="name"
          aria-required="true"
          maxLength={160}
          error={errorOf('representative')}
        />
      </FieldShell>

      <div className="md:col-span-2">
        <PhoneField {...props} />
      </div>

      <FieldShell id={fieldDomId('email')} label={f.email.label} required requiredLabel={req} error={errorOf('email')}>
        <TextInput
          id={fieldDomId('email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          value={values.email}
          onValue={(value) => update('email', value)}
          placeholder={f.email.placeholder}
          aria-required="true"
          error={errorOf('email')}
          className="text-left"
        />
      </FieldShell>
      <FieldShell
        id={fieldDomId('teamSize')}
        label={f.teamSize.label}
        required
        requiredLabel={req}
        hint={f.teamSize.hint}
        error={errorOf('teamSize')}
      >
        <TextInput
          id={fieldDomId('teamSize')}
          inputMode="numeric"
          value={values.teamSize}
          onValue={(value) => update('teamSize', value)}
          placeholder={f.teamSize.placeholder}
          aria-required="true"
          maxLength={6}
          hint={f.teamSize.hint}
          error={errorOf('teamSize')}
        />
      </FieldShell>

      <FieldShell
        id={fieldDomId('allYemeni')}
        group
        label={f.nationality.label}
        required
        requiredLabel={req}
        className="md:col-span-2"
        error={nationalityError}
      >
        <p className="-mt-1 mb-3 flex items-start gap-2 text-[13px] leading-relaxed text-dark-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-dark-400" aria-hidden="true" />
          {f.nationality.note}
        </p>
        <div className="max-w-md">
          <ChoiceGroup
            id={fieldDomId('allYemeni')}
            name="award-all-yemeni"
            value={values.allYemeni}
            onValue={(value) => update('allYemeni', value as ApplyValues['allYemeni'])}
            options={[
              { value: 'yes', label: f.nationality.yes },
              { value: 'no', label: f.nationality.no },
            ]}
            error={nationalityError}
          />
        </div>
      </FieldShell>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Step 2 — initiative details                                               */
/* ------------------------------------------------------------------------- */

export function StepDetails(props: StepProps) {
  const { values, update, errorOf, content } = props;
  const { locale } = useI18n();
  const f = content.fields;
  const req = content.common.requiredMark;
  const collator = new Intl.Collator(locale);
  const governorates = yemenGovernorates
    .map((item) => ({ value: item.code, label: item.name[locale] }))
    .sort((a, b) => collator.compare(a.label, b.label));
  const categoryIcon = (value: CategoryValue) => {
    // "Other" shares the icon of the landing page's "other development fields" card.
    const Icon = value === 'other' ? categoryIcons.development : categoryIcons[value];
    return <Icon className="h-[18px] w-[18px]" aria-hidden="true" />;
  };

  return (
    <div className="grid gap-6">
      <fieldset className="min-w-0">
        <legend className="mb-3 text-[15px] font-bold text-dark-900">{f.location.label}</legend>
        <div className="grid gap-5 md:grid-cols-2">
          <FieldShell
            id={fieldDomId('governorate')}
            label={f.governorate.label}
            required
            requiredLabel={req}
            error={errorOf('governorate')}
          >
            <SelectInput
              id={fieldDomId('governorate')}
              value={values.governorate}
              onValue={(value) => update('governorate', value)}
              placeholder={f.governorate.placeholder}
              options={governorates}
              aria-required="true"
              error={errorOf('governorate')}
            />
          </FieldShell>
          <FieldShell
            id={fieldDomId('district')}
            label={f.district.label}
            required
            requiredLabel={req}
            error={errorOf('district')}
          >
            <TextInput
              id={fieldDomId('district')}
              value={values.district}
              onValue={(value) => update('district', value)}
              placeholder={f.district.placeholder}
              aria-required="true"
              maxLength={120}
              error={errorOf('district')}
            />
          </FieldShell>
        </div>
      </fieldset>

      <PeriodField {...props} />

      <FieldShell
        id={fieldDomId('category')}
        group
        label={f.category.label}
        required
        requiredLabel={req}
        error={errorOf('category')}
      >
        <ChoiceGroup
          id={fieldDomId('category')}
          name="award-category"
          value={values.category}
          onValue={(value) => update('category', value as CategoryValue)}
          options={categoryValues.map((value) => ({
            value,
            label: f.category.options[value],
            icon: categoryIcon(value),
          }))}
          error={errorOf('category')}
          columns="grid-cols-2 sm:grid-cols-3"
        />
        {values.category === 'other' && (
          <div className="mt-3 max-w-md">
            <FieldShell
              id={fieldDomId('categoryOther')}
              label={f.category.otherLabel}
              required
              requiredLabel={req}
              error={errorOf('categoryOther')}
            >
              <TextInput
                id={fieldDomId('categoryOther')}
                value={values.categoryOther}
                onValue={(value) => update('categoryOther', value)}
                placeholder={f.category.otherPlaceholder}
                maxLength={80}
                aria-required="true"
                error={errorOf('categoryOther')}
              />
            </FieldShell>
          </div>
        )}
      </FieldShell>

      <SocialLinksField {...props} />
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Step 3 — impact and distinction (official questions)                      */
/* ------------------------------------------------------------------------- */

export function StepImpact(props: StepProps) {
  return (
    <div className="grid gap-4">
      {impactIds.map((id, index) => (
        <WordCountField key={id} questionId={id} index={index} {...props} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Step 4 — attachments, review and declaration                              */
/* ------------------------------------------------------------------------- */

type StepReviewProps = StepProps & {
  images: AttachedImage[];
  imageNotices: string[];
  onAddImages: (files: File[]) => void;
  onReplaceImage: (id: string, file: File) => void;
  onRemoveImage: (id: string) => void;
  onEdit: (step: ApplyStepId) => void;
};

export function StepReview({
  images,
  imageNotices,
  onAddImages,
  onReplaceImage,
  onRemoveImage,
  onEdit,
  ...props
}: StepReviewProps) {
  const { values, update, errorOf, content } = props;
  const { locale } = useI18n();
  const declaration = content.declaration;
  const noticeId = 'award-declaration-notice';

  return (
    <div className="grid gap-6">
      <ImageAttachments
        images={images}
        notices={imageNotices}
        error={errorOf('images')}
        content={content}
        onAdd={onAddImages}
        onReplace={onReplaceImage}
        onRemove={onRemoveImage}
      />

      <section id="award-review" aria-labelledby="award-review-title">
        <h3 id="award-review-title" className="text-lg font-bold text-dark-900">
          {content.review.heading}
        </h3>
        <p className="mt-1 text-sm text-dark-500">{content.review.description}</p>
        <div className="mt-4">
          <ApplicationSummary values={values} images={images} content={content} locale={locale} onEdit={onEdit} />
        </div>
      </section>

      <section
        id="award-declaration"
        aria-labelledby="award-declaration-title"
        className="rounded-[22px] border border-dark-100 bg-warm/60 p-4 sm:p-6"
      >
        <h3 id="award-declaration-title" className="text-lg font-bold text-dark-900">
          {declaration.heading}
        </h3>
        <div id={noticeId} className="mt-3 rounded-2xl border border-dark-100 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-dark-900">{declaration.noticeTitle}</p>
            {/* Draft markers stay until the award team confirms the official wording in the dashboard. */}
            {!declaration.noticeApproved && (
              <span className="inline-flex items-center gap-1 rounded-full border border-dark-200 bg-dark-50 px-2.5 py-0.5 text-[11px] font-bold text-dark-600">
                <PenLine className="h-3 w-3" aria-hidden="true" />
                {declaration.noticeDraft}
              </span>
            )}
          </div>
          <p className="mt-2 whitespace-pre-line text-[15px] leading-[1.9] text-dark-700">{declaration.noticeText}</p>
          {!declaration.noticeApproved && <p className="mt-2 text-xs text-dark-500">{declaration.noticePending}</p>}
        </div>
        <div className="mt-4">
          <Checkbox
            id={fieldDomId('declaration')}
            checked={values.declaration}
            onChecked={(checked) => update('declaration', checked)}
            label={declaration.checkbox}
            error={errorOf('declaration')}
            describedById={noticeId}
          />
          <FieldError id={`${fieldDomId('declaration')}-error`} message={errorOf('declaration')} />
        </div>
      </section>
    </div>
  );
}
