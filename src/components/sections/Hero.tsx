import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TypewriterText from '@/components/ui/TypewriterText';
import VideoModal from '@/components/ui/VideoModal';
import { useFitSingleLine } from '@/hooks/useFitSingleLine';
import { useI18n } from '@/i18n/useI18n';
import { resolveVideo, youTubeEmbedUrl } from '@/lib/video';

type HeroBackgroundVideoProps = {
  videoId: string;
  videoFile?: string;
  title: string;
};

function HeroBackgroundVideo({ videoId, videoFile, title }: HeroBackgroundVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const source = resolveVideo({ videoFile, videoId });

  useEffect(() => {
    setIsLoaded(false);
  }, [videoFile, videoId]);

  if (!source) return null;

  if (source.kind === 'file') {
    return (
      <video
        src={source.src}
        title={title}
        className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setIsLoaded(true)}
      />
    );
  }

  return (
    <iframe
      src={youTubeEmbedUrl(source.id, {
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: source.id,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        disablekb: 1,
        playsinline: 1,
      })}
      title={title}
      className={`block border-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      allow="autoplay; encrypted-media; picture-in-picture"
      loading="eager"
      referrerPolicy="strict-origin-when-cross-origin"
      onLoad={() => setIsLoaded(true)}
    />
  );
}

// The preloader stays for ~0.95s (700ms + fade); typing starts right after it.
const TITLE_TYPING_START_DELAY = 1000;
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
    if (titleImage && shouldReduceMotion) setTypedTitle(titleImage);
  }, [titleImage, shouldReduceMotion]);

  const openVideo = useCallback(() => {
    setBackgroundVideoPaused(true);
    setVideoOpen(true);
  }, []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);
  const resumeBackgroundVideo = useCallback(() => setBackgroundVideoPaused(false), []);
  const handleTitleTyped = useCallback(() => setTypedTitle(titleToken), [titleToken]);

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

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] overflow-hidden bg-dark-950"
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.15, duration: shouldReduceMotion ? 0.01 : 0.9, ease: heroEase }}
        className="absolute inset-0"
      >
        <img
          src={heroContent.posterImage}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.15, duration: shouldReduceMotion ? 0.01 : 0.9, ease: heroEase }}
        className="yt-bg-container hidden md:block"
      >
        {isDesktop && !shouldReduceMotion && !backgroundVideoPaused && (
          <HeroBackgroundVideo
            videoId={heroContent.videoId}
            videoFile={heroContent.videoFile}
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
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : TITLE_TYPING_START_DELAY / 1000,
                    duration: shouldReduceMotion ? 0.01 : TITLE_IMAGE_REVEAL_SECONDS,
                    ease: 'linear',
                  }}
                  onAnimationComplete={handleTitleTyped}
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
                <TypewriterText
                  key={heroContent.title}
                  text={heroContent.title}
                  startDelay={TITLE_TYPING_START_DELAY}
                  charDelay={TITLE_TYPING_CHAR_DELAY}
                  respectReducedMotion
                  onComplete={handleTitleTyped}
                />
              </h1>
            )}

            <motion.div
              initial={false}
              animate={titleTyped ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.55, ease: heroEase }}
              className="mt-5 flex items-center justify-start sm:mt-6"
              style={{ pointerEvents: titleTyped ? 'auto' : 'none' }}
              aria-hidden={!titleTyped}
            >
              <button
                onClick={openButtonTarget}
                tabIndex={titleTyped ? 0 : -1}
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
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.75, duration: shouldReduceMotion ? 0.01 : 0.5, ease: heroEase }}
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
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 1.05, duration: shouldReduceMotion ? 0.01 : 0.4 }}
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
