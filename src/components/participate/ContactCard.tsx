import { ExternalLink, MessageCircle, Share2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ParticipateContactLink, ParticipateLabels } from '@/data/participate';

type ContactCardProps = {
  link: ParticipateContactLink;
  labels: ParticipateLabels;
  index: number;
};

export default function ContactCard({ link, labels, index }: ContactCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = link.kind === 'whatsapp' ? MessageCircle : Share2;

  return (
    <motion.article
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group h-full"
    >
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${labels.openLink}: ${link.label}`}
        className="flex h-full flex-col rounded-[22px] border border-primary-100 bg-white p-5 text-start shadow-[0_16px_42px_rgba(40,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(40,12,18,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 motion-reduce:hover:translate-y-0"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <ExternalLink className="h-4 w-4 text-dark-300 transition-colors group-hover:text-primary-600" aria-hidden="true" />
        </div>

        <h3 className="text-lg font-bold leading-tight text-dark-950">{link.label}</h3>
        {link.description && <p className="mt-3 text-sm leading-relaxed text-dark-600">{link.description}</p>}
      </a>
    </motion.article>
  );
}
