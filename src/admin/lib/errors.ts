import type { Locale } from '@/lib/types';

const L = (ar: string, tr: string, en: string): Record<Locale, string> => ({ ar, tr, en });

const MESSAGES = {
  duplicateSlug: L(
    'رابط الصفحة مستخدم من قبل — غيّر "رابط الصفحة" ثم احفظ.',
    'Bu sayfa bağlantısı zaten kullanılıyor — bağlantıyı değiştirip tekrar kaydedin.',
    'This page link is already in use — change the "Page link" and save again.',
  ),
  duplicate: L(
    'يوجد عنصر آخر بنفس القيمة؛ يجب أن تكون فريدة.',
    'Aynı değere sahip başka bir kayıt var; benzersiz olmalı.',
    'Another item already has this value; it must be unique.',
  ),
  required: L('حقل مطلوب لم يُملأ.', 'Zorunlu bir alan boş.', 'A required field is empty.'),
  invalidChoice: L(
    'إحدى القيم المختارة غير مسموح بها.',
    'Seçilen değerlerden biri geçerli değil.',
    'One of the chosen values is not allowed.',
  ),
  permission: L(
    'ليست لديك صلاحية لهذا الإجراء. سجّل الدخول من جديد أو اطلب من المسؤول إضافتك.',
    'Bu işlem için yetkiniz yok. Yeniden giriş yapın veya yöneticiden erişim isteyin.',
    'You do not have permission for this. Sign in again or ask the administrator for access.',
  ),
  network: L(
    'تعذر الاتصال بالخادم. تحقق من الإنترنت ثم حاول مجدداً.',
    'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.',
    'Could not reach the server. Check your connection and try again.',
  ),
  tooLarge: L('الملف أكبر من الحد المسموح.', 'Dosya izin verilen boyuttan büyük.', 'The file is larger than allowed.'),
  generic: L('تعذر الحفظ.', 'Kaydedilemedi.', 'Could not save.'),
};

/**
 * Turns Supabase/Postgres errors into a sentence an editor can act on, in the
 * dashboard's language. Unknown errors keep their original text after the
 * generic sentence so support can still read them.
 */
export function translateDbError(error: unknown, locale: Locale): string {
  const raw = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  const text = raw.toLowerCase();

  if (!raw) return MESSAGES.generic[locale];
  if (text.includes('failed to fetch') || text.includes('networkerror') || text.includes('load failed')) {
    return MESSAGES.network[locale];
  }
  if (text.includes('duplicate key') || text.includes('23505')) {
    return text.includes('slug') ? MESSAGES.duplicateSlug[locale] : MESSAGES.duplicate[locale];
  }
  if (text.includes('not-null') || text.includes('23502')) return MESSAGES.required[locale];
  if (text.includes('check constraint') || text.includes('23514') || text.includes('invalid input value')) {
    return MESSAGES.invalidChoice[locale];
  }
  if (text.includes('row-level security') || text.includes('permission denied') || text.includes('jwt')) {
    return MESSAGES.permission[locale];
  }
  if (text.includes('payload too large') || text.includes('exceeded the maximum allowed size')) {
    return MESSAGES.tooLarge[locale];
  }
  return `${MESSAGES.generic[locale]} (${raw})`;
}
