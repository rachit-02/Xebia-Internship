import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

export function Modal({ open, title, description, children, onClose, onConfirm, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="soft-card w-full max-w-lg p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-heading">{title}</h2>
            {description ? <p className="mt-1 text-sm text-text">{description}</p> : null}
          </div>
          <button type="button" className="focus-ring rounded-full p-2 hover:bg-hover" onClick={onClose} aria-label="Close dialog">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children ? <div className="space-y-4">{children}</div> : null}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
          {onConfirm ? <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button> : null}
        </div>
      </div>
    </div>
  );
}
