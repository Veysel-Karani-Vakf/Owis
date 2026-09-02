import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/i18n/useI18n';
import { resolveVideo, youTubeEmbedUrl } from '@/lib/video';

type VideoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onExitComplete: () => void;
  videoId: string;
  /** Public URL of a video uploaded in the dashboard; takes priority over videoId. */
  videoFile?: string;
  posterImage: string;
  title?: string;
};

type VideoPlayerProps = {
  videoId: string;
  videoFile?: string;
  posterImage: string;
  title: string;
  loadingLabel: string;
};

function VideoPlayer({ videoId, videoFile, posterImage, title, loadingLabel }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const source = resolveVideo({ videoFile, videoId });
  const youtubeId = source?.kind === 'youtube' ? source.id : videoId;

  useEffect(() => {
    setIsLoaded(false);
  }, [videoFile, videoId]);

  if (source?.kind === 'file') {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
        <video
          src={source.src}
          poster={posterImage || undefined}
          title={title}
          className="absolute inset-0 h-full w-full"
          controls
          autoPlay
          playsInline
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
      <img
        src={posterImage}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-70'
        }`}
      />

      {!isLoaded && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/25"
        >
          <span
            aria-hidden="true"
            className="h-11 w-11 animate-spin rounded-full border-4 border-white/30 border-t-white motion-reduce:animate-none"
          />
          <span className="text-sm font-semibold text-white/90">{loadingLabel}</span>
        </div>
      )}

      <iframe
        src={youTubeEmbedUrl(youtubeId, {
          autoplay: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        })}
        title={title}
        className={`absolute inset-0 z-10 h-full w-full transition-opacity duration-300 ${
          isLoaded ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="eager"
        tabIndex={isLoaded ? 0 : -1}
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

export default function VideoModal({
  isOpen,
  onClose,
  onExitComplete,
  videoId,
  videoFile,
  posterImage,
  title,
}: VideoModalProps) {
  const { t, isRtl } = useI18n();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const videoTitle = title ?? t('accessibility.videoTitle');

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (dialogRef.current && e.target instanceof Node && !dialogRef.current.contains(e.target)) {
        closeButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.addEventListener('keydown', handleFocusTrap);
    document.addEventListener('focusin', handleFocusIn);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('keydown', handleFocusTrap);
      document.removeEventListener('focusin', handleFocusIn);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-black/80 p-4 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-[min(56rem,calc((100dvh-8rem)*16/9))]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={videoTitle}
            ref={dialogRef}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={t('accessibility.closeVideo')}
              className={`btn-border-run btn-border-run--light absolute -top-12 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white ${
                isRtl ? 'left-0' : 'right-0'
              }`}
            >
              <X className="h-5 w-5" />
            </button>

            <VideoPlayer
              videoId={videoId}
              videoFile={videoFile}
              posterImage={posterImage}
              title={videoTitle}
              loadingLabel={t('accessibility.loadingVideo')}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
