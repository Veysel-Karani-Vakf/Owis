import { ExternalLink, Play, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import {
  getYouTubeVideoId,
  getYouTubeWatchUrl,
  isTrustedYouTubeOrigin,
  parseYouTubeMessage,
  youtubeHosts,
} from '@/utils/youtube';

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  posterImage: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  autoStart?: boolean;
  startOnVisible?: boolean;
  className?: string;
  iframeClassName?: string;
  loading?: 'eager' | 'lazy';
  'data-video-trigger'?: string;
};

const fallbackCopy = {
  ar: {
    unavailable: 'تعذر تشغيل الفيديو داخل الصفحة. قد يكون YouTube محجوبًا على هذا الاتصال.',
    retry: 'إعادة المحاولة',
    open: 'فتح على YouTube',
  },
  tr: {
    unavailable: 'Video sayfada oynatılamadı. Bu bağlantıda YouTube engellenmiş olabilir.',
    retry: 'Tekrar dene',
    open: 'YouTube’da aç',
  },
  en: {
    unavailable: 'The video could not play inside the page. YouTube may be blocked on this connection.',
    retry: 'Try again',
    open: 'Open on YouTube',
  },
} as const;

function getIsBrowserOnline() {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

export default function YouTubeEmbed({
  videoId,
  title,
  posterImage,
  autoplay = true,
  muted = false,
  controls = true,
  loop = false,
  autoStart = false,
  startOnVisible = false,
  className = '',
  iframeClassName = '',
  loading = 'lazy',
  'data-video-trigger': dataVideoTrigger,
}: YouTubeEmbedProps) {
  const { locale, t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const retryNonceRef = useRef(0);
  const [hasStarted, setHasStarted] = useState(autoStart);
  const [isBrowserOnline, setIsBrowserOnline] = useState(getIsBrowserOnline);
  const [hasIframeLoaded, setHasIframeLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hostIndex, setHostIndex] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const resolvedVideoId = useMemo(() => getYouTubeVideoId(videoId), [videoId]);
  const activeHost = youtubeHosts[hostIndex];
  const labels = fallbackCopy[locale];
  const watchUrl = getYouTubeWatchUrl(resolvedVideoId || videoId);
  const canAttemptEmbed = hasStarted && isBrowserOnline && Boolean(resolvedVideoId);
  const canShowPlayer = isBrowserOnline && (isReady || hasIframeLoaded);
  const hasPlaybackFailed = hasStarted && (!isBrowserOnline || hasTimedOut || !resolvedVideoId);

  const embedSrc = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      playsinline: '1',
      rel: '0',
      modestbranding: '1',
      controls: controls ? '1' : '0',
      enablejsapi: '1',
    });

    if (loop) {
      params.set('loop', '1');
      params.set('playlist', resolvedVideoId);
    }

    if (typeof window !== 'undefined') {
      params.set('origin', window.location.origin);
    }

    return `${activeHost}/embed/${resolvedVideoId}?${params.toString()}`;
  }, [activeHost, autoplay, controls, loop, muted, resolvedVideoId]);

  const postToPlayer = useCallback((payload: Record<string, unknown>) => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (!iframeWindow) return;

    const message = JSON.stringify(payload);
    youtubeHosts.forEach((host) => iframeWindow.postMessage(message, host));
  }, []);

  const sendCommand = useCallback(
    (command: 'mute' | 'playVideo' | 'pauseVideo') => {
      postToPlayer({
        event: 'command',
        func: command,
        args: [],
      });
    },
    [postToPlayer]
  );

  const startVideo = useCallback(() => {
    setIsBrowserOnline(getIsBrowserOnline());
    setHasStarted(true);
    setHasIframeLoaded(false);
    setIsReady(false);
    setHasTimedOut(false);
  }, []);

  const retryVideo = useCallback(() => {
    setIsBrowserOnline(getIsBrowserOnline());
    retryNonceRef.current += 1;
    setHostIndex(0);
    setHasIframeLoaded(false);
    setIsReady(false);
    setHasTimedOut(false);
    setHasStarted(false);
    window.requestAnimationFrame(() => setHasStarted(true));
  }, []);

  useEffect(() => {
    setIsBrowserOnline(getIsBrowserOnline());
    setHasStarted(autoStart);
    setHasIframeLoaded(false);
    setIsReady(false);
    setHostIndex(0);
    setHasTimedOut(false);
  }, [autoStart, resolvedVideoId]);

  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      setHasTimedOut(false);

      if (!hasStarted) return;
      retryNonceRef.current += 1;
      setHostIndex(0);
      setHasIframeLoaded(false);
      setIsReady(false);
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
      setHasIframeLoaded(false);
      setIsReady(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!startOnVisible || hasStarted) return undefined;

    const element = containerRef.current;
    if (!element) return undefined;

    if (!('IntersectionObserver' in window)) {
      setHasStarted(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasStarted(true);
        observer.disconnect();
      },
      {
        threshold: 0.14,
        rootMargin: '160px 0px -8% 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasStarted, startOnVisible]);

  useEffect(() => {
    if (!canAttemptEmbed || canShowPlayer || hasTimedOut) return undefined;

    const timeout = window.setTimeout(() => {
      if (hostIndex === 0) {
        setHasIframeLoaded(false);
        setIsReady(false);
        setHostIndex(1);
        return;
      }

      setHasTimedOut(true);
    }, hostIndex === 0 ? 9000 : 16000);

    return () => window.clearTimeout(timeout);
  }, [canAttemptEmbed, canShowPlayer, hasTimedOut, hostIndex]);

  useEffect(() => {
    if (!canAttemptEmbed) return undefined;

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (!isTrustedYouTubeOrigin(event.origin)) return;

      const data = parseYouTubeMessage(event.data);
      const eventName = typeof data?.event === 'string' ? data.event : '';

      if (eventName === 'onReady' || eventName === 'initialDelivery' || eventName === 'infoDelivery') {
        setHasIframeLoaded(true);
        setIsReady(true);
        setHasTimedOut(false);
      } else if (eventName === 'onError') {
        setHasTimedOut(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [canAttemptEmbed]);

  useEffect(() => {
    if (!isReady) return;
    if (muted) sendCommand('mute');
    if (autoplay) sendCommand('playVideo');
  }, [autoplay, isReady, muted, sendCommand]);

  const handleIframeLoad = () => {
    if (!getIsBrowserOnline()) {
      setIsBrowserOnline(false);
      setHasIframeLoaded(false);
      setIsReady(false);
      return;
    }

    setIsBrowserOnline(true);
    setHasIframeLoaded(true);
    setHasTimedOut(false);
    postToPlayer({ event: 'listening' });
  };

  return (
    <div
      ref={containerRef}
      data-video-trigger={dataVideoTrigger}
      className={`relative aspect-video w-full overflow-hidden rounded-[18px] bg-dark-950 text-start shadow-[0_22px_70px_rgba(35,15,20,0.18)] ${className}`}
    >
      <img
        src={posterImage}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          canShowPlayer ? 'opacity-0' : 'opacity-80'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-dark-950/28 to-dark-950/10" />

      {canAttemptEmbed && !hasTimedOut && (
        <iframe
          key={`${resolvedVideoId}-${hostIndex}-${retryNonceRef.current}`}
          ref={iframeRef}
          src={embedSrc}
          title={title}
          loading={loading}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={handleIframeLoad}
          className={`absolute inset-0 z-10 block h-full w-full border-0 transition-opacity duration-300 ${
            canShowPlayer ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          } ${iframeClassName}`}
          tabIndex={canShowPlayer ? 0 : -1}
        />
      )}

      {!hasStarted && (
        <button
          type="button"
          onClick={startVideo}
          aria-label={`${t('accessibility.playVideo')}: ${title}`}
          className="group absolute inset-0 z-20 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary-700 shadow-xl transition-transform group-hover:scale-105">
            <Play className="h-7 w-7 fill-current" aria-hidden="true" />
          </span>
        </button>
      )}

      {canAttemptEmbed && !canShowPlayer && !hasTimedOut && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/35 text-white"
        >
          <span
            aria-hidden="true"
            className="h-11 w-11 animate-spin rounded-full border-4 border-white/30 border-t-white motion-reduce:animate-none"
          />
          <span className="text-sm font-semibold text-white/90">{t('accessibility.loadingVideo')}</span>
        </div>
      )}

      {hasPlaybackFailed && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black/70 p-5 text-center text-white">
          <p className="max-w-sm text-sm font-semibold leading-relaxed text-white/90">{labels.unavailable}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={retryVideo}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {labels.retry}
            </button>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/35 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              {labels.open}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
