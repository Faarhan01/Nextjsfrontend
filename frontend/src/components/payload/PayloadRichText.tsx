'use client';

import React from 'react';
import { LexicalRoot, LexicalNode } from '../../types/payload';

interface PayloadRichTextProps {
  content?: LexicalRoot | string | any;
  className?: string;
}

export const PayloadRichText: React.FC<PayloadRichTextProps> = ({ content, className = '' }) => {
  if (!content) return null;

  if (typeof content === 'string') {
    return (
      <div 
        className={`prose max-w-none text-neutral-700 dark:text-neutral-300 leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // If Lexical Root structure
  const rootNode = content.root || content;
  const children: LexicalNode[] = rootNode.children || [];

  const renderNode = (node: LexicalNode, index: number): React.ReactNode => {
    if (!node) return null;

    // Plain text leaf node
    if (node.type === 'text') {
      let textElement: React.ReactNode = node.text || '';
      const format = typeof node.format === 'number' ? node.format : 0;
      
      // Lexical format bitmask: 1 = bold, 2 = italic, 8 = underline, 16 = strikethrough, 32 = code
      if (format & 1) textElement = <strong key={`b-${index}`}>{textElement}</strong>;
      if (format & 2) textElement = <em key={`i-${index}`}>{textElement}</em>;
      if (format & 8) textElement = <span key={`u-${index}`} className="underline">{textElement}</span>;
      if (format & 16) textElement = <span key={`s-${index}`} className="line-through">{textElement}</span>;
      if (format & 32) textElement = <code key={`c-${index}`} className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-mono">{textElement}</code>;

      return <React.Fragment key={index}>{textElement}</React.Fragment>;
    }

    // Paragraph node
    if (node.type === 'paragraph') {
      return (
        <p key={index} className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
          {node.children ? node.children.map((child, i) => renderNode(child, i)) : null}
        </p>
      );
    }

    // Heading nodes
    if (node.type === 'heading') {
      const tag = node.tag || 'h2';
      const headingClasses: Record<string, string> = {
        h1: 'text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mt-8 mb-4',
        h2: 'text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-6 mb-3',
        h3: 'text-xl font-medium text-neutral-900 dark:text-white mt-5 mb-2',
        h4: 'text-lg font-medium text-neutral-800 dark:text-neutral-200 mt-4 mb-2',
      };
      const cls = headingClasses[tag] || headingClasses.h2;

      const childrenContent = node.children ? node.children.map((child, i) => renderNode(child, i)) : null;

      if (tag === 'h1') return <h1 key={index} className={cls}>{childrenContent}</h1>;
      if (tag === 'h3') return <h3 key={index} className={cls}>{childrenContent}</h3>;
      if (tag === 'h4') return <h4 key={index} className={cls}>{childrenContent}</h4>;
      return <h2 key={index} className={cls}>{childrenContent}</h2>;
    }

    // List nodes
    if (node.type === 'list') {
      const isOrdered = node.tag === 'ol' || node.listType === 'number';
      const ListTag = isOrdered ? 'ol' : 'ul';
      return (
        <ListTag key={index} className={`mb-4 pl-6 space-y-1.5 ${isOrdered ? 'list-decimal' : 'list-disc'} text-neutral-700 dark:text-neutral-300`}>
          {node.children ? node.children.map((child, i) => renderNode(child, i)) : null}
        </ListTag>
      );
    }

    // List item node
    if (node.type === 'listitem') {
      return (
        <li key={index} className="leading-relaxed">
          {node.children ? node.children.map((child, i) => renderNode(child, i)) : null}
        </li>
      );
    }

    // Quote node
    if (node.type === 'quote') {
      return (
        <blockquote key={index} className="border-l-4 border-amber-500 pl-4 py-1 italic my-4 text-neutral-600 dark:text-neutral-400 bg-amber-50/50 dark:bg-amber-950/20 rounded-r-md">
          {node.children ? node.children.map((child, i) => renderNode(child, i)) : null}
        </blockquote>
      );
    }

    // Link node
    if (node.type === 'link') {
      return (
        <a 
          key={index} 
          href={node.url || '#'} 
          target={node.target || '_self'} 
          rel={node.rel || 'noreferrer'}
          className="text-amber-600 hover:text-amber-700 dark:text-amber-400 underline underline-offset-2 transition-colors"
        >
          {node.children ? node.children.map((child, i) => renderNode(child, i)) : node.url}
        </a>
      );
    }

    // Default fallback container
    if (node.children && node.children.length > 0) {
      return (
        <div key={index}>
          {node.children.map((child, i) => renderNode(child, i))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`payload-lexical-content ${className}`}>
      {children.map((child, i) => renderNode(child, i))}
    </div>
  );
};
