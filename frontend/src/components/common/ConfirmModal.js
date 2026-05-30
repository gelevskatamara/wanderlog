import Modal from './Modal';
import Button from './Button';
import { WarningIcon } from './Icons';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmVariant = 'danger', loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Are you sure?'} maxWidth="max-w-sm">
      <div className="text-center">
        <div className="flex justify-center mb-3 text-amber-500">
          <WarningIcon className="w-12 h-12" />
        </div>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1" disabled={loading}>Cancel</Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading} className="flex-1">{confirmText}</Button>
        </div>
      </div>
    </Modal>
  );
}
