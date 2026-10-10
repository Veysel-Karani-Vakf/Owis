import { useEffect, useState } from 'react';
import type { AdministrativeMember } from '@/data/about';

type FeaturedMemberPortraitProps = {
  member: AdministrativeMember;
  className?: string;
  loading?: 'eager' | 'lazy';
};

export function getMemberInitials(name: string): string {
  const cleaned = name
    .trim()
    .replace(
      /^(أ\.|أ\/|د\.|د\/|م\.|م\/|الأستاذ الدكتور\s+|الأستاذة\s+|الأستاذ\s+|الدكتورة\s+|الدكتور\s+|المهندس\s+|الشيخ\/|الشيخ\s+|Prof\.\s*Dr\.\s*|Dr\.\s*|Eng\.\s*|Prof\.\s*|Şeyh\s+)/i,
      '',
    )
    .trim();

  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'OK';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export default function FeaturedMemberPortrait({
  member,
  className = '',
  loading = 'lazy',
}: FeaturedMemberPortraitProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [member.id, member.image]);

  const hasValidImage = Boolean(member.image && member.image.trim() !== '' && !imageFailed);
  const objectPosition = member.imagePosition || 'center 18%';
  const initials = getMemberInitials(member.name);

  if (!hasValidImage) {
    return (
      <div
        role="img"
        aria-label={member.name}
        className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-gold-700 pb-10 ${className}`}
      >
        <div className="absolute -end-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
        <div className="absolute -bottom-20 -start-12 h-56 w-56 rounded-full border border-white/10" />
        <span className="relative font-brand text-5xl font-bold text-white/95 drop-shadow-lg sm:text-6xl">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={member.image}
      alt={member.name}
      loading={loading}
      style={{ objectPosition }}
      onError={() => setImageFailed(true)}
      className={className}
    />
  );
}

