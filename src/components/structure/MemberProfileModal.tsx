import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Briefcase, UserCheck } from 'lucide-react';
import type { AdministrativeMember } from '@/data/about';
import MemberPortrait from './MemberPortrait';
import { useI18n } from '@/i18n/useI18n';

type MemberProfileModalProps = {
  member: AdministrativeMember | null;
  onClose: () => void;
};

export default function MemberProfileModal({ member, onClose }: MemberProfileModalProps) {
  const { isRtl, locale } = useI18n();

  useEffect(() => {
    if (!member) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [member, onClose]);

  const levelLabels: Record<number, { ar: string; en: string; tr: string }> = {
    1: { ar: 'المستوى الأول: القيادة العليا', en: 'Level 1: Senior Leadership', tr: '1. Kademe: Üst Düzey Liderlik' },
    2: { ar: 'المستوى الثاني: الإدارة التنفيذية', en: 'Level 2: Executive Management', tr: '2. Kademe: İcra Yönetimi' },
    3: { ar: 'المستوى الثالث: إدارة البرامج والعمليات', en: 'Level 3: Department Management', tr: '3. Kademe: Birim Yönetimi' },
  };

  const closeLabel = locale === 'ar' ? 'إغلاق' : locale === 'tr' ? 'Kapat' : 'Close';

  return (
    <AnimatePresence>
      {member && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-950/75 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`member-modal-title-${member.id}`}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-slate-100 text-start"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative gradient bar */}
            <div className="h-2 w-full bg-gradient-to-r from-primary-600 via-primary-500 to-gold-400" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute top-4 end-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-dark-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 sm:p-8">
              {/* Header profile row */}
              <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-md">
                  <MemberPortrait
                    name={member.name}
                    image={member.image}
                    imagePosition={member.imagePosition}
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute top-0 start-0 h-full w-1.5 bg-primary-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 mb-2">
                    <Award className="h-3.5 w-3.5 text-primary-600" />
                    <span>{levelLabels[member.level]?.[locale] ?? levelLabels[member.level]?.ar}</span>
                  </div>

                  <h3
                    id={`member-modal-title-${member.id}`}
                    className="text-xl sm:text-2xl font-bold text-dark-900 leading-snug break-words"
                  >
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-primary-600 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    <span>{member.position}</span>
                  </p>
                </div>
              </div>

              {/* Role Responsibility summary */}
              <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200/60 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-primary-600" />
                  <span>
                    {locale === 'ar'
                      ? 'المهام والمسؤوليات'
                      : locale === 'tr'
                      ? 'Görev ve Sorumluluklar'
                      : 'Roles & Responsibilities'}
                  </span>
                </h4>
                <p className="text-sm leading-relaxed text-dark-700">
                  {member.shortDescription}
                </p>
              </div>

              {/* Extended Biography */}
              {member.biography && (
                <div className="mt-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {locale === 'ar'
                      ? 'نبذة تعريفية'
                      : locale === 'tr'
                      ? 'Biyografi'
                      : 'Biography'}
                  </h4>
                  <p className="text-sm sm:text-base leading-relaxed text-dark-600">
                    {member.biography}
                  </p>
                </div>
              )}

              {/* Footer action */}
              <div className="mt-7 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-dark-700 hover:bg-slate-100 transition-colors"
                >
                  {closeLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

