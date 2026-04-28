import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fadeIn">
      {icon && <div className="mb-4 text-5xl opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold text-center text-slate-800">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-center mt-2 max-w-sm text-slate-500">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#0079BF] rounded-lg transition-colors duration-200 ease-in-out hover:bg-[#0068a8] focus:outline-none focus:ring-2 focus:ring-[#0079BF]/50"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
