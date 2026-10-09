import { useEffect, useState } from 'react';

type MemberPortraitProps = {
  name: string;
  image?: string;
  imagePosition?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

function initialsFor(name: string): string {
  return name
    .trim()
    .replace(/^أ\/\s*|^د\/\s*|^م\/\s*|^الشيخ\/\s*/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');
}

export default function MemberPortrait({
  name,
  image,
  imagePosition = 'center 20%',
  className = '',
  loading = 'lazy',
}: MemberPortraitProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  if (!image || imageFailed) {
    return (
      <div
        role="img"
        aria-label={name}
        className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 ${className}`}
      >
        <div className="absolute -end-6 -top-6 h-24 w-24 rounded-full border border-white/10" />
        <div className="absolute -bottom-8 -start-6 h-28 w-28 rounded-full border border-white/10" />
        <span className="relative font-bold text-xl sm:text-2xl text-white/95 drop-shadow-md">
          {initialsFor(name) || 'OK'}
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
      className={`h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 ${className}`}
      onError={() => setImageFailed(true)}
    />
  );
}

