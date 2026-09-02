import { Check, Copy, Facebook, MessageCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import XIcon from '@/components/icons/XIcon';
import type { NewsLabels } from '@/data/news';

type NewsShareActionsProps = {
  labels: NewsLabels;
  title: string;
};

export default function NewsShareActions({ labels, title }: NewsShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window === 'undefined' ? '' : window.location.href;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = useMemo(
    () => [
      {
        label: labels.whatsapp,
        href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        icon: MessageCircle,
      },
      {
        label: labels.facebook,
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        icon: Facebook,
      },
      {
        label: labels.x,
        href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`,
        icon: XIcon,
      },
    ],
    [encodedTitle, encodedUrl, labels.facebook, labels.whatsapp, labels.x]
  );

  const copyLink = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="rounded-[20px] border border-primary-100 bg-white p-4 shadow-[0_14px_36px_rgba(35,12,18,0.06)]">
      <p className="mb-3 text-sm font-bold text-dark-950">{labels.share}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="btn-border-run inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? labels.linkCopied : labels.copyLink}
        </button>

        {shareLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-border-run btn-border-run--sheen-tint inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <link.icon className="h-4 w-4" aria-hidden="true" />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
