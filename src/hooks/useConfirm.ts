import { useCallback, useState } from 'react';

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
}

export function useConfirm() {
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);

  const requestConfirm = useCallback((options: ConfirmOptions) => {
    setConfirmState(options);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmState) {
      confirmState.onConfirm();
      setConfirmState(null);
    }
  }, [confirmState]);

  return {
    confirmState,
    requestConfirm,
    closeConfirm,
    handleConfirm,
  };
}
