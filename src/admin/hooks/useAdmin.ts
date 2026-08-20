import { useI18n } from '@/i18n/useI18n';
import { adminStrings } from '../i18n';

/** Admin UI strings for the currently active site locale. */
export function useAdminStrings() {
  const { locale } = useI18n();
  return adminStrings[locale];
}
