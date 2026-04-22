import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={clsx(sizeClasses[size], 'border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin')} />
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'var(--surface-0)' }}>
      <LoadingSpinner size="lg" />
    </div>
  );
}
