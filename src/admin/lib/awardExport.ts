// Excel export of the award nominations: one row per application, every form
// field in its own column, in the dashboard's language.
//
// A real .xlsx (not CSV) so that Arabic opens right-to-left, long answers wrap
// inside their cells, and phone numbers stay text ("+967…" is not a formula and
// keeps its leading plus). ExcelJS is loaded only when the button is pressed.

import type * as ExcelNS from 'exceljs';
import { getAwardFormContent } from '@/data/award/form';
import type { AwardApplicationRow, Locale } from '@/lib/types';
import {
  awardAnswers,
  awardImages,
  awardStatusLabel,
  categoryName,
  formLanguageName,
  governorateName,
  socialLinks,
} from './awardApplications';

/** The part of ExcelJS this file needs (the browser and Node builds both provide it). */
export type ExcelModule = Pick<typeof ExcelNS, 'Workbook'>;

const L = (ar: string, tr: string, en: string): Record<Locale, string> => ({ ar, tr, en });

type CellValue = string | number | Date;
type ColumnKind = 'text' | 'ltr' | 'long' | 'number' | 'date';

type ExportContext = { locale: Locale; duplicates: Map<string, string[]> };

type ExportColumn = {
  key: string;
  header: string;
  width: number;
  kind: ColumnKind;
  value: (row: AwardApplicationRow, context: ExportContext) => CellValue;
};

/** Yemen is UTC+3 all year; Excel dates carry no zone, so the offset is baked in. */
const YEMEN_OFFSET_MS = 3 * 60 * 60 * 1000;

const BRAND_RED = 'FFDA0812';

export function awardExportColumns(locale: Locale): ExportColumn[] {
  const t = (label: Record<Locale, string>) => label[locale];
  const form = getAwardFormContent(locale);
  const impact = form.fields.impact;

  const column = (
    key: string,
    header: string,
    width: number,
    kind: ColumnKind,
    value: ExportColumn['value'],
  ): ExportColumn => ({ key, header, width, kind, value });

  return [
    column('reference', t(L('رقم الطلب', 'Başvuru no', 'Application no.')), 18, 'ltr', (row) => row.reference_no ?? ''),
    column(
      'submitted',
      t(L('تاريخ التقديم (توقيت اليمن)', 'Başvuru tarihi (Yemen saati)', 'Submitted (Yemen time)')),
      20,
      'date',
      (row) => {
        const time = Date.parse(row.created_at);
        return Number.isNaN(time) ? row.created_at : new Date(time + YEMEN_OFFSET_MS);
      },
    ),
    column('status', t(L('الحالة', 'Durum', 'Status')), 16, 'text', (row) => awardStatusLabel[row.status]?.[locale] ?? row.status),
    column('initiative', form.fields.initiativeName.label, 32, 'text', (row) => row.initiative_name),
    column('representative', form.fields.representative.label, 28, 'text', (row) => row.representative),
    column('whatsapp', t(L('واتساب', 'WhatsApp', 'WhatsApp')), 20, 'ltr', (row) => row.whatsapp),
    column('email', form.fields.email.label, 32, 'ltr', (row) => row.email),
    column('team', form.fields.teamSize.label, 14, 'number', (row) => row.team_size),
    column('governorate', form.fields.governorate.label, 22, 'text', (row) => governorateName(row.governorate, locale)),
    column('district', form.fields.district.label, 22, 'text', (row) => row.district),
    column('start', form.fields.period.start, 14, 'ltr', (row) => row.period_start),
    column('end', form.fields.period.end, 14, 'text', (row) =>
      row.ongoing || !row.period_end ? form.review.ongoing : row.period_end,
    ),
    column('category', form.fields.category.label, 22, 'text', (row) => categoryName(row, locale)),
    column('social', t(L('روابط التواصل الاجتماعي', 'Sosyal medya bağlantıları', 'Social media links')), 48, 'long', (row) =>
      socialLinks(row, locale)
        .map((link) => `${link.label}: ${link.url}`)
        .join('\n'),
    ),
    ...(['idea', 'results', 'team', 'sustainability'] as const).map((id) =>
      column(`answer-${id}`, impact[id].title, 60, 'long', (row) => awardAnswers(row, locale).find((a) => a.id === id)?.answer ?? ''),
    ),
    column('images', t(L('عدد الصور', 'Fotoğraf sayısı', 'Photos')), 12, 'number', (row) => awardImages(row).length),
    column(
      'duplicate',
      t(L('طلبات أخرى من نفس البريد أو الرقم', 'Aynı e-posta/numaradan diğer başvurular', 'Other applications from the same email or number')),
      26,
      'ltr',
      (row, context) => (context.duplicates.get(row.id) ?? []).join(', '),
    ),
    column('notes', t(L('ملاحظات الإدارة', 'Yönetim notları', 'Team notes')), 40, 'long', (row) => row.admin_notes ?? ''),
    column('language', t(L('لغة الاستمارة', 'Form dili', 'Form language')), 14, 'text', (row) =>
      row.locale ? (formLanguageName[row.locale] ?? row.locale) : '',
    ),
  ];
}

/** Builds the workbook; pure apart from the ExcelJS module it is handed. */
export function buildAwardWorkbook(
  Excel: ExcelModule,
  rows: AwardApplicationRow[],
  locale: Locale,
  duplicates: Map<string, string[]>,
): ExcelNS.Workbook {
  const rtl = locale === 'ar';
  const columns = awardExportColumns(locale);
  const context: ExportContext = { locale, duplicates };

  const workbook = new Excel.Workbook();
  workbook.created = new Date();
  const sheet = workbook.addWorksheet(
    { ar: 'طلبات الترشيح', tr: 'Başvurular', en: 'Applications' }[locale],
    { views: [{ rightToLeft: rtl, state: 'frozen', ySplit: 1 }] },
  );

  sheet.columns = columns.map((entry) => ({ header: entry.header, key: entry.key, width: entry.width }));

  const header = sheet.getRow(1);
  header.height = 34;
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_RED } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  });

  for (const row of rows) {
    const added = sheet.addRow(Object.fromEntries(columns.map((entry) => [entry.key, entry.value(row, context)])));
    columns.forEach((entry, index) => {
      const cell = added.getCell(index + 1);
      if (entry.kind === 'date') {
        if (cell.value instanceof Date) cell.numFmt = 'yyyy-mm-dd hh:mm';
        cell.alignment = { vertical: 'top', horizontal: 'center' };
      } else if (entry.kind === 'number') {
        cell.alignment = { vertical: 'top', horizontal: 'center' };
      } else if (entry.kind === 'ltr') {
        // Numbers, addresses and codes read left to right even on an Arabic sheet.
        cell.alignment = { vertical: 'top', horizontal: rtl ? 'right' : 'left', readingOrder: 'ltr', wrapText: true };
      } else {
        cell.alignment = { vertical: 'top', horizontal: rtl ? 'right' : 'left', wrapText: true };
      }
    });
  }

  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };
  return workbook;
}

export function awardExportFileName(now: Date = new Date()): string {
  return `owais-award-applications-${now.toISOString().slice(0, 10)}.xlsx`;
}

/** Builds the file in the browser and hands it to the download manager. */
export async function downloadAwardWorkbook(
  rows: AwardApplicationRow[],
  locale: Locale,
  duplicates: Map<string, string[]>,
): Promise<void> {
  const loaded = (await import('exceljs')) as unknown as ExcelModule & { default?: ExcelModule };
  const Excel = loaded.default ?? loaded;
  const buffer = await buildAwardWorkbook(Excel, rows, locale, duplicates).xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = awardExportFileName();
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a moment to start reading the blob before it is released.
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
