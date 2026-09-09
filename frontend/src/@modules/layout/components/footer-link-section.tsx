'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface FooterLinkSectionProps {
  title: string;
  icon: LucideIcon;
  iconClassName: string;
  links: Array<{
    href: string;
    label: string;
    badge?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
  }>;
}

export const FooterLinkSection: React.FC<FooterLinkSectionProps> = ({
  title,
  icon: Icon,
  iconClassName,
  links,
}) => {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-1.5">
        <Icon className={`w-3 h-3 ${iconClassName}`} />
        <span>{title}</span>
      </h4>
      <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              onClick={link.onClick}
              className={`hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200 group ${link.className || ''}`}
            >
              <span className="flex items-center justify-between w-full">
                <span className="group-hover:text-slate-900 dark:group-hover:text-white">{link.label}</span>
                {link.badge}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
