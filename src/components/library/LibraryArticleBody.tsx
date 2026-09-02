import { ArrowLeft, ArrowRight, ChevronDown, ExternalLink, HeartHandshake, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LibraryLabels } from '@/data/library';
import { resolveInternalUrl, type ArticleBlock } from './articleContent';

type LibraryArticleBodyProps = {
  blocks: ArticleBlock[];
  labels: LibraryLabels;
  isRtl: boolean;
  /** When the article belongs to a detected series, "see previous parts" notes are redundant. */
  hideNotes?: boolean;
  /** Source language of the text; sets dir/lang so LTR sources read correctly inside an RTL page. */
  lang?: string;
};

export default function LibraryArticleBody({
  blocks,
  labels,
  isRtl,
  hideNotes = false,
  lang,
}: LibraryArticleBodyProps) {
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const dir = lang ? (lang === 'ar' ? 'rtl' : 'ltr') : undefined;

  return (
    <div lang={lang} dir={dir} className="library-article text-start text-lg leading-9 text-dark-700">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={block.id}
                id={block.id}
                className="mb-4 mt-12 scroll-mt-36 text-2xl font-bold leading-snug text-dark-950 first:mt-0 md:text-3xl md:scroll-mt-44"
              >
                {block.text}
              </h2>
            );
          case 'subheading':
            return (
              <h3 key={`${block.type}-${index}`} className="mb-2 mt-8 text-xl font-bold leading-snug text-dark-900">
                {block.text}
              </h3>
            );
          case 'paragraph':
            return (
              <p key={`${block.type}-${index}`} className={`mb-5 ${block.lead ? 'font-bold text-dark-900' : ''}`}>
                {block.text}
              </p>
            );
          case 'list':
            return (
              <ul key={`${block.type}-${index}`} className="mb-6 grid gap-2.5 ps-1">
                {block.items.map((item, itemIndex) => (
                  <li key={`${index}-${itemIndex}`} className="relative ps-6 leading-8">
                    <span
                      className="absolute start-0 top-[0.85rem] h-2.5 w-2.5 rounded-full bg-primary-500 ring-4 ring-primary-50"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case 'cta': {
            const internal = resolveInternalUrl(block.url);
            const label = block.text || (internal ? labels.donateCta : block.url.replace(/^https?:\/\//, ''));
            const className =
              'btn-border-run my-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-primary-600 px-6 py-3 text-base font-bold text-white shadow-[0_14px_34px_rgba(195,7,16,0.28)] transition-all hover:-translate-y-0.5 hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600';
            return internal ? (
              <div key={`${block.type}-${index}`}>
                <Link to={internal} className={className}>
                  <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                  {label}
                  <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <div key={`${block.type}-${index}`}>
                <a href={block.url} target="_blank" rel="noopener noreferrer" className={className}>
                  {label}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            );
          }
          case 'note':
            if (hideNotes) return null;
            return (
              <p
                key={`${block.type}-${index}`}
                className="mb-5 rounded-2xl bg-[#faf8f8] px-5 py-4 text-base text-dark-600"
              >
                {block.text}
              </p>
            );
          case 'author':
            return <AuthorCard key={`${block.type}-${index}`} name={block.name} bio={block.bio} labels={labels} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function AuthorCard({ name, bio, labels }: { name: string; bio: string[]; labels: LibraryLabels }) {
  const [expanded, setExpanded] = useState(false);
  const [first, ...rest] = bio;
  const initial = name
    .replace(/^(أ\.د\.|د\.|أ\.)\s*/, '')
    .trim()
    .charAt(0);

  return (
    <aside className="mt-12 rounded-[24px] border border-primary-100 bg-gradient-to-br from-primary-50/70 via-white to-white p-5 text-base leading-8 md:p-6">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-xl font-bold text-white shadow-[0_10px_24px_rgba(195,7,16,0.28)]">
          {initial || <UserRound className="h-6 w-6" aria-hidden="true" />}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-primary-700">{labels.author}</p>
          <p className="text-lg font-bold leading-tight text-dark-950 md:text-xl">{name}</p>
        </div>
      </div>
      {first && (
        <div className="mt-4 text-dark-700">
          <p>{first}</p>
          {rest.length > 0 && (
            <>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 pt-3">
                    {rest.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:underline"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
                {expanded ? labels.showLess : labels.showMore}
              </button>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
