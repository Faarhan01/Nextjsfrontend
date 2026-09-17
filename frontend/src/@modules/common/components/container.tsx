import React from 'react';
import { clx } from '@/lib/util/clx';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'elevated' | 'subtle';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  variant = 'base',
  className,
  ...props
}) => {
  return (
    <div
      className={clx(
        'card-base p-4 sm:p-6 lg:p-8',
        variant === 'base' && 'card-base',
        variant === 'elevated' && 'card-elevated',
        variant === 'subtle' && 'card-subtle',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
