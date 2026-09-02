import { Search, X } from 'lucide-react';
import type { NewsLabels } from '@/data/news';

type NewsSearchControlsProps = {
  labels: NewsLabels;
  query: string;
  year: string;
  years: number[];
  resultCount: number;
  onQueryChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onClear: () => void;
};

export default function NewsSearchControls({
  labels,
  query,
  year,
  years,
  resultCount,
  onQueryChange,
  onYearChange,
  onClear,
}: NewsSearchControlsProps) {
  const hasActiveFilter = query.trim() !== '' || year !== 'all';
  const yearOptions = [
    { value: 'all', label: labels.allYears },
    ...years.map((option) => ({ value: String(option), label: String(option) })),
  ];

  return (
    <div className="mb-6 rounded-[20px] border border-primary-100 bg-white p-3 shadow-[0_18px_48px_rgba(40,12,18,0.07)] md:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">{labels.search}</span>
          <Search
            className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={labels.searchPlaceholder}
            className="min-h-12 w-full rounded-2xl border border-dark-100 bg-[#faf8f8] px-11 py-3 text-sm font-medium text-dark-800 outline-none transition-colors placeholder:text-dark-400 focus:border-primary-300 focus:bg-white"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={labels.allYears}>
          {yearOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onYearChange(option.value)}
              aria-pressed={option.value === year}
              className={`btn-border-run inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                option.value === year
                  ? 'bg-primary-600 text-white'
                  : 'btn-border-run--sheen-tint border border-primary-100 bg-white text-primary-700 hover:bg-primary-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={onClear}
            className="btn-border-run btn-border-run--sheen-tint inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-4 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            {labels.clearSearch}
          </button>
        )}
      </div>

      {hasActiveFilter && (
        <p className="mt-3 text-start text-sm font-bold text-primary-700">
          {resultCount} {labels.results}
        </p>
      )}
    </div>
  );
}
