'use client';

import React, { useState } from 'react';
import { SlideConfig, SliderSettings, CategoryCarouselSettings, BrandCarouselSettings, MockCategory, MockBrand, HeaderSettings, MockProduct } from '../../types';
import { generateNextjsPageCode, generateCSSCode, generateJSCode, generateReadme } from '../../utils/codeGenerator';
import { Clipboard, Check, Download, FileCode, Folder, ChevronRight, FileText } from 'lucide-react';
import JSZip from 'jszip';

interface CodeViewerProps {
  slides: SlideConfig[];
  settings: SliderSettings;
  catSettings?: CategoryCarouselSettings;
  catList?: MockCategory[];
  brandSettings?: BrandCarouselSettings;
  brandList?: MockBrand[];
  headerSettings?: HeaderSettings;
  productList?: MockProduct[];
}

type FileTab = 'page' | 'client' | 'css' | 'readme';

export default function CodeViewer({ slides, settings, catSettings, catList, brandSettings, brandList, headerSettings, productList }: CodeViewerProps) {
  const [activeTab, setActiveTab] = useState<FileTab>('page');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const pageCode = generateNextjsPageCode(slides, settings, catSettings, catList, headerSettings, brandSettings, brandList, productList);
  const clientCode = generateJSCode();
  const cssCode = generateCSSCode(settings);
  const readmeText = generateReadme(slides, settings);

  const getCodeString = () => {
    switch (activeTab) {
      case 'page':
        return pageCode;
      case 'client':
        return clientCode;
      case 'css':
        return cssCode;
      case 'readme':
        return readmeText;
      default:
        return '';
    }
  };

  const getFileName = () => {
    switch (activeTab) {
      case 'page':
        return 'app/page.tsx';
      case 'client':
        return 'lib/catalog.ts';
      case 'css':
        return 'styles/globals.css';
      case 'readme':
        return 'README.md';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCodeString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      
      const appFolder = zip.folder('app');
      if (appFolder) {
        appFolder.file('page.tsx', pageCode);
      }

      const libFolder = zip.folder('lib');
      if (libFolder) {
        libFolder.file('catalog.ts', clientCode);
      }

      const stylesFolder = zip.folder('styles');
      if (stylesFolder) {
        stylesFolder.file('globals.css', cssCode);
      }

      zip.file('README.md', readmeText);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'nextjs-storefront.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error creating ZIP package: ', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-full min-h-[550px]">
      {/* File Tree Header */}
      <div className="bg-black/30 border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-slate-200 font-medium text-sm select-none">
          <Folder className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span>nextjs-storefront</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-300 font-mono font-normal">{getFileName()}</span>
        </div>

        {/* Action Button: Download ZIP */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-55 text-white font-medium text-xs transition duration-200 cursor-pointer shadow-lg shadow-emerald-500/10 border border-white/10"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isZipping ? 'Generating Package...' : 'Download Next.js .ZIP'}</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex bg-black/10 border-b border-white/10 text-xs overflow-x-auto select-none">
        <button
          onClick={() => { setActiveTab('page'); setCopied(false); }}
          className={`flex items-center space-x-1.5 px-4 py-3 border-r border-white/10 font-mono transition duration-150 cursor-pointer ${
            activeTab === 'page' ? 'bg-white/5 text-sky-400 font-semibold border-b-2 border-b-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-sky-400" />
          <span>app/page.tsx</span>
        </button>

        <button
          onClick={() => { setActiveTab('client'); setCopied(false); }}
          className={`flex items-center space-x-1.5 px-4 py-3 border-r border-white/10 font-mono transition duration-150 cursor-pointer ${
            activeTab === 'client' ? 'bg-white/5 text-amber-400 font-semibold border-b-2 border-b-amber-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span>lib/catalog.ts</span>
        </button>

        <button
          onClick={() => { setActiveTab('css'); setCopied(false); }}
          className={`flex items-center space-x-1.5 px-4 py-3 border-r border-white/10 font-mono transition duration-150 cursor-pointer ${
            activeTab === 'css' ? 'bg-white/5 text-teal-400 font-semibold border-b-2 border-b-teal-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-teal-400" />
          <span>styles/globals.css</span>
        </button>

        <button
          onClick={() => { setActiveTab('readme'); setCopied(false); }}
          className={`flex items-center space-x-1.5 px-4 py-3 border-r border-white/10 font-mono transition duration-150 cursor-pointer ${
            activeTab === 'readme' ? 'bg-white/5 text-slate-200 font-semibold border-b-2 border-b-slate-300' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>README.md</span>
        </button>
      </div>

      {/* Editor Panel Wrapper */}
      <div className="relative flex-1 flex flex-col bg-black/40">
        {/* Copy Button Floating */}
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-slate-100 transition duration-150 cursor-pointer z-10 shadow-md flex items-center gap-1 backdrop-blur-md"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Clipboard className="w-3.5 h-3.5" />
              <span className="text-[10px] text-slate-300 font-medium">Copy</span>
            </>
          )}
        </button>

        {/* Code Block Box */}
        <div className="flex-1 overflow-auto max-h-[550px] p-5 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
          <pre className="select-text whitespace-pre overflow-x-auto">
            <code>{getCodeString()}</code>
          </pre>
        </div>
      </div>

      {/* Code Status Footer */}
      <div className="bg-black/30 border-t border-white/10 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Build Status: <b className="text-slate-300 font-medium">Ready for Production</b></span>
        </div>
        <div>
          <span>Next.js 15 App Router Compatible</span>
        </div>
      </div>
    </div>
  );
}
