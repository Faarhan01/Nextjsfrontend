'use client';

import React, { useState, useEffect } from 'react';
import { sdk } from '@/lib/sdk';
import { Database, Server, RefreshCw, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export function MedusaStatusBadge() {
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const backendUrl = sdk.getBaseUrl();

  const pingBackend = async () => {
    setChecking(true);
    try {
      const online = await sdk.checkHealth();
      setIsLive(online);
    } catch {
      setIsLive(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    pingBackend();
  }, []);

  return (
    <div id="medusa-status-badge" className="fixed bottom-4 right-4 z-50 text-xs font-sans">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-200">
        <button
          id="medusa-status-toggle"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Medusa: {isLive ? 'Live API' : 'Design Mode'}
          </span>
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {expanded && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 max-w-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                Backend Endpoint
              </span>
              <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                {backendUrl || 'None'}
              </code>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                Store Mode
              </span>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200">
                {isLive ? 'Remote Store API' : 'Local Presets + Storage'}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                id="medusa-ping-button"
                onClick={pingBackend}
                disabled={checking}
                className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Checking...' : 'Ping Server'}
              </button>
              <span className="text-[10px] text-slate-400">
                {isLive ? 'v2 Store API' : 'Design Fallback'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
