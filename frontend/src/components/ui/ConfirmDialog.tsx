import { ReactNode } from 'react';
import clsx from 'clsx';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isDangerous = false,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full mx-4"
        style={{ backgroundColor: 'var(--surface-0)' }}
      >
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        )}

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-md border transition-colors',
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--surface-hover)]'
            )}
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-md text-white transition-colors flex items-center gap-2',
              isDangerous
                ? 'bg-[var(--danger)] hover:bg-[#a62300] disabled:opacity-50 disabled:cursor-not-allowed'
                : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isDangerous ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
