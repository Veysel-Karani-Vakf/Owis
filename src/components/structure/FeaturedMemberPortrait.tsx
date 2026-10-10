import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { AdministrativeMember } from '@/data/about';

type FeaturedMemberPortraitProps = {
  member: AdministrativeMember;
};

export function getMemberInitials(name: string): string {
  const cleaned = name
    .trim()
    .replace(/^(أ\.|أ\/|د\.|د\/|م\.|م\/|الشيخ\/|الشيخ\s+|Dr\.\s*|Eng\.\s*|Prof\.\s*|Şeyh\s+)/i, '')
    .trim();

  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'OK';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export default function FeaturedMemberPortrait({ member }: FeaturedMemberPortraitProps) {
  const shouldReduceMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [member.id, member.image]);

  const hasValidImage = Boolean(member.image && member.image.trim() !== '' && !imageFailed);
  const objectPosition = member.imagePosition || 'center 18%';
  const initials = getMemberInitials(member.name);

  return (
    <div className="relative flex w-full items-end justify-center select-none">
      {/* Ambient studio halo behind the portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 bottom-0 top-4 -z-10 mx-auto max-w-[440px] rounded-full bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.95)_0%,rgba(218,8,18,0.06)_48%,transparent_74%)] blur-2xl"
      />

      {/* Subtle architectural concentric ring watermark behind the portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-300/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[210px] w-[210px] sm:h-[260px] sm:w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-500/10"
      />

      {/* Portrait Frame sized for the compact horizontal card */}
      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, scale: 0.97, y: 12 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0.01 }
            : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
        className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[320px] h-[250px] sm:h-[290px] lg:h-[315px] overflow-hidden rounded-t-[2.25rem] [mask-image:linear-gradient(to_bottom,black_78%,rgba(0,0,0,0.65)_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_78%,rgba(0,0,0,0.65)_92%,transparent_100%)]"
      >
        {hasValidImage ? (
          <div className="relative h-full w-full bg-gradient-to-b from-white/60 via-slate-100/40 to-transparent">
            <img
              src={member.image}
              alt={member.name}
              loading="eager"
              style={{ objectPosition }}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-out"
            />
            {/* Delicate side & top studio vignette to blend rectangular photo edges softly */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-t-[2.5rem] ring-1 ring-inset ring-slate-900/5 bg-[linear-gradient(to_bottom,rgba(244,246,248,0.08)_0%,transparent_20%,transparent_72%,rgba(235,239,242,0.55)_100%)]"
            />
          </div>
        ) : (
          /* Elegant institutional studio portrait placeholder when member image is missing */
          <div
            role="img"
            aria-label={member.name}
            className="relative flex h-full w-full flex-col items-center justify-end overflow-hidden rounded-t-[2.5rem] bg-gradient-to-b from-white/95 via-[#edf1f4] to-[#dfe5ea] ring-1 ring-inset ring-slate-300/70"
          >
            {/* Subtle warm brand glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-10 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(218,8,18,0.09)_0%,transparent_70%)]"
            />

            {/* Architectural Executive Portrait Silhouette SVG */}
            <svg
              viewBox="0 0 320 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="h-[88%] w-auto max-w-full text-slate-300/90 drop-shadow-sm"
            >
              {/* Head & Shoulders Executive Silhouette */}
              <circle cx="160" cy="118" r="54" fill="url(#execHeadGrad)" />
              <path
                d="M44 370C44 278 92 224 160 224C228 224 276 278 276 370H44Z"
                fill="url(#execSuitGrad)"
              />
              {/* Subtle Lapel / Tie Accent in Waqf Brand Red */}
              <path
                d="M148 225L160 288L172 225H148Z"
                fill="rgba(218, 8, 18, 0.22)"
              />
              <defs>
                <linearGradient id="execHeadGrad" x1="160" y1="64" x2="160" y2="172" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#CBD5E1" />
                  <stop offset="1" stopColor="#94A3B8" />
                </linearGradient>
                <linearGradient id="execSuitGrad" x1="160" y1="224" x2="160" y2="370" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#94A3B8" />
                  <stop offset="1" stopColor="#64748B" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Monogram Crest */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 flex flex-col items-center">
              <div className="flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-[0_12px_32px_rgba(15,23,42,0.10)] ring-2 ring-primary-600/25">
                <span className="font-brand text-2xl sm:text-3xl font-bold tracking-wider text-primary-700">
                  {initials}
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
