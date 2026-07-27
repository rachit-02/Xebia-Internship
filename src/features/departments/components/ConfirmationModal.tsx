import { Modal } from '@/components/ui/Modal';

export function ConfirmationModal({
  open,
  title,
  description,
  onClose,
  onConfirm,
  confirmLabel,
}: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
}) {
  return (
    <Modal open={open} title={title} description={description} onClose={onClose} onConfirm={onConfirm} confirmLabel={confirmLabel} />
  );
}
