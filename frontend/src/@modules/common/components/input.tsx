import React, { forwardRef } from 'react';
import { clx } from '@/lib/util/clx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  topLabel?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, topLabel, error, className, id, type = 'text', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-y-1.5">
        {(label || topLabel) && (
          <label
            htmlFor={inputId}
            className="form-label text-xs font-semibold text-ui-fg-base select-none"
          >
            {topLabel || label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={clx(
              'w-full px-3.5 py-2 text-sm bg-ui-bg-field text-ui-fg-base border border-ui-border-base rounded-md',
              'transition-all duration-150 outline-none',
              'placeholder:text-ui-fg-muted',
              'hover:border-ui-border-strong',
              'focus:border-ui-border-base focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-rose-500 font-medium">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
