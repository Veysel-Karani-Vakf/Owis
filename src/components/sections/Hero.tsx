import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TypewriterText from '@/components/ui/TypewriterText';
import VideoModal from '@/components/ui/VideoModal';
import { useFitSingleLine } from '@/hooks/useFitSingleLine';
import { useI18n } from '@/i18n/useI18n';
import { getHeroMediaState, setHeroMediaState, subscribeHeroMedia } from '@/lib/heroMedia';
import { resolveVideo, videoSourceKey, youTubeEmbedUrl } from '@/lib/video';

const YOUTUBE_ORIGIN = 'https://www.youtube-nocookie.com';
// YouTube's player state code for "playing" (IFrame API).
const YT_PLAYING = 1;
// How long the hero waits for the video to actually start before it falls
// back to the poster. Generous: a slow YouTube is still better than the poster.
const VIDEO_START_TIMEOUT_MS = 7000;

type BackgroundVideoProps = {
  /** The video is kept mounted while the modal is open, only paused. */
  paused: boolean;
  /** Called when frames are actually being shown, not merely when the player loaded. */
  onPlaying: () => void;
  title: string;
};

function FileBackground({ src, paused, onPlaying, title }: BackgroundVideoProps & { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (paused) video.pause();
    else video.play().catch(() => {});
  }, [paused]);

  return (
    <video
      ref={videoRef}
      src={src}
      preload="auto"
      title={title}
      className="block"
      autoPlay
      muted
      loop
      playsInline
      onPlaying={onPlaying}
    />
  );
}

/**
 * YouTube background. The player is driven over the IFrame API's postMessage
 * channel (no API script needed): after the "listening" handshake it reports
 * state changes, which is how "playing" is detected, and it accepts
 * pause/play commands while the modal is open.
 */
function YouTubeBackground({ id, paused, onPlaying, title }: BackgroundVideoProps & { id: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const handshakeTimer = useRef<number | null>(null);

  const send = useCallback((message: Record<string, unknown>) => {
    frameRef.current?.contentWindow?.postMessage(JSON.stringify(message), YOUTUBE_ORIGIN);
  }, []);

  const stopHandshake = useCallback(() => {
    if (handshakeTimer.current !== null) {
      window.clearInterval(handshakeTimer.current);
      handshakeTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const frame = frameRef.current;
      if (!frame || event.origin !== YOUTUBE_ORIGIN || event.source !== frame.contentWindow) return;
      let data: unknown = event.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (!data || typeof data !== 'object') return;
      // Any reply means the player heard the handshake.
      stopHandshake();
      const message = data as { event?: string; info?: unknown };
      const playerState =
        message.event === 'onStateChange'
          ? message.info
          : message.event === 'infoDelivery' && message.info && typeof message.info === 'object'
            ? (message.info as { playerState?: unknown }).playerState
            : undefined;
      if (playerState === YT_PLAYING) onPlaying();
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      stopHandshake();
    };
  }, [onPlaying, stopHandshake]);

  // The player stays silent until the page says it is listening; repeat until it answers.
  const handleLoad = () => {
    stopHandshake();
    const listen = () => send({ event: 'listening', id: `hero-${id}`, channel: 'widget' });
    listen();
    handshakeTimer.current = window.setInterval(listen, 500);
    window.setTimeout(stopHandshake, 10000);
  };

  useEffect(() => {
    send({ event: 'command', func: paused ? 'pauseVideo' : 'playVideo', args: [] });
  }, [paused, send]);

  return (
    <iframe
      ref={frameRef}
      src={youTubeEmbedUrl(id, {
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: id,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        disablekb: 1,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin,
      })}
      title={title}
      className="block border-0"
      allow="autoplay; encrypted-media; picture-in-picture"
      loading="eager"
      referrerPolicy="strict-origin-when-cross-origin"
      onLoad={handleLoad}
    />
  );
}

// Everything in the hero reveals once its visual is settled (video playing, or
// the poster when there is no video); the title starts typing shortly after.
const TITLE_TYPING_START_DELAY = 400;
// A deliberate, readable pace that feels like someone typing the headline live.
const TITLE_TYPING_CHAR_DELAY = 140;
// When the title is an image (calligraphy), it is revealed writing-direction-first
// over roughly the time the equivalent text would take to type.
const TITLE_IMAGE_REVEAL_SECONDS = 2.8;
// The title stays on one line: it starts at TITLE_MAX_FONT_PX and shrinks to fit the viewport width.
// Only if it can't fit even at TITLE_MIN_FONT_PX (long Latin titles on narrow phones) it wraps at TITLE_WRAP_FONT_PX.
const TITLE_MAX_FONT_PX = 34;
const TITLE_MIN_FONT_PX = 13;
const TITLE_WRAP_FONT_PX = 15;

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [backgroundVideoPaused, setBackgroundVideoPaused] = useState(false);
  // Holds the title whose typing animation has finished; resets automatically when the title changes.
  const [typedTitle, setTypedTitle] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(min-width: 768px)').matches
      : false,
  );
  const shouldReduceMotion = useReducedMotion();
  const { content, t, isRtl, locale } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const heroContent = content.hero;
  const isLatinScript = locale !== 'ar';
  const titleImage = heroContent.titleImage;
  // The completion marker: the image URL when the title is a calligraphy image, the text otherwise.
  // Keyed on the image (not the text) so a CMS title override arriving late doesn't restart the reveal.
  const titleToken = titleImage ?? heroContent.title;
  const titleTyped = typedTitle === titleToken;
  const heroEase = [0.22, 1, 0.36, 1] as const;
  const {
    ref: titleRef,
    fontSize: titleFontSize,
    singleLine: titleSingleLine,
  } = useFitSingleLine<HTMLHeadingElement>(heroContent.title, {
    maxPx: TITLE_MAX_FONT_PX,
    minPx: TITLE_MIN_FONT_PX,
    fallbackPx: TITLE_WRAP_FONT_PX,
  });

  // The hero's visual: the background video once it plays, else the poster. Its
  // foreground reveals only then, and the splash waits for it on the landing route.
  const mediaState = useSyncExternalStore(subscribeHeroMedia, getHeroMediaState, getHeroMediaState);
  const revealed = mediaState !== 'pending';
  const videoSource = resolveVideo({ videoFile: heroContent.videoFile, videoId: heroContent.videoId });
  const videoKey = videoSourceKey(videoSource);
  const wantsVideo = isDesktop && !shouldReduceMotion && videoSource !== null;

  useLayoutEffect(() => {
    if (!wantsVideo) {
      setHeroMediaState('poster');
      return undefined;
    }
    setHeroMediaState('pending');
    const timer = window.setTimeout(() => {
      if (getHeroMediaState() === 'pending') setHeroMediaState('poster');
    }, VIDEO_START_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [wantsVideo, videoKey]);

  // A video that starts late still takes over from the poster.
  const handleVideoPlaying = useCallback(() => setHeroMediaState('video'), []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const desktopMediaQuery = window.matchMedia('(min-width: 768px)');
    const handleViewportChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

    desktopMediaQuery.addEventListener('change', handleViewportChange);
    return () => desktopMediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  // The reveal follows the writing direction: from the right for RTL scripts, from the left otherwise.
  // Every inset keeps the % unit so the browser can interpolate between the two values.
  const titleImageClipStart = isRtl ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';

  // Mirrors TypewriterText's reduced-motion path: the finished title shows at once and unlocks the button.
  useEffect(() => {
    if (titleImage && shouldReduceMotion && revealed) setTypedTitle(titleImage);
  }, [titleImage, shouldReduceMotion, revealed]);

  const openVideo = useCallback(() => {
    setBackgroundVideoPaused(true);
    setVideoOpen(true);
  }, []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);
  const resumeBackgroundVideo = useCallback(() => setBackgroundVideoPaused(false), []);
  const handleTitleTyped = useCallback(() => setTypedTitle(titleToken), [titleToken]);
  const showCta = revealed && titleTyped;

  const scrollToAbout = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // The button destination is editable: "#anchor" scrolls on the page,
  // "/path" navigates, anything else (full URL) opens as a normal link.
  const openButtonTarget = () => {
    const href = heroContent.secondaryUrl || '#participate';

    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate({ pathname: '/', hash: href });
        return;
      }
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (href.startsWith('/')) {
      navigate(href);
      return;
    }

    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const visualTransition = {
    duration: shouldReduceMotion ? 0.01 : 0.9,
    ease: heroEase,
  };

  // The video shows the moment it plays. YouTube's player puts its title bar
  // and "More videos" tray on screen for ~3.5s at every start (also after the
  // modal resumes it); the iframe is scaled in index.css so those edges fall
  // outside the hero. Its centre pause glyph cannot be cropped and stays for
  // those seconds: an uploaded file has no such chrome at all.
  const videoVisible = mediaState === 'video' && !backgroundVideoPaused;
  const videoAnimate = videoVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 };
  const videoTransition = videoVisible
    ? { duration: shouldReduceMotion ? 0.01 : 0.6, ease: heroEase }
    : { duration: 0.3 };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] overflow-hidden bg-dark-950"
    >
      {/* The poster is the fallback visual: shown only when no video applies or it did not start. */}
      <motion.div
        initial={false}
        animate={mediaState === 'poster' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        transition={visualTransition}
        className="absolute inset-0"
        aria-hidden={mediaState !== 'poster'}
      >
        <img
          src={heroContent.posterImage}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* The video stays invisible until frames are playing, so the player's own loading screen is never seen. */}
      <motion.div
        initial={false}
        animate={videoAnimate}
        transition={videoTransition}
        className="yt-bg-container hidden md:block"
      >
        {wantsVideo && videoSource?.kind === 'file' && (
          <FileBackground
            key={videoKey}
            src={videoSource.src}
            paused={backgroundVideoPaused}
            onPlaying={handleVideoPlaying}
            title={t('accessibility.videoBackgroundTitle')}
          />
        )}
        {wantsVideo && videoSource?.kind === 'youtube' && (
          <YouTubeBackground
            key={videoKey}
            id={videoSource.id}
            paused={backgroundVideoPaused}
            onPlaying={handleVideoPlaying}
            title={t('accessibility.videoBackgroundTitle')}
          />
        )}
      </motion.div>

      {/* Light overlay: keeps the video vivid, only the bottom is darkened for the text. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.1) 45%, rgba(0, 0, 0, 0.42) 78%, rgba(0, 0, 0, 0.66) 100%)',
        }}
      />

      <div className="absolute inset-x-0 bottom-[clamp(40px,7svh,64px)] z-10 px-5 pt-28 sm:px-8 md:bottom-[clamp(64px,9vh,96px)] lg:px-12">
        <div className="mx-auto flex max-w-7xl items-end justify-start">
          <div className="w-full text-start">
            {titleImage ? (
              <h1 className="leading-none">
                <motion.img
                  key={titleImage}
                  src={titleImage}
                  alt={heroContent.title}
                  draggable={false}
                  loading="eager"
                  className="block h-auto select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
                  style={{ width: 'min(100%, 20rem)' }}
                  initial={shouldReduceMotion ? false : { clipPath: titleImageClipStart }}
                  animate={{ clipPath: revealed ? 'inset(0% 0% 0% 0%)' : titleImageClipStart }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : TITLE_TYPING_START_DELAY / 1000,
                    duration: shouldReduceMotion ? 0.01 : TITLE_IMAGE_REVEAL_SECONDS,
                    ease: 'linear',
                  }}
                  onAnimationComplete={() => {
                    if (revealed) handleTitleTyped();
                  }}
                />
              </h1>
            ) : (
              <h1
                ref={titleRef}
                style={{ fontSize: titleFontSize }}
                className={`no-transitions font-brand font-black leading-[1.2] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] ${
                  titleSingleLine ? 'whitespace-nowrap' : 'text-balance'
                } ${isLatinScript ? 'uppercase tracking-[0.02em]' : ''}`}
              >
                {revealed && (
                  <TypewriterText
                    key={heroContent.title}
                    text={heroContent.title}
                    startDelay={TITLE_TYPING_START_DELAY}
                    charDelay={TITLE_TYPING_CHAR_DELAY}
                    respectReducedMotion
                    onComplete={handleTitleTyped}
                  />
                )}
              </h1>
            )}

            <motion.div
              initial={false}
              animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.55, ease: heroEase }}
              className="mt-5 flex items-center justify-start sm:mt-6"
              style={{ pointerEvents: showCta ? 'auto' : 'none' }}
              aria-hidden={!showCta}
            >
              <button
                onClick={openButtonTarget}
                tabIndex={showCta ? 0 : -1}
                className={`btn-border-run btn-border-run--light btn-border-run--sheen-tint inline-flex min-w-[9.5rem] items-center justify-center rounded-md border border-white/75 bg-black/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-[2px] transition-all duration-300 hover:border-white hover:bg-white hover:text-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 ${
                  isLatinScript ? 'uppercase tracking-[0.06em]' : 'text-base'
                }`}
              >
                {heroContent.secondaryButton}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={openVideo}
        aria-label={t('accessibility.playVideo')}
        initial={false}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ delay: shouldReduceMotion || !revealed ? 0 : 0.5, duration: shouldReduceMotion ? 0.01 : 0.5, ease: heroEase }}
        style={{ pointerEvents: revealed ? 'auto' : 'none' }}
        tabIndex={revealed ? 0 : -1}
        className={`btn-border-run btn-border-run--light group absolute bottom-8 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/60 hover:bg-primary-500 md:bottom-10 md:h-16 md:w-16 ${
          isRtl ? 'left-4 md:left-8' : 'right-4 md:right-8'
        }`}
      >
        <span className="absolute h-full w-full animate-ping rounded-full border border-white/20" />
        <Play className="relative h-5 w-5 transition-transform group-hover:scale-110 md:h-6 md:w-6" fill="currentColor" />
      </motion.button>

      <motion.button
        onClick={scrollToAbout}
        aria-label={t('accessibility.scrollDown')}
        initial={false}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ delay: shouldReduceMotion || !revealed ? 0 : 0.8, duration: shouldReduceMotion ? 0.01 : 0.4 }}
        style={{ pointerEvents: revealed ? 'auto' : 'none' }}
        tabIndex={revealed ? 0 : -1}
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-white md:flex"
      >
        <span className="text-xs font-medium">{t('common.discoverMore')}</span>
        <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-white/30 p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1 rounded-full bg-white/60"
          />
        </div>
        <ChevronDown className="h-4 w-4" />
      </motion.button>

      <VideoModal
        isOpen={videoOpen}
        onClose={closeVideo}
        onExitComplete={resumeBackgroundVideo}
        videoId={heroContent.videoId}
        videoFile={heroContent.videoFile}
        posterImage={heroContent.posterImage}
      />
    </section>
  );
}
