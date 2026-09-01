import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings2,
  Link2,
  SlidersHorizontal,
} from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { LOCALES, type Locale } from '@/lib/types';
import type { PageFieldDef } from '../lib/pageSchema';
import { getAtPath, setAtPath } from '../lib/paths';
import { useAdminStrings } from '../hooks/useAdmin';
import { hasAnyLocale } from '../lib/validate';
import {
  ImageInput,
  LocalizedInput,
  ParagraphTextarea,
  SelectControl,
  paragraphsHint,
} from './FieldControls';
import { VideoInput } from './VideoInput';
import { IconPicker } from './IconPicker';
import { useConfirm } from './ConfirmDialog';

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ' +
  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100';

export const contentDir: Record<Locale, 'rtl' | 'ltr'> = { ar: 'rtl', tr: 'ltr', en: 'ltr' };

// --- Field nature ------------------------------------------------------------
// By default every field renders the same white box, which makes a button's
// technical destination look exactly like its human text. Classifying fields
// by what they hold lets the form show writable content prominently and the
// fixed/technical bits quiet and tagged — no schema changes needed.

export type FieldNature = 'content' | 'link' | 'media' | 'setting';

const LINK_PATH = /(href|url|link|destination|canonical)/i;

export function fieldNature(field: PageFieldDef): FieldNature {
  if (field.type === 'image' || field.type === 'video' || field.type === 'file') return 'media';
  if (field.type === 'url') return 'link';
  if (
    field.type === 'select' ||
    field.type === 'number' ||
    field.type === 'boolean' ||
    field.type === 'icon'
  ) {
    return 'setting';
  }
  if (field.type === 'text' && LINK_PATH.test(field.path)) return 'link';
  return 'content';
}

/** Small tag beside a label telling the editor what kind of value this is. */
export function FieldNatureChip({ nature }: { nature: FieldNature }) {
  const { locale } = useI18n();
  if (nature === 'content' || nature === 'media') return null;
  const text =
    nature === 'link'
      ? locale === 'ar' ? 'رابط' : locale === 'tr' ? 'bağlantı' : 'link'
      : locale === 'ar' ? 'إعداد' : locale === 'tr' ? 'ayar' : 'setting';
  const Icon = nature === 'link' ? Link2 : SlidersHorizontal;
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium leading-none text-slate-500">
      <Icon size={10} /> {text}
    </span>
  );
}

/**
 * Label row shared by section forms and repeater rows: writable content reads
 * dark and semibold; links and settings read quieter and carry a tag.
 */
export function FieldLabel({ field, compact }: { field: PageFieldDef; compact?: boolean }) {
  const { locale } = useI18n();
  const nature = fieldNature(field);
  const quiet = nature === 'link' || nature === 'setting';
  const tone = quiet
    ? compact ? 'text-xs font-medium text-slate-500' : 'text-[13px] font-medium text-slate-500'
    : compact ? 'text-xs font-semibold text-slate-700' : 'text-sm font-semibold text-slate-800';
  return (
    <span className={'flex items-center gap-1.5 ' + tone}>
      <span className="min-w-0 truncate">{field.label[locale]}</span>
      <FieldNatureChip nature={nature} />
    </span>
  );
}

/**
 * Technical address input: Latin, monospaced and tinted, so it reads as
 * "an exact address" rather than text to rewrite freely.
 */
function LinkValueInput({
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'url';
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Link2 size={14} className="pointer-events-none absolute inset-y-0 my-auto ms-2.5 text-slate-400" />
      <input
        type={type}
        dir="ltr"
        placeholder={placeholder ?? (type === 'url' ? 'https://…' : '/…  #…')}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pe-3 ps-8 text-left font-mono text-[13px] text-slate-700 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

/** Item keys that hold whole numbers; the browser then refuses decimals. */
const INTEGER_KEYS = new Set(['sort_order', 'width', 'height', 'value', 'rows']);

export function isIntegerKey(key: string): boolean {
  return INTEGER_KEYS.has(key.split('.').pop() ?? key);
}

type ControlProps = {
  field: PageFieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  /** Direction of the content locale being edited. */
  dir: 'rtl' | 'ltr';
  /** Natural size of a chosen image, when sibling width/height fields exist. */
  onDimensions?: (width: number, height: number) => void;
};

/** Renders one schema field. Repeaters recurse through `RepeaterInput`. */
export function PageFieldControl({ field, value, onChange, dir, onDimensions }: ControlProps) {
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          className={`${inputBase} min-h-[90px] resize-y`}
          dir={dir}
          value={asString(value)}
          onChange={(event) => onChange(event.target.value)}
        />
      );

    case 'paragraphs':
      return <ParagraphsInput value={value} onChange={onChange} dir={dir} />;

    case 'list':
      return <ListInput value={value} onChange={onChange} dir={dir} />;

    case 'image':
      return <ImageInput value={asString(value)} onChange={onChange} onDimensions={onDimensions} />;

    case 'file':
      // Document link (e.g. the waqf profile PDF): upload to the media
      // bucket's docs folder, pick from the library, or paste an exact URL.
      return <ImageInput value={asString(value)} onChange={onChange} accept="application/pdf" />;

    case 'number':
      return (
        <input
          type="number"
          dir="ltr"
          inputMode={isIntegerKey(field.path) ? 'numeric' : 'decimal'}
          step={isIntegerKey(field.path) ? 1 : undefined}
          className={inputBase}
          value={value === null || value === undefined ? '' : String(value)}
          onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))}
        />
      );

    case 'boolean':
      return (
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-400"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
          />
        </label>
      );

    case 'url':
      return <LinkValueInput value={asString(value)} onChange={onChange} type="url" placeholder={field.placeholder} />;

    case 'video':
      return <VideoInput value={value} onChange={onChange} />;

    case 'select':
      return <SelectControl value={value} onChange={onChange} options={field.options ?? []} />;

    case 'icon':
      return <IconPicker value={value} onChange={onChange} />;

    case 'localized':
    case 'localizedTextarea':
      return (
        <LocalizedInput
          value={(value && typeof value === 'object' ? value : {}) as never}
          onChange={onChange}
          multiline={field.type === 'localizedTextarea'}
        />
      );

    case 'repeater':
      return <RepeaterInput field={field} value={value} onChange={onChange} dir={dir} />;

    default:
      // A text field that holds an address (button destination, breadcrumb
      // href…) renders as a link input, not as prose.
      if (fieldNature(field) === 'link') {
        return <LinkValueInput value={asString(value)} onChange={onChange} placeholder={field.placeholder} />;
      }
      return (
        <input
          className={inputBase}
          dir={dir}
          value={asString(value)}
          onChange={(event) => onChange(event.target.value)}
        />
      );
  }
}

function asString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return String(value);
}

/** Blank-line separated textarea backed by a `string[]`. */
function ParagraphsInput({
  value,
  onChange,
  dir,
}: {
  value: unknown;
  onChange: (value: string[]) => void;
  dir: 'rtl' | 'ltr';
}) {
  const items = Array.isArray(value) ? (value as string[]) : [];
  const { locale } = useI18n();

  return (
    <div>
      <ParagraphTextarea
        paragraphs={items}
        onCommit={onChange}
        dir={dir}
        className={`${inputBase} min-h-[170px] resize-y leading-relaxed`}
      />
      <p className="mt-1 text-xs text-slate-400">{paragraphsHint(locale, items.length)}</p>
    </div>
  );
}

/** One input per entry in a `string[]`. */
function ListInput({
  value,
  onChange,
  dir,
}: {
  value: unknown;
  onChange: (value: string[]) => void;
  dir: 'rtl' | 'ltr';
}) {
  const strings = useAdminStrings();
  const confirm = useConfirm();
  const items = Array.isArray(value) ? (value as string[]) : [];

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = async (index: number) => {
    const text = (items[index] ?? '').trim();
    if (text) {
      const ok = await confirm({ title: strings.deleteTitle.replace('{name}', truncate(text)), destructive: true });
      if (!ok) return;
    }
    onChange(items.filter((_, position) => position !== index));
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <span className="w-6 shrink-0 text-center text-xs text-slate-400">{index + 1}</span>
          <input
            className={inputBase}
            dir={dir}
            value={item}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <IconButton title={strings.moveUp} onClick={() => move(index, -1)}>
            <ArrowUp size={15} />
          </IconButton>
          <IconButton title={strings.moveDown} onClick={() => move(index, 1)}>
            <ArrowDown size={15} />
          </IconButton>
          <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
          <IconButton title={strings.removeItem} danger onClick={() => remove(index)}>
            <Trash2 size={15} />
          </IconButton>
        </div>
      ))}
      <AddButton label={strings.addItem} onClick={() => onChange([...items, ''])} />
    </div>
  );
}

function truncate(text: string, max = 60): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/** True when any item field holds something the editor typed or uploaded. */
export function itemHasContent(item: Record<string, unknown>, fields: PageFieldDef[]): boolean {
  return fields.some((field) => {
    const raw = field.path ? getAtPath(item, field.path) : item;
    if (raw === null || raw === undefined) return false;
    if (typeof raw === 'string') return raw.trim() !== '';
    if (typeof raw === 'number') return true;
    if (typeof raw === 'boolean') return false;
    if (Array.isArray(raw)) return raw.length > 0;
    if (field.type === 'video') {
      const v = raw as Record<string, unknown>;
      return ['videoFile', 'videoId', 'sourceUrl', 'posterImage'].some(
        (key) => typeof v[key] === 'string' && (v[key] as string).trim() !== '',
      );
    }
    if (field.type === 'localized' || field.type === 'localizedTextarea') return hasAnyLocale(raw);
    return Object.keys(raw as object).length > 0;
  });
}

/**
 * Older news rows stored their gallery per language — { ar: [...], tr: [...], en: [...] }
 * with plain-string titles — although the photos are the same in every
 * language. Folds that into one list whose localized fields hold all three
 * texts, so the editor sees one gallery. Written back as a plain array.
 */
export function normalizePlainRepeater(value: unknown, itemFields: PageFieldDef[]): Record<string, unknown>[] {
  if (Array.isArray(value)) return value as Record<string, unknown>[];
  if (!value || typeof value !== 'object') return [];

  const container = value as Record<string, unknown>;
  const lists: Partial<Record<Locale, Record<string, unknown>[]>> = {};
  for (const locale of LOCALES) {
    if (Array.isArray(container[locale])) lists[locale] = container[locale] as Record<string, unknown>[];
  }
  const base = lists.ar ?? lists.tr ?? lists.en;
  if (!base) return [];

  const localizedPaths = itemFields
    .filter((field) => field.type === 'localized' || field.type === 'localizedTextarea')
    .map((field) => field.path);

  return base.map((entry, index) => {
    let item: Record<string, unknown> = { ...entry };
    for (const path of localizedPaths) {
      const existing = getAtPath(item, path);
      if (existing && typeof existing === 'object') continue; // already localized
      const map: Partial<Record<Locale, string>> = {};
      for (const locale of LOCALES) {
        const text = getAtPath(lists[locale]?.[index] ?? {}, path);
        if (typeof text === 'string' && text !== '') map[locale] = text;
      }
      item = setAtPath(item, path, map);
    }
    return item;
  });
}

/** Collapsible rows of objects described by `field.itemFields`. */
export function RepeaterInput({
  field,
  value,
  onChange,
  dir,
}: {
  field: PageFieldDef;
  value: unknown;
  onChange: (value: unknown[]) => void;
  dir: 'rtl' | 'ltr';
}) {
  const strings = useAdminStrings();
  const { locale } = useI18n();
  const confirm = useConfirm();
  const [openRow, setOpenRow] = useState<number | null>(0);
  const [advancedRows, setAdvancedRows] = useState<Set<number>>(new Set());
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const itemFields = field.itemFields ?? [];
  const mainFields = itemFields.filter((itemField) => !itemField.advanced);
  const advancedFields = itemFields.filter((itemField) => itemField.advanced);
  const atMax = typeof field.max === 'number' && items.length >= field.max;

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  const update = (index: number, next: Record<string, unknown>) => {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  };

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
    setOpenRow(target);
  };

  const rowTitle = (item: Record<string, unknown>, index: number) => {
    const raw = field.itemTitleField ? getAtPath(item, field.itemTitleField) : undefined;
    let text = typeof raw === 'string' ? raw.trim() : '';
    if (!text && raw && typeof raw === 'object') {
      // Localized title inside a plain repeater: show the editor's language first.
      const map = raw as Record<string, unknown>;
      const pick = [locale, ...LOCALES].find((l) => typeof map[l] === 'string' && (map[l] as string).trim());
      text = pick ? (map[pick] as string).trim() : '';
    }
    if (text) return truncate(text);
    return `${label('عنصر', 'Öğe', 'Item')} ${index + 1}`;
  };

  const remove = async (index: number) => {
    if (itemHasContent(items[index] ?? {}, itemFields)) {
      const ok = await confirm({
        title: strings.deleteTitle.replace('{name}', rowTitle(items[index], index)),
        destructive: true,
      });
      if (!ok) return;
    }
    onChange(items.filter((_, position) => position !== index));
    setOpenRow(null);
  };

  const toggleAdvanced = (index: number) =>
    setAdvancedRows((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  // An image next to width/height fields fills them from the file itself.
  const hasPath = (path: string) => itemFields.some((itemField) => itemField.path === path);
  const dimensionsFor = (itemField: PageFieldDef, index: number) =>
    itemField.type === 'image' && hasPath('width') && hasPath('height')
      ? (width: number, height: number) => {
          const current = items[index] ?? {};
          update(index, setAtPath(setAtPath(current, 'width', width), 'height', height));
        }
      : undefined;

  const renderField = (itemField: PageFieldDef, item: Record<string, unknown>, index: number) => {
    const wide =
      itemField.full ||
      ['textarea', 'paragraphs', 'list', 'repeater', 'image', 'video', 'file', 'localizedTextarea'].includes(itemField.type);
    return (
      <div key={itemField.path || itemField.type} className={wide ? 'md:col-span-2' : ''}>
        <label className="mb-1 block">
          <FieldLabel field={itemField} compact />
        </label>
        <PageFieldControl
          field={itemField}
          dir={dir}
          value={itemField.path ? getAtPath(item, itemField.path) : item}
          onChange={(next) =>
            update(
              index,
              itemField.path ? setAtPath(item, itemField.path, next) : (next as Record<string, unknown>),
            )
          }
          onDimensions={dimensionsFor(itemField, index)}
        />
        {itemField.help && <p className="mt-1 text-xs text-slate-400">{itemField.help[locale]}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const open = openRow === index;
        const advancedOpen = advancedRows.has(index);
        return (
          <div key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="flex items-center gap-1 px-2 py-1.5">
              <GripVertical size={14} className="shrink-0 text-slate-300" />
              <button
                type="button"
                onClick={() => setOpenRow(open ? null : index)}
                className="flex flex-1 items-center gap-1.5 truncate text-start text-sm font-medium text-slate-700"
              >
                {open ? <ChevronDown size={15} /> : <ChevronRight size={15} className="rtl:rotate-180" />}
                <span className="truncate">{rowTitle(item, index)}</span>
              </button>
              <IconButton title={strings.moveUp} onClick={() => move(index, -1)}>
                <ArrowUp size={15} />
              </IconButton>
              <IconButton title={strings.moveDown} onClick={() => move(index, 1)}>
                <ArrowDown size={15} />
              </IconButton>
              <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
              <IconButton title={strings.removeItem} danger onClick={() => remove(index)}>
                <Trash2 size={15} />
              </IconButton>
            </div>

            {open && (
              <div className="border-t border-slate-200 bg-white p-3">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {mainFields.map((itemField) => renderField(itemField, item, index))}
                </div>

                {advancedFields.length > 0 && (
                  <div className="mt-3 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => toggleAdvanced(index)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-medium text-slate-600 transition hover:text-slate-900"
                    >
                      <Settings2 size={14} />
                      {strings.moreSettings}
                      {advancedOpen ? (
                        <ChevronDown size={14} className="ms-auto" />
                      ) : (
                        <ChevronRight size={14} className="ms-auto rtl:rotate-180" />
                      )}
                    </button>
                    {advancedOpen && (
                      <div className="grid grid-cols-1 gap-4 border-t border-slate-100 p-3 md:grid-cols-2">
                        {advancedFields.map((itemField) => renderField(itemField, item, index))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {atMax ? (
        <p className="text-xs text-slate-400">
          {label(`الحد الأقصى ${field.max}`, `En fazla ${field.max}`, `Maximum ${field.max}`)}
        </p>
      ) : (
        <AddButton
          label={strings.addItem}
          onClick={() => {
            onChange([...items, blankItem(itemFields)]);
            setOpenRow(items.length);
          }}
        />
      )}
    </div>
  );
}

let itemCounter = 0;

/**
 * Records carry an `id` used for React keys and in-page anchors. It is not
 * something an editor should have to invent, so new rows get one generated and
 * the field is kept out of the forms.
 */
function generateItemId(): string {
  itemCounter += 1;
  return `item-${itemCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

function blankItem(fields: PageFieldDef[]): Record<string, unknown> {
  let item: Record<string, unknown> = { id: generateItemId() };
  for (const field of fields) {
    // A video field with an empty path edits the item itself; nothing to seed.
    if (!field.path) continue;
    const empty =
      field.type === 'list' || field.type === 'paragraphs' || field.type === 'repeater'
        ? []
        : field.type === 'boolean'
          ? false
          : field.type === 'number'
            ? null
            : field.type === 'localized' || field.type === 'localizedTextarea'
              ? // A real translation map from the start: the site's localizer
                // would otherwise hand `{}` to a React child.
                { ar: '', tr: '', en: '' }
              : field.type === 'select'
                ? (field.options?.[0]?.value ?? '')
                : '';
    item = setAtPath(item, field.path, empty);
  }
  return item;
}

function IconButton({
  children,
  title,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={
        'shrink-0 rounded-md p-1.5 transition hover:bg-slate-200 ' +
        (danger ? 'text-red-500 hover:bg-red-50' : 'text-slate-500')
      }
    >
      {children}
    </button>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-600 transition hover:border-primary-400 hover:text-primary-600"
    >
      <Plus size={15} /> {label}
    </button>
  );
}
