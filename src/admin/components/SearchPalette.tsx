import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeft, FileText, Inbox, Images, LayoutTemplate, Mail, Search, X } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import { adminStrings } from '../i18n';
import { RESOURCES } from '../lib/resources';
import { SITE_PAGES, pageSearchIndex } from '../lib/pageSchema';
import { listRows, pickLocalized } from '../lib/api';

type Hit = {
  id: string;
  kind: 'page' | 'section' | 'field' | 'resource' | 'record' | 'tool';
  title: string;
  subtitle?: string;
  to: string;
  icon: typeof Search;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[ً-ٰٟ]/g, '')
    .replace(/[إأآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

function matches(haystack: string, needle: string): boolean {
  const target = normalize(haystack);
  return needle
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => target.includes(token));
}

/**
 * "Where do I change X?" — one box that finds page sections and fields by
 * their labels, content lists by name, and individual records by title.
 */
export default function SearchPalette({ onClose }: { onClose: () => void }) {
  const s = useAdminStrings();
  const { locale } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [records, setRecords] = useState<Hit[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Record titles load once, only after the editor starts typing.
  useEffect(() => {
    if (records !== null || query.trim().length < 2) return;
    let cancelled = false;
    Promise.all(
      RESOURCES.map((resource) =>
        listRows(resource.table, { sort: resource.defaultSort })
          .then((rows) =>
            rows.map<Hit>((row) => ({
              id: `${resource.key}:${row.id}`,
              kind: 'record',
              title: pickLocalized(row[resource.titleField], locale) || String(row.slug ?? ''),
              subtitle: adminStrings[locale].sections[resource.labelKey],
              to: `/admin/r/${resource.key}/${row.id}`,
              icon: resource.icon,
            })),
          )
          .catch(() => [] as Hit[]),
      ),
    ).then((groups) => {
      if (!cancelled) setRecords(groups.flat());
    });
    return () => {
      cancelled = true;
    };
  }, [query, records, locale]);

  const staticHits = useMemo<Hit[]>(() => {
    const hits: Hit[] = [];
    for (const page of SITE_PAGES) {
      hits.push({
        id: `page:${page.key}`,
        kind: 'page',
        title: page.label[locale],
        subtitle: page.description?.[locale],
        to: `/admin/content/${page.key}/${locale}`,
        icon: page.icon,
      });
      for (const section of page.sections) {
        hits.push({
          id: `section:${page.key}:${section.key}`,
          kind: 'section',
          title: section.label[locale],
          subtitle: `${page.label[locale]}${section.description ? ' — ' + section.description[locale] : ''}`,
          to: `/admin/content/${page.key}/${locale}?section=${section.key}`,
          icon: section.icon,
        });
      }
    }
    const seen = new Set<string>();
    for (const entry of pageSearchIndex(locale)) {
      const key = `${entry.pageKey}:${entry.sectionKey}:${entry.field}`;
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({
        id: `field:${key}`,
        kind: 'field',
        title: entry.field,
        subtitle: `${entry.page} › ${entry.section}`,
        to: `/admin/content/${entry.pageKey}/${locale}?section=${entry.sectionKey}`,
        icon: LayoutTemplate,
      });
    }
    for (const resource of RESOURCES) {
      hits.push({
        id: `resource:${resource.key}`,
        kind: 'resource',
        title: adminStrings[locale].sections[resource.labelKey] ?? resource.key,
        subtitle: resource.description?.[locale],
        to: `/admin/r/${resource.key}`,
        icon: resource.icon,
      });
    }
    hits.push(
      { id: 'tool:submissions', kind: 'tool', title: s.sections.submissions, to: '/admin/submissions', icon: Inbox },
      { id: 'tool:subscribers', kind: 'tool', title: s.sections.subscribers, to: '/admin/subscribers', icon: Mail },
      { id: 'tool:media', kind: 'tool', title: s.mediaLibrary, to: '/admin/media', icon: Images },
      { id: 'tool:restore', kind: 'tool', title: s.restoreContent, to: '/admin/restore', icon: FileText },
    );
    return hits;
  }, [locale, s]);

  const results = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return staticHits.filter((hit) => hit.kind === 'page' || hit.kind === 'resource').slice(0, 12);
    const all = [...staticHits, ...(records ?? [])];
    const order: Record<Hit['kind'], number> = { page: 0, resource: 1, section: 2, record: 3, field: 4, tool: 5 };
    return all
      .filter((hit) => matches(`${hit.title} ${hit.subtitle ?? ''}`, needle))
      .sort((a, b) => order[a.kind] - order[b.kind])
      .slice(0, 30);
  }, [query, staticHits, records]);

  useEffect(() => setActive(0), [query]);

  const go = (hit: Hit) => {
    onClose();
    navigate(hit.to);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((current) => Math.min(current + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((current) => Math.max(current - 1, 0));
    } else if (event.key === 'Enter' && results[active]) {
      event.preventDefault();
      go(results[active]);
    }
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-start justify-center bg-slate-900/50 p-4 pt-[10vh]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-slate-200 px-4">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={s.searchEverything}
            className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-400 hover:text-slate-700" aria-label={s.cancel}>
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-400">{s.noSearchResults}</p>
          ) : (
            <ul>
              {results.map((hit, index) => {
                const Icon = hit.icon;
                const selected = index === active;
                return (
                  <li key={hit.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(index)}
                      onClick={() => go(hit)}
                      className={
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start transition ' +
                        (selected ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100')
                      }
                    >
                      <Icon size={16} className={'shrink-0 ' + (selected ? 'text-white/80' : 'text-slate-400')} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{hit.title}</span>
                        {hit.subtitle && (
                          <span className={'block truncate text-xs ' + (selected ? 'text-white/60' : 'text-slate-400')}>
                            {hit.subtitle}
                          </span>
                        )}
                      </span>
                      {selected && <CornerDownLeft size={14} className="shrink-0 text-white/60" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">{s.searchHint}</p>
      </div>
    </div>
  );
}
