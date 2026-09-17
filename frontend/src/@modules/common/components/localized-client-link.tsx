import React from 'react';
import Link, { LinkProps } from 'next/link';
import { clx } from '@/lib/util/clx';

export interface LocalizedClientLinkProps extends LinkProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  title?: string;
}

export const LocalizedClientLink: React.FC<LocalizedClientLinkProps> = ({
  children,
  href,
  className,
  onClick,
  ...props
}) => {
  return (
    <Link
      href={href}
      className={clx('transition-colors duration-150', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LocalizedClientLink;
