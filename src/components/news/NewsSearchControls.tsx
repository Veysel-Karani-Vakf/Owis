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
  return (
    <div className="mb-8 grid gap-3 rounded-[20px] border border-primary-100 bg-white p-3 shadow-[0_18px_48px_rgba(40,12,18,0.07)] md:grid-cols-[1fr_auto_auto_auto] md:items-center md:p-4">
      <label className="relative block">
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

      <label className="block">
        <span className="sr-only">{labels.allYears}</span>
        <select
          value={year}
          onChange={(event) => onYearChange(event.target.value)}
          className="min-h-12 w-full rounded-2xl border border-dark-100 bg-[#faf8f8] px-4 py-3 text-sm font-bold text-dark-800 outline-none transition-colors focus:border-primary-300 focus:bg-white md:min-w-[150px]"
        >
          <option value="all">{labels.allYears}</option>
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="flex min-h-12 items-center justify-center rounded-2xl bg-primary-50 px-4 text-sm font-bold text-primary-700">
        {resultCount} {labels.results}
      </div>

      {(query || year !== 'all') && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          {labels.clearSearch}
        </button>
      )}
    </div>
  );
}
