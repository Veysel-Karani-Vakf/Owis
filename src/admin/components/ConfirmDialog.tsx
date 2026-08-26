import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAdminStrings } from '../hooks/useAdmin';

export type ConfirmOptions = {
  title: string;
  /** Plain text or a small block of JSX (e.g. a list of affected items). */
  body?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button for deletes and other irreversible actions. */
  destructive?: boolean;
  /** Require the user to type this word before the confirm button enables. */
  typedWord?: string;
  /** Third button, e.g. "Save and leave"; resolves the promise with 'alt'. */
  altLabel?: string;
};

export type ConfirmResult = boolean | 'alt';

type ConfirmFn = (options: ConfirmOptions) => Promise<ConfirmResult>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

type Pending = { options: ConfirmOptions; resolve: (value: ConfirmResult) => void };

/**
 * Promise-based confirmation modal that names what is about to happen,
 * replacing window.confirm (which is generic, unstyled and in the browser's
 * language rather than the dashboard's).
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<ConfirmResult>((resolve) => {
        setPending({ options, resolve });
      }),
    [],
  );

  const settle = (value: ConfirmResult) => {
    pending?.resolve(value);
    setPending(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && <Dialog options={pending.options} onSettle={settle} />}
    </ConfirmContext.Provider>
  );
}

function Dialog({ options, onSettle }: { options: ConfirmOptions; onSettle: (value: ConfirmResult) => void }) {
  const s = useAdminStrings();
  const [typed, setTyped] = useState('');
  const confirmRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gate = options.typedWord;
  const ready = !gate || typed.trim() === gate;

  useEffect(() => {
    (gate ? inputRef.current : confirmRef.current)?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onSettle(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gate, onSettle]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      onClick={() => onSettle(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          {options.destructive && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 id="confirm-title" className="text-base font-bold text-slate-900">
              {options.title}
            </h2>
            {options.body && <div className="mt-2 text-sm leading-relaxed text-slate-600">{options.body}</div>}
          </div>
          <button
            type="button"
            onClick={() => onSettle(false)}
            className="rounded-md p-1 text-slate-400 transition hover:text-slate-700"
            aria-label={s.cancel}
          >
            <X size={18} />
          </button>
        </div>

        {gate && (
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              {s.typeToConfirm.replace('{word}', gate)}
            </label>
            <input
              ref={inputRef}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => onSettle(false)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            {options.cancelLabel ?? s.cancel}
          </button>
          {options.altLabel && (
            <button
              type="button"
              onClick={() => onSettle('alt')}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              {options.altLabel}
            </button>
          )}
          <button
            ref={confirmRef}
            type="button"
            disabled={!ready}
            onClick={() => onSettle(true)}
            className={
              'rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ' +
              (options.destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-800')
            }
          >
            {options.confirmLabel ?? s.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

/** `const confirm = useConfirm(); if (await confirm({ title })) …` */
export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside ConfirmProvider');
  return ctx;
}
