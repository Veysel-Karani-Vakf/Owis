import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, FileText, Images, Newspaper, Search, Trophy, X } from 'lucide-react';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  getLibrarySearchSuggestions,
  searchLibrary,
  type LibraryLabels,
  type LibrarySearchHit,
} from '@/data/library';
import type { Locale } from '@/i18n/content';

type LibrarySearchProps = {
  locale: Locale;
  labels: LibraryLabels;
  isRtl: boolean;
};

const kindIcons = {
  article: Newspaper,
  story: Trophy,
  document: FileText,
  image: Images,
} as const;

function kindLabel(labels: LibraryLabels, kind: LibrarySearchHit['kind']) {
  switch (kind) {
    case 'article':
      return labels.typeArticle;
    case 'story':
      return labels.typeStory;
    case 'document':
      return labels.typeDocument;
    default:
      return labels.typeImage;
  }
}

/**
 * Unified, instant search across every library collection. Results are
 * grouped by section with a "see all" link that carries the query to the
 * section page through `?q=`.
 */
export default function LibrarySearch({ locale, labels, isRtl }: LibrarySearchProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const groups = useMemo(() => searchLibrary(locale, deferredQuery), [deferredQuery, locale]);
  const totalHits = groups.reduce((sum, group) => sum + group.total, 0);
  const suggestions = getLibrarySearchSuggestions(locale);
  const hasQuery = deferredQuery.trim().length > 0;

  useEffect(() => {
    const trimmed = query.trim();
    const current = searchParams.get('q') ?? '';
    if (trimmed === current) return;
    const next = new URLSearchParams(searchParams);
    if (trimmed) next.set('q', trimmed);
    else next.delete('q');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="relative z-20 mx-auto -mt-10 max-w-4xl px-4 md:-mt-14 md:px-8">
      <div className="rounded-[26px] border border-white/70 bg-white p-3 shadow-[0_28px_70px_rgba(40,12,18,0.16)] md:p-4">
        <label className="relative block">
          <span className="sr-only">{labels.searchAll}</span>
          <Search
            className="pointer-events-none absolute start-5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-600"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setQuery('');
            }}
            placeholder={labels.searchAllPlaceholder}
            autoComplete="off"
            enterKeyHint="search"
            className="min-h-14 w-full rounded-2xl border border-dark-100 bg-[#faf8f8] py-3 pe-14 text-base font-semibold text-dark-900 outline-none transition-colors placeholder:font-medium placeholder:text-dark-400 focus:border-primary-300 focus:bg-white md:min-h-16 md:text-lg [&::-webkit-search-cancel-button]:hidden"
            style={{ paddingInlineStart: '3.25rem' }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label={labels.clearFilters}
              className="absolute end-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-dark-500 transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-2 px-1 text-xs font-semibold text-dark-500">
          {hasQuery ? (
            <span className="rounded-full bg-primary-50 px-3 py-1.5 text-primary-700" aria-live="polite">
              {totalHits} {labels.results}
            </span>
          ) : (
            <>
              <span className="me-1">{labels.suggestions}:</span>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuery(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="rounded-full border border-primary-100 bg-white px-3 py-1.5 font-bold text-primary-700 transition-colors hover:border-primary-300 hover:bg-primary-50"
                >
                  {suggestion}
                </button>
              ))}
            </>
          )}
        </div>

        <AnimatePresence initial={false}>
          {hasQuery && (
            <motion.div
              key="results"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="mt-4 border-t border-primary-100/80 pt-4"
            >
              {groups.length === 0 ? (
                <p className="rounded-2xl bg-[#faf8f8] p-5 text-center text-sm font-semibold text-dark-600">
                  {labels.noResults}
                </p>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {groups.map((group) => (
                    <section key={group.collection} className="text-start">
                      <div className="mb-2 flex items-center justify-between gap-3 px-1">
                        <h3 className="text-sm font-bold text-dark-950">
                          {group.title}
                          <span className="ms-2 rounded-full bg-warm px-2 py-0.5 text-[11px] font-bold text-dark-500">
                            {group.total}
                          </span>
                        </h3>
                        {group.total > group.hits.length && (
                          <Link
                            to={`${group.route}?q=${encodeURIComponent(deferredQuery.trim())}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:underline"
                          >
                            {labels.seeAllIn} {group.title}
                            <ArrowIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                      <ul className="grid gap-1.5">
                        {group.hits.map((hit) => (
                          <li key={hit.id}>
                            <SearchHitRow hit={hit} labels={labels} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-3 text-center text-xs font-medium text-dark-500">{labels.searchHint}</p>
    </div>
  );
}

function SearchHitRow({ hit, labels }: { hit: LibrarySearchHit; labels: LibraryLabels }) {
  const Icon = kindIcons[hit.kind];
  const inner = (
    <>
      <img src={hit.image} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-1 text-sm font-bold text-dark-950">{hit.title}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-dark-500">
          <Icon className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
          {kindLabel(labels, hit.kind)}
          {hit.kind === 'document' && (
            <span className={`rounded-full px-2 py-0.5 ${hit.hasPdf ? 'bg-primary-50 text-primary-700' : 'bg-warm text-dark-500'}`}>
              {hit.hasPdf ? labels.pdfShort : labels.noPdfShort}
            </span>
          )}
        </span>
      </span>
      {hit.external && <ExternalLink className="h-3.5 w-3.5 shrink-0 text-dark-400" aria-hidden="true" />}
    </>
  );
  const className =
    'flex items-center gap-3 rounded-2xl p-2 text-start transition-colors hover:bg-primary-50/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600';

  return hit.external ? (
    <a href={hit.href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link to={hit.href} className={className}>
      {inner}
    </Link>
  );
}
