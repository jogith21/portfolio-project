import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />,
    error: <XCircle className="h-4 w-4 text-red-600 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />,
    info: <Info className="h-4 w-4 text-[#2563EB] shrink-0" />,
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-lg transition-all"
        >
          <div className="mt-0.5">{iconMap[toast.type]}</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#0F172A]">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-xs text-[#64748B]">{toast.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
