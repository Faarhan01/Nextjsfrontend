'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  Eye, 
  ShoppingCart, 
  CreditCard, 
  ShieldCheck, 
  Play, 
  Trash2, 
  Layers, 
  Code2, 
  Activity, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  HelpCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';
import { 
  getStoredGtmId, 
  setStoredGtmId, 
  getStoredGa4Id, 
  setStoredGa4Id, 
  initGTM, 
  pushToDataLayer, 
  trackViewItem, 
  trackAddToCart, 
  trackBeginCheckout, 
  trackPurchase,
  subscribeToDataLayer,
  getDataLayerLogs,
  clearDataLayerLogs,
  DataLayerLogEntry
} from '../../utils/gtm';
import { MockProduct } from '../../types';

interface GoogleAnalyticsHubProps {
  products: MockProduct[];
  storeCurrency: string;
  showToast?: (msg: string) => void;
}

export function GoogleAnalyticsHub({
  products,
  storeCurrency,
  showToast = (msg: string) => alert(msg)
}: GoogleAnalyticsHubProps) {
  // Config state
  const [gtmId, setGtmId] = useState('');
  const [ga4Id, setGa4Id] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'success' | 'warning' | 'error';
    message: string;
    details: {
      dataLayerExists: boolean;
      headScriptInjected: boolean;
      bodyIframeInjected: boolean;
      activeGtmId: string;
    };
  }>({
    status: 'idle',
    message: '',
    details: {
      dataLayerExists: false,
      headScriptInjected: false,
      bodyIframeInjected: false,
      activeGtmId: ''
    }
  });

  // DataLayer Live Stream State
  const [liveLogs, setLiveLogs] = useState<DataLayerLogEntry[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [activeSimulatorEvent, setActiveSimulatorEvent] = useState<'view_item' | 'add_to_cart' | 'begin_checkout' | 'purchase'>('view_item');
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0);
  const [activeDocsTab, setActiveDocsTab] = useState<'schema' | 'snippets' | 'setup'>('schema');

  // Load initial settings on mount
  useEffect(() => {
    const currentGtm = getStoredGtmId();
    const currentGa4 = getStoredGa4Id();
    setGtmId(currentGtm);
    setGa4Id(currentGa4);
    setLiveLogs(getDataLayerLogs());

    // Perform initial passive check
    verifyInstallation(false);

    // Subscribe to live DataLayer pushes
    const unsubscribe = subscribeToDataLayer((entry) => {
      setLiveLogs((prev) => [entry, ...prev].slice(0, 40));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveGtmId = () => {
    const cleanId = gtmId.trim().toUpperCase();
    if (cleanId && !cleanId.startsWith('GTM-')) {
      showToast('Warning: Google Tag Manager ID should begin with "GTM-"');
    }
    setStoredGtmId(cleanId);
    setStoredGa4Id(ga4Id);
    showToast(`Saved GTM ID: ${cleanId || '(Disabled)'}`);
    verifyInstallation(true);
  };

  const verifyInstallation = (showSuccessToast = true) => {
    setIsVerifying(true);
    setTimeout(() => {
      if (typeof window === 'undefined') {
        setIsVerifying(false);
        return;
      }

      const scriptEl = document.getElementById('gtm-script-tag');
      const noscriptEl = document.getElementById('gtm-noscript-tag');
      const hasDataLayer = Array.isArray((window as any).dataLayer);
      const activeScriptId = scriptEl?.getAttribute('data-gtm-id') || '';

      const isInstalled = !!scriptEl && hasDataLayer;
      
      const result = {
        status: (isInstalled ? 'success' : gtmId ? 'warning' : 'idle') as 'idle' | 'success' | 'warning' | 'error',
        message: isInstalled 
          ? `GTM is active and tracking live on this storefront with container ${activeScriptId || gtmId}.`
          : gtmId 
          ? 'GTM Container ID is saved. Script will initialize upon saving and loading pages.'
          : 'Google Tag Manager ID has not been set yet. Enter your GTM container ID below.',
        details: {
          dataLayerExists: hasDataLayer,
          headScriptInjected: !!scriptEl,
          bodyIframeInjected: !!noscriptEl,
          activeGtmId: activeScriptId || gtmId
        }
      };

      setVerificationResult(result);
      setIsVerifying(false);

      if (showSuccessToast && isInstalled) {
        showToast('Google Tag Manager installation verified successfully!');
      }
    }, 450);
  };

  // Trigger test simulator events
  const handleFireTestEvent = (eventName: 'view_item' | 'add_to_cart' | 'begin_checkout' | 'purchase') => {
    const product = products[selectedProductIndex] || products[0] || {
      id: 'prod-1',
      name: 'Premium Leather Watch',
      price: '249.00',
      category: 'Accessories',
      brand: 'Mrbulk'
    };

    const currencyCode = storeCurrency.replace(/[^A-Z]/g, '') || 'ZAR';

    if (eventName === 'view_item') {
      trackViewItem(product, currencyCode);
      showToast(`Triggered test "view_item" event for ${product.name}`);
    } else if (eventName === 'add_to_cart') {
      trackAddToCart(product, 1, currencyCode);
      showToast(`Triggered test "add_to_cart" event for ${product.name}`);
    } else if (eventName === 'begin_checkout') {
      trackBeginCheckout(
        [
          {
            id: product.id,
            name: product.name,
            price: product.price || 99,
            quantity: 1,
            category: product.category,
            brand: product.brand
          }
        ],
        typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, '') || '99'),
        currencyCode,
        'LUXE20'
      );
      showToast('Triggered test "begin_checkout" event with sample cart');
    } else if (eventName === 'purchase') {
      const testOrderId = `TEST-ORD-${Date.now().toString().slice(-5)}`;
      const priceVal = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, '') || '99');
      
      const success = trackPurchase({
        transaction_id: testOrderId,
        value: priceVal + 15,
        currency: currencyCode,
        tax: Number((priceVal * 0.15).toFixed(2)),
        shipping: 15.00,
        coupon: 'LUXE20',
        items: [
          {
            id: product.id,
            name: product.name,
            price: priceVal,
            quantity: 1,
            category: product.category,
            brand: product.brand
          }
        ]
      });

      if (success) {
        showToast(`Triggered test "purchase" event for order #${testOrderId}`);
      } else {
        showToast(`Purchase event suppressed (duplicate order ID)`);
      }
    }
  };

  const currentSampleProduct = products[selectedProductIndex] || products[0];

  const headSnippetCode = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId || 'GTM-XXXXXXX'}');</script>
<!-- End Google Tag Manager -->`;

  const bodySnippetCode = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId || 'GTM-XXXXXXX'}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. TOP HEADER & CONNECTION BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Google Analytics 4 & GTM Architecture
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Google Analytics 4 & Tag Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Full-funnel GA4 E-commerce tracking powered by clean <code className="text-amber-300 font-mono font-bold">window.dataLayer</code> events, standard schema architecture, automatic script injection, and purchase deduplication.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GTM Container</span>
              <span className="text-xs font-mono font-black text-white">
                {gtmId || 'Not Configured'}
              </span>
            </div>
          </div>

          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" /> Open GA4 Console
          </a>
        </div>
      </div>

      {/* 2. MAIN CONFIGURATION & VERIFICATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: GTM & GA4 Credentials */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Tag Manager Configuration</h3>
                  <p className="text-xs text-slate-400">Save container IDs to activate tracking scripts across all pages.</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1.5 ${
                verificationResult.status === 'success'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${verificationResult.status === 'success' ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                {verificationResult.status === 'success' ? 'Active' : 'Setup Required'}
              </span>
            </div>

            <div className="space-y-4">
              {/* GTM ID Input */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Google Tag Manager ID *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={gtmId}
                    onChange={(e) => setGtmId(e.target.value.toUpperCase())}
                    placeholder="e.g. GTM-XXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition uppercase placeholder:text-slate-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 font-bold">
                    Head & Body Injection
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Located in your Google Tag Manager workspace top navigation (e.g. <strong className="font-mono text-slate-700">GTM-LX84920</strong>).
                </p>
              </div>

              {/* GA4 Measurement ID (Optional Direct ID) */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  GA4 Measurement ID (Optional Direct Reference)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ga4Id}
                    onChange={(e) => setGa4Id(e.target.value.toUpperCase())}
                    placeholder="e.g. G-XXXXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition uppercase placeholder:text-slate-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 font-bold">
                    Web Data Stream
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Found in Google Analytics 4 &gt; Admin &gt; Data Streams &gt; Web Stream Details.
                </p>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveGtmId}
                  className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Tag Manager ID
                </button>

                <button
                  type="button"
                  onClick={() => verifyInstallation(true)}
                  disabled={isVerifying}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>Verify Status</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Box */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                System Tracking Diagnostics:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                  {verificationResult.details.dataLayerExists ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px]">DataLayer</span>
                    <span className="text-[10px] text-slate-500">
                      {verificationResult.details.dataLayerExists ? 'Active' : 'Uninitialized'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                  {verificationResult.details.headScriptInjected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px]">&lt;head&gt; Tag</span>
                    <span className="text-[10px] text-slate-500">
                      {verificationResult.details.headScriptInjected ? 'Injected' : 'Pending Save'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                  {verificationResult.details.bodyIframeInjected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px]">&lt;body&gt; iFrame</span>
                    <span className="text-[10px] text-slate-500">
                      {verificationResult.details.bodyIframeInjected ? 'Active' : 'Pending Save'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Official GTM Code Snippet Inspector */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Injected Script Snippets</h3>
                  <p className="text-xs text-slate-400">Automated head script and body noscript fallback code.</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveDocsTab('snippets')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeDocsTab === 'snippets' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Snippets
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDocsTab('setup')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeDocsTab === 'setup' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  GTM Setup Guide
                </button>
              </div>
            </div>

            {activeDocsTab === 'snippets' ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-blue-600" /> Header Script (Injected as high as possible in &lt;head&gt;)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(headSnippetCode, 'head')}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'head' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'head' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl text-[10.5px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                    {headSnippetCode}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" /> Body Fallback (Injected immediately after opening &lt;body&gt;)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bodySnippetCode, 'body')}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'body' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'body' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl text-[10.5px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                    {bodySnippetCode}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Connecting GTM to GA4 in 3 Easy Steps:
                </div>
                <ol className="list-decimal pl-4 space-y-2 text-[11.5px]">
                  <li>
                    <strong>Open Google Tag Manager:</strong> Create a new tag of type <span className="font-semibold text-slate-800">"Google Analytics: GA4 Configuration"</span> and enter your Measurement ID (<span className="font-mono text-blue-600">{ga4Id || 'G-XXXXXXXXXX'}</span>).
                  </li>
                  <li>
                    <strong>Create GA4 Event Tag:</strong> Add a tag of type <span className="font-semibold text-slate-800">"Google Analytics: GA4 Event"</span> with Event Name set to <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-amber-700">{'{{Event}}'}</code> and check "Send Ecommerce data" (Data Layer source).
                  </li>
                  <li>
                    <strong>Add Custom Event Trigger:</strong> Create a Trigger with type "Custom Event" and Event name regex matching: <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-blue-700">view_item|add_to_cart|begin_checkout|purchase</code>.
                  </li>
                </ol>
                <div className="pt-1">
                  <a
                    href="https://tagmanager.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-800 underline"
                  >
                    Open Tag Manager Workspace <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. GA4 E-COMMERCE STANDARD DATA LAYER SCHEMA & EVENT REFERENCE */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Standard GA4 E-commerce Event Architecture</h3>
              <p className="text-xs text-slate-400">Strictly implemented dataLayer pushes compliant with Google Analytics 4 schema.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold flex items-center gap-1.5 border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Purchase Deduplication Active
            </span>
          </div>
        </div>

        {/* 4 Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. view_item */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  PDP View
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 font-mono">view_item</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-1">
                Fires automatically whenever a customer lands on a Product Detail Page (PDP) or opens a quick view.
              </p>
            </div>
            <div className="text-[10px] text-slate-600 font-mono bg-white p-2 rounded-xl border border-slate-200">
              Payload: <strong className="text-slate-800">currency, value, items[]</strong>
            </div>
          </div>

          {/* 2. add_to_cart */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                  Cart Add
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 font-mono">add_to_cart</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-1">
                Fires when a customer adds any product to their basket with quantity and formatted prices.
              </p>
            </div>
            <div className="text-[10px] text-slate-600 font-mono bg-white p-2 rounded-xl border border-slate-200">
              Payload: <strong className="text-slate-800">currency, value, items[] (qty)</strong>
            </div>
          </div>

          {/* 3. begin_checkout */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  Checkout Flow
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 font-mono">begin_checkout</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-1">
                Fires when a customer enters the checkout funnel with cart contents, applied coupons, and subtotal.
              </p>
            </div>
            <div className="text-[10px] text-slate-600 font-mono bg-white p-2 rounded-xl border border-slate-200">
              Payload: <strong className="text-slate-800">currency, value, coupon, items[]</strong>
            </div>
          </div>

          {/* 4. purchase */}
          <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/40 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  Conversion
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 font-mono">purchase</h4>
              <p className="text-[11px] text-slate-600 leading-normal mt-1">
                Fires on Order Success. Deduplicated so page refreshes never inflate sales or duplicate conversions.
              </p>
            </div>
            <div className="text-[10px] text-emerald-900 font-mono bg-white p-2 rounded-xl border border-emerald-200">
              Payload: <strong className="text-slate-900">transaction_id, value, tax, shipping, items[]</strong>
            </div>
          </div>

        </div>
      </div>

      {/* 4. LIVE DATALAYER INSPECTOR & EVENT SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 cols: Live Event Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Event Simulator & Debugger</h3>
                <p className="text-xs text-slate-400">Trigger test GA4 events and verify dataLayer output.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Select Store Product for Simulation</label>
                <select
                  value={selectedProductIndex}
                  onChange={(e) => setSelectedProductIndex(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  {products.slice(0, 15).map((p: any, idx: number) => {
                    const priceLabel = typeof p.price === 'number' ? `R${p.price.toFixed(2)}` : (p.price || p.retailPrice || '');
                    return (
                      <option key={p.id} value={idx}>
                        {p.name} — {priceLabel} ({p.category || 'General'})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block mb-1">Select Event to Fire:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFireTestEvent('view_item')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition cursor-pointer flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-extrabold text-slate-900 block font-mono text-[11px]">view_item</span>
                      <span className="text-[10px] text-slate-400">PDP View</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFireTestEvent('add_to_cart')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition cursor-pointer flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-extrabold text-slate-900 block font-mono text-[11px]">add_to_cart</span>
                      <span className="text-[10px] text-slate-400">Cart Add</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFireTestEvent('begin_checkout')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition cursor-pointer flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-extrabold text-slate-900 block font-mono text-[11px]">begin_checkout</span>
                      <span className="text-[10px] text-slate-400">Enter Checkout</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFireTestEvent('purchase')}
                    className="p-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-left transition cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-extrabold text-emerald-900 block font-mono text-[11px]">purchase</span>
                      <span className="text-[10px] text-emerald-600 font-medium">Conversion</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-1.5">
                <span className="text-[11px] font-extrabold text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Purchase Deduplication Guard
                </span>
                <p className="text-[11px] text-amber-800/90 leading-relaxed font-medium">
                  When real customers complete purchases or refresh the thank-you screen, the <code className="font-mono font-bold">transaction_id</code> deduplicator automatically suppresses duplicate conversion dispatches.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 cols: Real-Time DataLayer Stream */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Live DataLayer Stream</h3>
                  <p className="text-xs text-slate-400">Real-time pushes to window.dataLayer on this site.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 font-bold">
                  {liveLogs.length} events logged
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearDataLayerLogs();
                    setLiveLogs([]);
                    showToast('Cleared dataLayer event log.');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title="Clear Event Log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {liveLogs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No dataLayer events recorded in this session yet.</p>
                <p className="text-[11px] text-slate-400">
                  Click any simulator button on the left or browse product pages and checkout to observe live events.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {liveLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  const isPurchase = log.event === 'purchase';
                  const isAddToCart = log.event === 'add_to_cart';
                  const isViewItem = log.event === 'view_item';
                  const isCheckout = log.event === 'begin_checkout';

                  const badgeColor = isPurchase
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : isAddToCart
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : isCheckout
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : isViewItem
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300';

                  const val = log.payload?.ecommerce?.value;
                  const itemCount = log.payload?.ecommerce?.items?.length;

                  return (
                    <div
                      key={log.id}
                      className="border border-slate-200/90 bg-slate-50/60 rounded-2xl p-3.5 transition hover:border-slate-300"
                    >
                      <div
                        className="flex items-center justify-between gap-3 cursor-pointer"
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2.5 py-0.5 text-[11px] font-mono font-extrabold rounded-lg border ${badgeColor}`}>
                            {log.event}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {log.timestamp}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {typeof val === 'number' && (
                            <span className="text-xs font-mono font-black text-slate-900">
                              R{val.toFixed(2)}
                            </span>
                          )}
                          {typeof itemCount === 'number' && (
                            <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </span>
                          )}
                          <button
                            type="button"
                            className="text-slate-400 hover:text-slate-700"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                              JSON Payload
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(JSON.stringify(log.payload, null, 2), `log-${log.id}`)}
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedKey === `log-${log.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedKey === `log-${log.id}` ? 'Copied' : 'Copy JSON'}</span>
                            </button>
                          </div>
                          <pre className="p-3 bg-slate-900 text-amber-300 rounded-xl text-[10px] font-mono overflow-x-auto max-h-56 leading-relaxed">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
