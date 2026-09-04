'use client';

import React, { useState } from 'react';
import { Server, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, ChevronRight, X, Layers, ShoppingBag } from 'lucide-react';
import { useMedusa } from '../../hooks/useMedusa';

export function MedusaStatusBadge() {
  const { backendUrl, isLiveBackend, checkingConnection, checkConnection, cart } = useMedusa();
  const [isOpen, setIsOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const ok = await checkConnection();
      if (ok) {
        setTestResult(`Successfully reached Medusa Store API at ${backendUrl}`);
      } else {
        setTestResult(`Medusa backend at ${backendUrl} is currently offline. Storefront is operating in Design Mode using local presets.`);
      }
    } catch (e: any) {
      setTestResult(`Connection failed: ${e?.message || 'Unable to connect'}. Frontend fallback active.`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      {/* Subtle bottom-left developer badge */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-lg border border-slate-700/60 backdrop-blur-md text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
          title="MedusaJS Headless Backend Status & Design Controls"
        >
          <span className={`w-2 h-2 rounded-full ${isLiveBackend ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="font-semibold text-[11px] tracking-wide">MedusaJS:</span>
          <span className="text-slate-300 text-[11px]">
            {checkingConnection ? 'Checking...' : isLiveBackend ? 'Connected' : 'Design Mode'}
          </span>
        </button>
      </div>

      {/* Info Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    MedusaJS Backend Readiness
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isLiveBackend ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'}`}>
                      {isLiveBackend ? 'Connected' : 'Design Mode'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Headless e-commerce architecture status</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Status banner */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${isLiveBackend ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-blue-500/5 border-blue-500/20 text-blue-900 dark:text-blue-300'}`}>
                {isLiveBackend ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {isLiveBackend ? 'Live Medusa Store API Active' : 'Frontend Design Mode Active'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isLiveBackend
                      ? `Requests to products, categories, cart, and checkout are streaming live with Medusa backend at ${backendUrl}.`
                      : `The frontend data layer is structured strictly for MedusaJS. All products, variants, pricing, and cart contracts map to Medusa models while using high-craft local presets so you can design freely.`}
                  </p>
                </div>
              </div>

              {/* Backend Endpoint Details */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-2.5 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Target Backend URL:</span>
                  <code className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                    {backendUrl}
                  </code>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Active Cart Items:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {cart?.items?.length || 0} line items
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Environment Variable:</span>
                  <code className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                    NEXT_PUBLIC_MEDUSA_BACKEND_URL
                  </code>
                </div>
              </div>

              {/* Endpoint Mapping Matrix */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Medusa Store API Contract
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400 block mb-0.5">/store/products</span>
                    <span className="text-slate-500">Products, variants, options, prices</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400 block mb-0.5">/store/carts</span>
                    <span className="text-slate-500">Cart creation, line items, totals</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400 block mb-0.5">/store/regions</span>
                    <span className="text-slate-500">Currencies (ZAR/USD) & taxes</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400 block mb-0.5">/store/collections</span>
                    <span className="text-slate-500">Bestsellers & featured feeds</span>
                  </div>
                </div>
              </div>

              {testResult && (
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono">
                  {testResult}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-semibold shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Pinging Backend...' : 'Ping Medusa Backend'}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 text-xs font-medium transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
