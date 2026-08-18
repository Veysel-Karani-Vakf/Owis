import { Search } from 'lucide-react';
import type { LibraryLabels } from '@/data/library';

type LibrarySearchControlsProps = {
  labels: LibraryLabels;
  query: string;
  onQueryChange: (value: string) => void;
  year: string;
  onYearChange: (value: string) => void;
  years: number[];
  resultCount: number;
};

export default function LibrarySearchControls({
  labels,
  query,
  onQueryChange,
  year,
  onYearChange,
  years,
  resultCount,
}: LibrarySearchControlsProps) {
  return (
    <div className="mb-8 grid gap-3 rounded-[22px] border border-primary-100 bg-white p-3 shadow-[0_18px_48px_rgba(40,12,18,0.07)] md:grid-cols-[1fr_auto_auto] md:items-center md:p-4">
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
    </div>
  );
}
