import clsx from 'clsx';

interface BadgeProps {
  role: 'superadmin' | 'admin' | 'user' | 'guest';
  size?: 'sm' | 'md';
}

const badgeStyles = {
  superadmin: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
  },
  admin: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  user: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  guest: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    dot: 'bg-gray-500',
  },
};

const roleLabels = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  user: 'User',
  guest: 'Guest',
};

export function RoleBadge({ role, size = 'md' }: BadgeProps) {
  const style = badgeStyles[role];
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span className={clsx('inline-flex items-center gap-2 rounded-full font-medium', style.bg, style.text, sizeClass)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', style.dot)} />
      {roleLabels[role]}
    </span>
  );
}
