import { X } from 'lucide-react';
import { useToastStore, type Toast } from '@/store/useToastStore';
import clsx from 'clsx';

const toastStyles: Record<Toast['type'], { bg: string; border: string; icon: string }> = {
  success: {
    bg: 'bg-[#E3FCEF] border-[#00875A]',
    border: 'border-l-4 border-[#00875A]',
    icon: 'text-[#00875A]',
  },
  error: {
    bg: 'bg-[#FFEBE6] border-[#BF2600]',
    border: 'border-l-4 border-[#BF2600]',
    icon: 'text-[#BF2600]',
  },
  warning: {
    bg: 'bg-[#FFFAE6] border-[#FF8B00]',
    border: 'border-l-4 border-[#FF8B00]',
    icon: 'text-[#FF8B00]',
  },
  info: {
    bg: 'bg-[#DEEBFF] border-[#0052CC]',
    border: 'border-l-4 border-[#0052CC]',
    icon: 'text-[#0052CC]',
  },
};

const toastIcons: Record<Toast['type'], string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'ℹ',
};

interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useToastStore((state) => state.removeToast);
  const style = toastStyles[toast.type];

  return (
    <div
      className={clsx(
        'flex items-start gap-3 w-full max-w-sm px-4 py-3 rounded-md shadow-md animate-slide-in',
        style.bg,
        style.border
      )}
      role="alert"
    >
      <span className={clsx('text-lg font-bold flex-shrink-0', style.icon)}>
        {toastIcons[toast.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
