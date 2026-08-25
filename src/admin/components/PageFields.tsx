import { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/lib/types';
import type { PageFieldDef } from '../lib/pageSchema';
import { getAtPath, setAtPath } from '../lib/paths';
import { useAdminStrings } from '../hooks/useAdmin';
import { ImageInput } from './FieldControls';
import { VideoInput } from './VideoInput';

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ' +
  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100';

export const contentDir: Record<Locale, 'rtl' | 'ltr'> = { ar: 'rtl', tr: 'ltr', en: 'ltr' };

type ControlProps = {
  field: PageFieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  /** Direction of the content locale being edited. */
  dir: 'rtl' | 'ltr';
};

/** Renders one schema field. Repeaters recurse through `RepeaterInput`. */
export function PageFieldControl({ field, value, onChange, dir }: ControlProps) {
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
      return <ImageInput value={asString(value)} onChange={onChange} />;

    case 'number':
      return (
        <input
          type="number"
          dir="ltr"
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
      return (
        <input
          type="url"
          dir="ltr"
          className={inputBase}
          value={asString(value)}
          onChange={(event) => onChange(event.target.value)}
        />
      );

    case 'video':
      return <VideoInput value={value} onChange={onChange} />;

    case 'repeater':
      return <RepeaterInput field={field} value={value} onChange={onChange} dir={dir} />;

    default:
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
      <textarea
        className={`${inputBase} min-h-[170px] resize-y leading-relaxed`}
        dir={dir}
        value={items.join('\n\n')}
        onChange={(event) =>
          onChange(
            event.target.value
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean),
          )
        }
      />
      <p className="mt-1 text-xs text-slate-400">
        {items.length}{' '}
        {locale === 'ar' ? 'فقرة' : locale === 'tr' ? 'paragraf' : items.length === 1 ? 'paragraph' : 'paragraphs'}
        {' — '}
        {locale === 'ar' ? 'افصل بين الفقرات بسطر فارغ' : locale === 'tr' ? 'Paragrafları boş satırla ayırın' : 'separate paragraphs with a blank line'}
      </p>
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
  const items = Array.isArray(value) ? (value as string[]) : [];

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
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
          <IconButton
            title={strings.removeItem}
            danger
            onClick={() => onChange(items.filter((_, position) => position !== index))}
          >
            <Trash2 size={15} />
          </IconButton>
        </div>
      ))}
      <AddButton label={strings.addItem} onClick={() => onChange([...items, ''])} />
    </div>
  );
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
  const [openRow, setOpenRow] = useState<number | null>(0);
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const itemFields = field.itemFields ?? [];

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
    const text = typeof raw === 'string' ? raw.trim() : '';
    if (text) return text.length > 60 ? `${text.slice(0, 60)}…` : text;
    return `${locale === 'ar' ? 'عنصر' : locale === 'tr' ? 'Öğe' : 'Item'} ${index + 1}`;
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const open = openRow === index;
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
              <IconButton
                title={strings.removeItem}
                danger
                onClick={() => {
                  onChange(items.filter((_, position) => position !== index));
                  setOpenRow(null);
                }}
              >
                <Trash2 size={15} />
              </IconButton>
            </div>

            {open && (
              <div className="grid grid-cols-1 gap-4 border-t border-slate-200 bg-white p-3 md:grid-cols-2">
                {itemFields.map((itemField) => {
                  const wide =
                    itemField.full ||
                    ['textarea', 'paragraphs', 'list', 'repeater', 'image'].includes(itemField.type);
                  return (
                    <div key={itemField.path} className={wide ? 'md:col-span-2' : ''}>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        {itemField.label[locale]}
                      </label>
                      <PageFieldControl
                        field={itemField}
                        dir={dir}
                        value={getAtPath(item, itemField.path)}
                        onChange={(next) => update(index, setAtPath(item, itemField.path, next))}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <AddButton
        label={strings.addItem}
        onClick={() => {
          onChange([...items, blankItem(itemFields)]);
          setOpenRow(items.length);
        }}
      />
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
    const empty =
      field.type === 'list' || field.type === 'paragraphs' || field.type === 'repeater'
        ? []
        : field.type === 'boolean'
          ? false
          : field.type === 'number'
            ? null
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
