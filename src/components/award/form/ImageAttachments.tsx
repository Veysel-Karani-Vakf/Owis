import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, ImagePlus, Info, RefreshCw, X } from 'lucide-react';
import { useRef, useState, type DragEvent } from 'react';
import { awardFormRules, fillTemplate, type AwardFormContent } from '@/data/award/form';
import type { AttachedImage } from './applyState';
import { formButton } from './formStyles';

type ImageAttachmentsProps = {
  images: AttachedImage[];
  notices: string[];
  content: AwardFormContent;
  onAdd: (files: File[]) => void;
  onReplace: (id: string, file: File) => void;
  onRemove: (id: string) => void;
};

const mb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);

/**
 * Optional supporting photos (a feature proposed for this preview). Files stay
 * in browser memory as object URLs; nothing is uploaded anywhere.
 */
export default function ImageAttachments({
  images,
  notices,
  content,
  onAdd,
  onReplace,
  onRemove,
}: ImageAttachmentsProps) {
  const reduceMotion = useReducedMotion();
  const text = content.attachments;
  const { max, maxBytes, accept } = awardFormRules.images;
  const pickRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const replaceTarget = useRef<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const full = images.length >= max;

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length) onAdd(files);
  };

  return (
    <section
      aria-labelledby="award-attachments-title"
      className="rounded-[22px] border border-dark-100 bg-white p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 id="award-attachments-title" className="text-base font-bold text-dark-900 sm:text-[17px]">
          {text.heading}
        </h3>
        <span className="rounded-full bg-warm px-2.5 py-0.5 text-[11px] font-bold text-dark-600 ring-1 ring-dark-100">
          {text.optionalBadge}
        </span>
      </div>
      <p className="mt-2 flex items-start gap-2 text-[13px] leading-relaxed text-dark-500">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-dark-400" aria-hidden="true" />
        {text.note}
      </p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!full) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`mt-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-7 text-center transition-colors duration-200 ${
          dragging
            ? 'border-primary-500 bg-primary-50'
            : full
              ? 'border-dark-200 bg-warm/60'
              : 'border-dark-200 bg-warm/40 hover:border-primary-300'
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm ring-1 ring-dark-100">
          <ImagePlus className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="text-[15px] font-bold text-dark-800">{text.dropTitle}</p>
        <p className="text-[13px] text-dark-500">{text.dropOr}</p>
        <button
          type="button"
          onClick={() => pickRef.current?.click()}
          disabled={full}
          aria-describedby="award-attachments-constraints award-attachments-count"
          className={`${formButton.secondary} min-h-11 px-5 text-sm disabled:cursor-not-allowed`}
        >
          {text.choose}
        </button>
        <p id="award-attachments-constraints" className="mt-1 text-xs leading-relaxed text-dark-500">
          {fillTemplate(text.constraints, { max, size: maxBytes / (1024 * 1024) })}
        </p>
        <p id="award-attachments-count" className="text-xs font-bold text-dark-600">
          {fillTemplate(text.count, { count: images.length, max })}
        </p>
        <input
          ref={pickRef}
          type="file"
          accept={accept}
          multiple
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = '';
            if (files.length) onAdd(files);
          }}
        />
        <input
          ref={replaceRef}
          type="file"
          accept={accept}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file && replaceTarget.current) onReplace(replaceTarget.current, file);
            replaceTarget.current = null;
          }}
        />
      </div>

      <div aria-live="polite">
        {notices.length > 0 && (
          <ul className="mt-3 space-y-1.5 rounded-2xl border border-primary-200 bg-primary-50/60 p-3">
            {notices.map((notice) => (
              <li
                key={notice}
                className="flex items-start gap-2 text-[13px] font-semibold leading-relaxed text-primary-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {notice}
              </li>
            ))}
          </ul>
        )}
      </div>

      {images.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <AnimatePresence initial={false}>
            {images.map((image) => (
              <motion.li
                key={image.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-warm">
                  <img
                    src={image.url}
                    alt={fillTemplate(text.previewAlt, { name: image.file.name })}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemove(image.id)}
                    aria-label={`${text.remove}: ${image.file.name}`}
                    className="absolute end-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-dark-950/70 text-white backdrop-blur transition-colors hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-dark-800" dir="auto" title={image.file.name}>
                      {image.file.name}
                    </p>
                    <p className="text-[11px] text-dark-500" dir="ltr">
                      {mb(image.file.size)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      replaceTarget.current = image.id;
                      replaceRef.current?.click();
                    }}
                    aria-label={`${text.replace}: ${image.file.name}`}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    {text.replace}
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
