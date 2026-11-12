import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, Send } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useBlocker, useNavigate } from 'react-router-dom';
import { applySteps, fillTemplate, getAwardFormContent, type ApplyStepId } from '@/data/award/form';
import { awardRoutes } from '@/data/award/routes';
import { useI18n } from '@/i18n/useI18n';
import {
  AwardSubmitError,
  newAwardUploadSession,
  submitAwardApplication,
  type AwardSubmitErrorCode,
  type AwardSubmitStage,
} from '@/services/awardApplication';
import {
  buildApplicationPayload,
  fieldDomId,
  initialApplyValues,
  isDirty,
  screenImages,
  validateStep,
  type ApplyValues,
  type AttachedImage,
  type FieldError,
} from './applyState';
import ApplyProgress from './ApplyProgress';
import { StepBasic, StepDetails, StepImpact, StepReview } from './ApplySteps';
import { formButton } from './formStyles';

const HEADER_OFFSET = 112;
const ease = [0.22, 1, 0.36, 1] as const;

let imageSeed = 0;

/**
 * The four-step nomination wizard. State lives here (React state only — no
 * localStorage); steps validate on "Next" and the first invalid field takes
 * focus. Nothing leaves the browser until the last step is sent: the photos
 * are uploaded, then the application is posted to /api/award/apply.
 */
export default function ApplyWizard() {
  const { locale, isRtl } = useI18n();
  const content = getAwardFormContent(locale);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [values, setValues] = useState<ApplyValues>(initialApplyValues);
  const [images, setImages] = useState<AttachedImage[]>([]);
  const [imageNotices, setImageNotices] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [attempted, setAttempted] = useState<Partial<Record<ApplyStepId, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState<AwardSubmitStage>({ step: 'sending' });
  const [submitError, setSubmitError] = useState<AwardSubmitErrorCode | null>(null);
  // Remembers the photos already uploaded, so a retry does not send them twice.
  const [uploadSession] = useState(newAwardUploadSession);
  // Hidden field no visitor sees; automated senders fill it and are refused.
  const [trap, setTrap] = useState('');
  const [focusTarget, setFocusTarget] = useState<{ id: string; seq: number } | null>(null);

  const formTopRef = useRef<HTMLDivElement>(null);
  const focusHeading = useRef(false);
  const submittingRef = useRef(false);
  const submittedRef = useRef(false);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const step = applySteps[stepIndex];
  const errors = useMemo(
    () => (attempted[step] ? validateStep(step, values, content, { imageCount: images.length }) : []),
    [attempted, step, values, content, images.length]
  );
  const errorMap = useMemo(() => {
    const map = new Map<string, string>();
    errors.forEach((error) => {
      if (!map.has(error.key)) map.set(error.key, error.message);
    });
    return map;
  }, [errors]);
  const errorOf = useCallback((key: string) => errorMap.get(key), [errorMap]);

  const update = useCallback(<K extends keyof ApplyValues>(key: K, value: ApplyValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  // Object URLs live as long as the wizard; release them when it goes away.
  useEffect(() => () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url)), []);

  // Focus the first invalid field. When the error sits on another step, that
  // step mounts only after the exit animation, so keep trying for ~1s.
  useEffect(() => {
    if (!focusTarget) return undefined;
    let frame = 0;
    let tries = 0;
    const attempt = () => {
      const element = document.getElementById(focusTarget.id);
      if (!element) {
        if ((tries += 1) < 60) frame = window.requestAnimationFrame(attempt);
        return;
      }
      const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET - 40;
      window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
      element.focus({ preventScroll: true });
    };
    frame = window.requestAnimationFrame(attempt);
    return () => window.cancelAnimationFrame(frame);
  }, [focusTarget, reduceMotion]);

  const requestFocus = (stepErrors: FieldError[]) => {
    const first = stepErrors[0];
    if (first) setFocusTarget({ id: fieldDomId(first.focus ?? first.key), seq: Date.now() });
  };

  const scrollToForm = () => {
    const top = (formTopRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const goTo = (index: number) => {
    if (index === stepIndex) {
      scrollToForm();
      return;
    }
    setDirection(index > stepIndex ? 1 : -1);
    setStepIndex(index);
    focusHeading.current = true;
    scrollToForm();
  };

  /** Validates steps from `from` up to (not including) `to`; stops at the first invalid one. */
  const firstInvalid = (from: number, to: number) => {
    for (let index = from; index < to; index += 1) {
      const stepErrors = validateStep(applySteps[index], values, content, { imageCount: images.length });
      if (stepErrors.length) return { index, stepErrors };
    }
    return null;
  };

  const showErrors = (index: number, stepErrors: FieldError[]) => {
    setAttempted((current) => ({ ...current, [applySteps[index]]: true }));
    if (index !== stepIndex) {
      setDirection(index > stepIndex ? 1 : -1);
      setStepIndex(index);
    }
    requestFocus(stepErrors);
  };

  const next = () => {
    const invalid = firstInvalid(stepIndex, stepIndex + 1);
    if (invalid) return showErrors(invalid.index, invalid.stepErrors);
    goTo(stepIndex + 1);
  };

  const select = (index: number) => {
    if (index <= stepIndex) return goTo(index);
    const invalid = firstInvalid(stepIndex, index);
    if (invalid) return showErrors(invalid.index, invalid.stepErrors);
    goTo(index);
  };

  const submit = async () => {
    if (submittingRef.current) return;
    const invalid = firstInvalid(0, applySteps.length);
    if (invalid) return showErrors(invalid.index, invalid.stepErrors);

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitStage(images.length ? { step: 'uploading', current: 1, total: images.length } : { step: 'sending' });
    try {
      const { reference } = await submitAwardApplication(buildApplicationPayload(values, images), {
        locale,
        session: uploadSession,
        files: images.map((image) => image.file),
        trap,
        onStage: setSubmitStage,
      });
      submittedRef.current = true;
      navigate(awardRoutes.success, { state: { initiativeName: values.initiativeName.trim(), reference } });
    } catch (error) {
      submittingRef.current = false;
      setSubmitting(false);
      setSubmitError(error instanceof AwardSubmitError ? error.code : 'network');
    }
  };

  /* Images (kept in memory as object URLs) */
  const addImages = (files: File[]) => {
    const { accepted, rejected } = screenImages(files, images.length, content);
    setImageNotices(rejected);
    if (accepted.length)
      setImages((current) => [
        ...current,
        ...accepted.map((file) => ({ id: `img-${(imageSeed += 1)}`, file, url: URL.createObjectURL(file) })),
      ]);
  };
  const replaceImage = (id: string, file: File) => {
    const { accepted, rejected } = screenImages([file], 0, content);
    setImageNotices(rejected);
    if (!accepted.length) return;
    setImages((current) =>
      current.map((image) => {
        if (image.id !== id) return image;
        URL.revokeObjectURL(image.url);
        return { id: image.id, file, url: URL.createObjectURL(file) };
      })
    );
  };
  const removeImage = (id: string) => {
    setImageNotices([]);
    setImages((current) => {
      const target = current.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((image) => image.id !== id);
    });
  };

  /* Leaving with unsent data: confirm in-app navigation, warn on reload / tab close. */
  const dirty = isDirty(values, images);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && !submittedRef.current && currentLocation.pathname !== nextLocation.pathname
  );
  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    if (window.confirm(content.common.leaveConfirm)) blocker.proceed();
    else blocker.reset();
  }, [blocker, content.common.leaveConfirm]);
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event: BeforeUnloadEvent) => {
      if (submittedRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const stepProps = { values, update, errorOf, content };
  const stepText = content.steps[step];
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;
  const PrevIcon = isRtl ? ArrowRight : ArrowLeft;
  const isLast = stepIndex === applySteps.length - 1;
  const offset = (reduceMotion ? 0 : 28) * (isRtl ? -1 : 1);
  const submitMessages: Record<AwardSubmitErrorCode, string> = {
    network: content.common.submitFailed,
    closed: content.common.submitClosed,
    invalid: content.common.submitRejected,
    'rate-limited': content.common.submitRateLimited,
  };

  return (
    <div
      id="award-apply-form"
      ref={formTopRef}
      className="rounded-[28px] border border-dark-100 bg-white p-4 shadow-[0_30px_80px_rgba(20,0,4,0.1)] sm:p-7 lg:p-9"
    >
      <ApplyProgress current={stepIndex} content={content} onSelect={select} />

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (isLast) void submit();
          else next();
        }}
        className="mt-7 border-t border-dark-100 pt-7"
      >
        <div aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
          <label>
            Leave this field empty
            <input
              type="text"
              name="extra_info"
              tabIndex={-1}
              autoComplete="off"
              value={trap}
              onChange={(event) => setTrap(event.target.value)}
            />
          </label>
        </div>
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * offset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * offset }}
            transition={{ duration: reduceMotion ? 0.01 : 0.32, ease }}
          >
            <div className="mb-6">
              <h2
                ref={(element) => {
                  if (element && focusHeading.current) {
                    focusHeading.current = false;
                    element.focus({ preventScroll: true });
                  }
                }}
                tabIndex={-1}
                className="font-brand text-2xl font-bold text-dark-900 outline-none sm:text-[1.75rem]"
              >
                {stepText.heading}
              </h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-dark-500">{stepText.description}</p>
            </div>

            {errors.length > 0 && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-2.5 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-bold leading-relaxed text-primary-800"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                {fillTemplate(content.common.errorSummary, { count: errorMap.size })}
              </div>
            )}

            {step === 'basic' && <StepBasic {...stepProps} />}
            {step === 'details' && <StepDetails {...stepProps} />}
            {step === 'impact' && <StepImpact {...stepProps} />}
            {step === 'review' && (
              <StepReview
                {...stepProps}
                images={images}
                imageNotices={imageNotices}
                onAddImages={addImages}
                onReplaceImage={replaceImage}
                onRemoveImage={removeImage}
                onEdit={(target) => goTo(applySteps.indexOf(target))}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {submitError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2.5 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-bold text-primary-800"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            {submitMessages[submitError]}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-dark-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {stepIndex === 0 ? (
            <Link to={awardRoutes.landing} className={formButton.secondary}>
              {content.common.backToAward}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => goTo(stepIndex - 1)}
              disabled={submitting}
              className={formButton.secondary}
            >
              <PrevIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              {content.common.previous}
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting || undefined}
            className={formButton.primary}
          >
            {isLast ? (
              submitting ? (
                <>
                  <Loader2 className="h-[18px] w-[18px] animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  {submitStage.step === 'uploading'
                    ? fillTemplate(content.common.uploading, {
                        current: submitStage.current,
                        total: submitStage.total,
                      })
                    : content.common.submitting}
                </>
              ) : (
                <>
                  {content.common.submit}
                  <Send className="h-[18px] w-[18px] rtl:-scale-x-100" aria-hidden="true" />
                </>
              )
            ) : (
              <>
                {content.common.next}
                <NextIcon
                  className={`h-[18px] w-[18px] transition-transform duration-300 ${
                    isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                  }`}
                  aria-hidden="true"
                />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
