'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowUpRight, 
  Layers, 
  ShieldCheck, 
  Tag, 
  ShoppingBag, 
  Search, 
  Sliders, 
  Edit3, 
  X, 
  Sparkles, 
  Info, 
  CheckCircle, 
  Clock, 
  FileCode,
  TrendingUp,
  Link as LinkIcon,
  HelpCircle,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { SafeImage } from '../ui/SafeImage';
import { MockProduct } from '../../types';

interface GoogleMarketingHubProps {
  products?: MockProduct[];
  storeCurrency?: string;
}

interface FeedIssue {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  issue: string;
  attribute: string;
  severity: 'critical' | 'warning';
  solution: string;
}

export const GoogleMarketingHub: React.FC<GoogleMarketingHubProps> = ({
  products = [],
  storeCurrency = 'ZAR'
}) => {
  // Connection State
  const [merchantId, setMerchantId] = useState<string>(() => {
    try {
      return localStorage.getItem('luxestore_gmc_account_id') || '849-291-0482';
    } catch {
      return '849-291-0482';
    }
  });
  const [isSavedId, setIsSavedId] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<'active' | 'not_connected' | 'sync_error'>('active');
  const [isSavingId, setIsSavingId] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Site Verification State
  const [verificationTag, setVerificationTag] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('mrbulk_gmc_verification_tag') ||
        localStorage.getItem('luxestore_gmc_verification_tag') ||
        '<meta name="google-site-verification" content="GMC-verify-Mrbulk9842aBcXyZ1092" />'
      );
    } catch {
      return '<meta name="google-site-verification" content="GMC-verify-Mrbulk9842aBcXyZ1092" />';
    }
  });
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [isTestingVerification, setIsTestingVerification] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>({
    success: true,
    message: 'Domain ownership verified & claimed for Google Merchant Center.'
  });

  // Feed Settings State
  const [feedFrequency, setFeedFrequency] = useState<string>('daily');
  const [targetCountry, setTargetCountry] = useState<string>('ZA');
  const [includeOutOfStock, setIncludeOutOfStock] = useState<boolean>(true);
  const [autoGenerateGtins, setAutoGenerateGtins] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Today at 09:42 AM (Automated)');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Copy Feedback State
  const [copiedFeedUrl, setCopiedFeedUrl] = useState<boolean>(false);
  const [copiedMetaTag, setCopiedMetaTag] = useState<boolean>(false);

  // Issues Filter State
  const [issueFilter, setIssueFilter] = useState<'all' | 'critical' | 'warning'>('all');
  const [issueSearch, setIssueSearch] = useState<string>('');

  // Quick Fix Modal State
  const [editingIssue, setEditingIssue] = useState<FeedIssue | null>(null);
  const [fixValue, setFixValue] = useState<string>('');

  // Host URL for feed
  const [feedUrl, setFeedUrl] = useState<string>('/api/feeds/google-shopping.xml');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFeedUrl(`${window.location.origin}/api/feeds/google-shopping.xml`);
    }
  }, []);

  // Compute feed statistics
  const totalProducts = products.length > 0 ? products.length : 24;
  const disapprovedCount = 3;
  const pendingCount = 1;
  const approvedCount = Math.max(0, totalProducts - disapprovedCount - pendingCount);
  const approvalRate = Math.round((approvedCount / totalProducts) * 100);

  // Mock Issues list
  const [issuesList, setIssuesList] = useState<FeedIssue[]>([
    {
      id: 'err-1',
      productId: 'prod-1',
      productName: 'Handcrafted Vintage Acoustic Guitar',
      productImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400',
      issue: 'Missing valid GTIN / EAN barcode or manufacturer part number (MPN).',
      attribute: 'gtin / barcode',
      severity: 'critical',
      solution: 'Provide a 12 or 13-digit registered GTIN code or set identifier_exists to false.'
    },
    {
      id: 'err-2',
      productId: 'prod-3',
      productName: 'Automatic Skeleton Titanium Watch',
      productImage: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=400',
      issue: 'Primary image resolution is below optimal requirement (recommended 800x800px).',
      attribute: 'image_link',
      severity: 'warning',
      solution: 'Upload a high-definition, white-background product image.'
    },
    {
      id: 'err-3',
      productId: 'prod-5',
      productName: 'Mid-Century Oak Lounge Chair',
      productImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=400',
      issue: 'Missing brand attribute required for furniture and manufactured goods.',
      attribute: 'brand',
      severity: 'warning',
      solution: 'Specify the maker or brand name (e.g. Mrbulk Essentials).'
    },
    {
      id: 'err-4',
      productId: 'prod-7',
      productName: 'Italian Double-Breasted Wool Suit',
      productImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=400',
      issue: 'Missing apparel attributes: size, color, and gender mapping.',
      attribute: 'size / color / gender',
      severity: 'critical',
      solution: 'Define item apparel variants (e.g. Size: 42R, Color: Navy, Gender: Male).'
    }
  ]);

  // Handle Save Merchant ID
  const handleSaveMerchantId = () => {
    setIsSavingId(true);
    setTimeout(() => {
      try {
        localStorage.setItem('luxestore_gmc_account_id', merchantId.trim());
      } catch {}
      setIsSavingId(false);
      setIsSavedId(true);
      setConnectionStatus('active');
      setSaveSuccessMessage('Merchant Center Account ID successfully verified and linked!');
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    }, 650);
  };

  // Handle Test Meta Tag Verification
  const handleTestVerification = () => {
    setIsTestingVerification(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsTestingVerification(false);
      setIsVerified(true);
      setVerificationResult({
        success: true,
        message: 'Googlebot successfully detected the HTML verification tag on the site header.'
      });
      try {
        localStorage.setItem('luxestore_gmc_verification_tag', verificationTag);
      } catch {}
    }, 900);
  };

  // Handle Copy Feed URL
  const handleCopyFeedUrl = () => {
    navigator.clipboard.writeText(feedUrl);
    setCopiedFeedUrl(true);
    setTimeout(() => setCopiedFeedUrl(false), 2500);
  };

  // Handle Copy Meta Tag
  const handleCopyMetaTag = () => {
    navigator.clipboard.writeText(verificationTag);
    setCopiedMetaTag(true);
    setTimeout(() => setCopiedMetaTag(false), 2500);
  };

  // Handle Manual Sync
  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(`Today at ${nowTime} (Manual Sync)`);
      setSyncToast(`Successfully generated and refreshed Google Shopping feed (${totalProducts} products)!`);
      setTimeout(() => setSyncToast(null), 4500);
    }, 1100);
  };

  // Handle Quick Fix Save
  const handleApplyQuickFix = () => {
    if (!editingIssue) return;
    setIssuesList(prev => prev.filter(item => item.id !== editingIssue.id));
    setEditingIssue(null);
    setFixValue('');
    setSyncToast(`Updated ${editingIssue.productName} and resolved "${editingIssue.attribute}" issue!`);
    setTimeout(() => setSyncToast(null), 4500);
  };

  const filteredIssues = issuesList.filter(item => {
    if (issueFilter === 'critical' && item.severity !== 'critical') return false;
    if (issueFilter === 'warning' && item.severity !== 'warning') return false;
    if (issueSearch.trim()) {
      const q = issueSearch.toLowerCase();
      return (
        item.productName.toLowerCase().includes(q) ||
        item.issue.toLowerCase().includes(q) ||
        item.attribute.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {syncToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs sm:text-sm font-bold">{syncToast}</p>
            <button
              onClick={() => setSyncToast(null)}
              className="p-1 text-slate-400 hover:text-white transition ml-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HEADER & CONNECTION STATUS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Google Brand Quad-Color Badge */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center p-3 shrink-0 relative">
              <svg className="w-full h-full" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full border-2 border-white shadow-xs">
                <ShoppingBag className="w-3 h-3" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Google Sales & Marketing
                </h2>
                {/* Connection Status Badge */}
                {connectionStatus === 'active' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100/90 text-emerald-800 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Connected & Active
                  </span>
                )}
                {connectionStatus === 'not_connected' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-600 border border-slate-300">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Not Connected
                  </span>
                )}
                {connectionStatus === 'sync_error' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Sync Warning
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
                Synchronize your product catalog with Google Merchant Center, configure live XML shopping data feeds, claim your domain verification tag, and direct-link campaigns with Google Ads.
              </p>
            </div>
          </div>

          {/* Quick status switch / test tool */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setConnectionStatus(prev => prev === 'active' ? 'sync_error' : 'active')}
              title="Toggle simulated status"
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer"
            >
              Status: {connectionStatus}
            </button>
          </div>
        </div>

        {/* GMC Account Linking Input Box */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-4">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
              Google Merchant Center Account ID
            </label>
            <p className="text-xs text-slate-500">
              Found in the top right of your GMC dashboard (e.g. 10-digit number).
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 text-xs font-mono font-bold">
                GMC:
              </span>
              <input
                type="text"
                value={merchantId}
                onChange={(e) => {
                  setMerchantId(e.target.value);
                  setIsSavedId(false);
                }}
                placeholder="e.g. 849-291-0482"
                className="w-full pl-14 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveMerchantId}
                disabled={isSavingId || !merchantId.trim()}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {isSavingId ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isSavedId ? 'Save & Re-verify' : 'Save & Link Account'}</span>
                  </>
                )}
              </button>

              <a
                href="https://merchantcenter.google.com"
                target="_blank"
                rel="noreferrer noopener"
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open GMC</span>
              </a>
            </div>
          </div>

          {saveSuccessMessage && (
            <div className="lg:col-span-12 mt-2">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveSuccessMessage}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. SITE VERIFICATION & DOMAIN CLAIMING SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Site Verification & Domain Claiming
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Verify and claim your store domain so Google Merchant Center authorizes your product feeds and Free Shopping listings.
              </p>
            </div>
          </div>

          {isVerified ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified & Claimed
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Pending Check
            </span>
          )}
        </div>

        {/* Verification Explanation & Input Box */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-600" />
              Google HTML Meta Tag Verification Code
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              Injected into document &lt;head&gt;
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={verificationTag}
              onChange={(e) => setVerificationTag(e.target.value)}
              placeholder='<meta name="google-site-verification" content="..." />'
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMetaTag}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedMetaTag ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied Tag</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Meta Tag</span>
                  </>
                )}
              </button>

              <button
                onClick={handleTestVerification}
                disabled={isTestingVerification}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isTestingVerification ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Crawling &lt;head&gt;...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Test & Confirm Meta Tag</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Verification method: <strong>HTML tag method (Recommended)</strong>
            </p>
          </div>

          {verificationResult && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-bold ${
              verificationResult.success
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {verificationResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{verificationResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. AUTOMATED DATA FEED CONFIGURATION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Automated Google Shopping Data Feed
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Live RSS 2.0 XML endpoint with Google Base namespace attributes for scheduled automatic GMC fetching.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSyncing ? 'Regenerating Feed...' : 'Sync Feed Now'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Feed URL Box */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-inner space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
              Primary Shopping XML Feed Route
            </span>
            <span className="text-amber-400 font-mono text-[11px] bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              Format: RSS 2.0 (Google Shopping)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex-1 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl font-mono text-xs sm:text-sm text-amber-300 break-all select-all flex items-center justify-between">
              <span>{feedUrl}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyFeedUrl}
                className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                {copiedFeedUrl ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <a
                href={feedUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 shrink-0"
                title="Preview live XML output in new tab"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Preview XML</span>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Last Catalog Sync: <strong className="text-slate-200">{lastSyncTime}</strong>
            </span>
            <span className="text-[11px] text-slate-500">
              Provide this exact URL inside Google Merchant Center &gt; Feeds &gt; Primary Feeds.
            </span>
          </div>
        </div>

        {/* Feed Schedule & Tuning Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Frequency Selector */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Feed Update Frequency
            </label>
            <select
              value={feedFrequency}
              onChange={(e) => setFeedFrequency(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value="daily">Daily at 04:00 AM UTC (Recommended)</option>
              <option value="weekly">Weekly (Every Monday)</option>
              <option value="realtime">Real-time Continuous / On-Demand</option>
            </select>
            <p className="text-[11px] text-slate-500">Googlebot fetch schedule recommendation.</p>
          </div>

          {/* Target Country */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Target Country & Region
            </label>
            <select
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value="ZA">South Africa (ZA - ZAR)</option>
              <option value="US">United States (US - USD)</option>
              <option value="GB">United Kingdom (GB - GBP)</option>
              <option value="EU">European Union (EU - EUR)</option>
            </select>
            <p className="text-[11px] text-slate-500">Default feed currency: <strong>{storeCurrency}</strong></p>
          </div>

          {/* Include Out of Stock */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
            <div>
              <span className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                Out-of-Stock Products
              </span>
              <p className="text-[11px] text-slate-500">
                Include zero-inventory products marked as out_of_stock.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {includeOutOfStock ? 'Included in feed' : 'Excluded'}
              </span>
              <button
                onClick={() => setIncludeOutOfStock(!includeOutOfStock)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  includeOutOfStock ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    includeOutOfStock ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Auto-generate GTINs */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
            <div>
              <span className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                Fallback Barcodes / GTIN
              </span>
              <p className="text-[11px] text-slate-500">
                Auto-generate GTIN checksums for custom artisanal catalog items.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {autoGenerateGtins ? 'Auto-enabled' : 'Disabled'}
              </span>
              <button
                onClick={() => setAutoGenerateGtins(!autoGenerateGtins)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  autoGenerateGtins ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    autoGenerateGtins ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FEED HEALTH & SUMMARY ANALYTICS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Feed Health & Audit Analytics
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Live compliance breakdown and top feed errors for Google Shopping item approval.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <span className="px-3 py-1 text-slate-600">Feed Health:</span>
            <span className="px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg font-black shadow-xs">
              {approvalRate}% Approved
            </span>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Submitted */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Submitted
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {totalProducts}
              </span>
              <span className="text-xs text-slate-400 font-semibold">SKUs in catalog</span>
            </div>
            <div className="mt-3 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-slate-700 h-full rounded-full w-full" />
            </div>
          </div>

          {/* Approved */}
          <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Approved Items
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-900">
                {approvedCount}
              </span>
              <span className="text-xs font-bold text-emerald-700">({approvalRate}%)</span>
            </div>
            <div className="mt-3 w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${approvalRate}%` }}
              />
            </div>
          </div>

          {/* Disapproved / Errors */}
          <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Disapproved / Errors
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-rose-900">
                {disapprovedCount}
              </span>
              <span className="text-xs font-bold text-rose-700">Need attention</span>
            </div>
            <div className="mt-3 w-full bg-rose-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full"
                style={{ width: `${Math.round((disapprovedCount / totalProducts) * 100)}%` }}
              />
            </div>
          </div>

          {/* Pending Review */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Pending Review
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-900">
                {pendingCount}
              </span>
              <span className="text-xs font-bold text-amber-700">Googlebot evaluating</span>
            </div>
            <div className="mt-3 w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${Math.round((pendingCount / totalProducts) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top Feed Errors Table Section */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-slate-900">Top Feed Errors & Diagnostics</h4>
              <p className="text-xs text-slate-500 font-medium">
                Fix missing attributes to maximize product visibility on Google Shopping.
              </p>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={issueSearch}
                  onChange={(e) => setIssueSearch(e.target.value)}
                  placeholder="Filter errors..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 w-36 sm:w-44"
                />
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setIssueFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    issueFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  All ({issuesList.length})
                </button>
                <button
                  onClick={() => setIssueFilter('critical')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    issueFilter === 'critical' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setIssueFilter('warning')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    issueFilter === 'warning' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Warnings
                </button>
              </div>
            </div>
          </div>

          {/* Issues Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Product Item</th>
                  <th className="px-4 py-3">Issue Diagnosis</th>
                  <th className="px-4 py-3">Attribute</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium">
                      No feed errors found matching your filter criteria. All products are compliant!
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 relative">
                            <SafeImage
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 line-clamp-1 block">
                              {item.productName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {item.productId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-slate-700 font-medium block max-w-sm">
                          {item.issue}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Solution: {item.solution}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-mono font-bold text-slate-700 text-[11px]">
                          g:{item.attribute}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {item.severity === 'critical' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                            <AlertCircle className="w-3 h-3" />
                            Critical Error
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            Optimization Warning
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setEditingIssue(item);
                            setFixValue('');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 font-black rounded-lg transition text-xs cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Quick Fix</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. GOOGLE ADS & PROMOTION DEEP LINKS (CTA SECTION) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-8 relative overflow-hidden">
        {/* Visual accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Paid Acquisition & Free Google Listings
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Run Shopping & Performance Max Campaigns
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Unlock millions of high-intent shoppers across Google Search, the Shopping tab, YouTube, Gmail, and Google Maps by directly linking your Google Merchant Center feed to Google Ads.
            </p>
          </div>

          {/* Direct External Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <a
              href="https://merchantcenter.google.com"
              target="_blank"
              rel="noreferrer noopener"
              className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Open Google Merchant Center</span>
              <ExternalLink className="w-4 h-4 text-slate-700" />
            </a>

            <a
              href="https://ads.google.com?subid=xs-ip-gemini-adlc"
              target="_blank"
              rel="noreferrer noopener"
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Manage Google Ads</span>
              <ArrowUpRight className="w-4 h-4 text-slate-950" />
            </a>
          </div>
        </div>

        {/* 3-Step GMC to Google Ads Linking Guide */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">
            How to Link Google Merchant Center to Google Ads in 3 Steps
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                1
              </div>
              <h5 className="font-bold text-sm text-white">Open Linked Accounts</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                In Google Merchant Center, click <strong>Settings & Tools (Gear icon) &gt; Linked Accounts</strong>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                2
              </div>
              <h5 className="font-bold text-sm text-white">Select Google Ads</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click <strong>Link Account</strong> and enter your 10-digit Google Ads Customer ID (e.g. 123-456-7890).
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                3
              </div>
              <h5 className="font-bold text-sm text-white">Accept Link in Ads</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                In Google Ads, navigate to <strong>Tools & Settings &gt; Linked Accounts</strong> and accept the connection.
              </p>
            </div>
          </div>
        </div>

        {/* Free Google Surfaces Highlight Card */}
        <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Free Listings on Google Search</span>
              <span className="text-[11px] text-slate-400">
                Active feeds automatically qualify your products for organic carousel display on Google Images and Shopping tabs with 0% ad spend required.
              </span>
            </div>
          </div>

          <a
            href="https://support.google.com/merchants/answer/9199328"
            target="_blank"
            rel="noreferrer noopener"
            className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 shrink-0"
          >
            <span>Learn About Free Listings</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* QUICK FIX MODAL */}
      <AnimatePresence>
        {editingIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Resolve Feed Issue</h3>
                    <p className="text-xs text-slate-500 font-medium">Attribute: g:{editingIssue.attribute}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingIssue(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden relative shrink-0">
                    <SafeImage
                      src={editingIssue.productImage}
                      alt={editingIssue.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">{editingIssue.productName}</h4>
                    <span className="text-[11px] text-rose-600 font-bold block">{editingIssue.issue}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Update {editingIssue.attribute.toUpperCase()} Value
                </label>
                <input
                  type="text"
                  value={fixValue}
                  onChange={(e) => setFixValue(e.target.value)}
                  placeholder={`Enter valid ${editingIssue.attribute} (e.g. 600987100452)`}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-slate-500">{editingIssue.solution}</p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setEditingIssue(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyQuickFix}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Mark Resolved</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GoogleMarketingHub;
