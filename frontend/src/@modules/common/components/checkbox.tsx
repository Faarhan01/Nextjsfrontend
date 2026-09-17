import React, { forwardRef } from 'react';
import { clx } from '@/lib/util/clx';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  sublabel?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, sublabel, className, id, ...props }, ref) => {
    const inputId = id || (label ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <label
        htmlFor={inputId}
        className={clx(
          'inline-flex items-start gap-3 cursor-pointer select-none group',
          props.disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={clx(
            'w-4 h-4 rounded mt-0.5 text-blue-600 bg-ui-bg-field border-ui-border-base',
            'focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer',
            className
          )}
          {...props}
        />
        {(label || sublabel) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-medium text-ui-fg-base group-hover:text-ui-fg-subtle">
                {label}
              </span>
            )}
            {sublabel && (
              <span className="text-xs text-ui-fg-muted">{sublabel}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
