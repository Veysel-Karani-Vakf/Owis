import { motion } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import TypewriterText from '@/components/ui/TypewriterText';
import VideoModal from '@/components/ui/VideoModal';
import { useFitSingleLine } from '@/hooks/useFitSingleLine';
import { useI18n } from '@/i18n/useI18n';

type HeroBackgroundVideoProps = {
  videoId: string;
  title: string;
};

function HeroBackgroundVideo({ videoId, title }: HeroBackgroundVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1`}
      title={title}
      className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      allow="autoplay; encrypted-media"
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
  const { content, t, isRtl, locale } = useI18n();
  const heroContent = content.hero;
  const isLatinScript = locale !== 'ar';
  const titleTyped = typedTitle === heroContent.title;
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
    if (typeof window.matchMedia !== 'function') return;

    const desktopMediaQuery = window.matchMedia('(min-width: 768px)');
    const handleViewportChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

    desktopMediaQuery.addEventListener('change', handleViewportChange);
    return () => desktopMediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  const openVideo = useCallback(() => {
    setBackgroundVideoPaused(true);
    setVideoOpen(true);
  }, []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);
  const resumeBackgroundVideo = useCallback(() => setBackgroundVideoPaused(false), []);
  const handleTitleTyped = useCallback(() => setTypedTitle(heroContent.title), [heroContent.title]);

  const scrollToAbout = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToParticipate = () => {
    const el = document.querySelector('#participate');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] overflow-hidden bg-dark-950"
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.9, ease: heroEase }}
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
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.9, ease: heroEase }}
        className="yt-bg-container hidden md:block"
      >
        {isDesktop && !backgroundVideoPaused && (
          <HeroBackgroundVideo
            videoId={heroContent.videoId}
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
                respectReducedMotion={false}
                onComplete={handleTitleTyped}
              />
            </h1>

            <motion.div
              initial={false}
              animate={titleTyped ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.55, ease: heroEase }}
              className="mt-5 flex items-center justify-start sm:mt-6"
              style={{ pointerEvents: titleTyped ? 'auto' : 'none' }}
              aria-hidden={!titleTyped}
            >
              <button
                onClick={scrollToParticipate}
                tabIndex={titleTyped ? 0 : -1}
                className={`inline-flex min-w-[9.5rem] items-center justify-center rounded-md border border-white/75 bg-black/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-[2px] transition-all duration-300 hover:border-white hover:bg-white hover:text-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 ${
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
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.5, ease: heroEase }}
        className={`group absolute bottom-8 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/60 hover:bg-primary-500 md:bottom-10 md:h-16 md:w-16 ${
          isRtl ? 'left-4 md:left-8' : 'right-4 md:right-8'
        }`}
      >
        <span className="absolute h-full w-full animate-ping rounded-full border border-white/20" />
        <Play className="relative h-5 w-5 transition-transform group-hover:scale-110 md:h-6 md:w-6" fill="currentColor" />
      </motion.button>

      <motion.button
        onClick={scrollToAbout}
        aria-label={t('accessibility.scrollDown')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.05, duration: 0.4 }}
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
        posterImage={heroContent.posterImage}
      />
    </section>
  );
}
