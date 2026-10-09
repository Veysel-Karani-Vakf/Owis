import { useEffect, useState } from 'react';

type PioneerPortraitProps = {
  name: string;
  image: string;
  hasPortrait?: boolean;
  imagePosition?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

function initialsFor(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');
}

export default function PioneerPortrait({
  name,
  image,
  hasPortrait = true,
  imagePosition = 'center 20%',
  className = '',
  loading = 'lazy',
}: PioneerPortraitProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  if (!hasPortrait || !image || imageFailed) {
    return (
      <div
        role="img"
        aria-label={name}
        className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-gold-700 ${className}`}
      >
        <div className="absolute -end-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
        <div className="absolute -bottom-20 -start-12 h-56 w-56 rounded-full border border-white/10" />
        <span className="relative font-brand text-5xl font-bold text-white/95 drop-shadow-lg sm:text-6xl">
          {initialsFor(name)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={name}
      loading={loading}
      style={{ objectPosition: imagePosition }}
      className={className}
      onError={() => setImageFailed(true)}
    />
  );
}
