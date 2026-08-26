import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastKind = 'success' | 'error' | 'info';

export type ToastOptions = {
  kind?: ToastKind;
  /** Milliseconds before the toast fades; errors stay until dismissed by default. */
  duration?: number;
  action?: { label: string; onClick: () => void };
};

type ToastItem = ToastOptions & { id: number; message: string; kind: ToastKind };

type ToastContextValue = {
  toast: (message: string, options?: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastKind, typeof Info> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const STYLES: Record<ToastKind, string> = {
  success: 'border-emerald-200 bg-white text-slate-800 [&_svg.kind]:text-emerald-500',
  error: 'border-red-200 bg-white text-slate-800 [&_svg.kind]:text-red-500',
  info: 'border-slate-200 bg-white text-slate-800 [&_svg.kind]:text-slate-500',
};

/**
 * Bottom-corner notifications for save/delete/upload results. Replaces the
 * browser's alert() so feedback is in the dashboard's language and never
 * blocks the page.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, options: ToastOptions = {}) => {
      counter.current += 1;
      const id = counter.current;
      const kind = options.kind ?? 'info';
      setItems((current) => [...current.slice(-3), { ...options, id, message, kind }]);
      const duration = options.duration ?? (kind === 'error' ? 0 : options.action ? 6000 : 3200);
      if (duration > 0) window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (message, options) => toast(message, { ...options, kind: 'success' }),
      error: (message, options) => toast(message, { ...options, kind: 'error' }),
      info: (message, options) => toast(message, { ...options, kind: 'info' }),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 z-[70] flex w-full max-w-sm flex-col gap-2 px-4 ltr:left-0 rtl:right-0 sm:px-0 ltr:sm:left-4 rtl:sm:right-4"
      >
        {items.map((item) => {
          const Icon = ICONS[item.kind];
          return (
            <div
              key={item.id}
              role={item.kind === 'error' ? 'alert' : 'status'}
              className={
                'pointer-events-auto flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm shadow-lg shadow-slate-900/10 ' +
                STYLES[item.kind]
              }
            >
              <Icon size={18} className="kind mt-0.5 shrink-0" />
              <span className="min-w-0 flex-1 leading-snug">{item.message}</span>
              {item.action && (
                <button
                  type="button"
                  onClick={() => {
                    item.action?.onClick();
                    dismiss(item.id);
                  }}
                  className="shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold text-primary-700 transition hover:bg-primary-50"
                >
                  {item.action.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="shrink-0 rounded-md p-0.5 text-slate-400 transition hover:text-slate-700"
                aria-label="×"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
