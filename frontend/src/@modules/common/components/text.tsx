import React from 'react';
import { clx } from '@/lib/util/clx';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xsmall' | 'small' | 'base' | 'large' | 'xlarge';
  weight?: 'regular' | 'plus';
  as?: 'p' | 'span' | 'div';
}

export const Text: React.FC<TextProps> = ({
  children,
  size = 'base',
  weight = 'regular',
  as: Component = 'p',
  className,
  ...props
}) => {
  return (
    <Component
      className={clx(
        'text-ui-fg-subtle',
        size === 'xsmall' && (weight === 'plus' ? 'txt-compact-xsmall font-semibold' : 'txt-compact-xsmall'),
        size === 'small' && (weight === 'plus' ? 'txt-compact-small-plus' : 'txt-compact-small'),
        size === 'base' && (weight === 'plus' ? 'txt-compact-medium-plus' : 'txt-compact-medium'),
        size === 'large' && (weight === 'plus' ? 'txt-compact-large-plus' : 'txt-compact-large'),
        size === 'xlarge' && (weight === 'plus' ? 'txt-compact-xlarge-plus' : 'txt-compact-xlarge'),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
