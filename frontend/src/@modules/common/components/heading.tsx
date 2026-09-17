import React from 'react';
import { clx } from '@/lib/util/clx';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 'h2',
  as,
  className,
  ...props
}) => {
  const Component = as || level;

  return (
    <Component
      className={clx(
        'font-bold tracking-tight text-ui-fg-base',
        level === 'h1' && 'text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight',
        level === 'h2' && 'text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight',
        level === 'h3' && 'text-lg sm:text-xl font-bold',
        level === 'h4' && 'text-base sm:text-lg font-semibold',
        level === 'h5' && 'text-sm sm:text-base font-semibold',
        level === 'h6' && 'text-xs sm:text-sm font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Heading;
