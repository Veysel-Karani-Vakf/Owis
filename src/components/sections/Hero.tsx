import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronDown, Play } from 'lucide-react';
import { useState } from 'react';
import VideoModal from '@/components/ui/VideoModal';
import { useI18n } from '@/i18n/useI18n';

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);
  const { content, t, isRtl } = useI18n();
  const heroContent = content.hero;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const heroEase = [0.22, 1, 0.36, 1] as const;

  const scrollToAbout = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToParticipate = () => {
    const el = document.querySelector('#participate');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.14, delayChildren: 2 },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: heroEase },
    },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: heroEase },
    },
  };

  const actionsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: heroEase },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] overflow-hidden bg-dark-950"
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 1.6, ease: heroEase }}
        className="yt-bg-container hidden md:block"
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${heroContent.videoId}?autoplay=1&mute=1&loop=1&playlist=${heroContent.videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1`}
          title={t('accessibility.videoBackgroundTitle')}
          allow="autoplay; encrypted-media"
          loading="eager"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 1.4, ease: heroEase }}
        className="absolute inset-0 md:hidden"
      >
        <img
          src={heroContent.posterImage}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-l from-dark-950/70 via-dark-950/20 to-dark-950/45" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.12) 20%, rgba(0, 0, 0, 0.36) 62%, rgba(0, 0, 0, 0.76) 100%)',
        }}
      />
      <div
        className={`absolute inset-y-0 w-3/5 ${
          isRtl
            ? 'right-0 bg-gradient-to-l from-primary-950/30 via-primary-950/10 to-transparent'
            : 'left-0 bg-gradient-to-r from-primary-950/30 via-primary-950/10 to-transparent'
        }`}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-x-0 bottom-[clamp(36px,6svh,55px)] z-10 px-5 pt-28 sm:px-8 md:bottom-[clamp(70px,9vh,100px)] lg:px-12"
      >
        <div className="mx-auto flex max-w-7xl items-end justify-start">
          <div className="w-full max-w-xl text-start md:max-w-2xl">
            <motion.h1
              variants={titleVariants}
              className="font-brand text-3xl font-black leading-[1.18] text-white text-balance sm:text-4xl md:text-5xl lg:text-[3.5rem]"
            >
              {heroContent.title}
            </motion.h1>

            <motion.p
              variants={paragraphVariants}
              className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-white/80 sm:mt-4 sm:text-base md:text-lg"
            >
              {heroContent.description}
            </motion.p>

            <motion.div
              variants={actionsVariants}
              className="mt-5 flex flex-col items-start justify-start gap-3 sm:mt-7 sm:flex-row sm:items-center"
            >
              <button
                onClick={scrollToAbout}
                className="group flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary-700 shadow-xl shadow-black/20 transition-all duration-300 hover:bg-gold-50 hover:shadow-2xl"
              >
                {heroContent.primaryButton}
                <ArrowIcon className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </button>

              <button
                onClick={scrollToParticipate}
                className="group flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10"
              >
                {heroContent.secondaryButton}
                <ArrowIcon className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={() => setVideoOpen(true)}
        aria-label={t('accessibility.playVideo')}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.35, duration: 0.7, ease: heroEase }}
        className="group absolute bottom-8 left-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/60 hover:bg-primary-500 md:bottom-10 md:left-8 md:h-16 md:w-16"
      >
        <span className="absolute h-full w-full animate-ping rounded-full border border-white/20" />
        <Play className="relative h-5 w-5 transition-transform group-hover:scale-110 md:h-6 md:w-6" fill="currentColor" />
      </motion.button>

      <motion.button
        onClick={scrollToAbout}
        aria-label={t('accessibility.scrollDown')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.5 }}
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
        onClose={() => setVideoOpen(false)}
        videoId={heroContent.videoId}
      />
    </section>
  );
}
