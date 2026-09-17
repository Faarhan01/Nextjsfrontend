import React from 'react';
import { clx } from '@/lib/util/clx';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  variant?: 'default' | 'subtle' | 'strong';
}

export const Divider: React.FC<DividerProps> = ({
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <hr
      className={clx(
        'border-0 w-full my-6',
        variant === 'default' && 'border-t border-ui-border-base',
        variant === 'subtle' && 'border-t border-ui-border-subtle',
        variant === 'strong' && 'border-t border-ui-border-strong',
        className
      )}
      {...props}
    />
  );
};

export default Divider;
