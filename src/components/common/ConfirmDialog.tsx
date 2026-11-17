import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ConfirmOptions } from '../../hooks/useConfirm';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  confirmState: ConfirmOptions | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  confirmState,
  onCancel,
  onConfirm,
}) => {
  if (!confirmState) return null;

  const isDanger = confirmState.variant === 'danger';

  return (
    <Modal
      isOpen={Boolean(confirmState)}
      onClose={onCancel}
      title={confirmState.title}
      maxWidthClass="max-w-md"
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            isDanger ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#2563EB]'
          }`}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{confirmState.description}</p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
        >
          {confirmState.cancelLabel ?? 'Cancel'}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`inline-flex min-h-[40px] items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors whitespace-nowrap ${
            isDanger
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-[#2563EB] hover:bg-blue-700'
          }`}
        >
          {confirmState.confirmLabel ?? 'Confirm'}
        </button>
      </div>
    </Modal>
  );
};
