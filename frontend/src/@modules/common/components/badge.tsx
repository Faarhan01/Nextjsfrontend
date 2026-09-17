import React from 'react';
import { clx } from '@/lib/util/clx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'green' | 'red' | 'blue' | 'orange' | 'grey' | 'purple';
  size?: 'small' | 'base' | 'large';
  rounded?: 'base' | 'full';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'grey',
  size = 'base',
  rounded = 'full',
  className,
  ...props
}) => {
  return (
    <span
      className={clx(
        'inline-flex items-center gap-x-1 font-semibold leading-none select-none tracking-wide uppercase',
        // Sizes
        size === 'small' && 'px-2 py-0.5 text-[10px]',
        size === 'base' && 'px-2.5 py-1 text-xs',
        size === 'large' && 'px-3 py-1.5 text-sm',
        // Radii
        rounded === 'full' && 'rounded-full',
        rounded === 'base' && 'rounded-md',
        // Colors
        color === 'grey' && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700',
        color === 'green' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60',
        color === 'red' && 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60',
        color === 'blue' && 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60',
        color === 'orange' && 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60',
        color === 'purple' && 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
