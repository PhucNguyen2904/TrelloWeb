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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 animate-fadeIn">
      <div
        className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 animate-scaleIn"
      >
        <h2 className="text-lg font-semibold text-slate-800">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-slate-600">
            {description}
          </p>
        )}

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-800 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-200',
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'
            )}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors duration-200 ease-in-out flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2',
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-rose-500'
                : 'bg-[#0079BF] hover:bg-[#0068a8] disabled:opacity-50 disabled:cursor-not-allowed focus:ring-blue-500'
            )}
          >
            {isLoading && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isDangerous ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
