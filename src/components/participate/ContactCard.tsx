import { ExternalLink, Facebook, Globe, Instagram, MessageCircle, Share2, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SVGProps } from 'react';
import type { ParticipateContactLink, ParticipateLabels } from '@/data/participate';
import { useRevealMotion } from '@/hooks/useResponsiveMotion';

type ContactCardProps = {
  link: ParticipateContactLink;
  labels: ParticipateLabels;
  index: number;
};

// Brand glyphs lucide does not ship.
function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.472-.148-.67.15-.198.297-.768.966-.941 1.164-.174.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231ZM17.083 19.77h1.833L7.084 4.126H5.117Z" />
    </svg>
  );
}

type BrandStyle = {
  Icon: typeof Globe;
  /** Icon chip: solid brand color, white glyph. */
  chip: string;
  /** Card surface: brand-tinted border, wash, and hover border. */
  card: string;
  /** Hover color of the small external-link arrow. */
  arrow: string;
};

const fallbackStyle: Omit<BrandStyle, 'Icon'> = {
  chip: 'bg-primary-50 text-primary-700',
  card: 'border-primary-100 bg-white hover:border-primary-200',
  arrow: 'group-hover:text-primary-600',
};

// Match on the address, not the stored `kind`: admin rows can carry any kind,
// but the destination always says which platform the card opens.
function brandFor(link: ParticipateContactLink): BrandStyle {
  const href = (link.href ?? '').toLowerCase();
  if (href.includes('wa.me') || href.includes('whatsapp.com')) {
    return {
      Icon: WhatsappIcon,
      chip: 'bg-[#25d366] text-white',
      card: 'border-[#25d366]/25 bg-gradient-to-br from-[#25d366]/[0.07] via-white to-white hover:border-[#25d366]/50',
      arrow: 'group-hover:text-[#1faa53]',
    };
  }
  if (href.includes('facebook.com')) {
    return {
      Icon: Facebook,
      chip: 'bg-[#1877f2] text-white',
      card: 'border-[#1877f2]/25 bg-gradient-to-br from-[#1877f2]/[0.07] via-white to-white hover:border-[#1877f2]/50',
      arrow: 'group-hover:text-[#1877f2]',
    };
  }
  if (href.includes('x.com') || href.includes('twitter.com')) {
    return {
      Icon: XIcon,
      chip: 'bg-dark-950 text-white',
      card: 'border-dark-950/20 bg-gradient-to-br from-dark-950/[0.06] via-white to-white hover:border-dark-950/40',
      arrow: 'group-hover:text-dark-950',
    };
  }
  if (href.includes('instagram.com')) {
    return {
      Icon: Instagram,
      chip: 'bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white',
      card: 'border-[#dd2a7b]/25 bg-gradient-to-br from-[#f58529]/[0.08] via-white to-[#8134af]/[0.06] hover:border-[#dd2a7b]/50',
      arrow: 'group-hover:text-[#dd2a7b]',
    };
  }
  if (href.includes('youtube.com') || href.includes('youtu.be')) {
    return {
      Icon: Youtube,
      chip: 'bg-[#ff0000] text-white',
      card: 'border-[#ff0000]/20 bg-gradient-to-br from-[#ff0000]/[0.06] via-white to-white hover:border-[#ff0000]/45',
      arrow: 'group-hover:text-[#ff0000]',
    };
  }
  if (link.kind === 'whatsapp') return { Icon: MessageCircle, ...fallbackStyle };
  if (link.kind === 'social') return { Icon: Share2, ...fallbackStyle };
  return { Icon: Globe, ...fallbackStyle };
}

export default function ContactCard({ link, labels, index }: ContactCardProps) {
  const revealMotion = useRevealMotion({
    y: 18,
    duration: 0.5,
    delay: index * 0.05,
    amount: 0.18,
    mobileY: 12,
    mobileDuration: 0.42,
  });
  const { Icon, chip, card, arrow } = brandFor(link);

  return (
    <motion.article
      {...revealMotion}
      className="group h-full"
    >
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${labels.openLink}: ${link.label}`}
        className={`flex h-full flex-col rounded-[22px] border p-5 text-start shadow-[0_16px_42px_rgba(40,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(40,12,18,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 motion-reduce:hover:translate-y-0 ${card}`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${chip}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <ExternalLink className={`h-4 w-4 text-dark-300 transition-colors ${arrow}`} aria-hidden="true" />
        </div>

        <h3 className="text-lg font-bold leading-tight text-dark-950">{link.label}</h3>
        {link.description && <p className="mt-3 text-sm leading-relaxed text-dark-600">{link.description}</p>}
      </a>
    </motion.article>
  );
}
