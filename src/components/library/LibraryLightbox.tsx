import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect } from 'react';
import type { LibraryGalleryImage, LibraryLabels } from '@/data/library';

type LibraryLightboxProps = {
  images: LibraryGalleryImage[];
  activeIndex: number | null;
  labels: LibraryLabels;
  isRtl: boolean;
  onClose: () => void;
  onMove: (nextIndex: number) => void;
};

export default function LibraryLightbox({
  images,
  activeIndex,
  labels,
  isRtl,
  onClose,
  onMove,
}: LibraryLightboxProps) {
  const image = activeIndex === null ? undefined : images[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onMove(isRtl ? activeIndex + 1 : activeIndex - 1);
      if (event.key === 'ArrowRight') onMove(isRtl ? activeIndex - 1 : activeIndex + 1);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, isRtl, onClose, onMove]);

  return (
    <AnimatePresence>
      {image && activeIndex !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={image.title || `${labels.imageCounter} ${activeIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[260] flex items-center justify-center bg-black/90 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.closeImage}
            className="absolute end-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-dark-950 shadow-lg transition-colors hover:bg-primary-50"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => onMove(activeIndex - 1)}
            aria-label={labels.previousImage}
            className="absolute start-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-950 shadow-lg transition-colors hover:bg-primary-50 sm:flex"
          >
            {isRtl ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
          </button>

          <motion.figure
            key={image.id}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.18 }}
            className="flex max-h-[88vh] w-full max-w-6xl flex-col items-center justify-center"
          >
            <img
              src={image.image}
              alt={image.imageAlt}
              className="max-h-[78vh] w-auto max-w-full rounded-[18px] object-contain shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            />
            <figcaption className="mt-4 flex w-full max-w-3xl flex-col items-center gap-3 text-center text-white sm:flex-row sm:justify-between sm:text-start">
              {image.title && <span className="text-base font-bold leading-snug">{image.title}</span>}
              <span className={`text-sm font-semibold ${image.title ? 'shrink-0 text-white/70' : ''}`}>
                {labels.imageCounter} {activeIndex + 1} / {images.length}
              </span>
            </figcaption>
          </motion.figure>

          <button
            type="button"
            onClick={() => onMove(activeIndex + 1)}
            aria-label={labels.nextImage}
            className="absolute end-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-dark-950 shadow-lg transition-colors hover:bg-primary-50 sm:flex"
          >
            {isRtl ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
