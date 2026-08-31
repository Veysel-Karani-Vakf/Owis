import { motion, useReducedMotion } from 'framer-motion';
import Breadcrumbs from './Breadcrumbs';
import type { BreadcrumbItem } from '@/data/about';

type PageHeroProps = {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  breadcrumbs: BreadcrumbItem[];
  /** Page-specific anchor so the dashboard preview can spotlight the hero. */
  id?: string;
};

const heroEase = [0.22, 1, 0.36, 1] as const;

export default function PageHero({ title, description, image, imageAlt, breadcrumbs, id }: PageHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0.01 : 0.7;

  return (
    <section id={id} className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-dark-950 pt-28 md:min-h-[460px] md:pt-32">
      <motion.img
        src={image}
        alt={imageAlt ?? ''}
        aria-hidden={imageAlt ? undefined : true}
        initial={{ scale: shouldReduceMotion ? 1 : 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 1.1, ease: heroEase }}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-950/85 via-dark-950/70 to-dark-950/55" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_42%,rgba(218,8,18,0.28),transparent_34%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, ease: heroEase }}
          className="mb-5"
        >
          <Breadcrumbs items={breadcrumbs} light />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: shouldReduceMotion ? 0 : 0.12, ease: heroEase }}
          className="max-w-full text-start md:max-w-3xl"
        >
          <h1 className="max-w-full text-balance break-words text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-full break-words text-base leading-relaxed text-white/75 md:max-w-2xl md:text-lg">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
