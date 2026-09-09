'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  GitBranch, 
  Laptop, 
  Cloud, 
  Copy, 
  Check, 
  Save, 
  Layers, 
  Package, 
  Users, 
  ShoppingBag, 
  FolderTree, 
  Sparkles,
  ExternalLink,
  HelpCircle,
  Clock,
  HardDrive
} from 'lucide-react';

interface SyncStatus {
  synced: boolean;
  filePath: string;
  absolutePath: string;
  lastSyncedAt: string;
  version: string;
  entityCounts: {
    products: number;
    categories: number;
    brands: number;
    orders: number;
    users: number;
  };
  gitInfo: {
    trackedFile: string;
    instructions: string;
  };
}

export function DatabaseSyncManager() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [jsonPreviewOpen, setJsonPreviewOpen] = useState(false);
  const [rawDbJson, setRawDbJson] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSyncStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/store/sync');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      } else {
        throw new Error('Failed to load sync status');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Could not fetch sync status.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const handleSaveToDisk = async () => {
    try {
      setActionLoading('save');
      setFeedback(null);
      const res = await fetch('/api/store/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: 'Catalog and system database persisted to data/db.json successfully.' });
        if (data.status) setStatus(data.status);
      } else {
        throw new Error(data.message || 'Failed to persist database');
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e?.message || 'Error saving database to disk.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReloadFromDisk = async () => {
    try {
      setActionLoading('reload');
      setFeedback(null);
      const res = await fetch('/api/store/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reload' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: 'Database reloaded from data/db.json into active runtime memory.' });
        await fetchSyncStatus();
      } else {
        throw new Error(data.message || 'Failed to reload from disk');
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e?.message || 'Error reloading database.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadDb = async () => {
    try {
      setActionLoading('download');
      const res = await fetch('/api/store/sync?download=true');
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `db-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setFeedback({ type: 'success', message: 'Database backup downloaded (db.json).' });
    } catch (e: any) {
      setFeedback({ type: 'error', message: e?.message || 'Failed to download db.json' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUploadDb = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setActionLoading('upload');
      setFeedback(null);
      const text = await file.text();
      const parsed = JSON.parse(text);

      const res = await fetch('/api/store/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'import', database: parsed })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: `Import successful! ${data.message}` });
        if (data.status) setStatus(data.status);
      } else {
        throw new Error(data.message || 'Invalid database structure');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Import error: ${err?.message}` });
    } finally {
      setActionLoading(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTogglePreview = async () => {
    if (!jsonPreviewOpen && !rawDbJson) {
      try {
        const res = await fetch('/api/store/sync?download=true');
        const json = await res.json();
        setRawDbJson(JSON.stringify(json, null, 2));
      } catch (e) {
        setRawDbJson('// Unable to load raw JSON');
      }
    }
    setJsonPreviewOpen(!jsonPreviewOpen);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="database-sync-manager" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
              <GitBranch className="w-3 h-3" /> Git-Synced Database Architecture
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Cross-Platform Database Sync
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Synchronize your full e-commerce database (<code className="text-blue-300 font-mono bg-blue-950/60 px-1.5 py-0.5 rounded">data/db.json</code>) seamlessly between Google AI Studio and your local PC using Git or direct 1-click cloud sync.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Tracked File</span>
                <span className="text-xs font-mono font-bold text-white">data/db.json</span>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Sync Status</span>
                <span className="text-xs font-bold text-emerald-400">Ready & Tracked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Feedback */}
      {feedback && (
        <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold border transition ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)} 
            className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded-md"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Database Entity Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {status?.entityCounts.products ?? '...'}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Products</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {status?.entityCounts.categories ?? '...'}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Categories</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {status?.entityCounts.orders ?? '...'}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Orders</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {status?.entityCounts.users ?? '...'}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Accounts</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {status?.entityCounts.brands ?? '...'}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Brands</div>
          </div>
        </div>
      </div>

      {/* Control Buttons Hub */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Synchronization Controls</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Force persist, hot-reload after pulling changes, or download snapshots.
            </p>
          </div>
          {status?.lastSyncedAt && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <Clock className="w-3 h-3" />
              <span>Last active: {new Date(status.lastSyncedAt).toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Save to db.json */}
          <button
            onClick={handleSaveToDisk}
            disabled={actionLoading !== null}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {actionLoading === 'save' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save to db.json
          </button>

          {/* Reload from db.json */}
          <button
            onClick={handleReloadFromDisk}
            disabled={actionLoading !== null}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {actionLoading === 'reload' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Reload from Disk
          </button>

          {/* Download db.json */}
          <button
            onClick={handleDownloadDb}
            disabled={actionLoading !== null}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {actionLoading === 'download' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download db.json
          </button>

          {/* Upload / Import db.json */}
          <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer">
            {actionLoading === 'upload' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Import Backup
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleUploadDb}
              className="hidden"
            />
          </label>

          {/* View Raw db.json */}
          <button
            onClick={handleTogglePreview}
            className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition flex items-center gap-2 ml-auto cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            {jsonPreviewOpen ? 'Hide Raw JSON' : 'Inspect JSON'}
          </button>
        </div>

        {/* Collapsible Raw JSON Viewer */}
        {jsonPreviewOpen && (
          <div className="mt-4 p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 font-mono text-xs max-h-72 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="text-[11px] text-slate-400">Preview: data/db.json</span>
              <button
                onClick={() => rawDbJson && copyToClipboard(rawDbJson, 999)}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
              >
                {copiedIndex === 999 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedIndex === 999 ? 'Copied' : 'Copy All'}
              </button>
            </div>
            <pre className="whitespace-pre-wrap">{rawDbJson || 'Loading db.json snapshot...'}</pre>
          </div>
        )}
      </div>

      {/* Interactive Sync Guide */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">How To Synchronize Properly</h3>
            <p className="text-xs text-slate-500">
              Step-by-step instructions for syncing between Google AI Studio and your personal computer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Method 1: AI Studio to PC */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wide">
              <Cloud className="w-4 h-4 text-blue-600" />
              <span>1. Google AI Studio → Your PC</span>
            </div>
            <ol className="space-y-3 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li>
                <span className="font-bold text-slate-800">Automatic Persistence:</span> Any products, orders, or category edits in AI Studio are immediately written to <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">data/db.json</code>.
              </li>
              <li>
                <span className="font-bold text-slate-800">Push to GitHub:</span> In Google AI Studio, commit your changes or use the GitHub sync tool to push the repository to your GitHub repo.
              </li>
              <li>
                <span className="font-bold text-slate-800">Pull on your PC:</span> Open your local terminal and run:
                <div className="mt-1.5 flex items-center justify-between bg-slate-900 text-emerald-400 p-2.5 rounded-xl font-mono text-[11px]">
                  <span>git pull origin main</span>
                  <button
                    onClick={() => copyToClipboard('git pull origin main', 1)}
                    className="text-slate-400 hover:text-white ml-2 cursor-pointer"
                  >
                    {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </li>
              <li>
                <span className="font-bold text-slate-800">Instant Update:</span> Your local server loads the identical catalog, orders, and user accounts.
              </li>
            </ol>
          </div>

          {/* Method 2: PC to AI Studio */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wide">
              <Laptop className="w-4 h-4 text-emerald-600" />
              <span>2. Your PC → Google AI Studio</span>
            </div>
            <ol className="space-y-3 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li>
                <span className="font-bold text-slate-800">Local Edits:</span> When running the project locally, edits are saved to your local <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">data/db.json</code>.
              </li>
              <li>
                <span className="font-bold text-slate-800">Commit & Push:</span> In your local project terminal, commit the updated file:
                <div className="mt-1.5 flex items-center justify-between bg-slate-900 text-emerald-400 p-2.5 rounded-xl font-mono text-[11px]">
                  <span>git add data/db.json && git commit -m "Update store database" && git push</span>
                  <button
                    onClick={() => copyToClipboard('git add data/db.json && git commit -m "Update store database" && git push', 2)}
                    className="text-slate-400 hover:text-white ml-2 cursor-pointer"
                  >
                    {copiedIndex === 2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </li>
              <li>
                <span className="font-bold text-slate-800">AI Studio Sync:</span> Once commits are received in AI Studio, click the <span className="font-bold text-blue-600">Reload from Disk</span> button above.
              </li>
              <li>
                <span className="font-bold text-slate-800">Alternative 1-Click:</span> You can also click <span className="font-bold text-slate-800">Download db.json</span> locally and click <span className="font-bold text-slate-800">Import Backup</span> directly in AI Studio!
              </li>
            </ol>
          </div>
        </div>

        {/* Documentation notice */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-blue-900">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Detailed documentation is available in <code className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-800">knowledgebase/sync.md</code>.
            </span>
          </div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider shrink-0">
            Documentation Ready
          </span>
        </div>
      </div>
    </div>
  );
}
