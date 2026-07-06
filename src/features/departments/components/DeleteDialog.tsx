import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function DeleteDialog({ open, name, onClose, onConfirm }: { open: boolean; name: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      title={`Delete ${name}?`}
      description="This action will soft delete the department from the current session. You can keep working without a backend." 
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel="Delete Department"
      danger
    >
      <div className="rounded-2xl border border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.06)] p-4 text-sm text-text">
        Deleting this department removes it from the list and details view in the current frontend session.
      </div>
    </Modal>
  );
}
