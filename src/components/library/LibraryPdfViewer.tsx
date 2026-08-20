import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Download, ExternalLink, X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { LibraryDocumentItem, LibraryLabels } from '@/data/library';

type LibraryPdfViewerProps = {
  item: LibraryDocumentItem | null;
  labels: LibraryLabels;
  onClose: () => void;
};

/**
 * In-site PDF preview. The file is rendered by the browser's PDF viewer in an
 * iframe; a fallback hint and "open in new tab" action are always visible in
 * case the remote host blocks embedding.
 */
export default function LibraryPdfViewer({ item, labels, onClose }: LibraryPdfViewerProps) {
  const shouldReduceMotion = useReducedMotion();
  const open = Boolean(item?.pdfUrl);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, open]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && item?.pdfUrl && (
        <motion.div
          key="pdf-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`${labels.preview}: ${item.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
          className="fixed inset-0 z-[200] flex items-end justify-center bg-dark-950/75 p-0 backdrop-blur-sm md:items-center md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={shouldReduceMotion ? { y: 0 } : { y: 24, scale: 0.985 }}
            animate={{ y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { y: 0 } : { y: 24, scale: 0.985 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-[26px] bg-white shadow-[0_40px_90px_rgba(0,0,0,0.4)] md:h-[88vh] md:rounded-[26px]"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center gap-3 border-b border-primary-100 px-4 py-3 md:px-5">
              <img src={item.image} alt="" className="hidden h-10 w-10 rounded-xl object-cover sm:block" />
              <div className="min-w-0 flex-1 text-start">
                <p className="truncate text-sm font-bold text-dark-950 md:text-base">{item.title}</p>
                <p className="truncate text-[11px] font-medium text-dark-500">{labels.previewUnavailable}</p>
              </div>
              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary-100 px-3.5 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-50"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{labels.openInNewTab}</span>
              </a>
              <a
                href={item.pdfUrl}
                download
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary-600 px-3.5 text-xs font-bold text-white transition-colors hover:bg-primary-700"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{labels.downloadPdf}</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label={labels.closePreview}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-dark-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>
            <div className="relative flex-1 bg-[#2b2b2b]">
              <iframe
                title={item.title}
                src={item.pdfUrl}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
