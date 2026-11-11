import type { AwardApplicationPayload } from '@/components/award/form/applyState';

/**
 * Award nomination submission — DEMO ONLY (frontend phase).
 *
 * Makes no network request and stores nothing: it simply waits, so the form
 * can show its loading state. Replace with the real call (Supabase insert +
 * file uploads) once the backend exists; the payload is already shaped for it.
 */
export async function submitAwardApplicationDemo(payload: AwardApplicationPayload): Promise<void> {
  void payload;
  await new Promise((resolve) => window.setTimeout(resolve, 1200));
}
