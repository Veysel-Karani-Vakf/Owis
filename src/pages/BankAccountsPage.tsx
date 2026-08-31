import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Copy, Landmark, MapPin, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import {
  formatIban,
  getBankAccountsContent,
  type Bank,
  type BankAccountsPageContent,
  type BankCurrency,
} from '@/data/bankAccounts';
import { contributeContactRoute } from '@/data/donate';
import { useI18n } from '@/i18n/useI18n';

const revealEase = [0.22, 1, 0.36, 1] as const;

const currencySymbols: Record<BankCurrency, string> = { TRY: '₺', USD: '$', EUR: '€', SAR: '﷼' };

/** Copies text and reports success for a short window so buttons can flip to "Copied". */
function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for insecure contexts / older browsers.
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopiedKey(key);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopiedKey(null), 1800);
  }, []);

  return { copiedKey, copy };
}

// Colour helpers ---------------------------------------------------------------

function parseHex(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value) || full.length !== 6) return null;
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/** Mixes a colour toward black (amount 0..1). */
function darken(hex: string, amount: number): string {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  const [r, g, b] = rgb.map((c) => Math.round(c * (1 - amount)));
  return `rgb(${r},${g},${b})`;
}

/** Black or white ink, whichever reads better on the given face colour. */
function contrastText(hex: string): 'light' | 'dark' {
  const rgb = parseHex(hex);
  if (!rgb) return 'light';
  const [r, g, b] = rgb;
  // Perceived luminance (ITU-R BT.601).
  return (r * 299 + g * 587 + b * 114) / 1000 > 160 ? 'dark' : 'light';
}

// Building blocks -------------------------------------------------------------

function CopyButton({
  label,
  copiedLabel,
  copied,
  onClick,
  compact = false,
}: {
  label: string;
  copiedLabel: string;
  copied: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
        compact ? 'min-h-9 px-3 text-xs' : 'min-h-10 px-4 text-sm'
      } ${
        copied
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-primary-100 bg-white text-primary-700 hover:border-primary-300 hover:bg-primary-50'
      }`}
    >
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      {copied ? copiedLabel : label}
    </button>
  );
}

/** Bank wordmark; falls back to the coloured monogram badge if the SVG fails to load. */
function BankLogo({ bank, className }: { bank: Bank; className: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !bank.logo) {
    return (
      <span
        className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg px-2 text-sm font-black text-white"
        style={{ backgroundColor: bank.brandColor }}
        aria-hidden="true"
      >
        {bank.monogram}
      </span>
    );
  }

  return (
    <img
      src={bank.logo}
      alt={bank.name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`w-auto shrink-0 object-contain object-center ${className}`}
    />
  );
}

/** The gold EMV chip printed on every bank card. */
function CardChip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 32" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="chip-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3e6b4" />
          <stop offset="0.5" stopColor="#d3b25a" />
          <stop offset="1" stopColor="#a17a22" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="43" height="31" rx="6" fill="url(#chip-gold)" stroke="#8a6717" />
      <path
        d="M0.5 11h13a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4h-13M43.5 11h-13a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4h13M17.5 0.5v31M26.5 0.5v31"
        fill="none"
        stroke="#8a6717"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Contactless-payment waves, purely decorative. */
function ContactlessIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M6.5 7.5a8 8 0 0 1 0 9M9.5 9a5 5 0 0 1 0 6M12.5 10.5a2 2 0 0 1 0 3M15.5 6a11 11 0 0 1 0 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Wavy "guilloche" texture like the one printed on real cards. Rendered once per card
 * as an inline SVG so it scales with the card and needs no external asset.
 */
function CardPattern({ ink }: { ink: string }) {
  const waves = Array.from({ length: 14 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 340 214"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <g fill="none" stroke={ink} strokeWidth="1" opacity="0.16">
        {waves.map((i) => {
          const y = -30 + i * 22;
          return (
            <path
              key={i}
              d={`M-20 ${y} C 60 ${y - 40}, 110 ${y + 60}, 190 ${y + 10} S 300 ${y - 50}, 380 ${y + 30}`}
            />
          );
        })}
      </g>
      <g fill="none" stroke={ink} strokeWidth="0.8" opacity="0.1">
        {waves.map((i) => {
          const y = -10 + i * 22;
          return (
            <path
              key={`b${i}`}
              d={`M-20 ${y + 6} C 80 ${y + 50}, 140 ${y - 40}, 220 ${y + 20} S 320 ${y + 70}, 380 ${y - 20}`}
            />
          );
        })}
      </g>
    </svg>
  );
}

// The card ---------------------------------------------------------------------

function BankCard({
  bank,
  content,
  index,
  copiedKey,
  copy,
}: {
  bank: Bank;
  content: BankAccountsPageContent;
  index: number;
  copiedKey: string | null;
  copy: (key: string, text: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { labels } = content;
  const ink = contrastText(bank.brandColor);
  const text = ink === 'light' ? 'text-white' : 'text-dark-950';
  const muted = ink === 'light' ? 'text-white/70' : 'text-dark-950/60';
  const chipBg = ink === 'light' ? 'bg-white/15 text-white' : 'bg-black/10 text-dark-950';
  const patternInk = ink === 'light' ? '#ffffff' : '#000000';
  const swiftCopied = copiedKey === `${bank.id}:swift`;

  return (
    <motion.li
      id={bank.id}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.05,
        ease: revealEase,
      }}
      className="min-w-0 list-none scroll-mt-28"
    >
      <h2 className="sr-only">{bank.name}</h2>
      <div
        dir="ltr"
        className={`relative isolate flex h-full w-full flex-col overflow-hidden rounded-[18px] text-left shadow-[0_18px_40px_rgba(20,8,12,0.28)] ring-1 ring-black/10 transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${text}`}
        style={{
          background: `linear-gradient(125deg, ${bank.brandColor} 0%, ${bank.brandColor} 40%, ${darken(bank.brandColor, 0.45)} 100%)`,
        }}
      >
        <CardPattern ink={patternInk} />
        {/* Glossy highlight across the top-left, like a laminated card. */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.05)_35%,transparent_60%)]"
          aria-hidden="true"
        />

        {/* Top strip: white logo tab (diagonal cut) + SWIFT on the right */}
        <div className="relative flex h-14 items-start justify-between">
          <div
            className="flex h-full w-[58%] max-w-[240px] items-center bg-white pl-5 pr-8"
            style={{ clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)' }}
          >
            <BankLogo bank={bank} className="h-8 max-w-full" />
          </div>
          {bank.swift && (
            <button
              type="button"
              onClick={() => copy(`${bank.id}:swift`, bank.swift as string)}
              aria-label={`${labels.copy}: ${labels.swift} ${bank.swift}`}
              className={`mr-4 mt-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${chipBg} ${
                ink === 'light' ? 'hover:bg-white/25' : 'hover:bg-black/20'
              }`}
            >
              <span className={muted}>SWIFT</span>
              <span className="font-mono">{bank.swift}</span>
              {swiftCopied ? (
                <Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {/* Chip + contactless */}
        <div className="relative flex items-center justify-between px-5 pt-3">
          <CardChip className="h-8 w-11 drop-shadow-sm" />
          <ContactlessIcon className={`h-6 w-6 ${muted}`} />
        </div>

        {/* Card numbers = one IBAN per currency */}
        <ul className="relative flex flex-1 flex-col gap-3 px-5 pb-4 pt-4">
          {bank.accounts.map((account) => {
            const key = `${bank.id}:${account.currency}`;
            const copied = copiedKey === key;
            return (
              <li key={key} className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg leading-none ${chipBg}`}
                  aria-hidden="true"
                >
                  <span className="text-[15px] font-black">{currencySymbols[account.currency]}</span>
                  <span className="mt-0.5 text-[8px] font-bold tracking-wider">{account.currency}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold leading-tight">
                    {labels.currencies[account.currency]}
                    <span className={`ms-1.5 text-[9px] font-semibold tracking-wider ${muted}`}>({account.currency})</span>
                  </p>
                  <p className="mt-0.5 text-balance break-words font-mono text-[12px] font-semibold leading-snug tracking-[0.02em] drop-shadow-sm min-[400px]:text-[13px] min-[400px]:tracking-[0.05em] sm:whitespace-nowrap sm:text-[15px]">
                    {formatIban(account.iban)}
                  </p>
                  {account.accountNumber && (
                    <p className={`text-[9px] font-semibold ${muted}`}>
                      {labels.accountNumber}: <span className="font-mono">{account.accountNumber}</span>
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => copy(key, account.iban)}
                  aria-label={`${copied ? labels.copied : labels.copy}: ${labels.iban} ${account.currency}`}
                  aria-live="polite"
                  className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    copied
                      ? 'border-emerald-300 bg-emerald-400 text-dark-950'
                      : ink === 'light'
                        ? 'border-white/30 bg-white/15 text-white hover:bg-white/30'
                        : 'border-black/15 bg-black/10 text-dark-950 hover:bg-black/20'
                  }`}
                >
                  {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Cardholder line + branch / account number */}
        <div className="relative px-5 pb-4">
          <p className={`text-[8px] font-bold uppercase tracking-[0.18em] ${muted}`}>{labels.accountHolder}</p>
          <p className="break-words text-[11px] font-bold uppercase tracking-[0.06em]">{content.accountHolder}</p>
          <div className={`mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px] font-semibold ${muted}`}>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {bank.branch}
            </span>
            {bank.accountNumber && (
              <span>
                {labels.accountNumber}: <span className="font-mono">{bank.accountNumber}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
}

// Page -------------------------------------------------------------------------

export default function BankAccountsPage() {
  const { locale, isRtl } = useI18n();
  const page = getBankAccountsContent(locale);
  const { copiedKey, copy } = useCopy();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.hero.title,
      description: page.hero.description,
    }),
    [page.hero.description, page.hero.title],
  );

  return (
    <>
      <PageSeo
        title={page.seo.title}
        description={page.seo.description}
        canonical={page.seo.canonical}
        image={page.hero.image}
        structuredData={structuredData}
      />
      <main className="bg-white">
        <PageHero
          id="cms-bank-hero"
          title={page.hero.title}
          description={page.hero.description}
          image={page.hero.image}
          imageAlt={page.hero.imageAlt}
          breadcrumbs={page.breadcrumbs}
        />

        <section id="cms-bank-accounts-intro" className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
            <FadeContent blur={false} duration={650} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <div className="mb-4 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-primary-200" />
                <span className="text-sm font-semibold text-primary-700">{page.intro.eyebrow}</span>
                <span className="h-px w-8 bg-primary-200" />
              </div>
              <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{page.intro.title}</h2>
              <div className="mx-auto mt-5 max-w-3xl space-y-3 text-base leading-relaxed text-dark-600 md:text-lg">
                {(page.intro.paragraphs ?? []).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {/* Account holder — the one thing every transfer must match. */}
              <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 rounded-[22px] border border-primary-100 bg-primary-50/60 p-5 sm:flex-row sm:justify-between sm:text-start md:p-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white">
                    <Landmark className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-700">{page.labels.accountHolder}</p>
                    <p dir="ltr" className="mt-1 text-lg font-black leading-tight text-dark-950 md:text-xl">
                      {page.accountHolder}
                    </p>
                  </div>
                </div>
                <CopyButton
                  label={page.labels.copy}
                  copiedLabel={page.labels.copied}
                  copied={copiedKey === 'holder'}
                  onClick={() => copy('holder', page.accountHolder)}
                />
              </div>

              <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-bold text-primary-700">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                {page.labels.notice}
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="bg-[#faf8f8] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            {/* Quick jump to a bank */}
            <nav aria-label={page.hero.title} className="mb-10 flex flex-wrap justify-center gap-2 md:mb-14">
              {(page.banks ?? []).map((bank) => (
                <a
                  key={bank.id}
                  href={`#${bank.id}`}
                  aria-label={bank.name}
                  title={bank.name}
                  className="inline-flex min-h-12 items-center rounded-full border border-primary-100 bg-white px-5 py-2 transition-colors hover:border-primary-300 hover:shadow-sm"
                >
                  <BankLogo bank={bank} className="h-6 max-w-[130px]" />
                </a>
              ))}
            </nav>

            <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
              {(page.banks ?? []).map((bank, index) => (
                <BankCard key={bank.id} bank={bank} content={page} index={index} copiedKey={copiedKey} copy={copy} />
              ))}
            </ul>

            <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-[22px] border border-primary-100 bg-white p-6 text-center shadow-[0_14px_36px_rgba(40,12,18,0.06)] sm:flex-row sm:text-start">
              <p className="text-base font-bold text-dark-950">{page.labels.contactPrompt}</p>
              <Link
                to={contributeContactRoute}
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
              >
                {page.labels.contactCta}
                <ArrowIcon
                  className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
