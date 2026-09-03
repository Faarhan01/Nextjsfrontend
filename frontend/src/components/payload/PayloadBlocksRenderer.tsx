'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, Award, Star, Quote, HelpCircle, Info, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
import { PayloadPageBlock } from '../../types/payload';
import { PayloadRichText } from './PayloadRichText';

interface PayloadBlocksRendererProps {
  blocks: PayloadPageBlock[];
  className?: string;
  onNavigate?: (path: string) => void;
}

export function PayloadBlocksRenderer({ blocks, className = '', onNavigate }: PayloadBlocksRendererProps) {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'truck': return <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'shield': return <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'return': case 'rotateccw': return <RotateCcw className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'award': return <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default: return <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const handleClick = (e: React.MouseEvent, link: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(link);
    }
  };

  return (
    <div className={`space-y-12 ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.blockType) {
          case 'hero':
            return (
              <section key={idx} className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 md:p-16 shadow-2xl border border-slate-800/80">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-indigo-950/50 to-slate-950/80 pointer-events-none" />
                <div className="relative z-10 max-w-2xl space-y-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> {block.badgeText || 'Payload CMS 3.88 E-Commerce'}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                    {block.heading}
                  </h1>
                  <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                    {block.subheading}
                  </p>
                  <div className="pt-2">
                    <a
                      href={block.buttonLink}
                      onClick={(e) => handleClick(e, block.buttonLink)}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <span>{block.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </section>
            );

          case 'features':
            return (
              <section key={idx} className="py-4">
                {block.title && (
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {block.title}
                    </h2>
                    {block.subtitle && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {block.subtitle}
                      </p>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {block.items.map((it, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-md transition-all space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {getIcon(it.icon)}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {it.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {it.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'banner':
            return (
              <section key={idx} className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-blue-800/40">
                <div className="space-y-1.5 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xl font-bold">{block.title}</h3>
                  </div>
                  <p className="text-sm text-slate-300 max-w-xl">{block.subtitle}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {block.code && (
                    <span className="font-mono text-sm px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 font-bold tracking-widest text-amber-300">
                      {block.code}
                    </span>
                  )}
                  <a
                    href={block.linkUrl}
                    onClick={(e) => handleClick(e, block.linkUrl)}
                    className="px-5 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 transition-all shadow-md"
                  >
                    Explore Now
                  </a>
                </div>
              </section>
            );

          case 'testimonials':
            return (
              <section key={idx} className="py-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                  {block.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {block.items.map((t, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: t.rating }).map((_, r) => (
                          <Star key={r} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm italic text-slate-700 dark:text-slate-300 leading-relaxed relative">
                        <Quote className="w-6 h-6 text-slate-300 dark:text-slate-700 inline-block mr-1 opacity-50" />
                        "{t.quote}"
                      </p>
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {t.avatar ? (
                          <img src={t.avatar} alt={t.author} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            {t.author.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{t.author}</div>
                          <div className="text-[11px] text-slate-500">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'cta':
            return (
              <section key={idx} className="p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-center space-y-4 max-w-4xl mx-auto shadow-sm">
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{block.title}</h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{block.description}</p>
                <div className="flex items-center justify-center gap-4 pt-3">
                  <a
                    href={block.primaryBtn.link}
                    onClick={(e) => handleClick(e, block.primaryBtn.link)}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-md hover:scale-105"
                  >
                    {block.primaryBtn.text}
                  </a>
                  {block.secondaryBtn && (
                    <a
                      href={block.secondaryBtn.link}
                      onClick={(e) => handleClick(e, block.secondaryBtn.link)}
                      className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      {block.secondaryBtn.text}
                    </a>
                  )}
                </div>
              </section>
            );

          case 'callout':
            return (
              <section key={idx} className={`p-5 rounded-2xl border flex items-start gap-4 ${
                block.theme === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                  : block.theme === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                  : block.theme === 'danger'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200'
              }`}>
                <div className="shrink-0 mt-0.5">
                  {block.theme === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                  {block.theme === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {block.theme === 'danger' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                  {(!block.theme || block.theme === 'info') && <Info className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="space-y-1 text-sm">
                  {block.title && <h4 className="font-bold">{block.title}</h4>}
                  <p className="leading-relaxed opacity-90">{block.message}</p>
                </div>
              </section>
            );

          case 'faq':
            return (
              <section key={idx} className="py-6 max-w-4xl mx-auto space-y-6">
                {(block.title || block.subtitle) && (
                  <div className="text-center space-y-2">
                    {block.title && <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                      <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      {block.title}
                    </h2>}
                    {block.subtitle && <p className="text-sm text-slate-600 dark:text-slate-400">{block.subtitle}</p>}
                  </div>
                )}
                <div className="space-y-3">
                  {block.items.map((item, i) => (
                    <details key={i} className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all [&_svg]:open:-rotate-180">
                      <summary className="flex items-center justify-between cursor-pointer font-semibold text-sm text-slate-900 dark:text-white list-none">
                        <span>{item.question}</span>
                        <ChevronDown className="w-4 h-4 text-slate-500 transition-transform duration-200" />
                      </summary>
                      <p className="mt-3 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            );

          case 'richText':
            return (
              <section key={idx} className="py-4 max-w-4xl mx-auto">
                <PayloadRichText content={block.content} />
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
