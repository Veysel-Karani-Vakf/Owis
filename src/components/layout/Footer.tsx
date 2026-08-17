import { motion } from 'framer-motion';
import { Mail, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';

export default function Footer() {
  const { ref, inView } = useInView<HTMLElement>();
  const { content, t, isRtl } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const siteConfig = content.siteConfig;
  const footerContent = content.footer;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const socialIcons = [
    { icon: Facebook, url: siteConfig.socialLinks.facebook, label: t('social.facebook') },
    { icon: Twitter, url: siteConfig.socialLinks.twitter, label: t('social.twitter') },
    { icon: Instagram, url: siteConfig.socialLinks.instagram, label: t('social.instagram') },
    { icon: Youtube, url: siteConfig.socialLinks.youtube, label: t('social.youtube') },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleNavClick = (href: string) => {
    if (!href.startsWith('#')) return;

    if (location.pathname !== '/') {
      navigate({ pathname: '/', hash: href });
      return;
    }

    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden bg-dark-950 text-white"
      id="contact"
    >
      <div className="geometric-pattern absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-start lg:col-span-2"
          >
            <img
              src={siteConfig.logo}
              alt={siteConfig.name}
              className="mb-6 h-14 w-auto brightness-0 invert"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className="mb-6 hidden text-2xl font-bold">{siteConfig.name}</div>

            <p className="mb-6 max-w-md text-sm leading-relaxed text-white/60">
              {footerContent.description}
            </p>

            <div className="flex flex-col gap-3 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary-400" />
                <span>{footerContent.contactInfo.address}</span>
              </div>
              {footerContent.contactInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary-400" />
                  <a
                    href={`mailto:${footerContent.contactInfo.email}`}
                    className="transition-colors hover:text-primary-400"
                  >
                    {footerContent.contactInfo.email}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all duration-300 hover:bg-primary-500 hover:text-white"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-start"
          >
            <h3 className="mb-5 text-sm font-bold text-white">{t('common.quickLinks')}</h3>
            <ul className="flex flex-col gap-3">
              {footerContent.quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith('#')) {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }
                    }}
                    className="text-sm text-white/60 transition-colors hover:text-primary-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#"
                  className="text-sm text-gold-400 transition-colors hover:text-gold-300"
                >
                  {footerContent.bankAccountsLink}
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-start"
          >
            <h3 className="mb-2 text-sm font-bold text-white">
              {footerContent.newsletterTitle}
            </h3>
            <p className="mb-4 text-sm text-white/50">
              {footerContent.newsletterDescription}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('common.emailPlaceholder')}
                required
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary-400"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
              >
                {subscribed ? t('common.subscribed') : t('common.subscribe')}
                <ArrowIcon className="h-4 w-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => handleNavClick('#participate')}
              className="mt-4 w-full rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2.5 text-sm font-semibold text-gold-300 transition-all hover:bg-gold-400/20"
            >
              {t('common.donateNow')}
            </button>
          </motion.div>
        </div>

        <div className="my-10 h-px bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-start">
          <div className="flex flex-col gap-1 text-xs text-white/40">
            <p>
              {t('footer.licensePrefix')}: {siteConfig.licenseNumber} -{' '}
              {t('footer.courtDecisionPrefix')}: {siteConfig.courtDecision} -{' '}
              {t('footer.taxNumberPrefix')}: {siteConfig.taxNumber}
            </p>
            <p>{t('common.taxExempt')}</p>
          </div>
          <p className="text-xs text-white/40">
            {t('footer.rightsReserved')} © {siteConfig.name} {new Date().getFullYear()}
            {t('footer.yearSuffix')}
          </p>
        </div>
      </div>
    </footer>
  );
}
