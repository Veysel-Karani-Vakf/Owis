import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isPreviewFrame } from '@/cms/preview';
import { getAwardSettings } from '@/data/award/settings';

/**
 * Wraps every award route. When the award team has hidden the award from the
 * dashboard, the pages do not exist for visitors: like any unknown address,
 * they lead back to the home page. The dashboard's own preview frame still
 * renders them, so the pictures and the notice can be prepared while hidden.
 */
export default function AwardGate({ children }: { children: ReactNode }) {
  if (!getAwardSettings().visible && !isPreviewFrame()) return <Navigate to="/" replace />;
  return <>{children}</>;
}
