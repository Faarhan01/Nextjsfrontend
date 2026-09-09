'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught runtime exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleClearCache = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
        window.sessionStorage.clear();
        window.location.reload();
      }
    } catch (e) {
      console.error('[ErrorBoundary] Failed clearing cache:', e);
      this.handleReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full card-base p-8 rounded-3xl space-y-6 shadow-2xl">
            <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-theme-primary tracking-tight">Render Recovered</h2>
              <p className="text-xs text-theme-muted leading-relaxed max-h-24 overflow-y-auto bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-card font-mono text-left">
                {this.state.error?.message || 'An unexpected error occurred while rendering the page component.'}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Component</span>
              </button>

              <button
                onClick={this.handleClearCache}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Trash2 className="w-3 h-3 text-slate-500" />
                <span>Reset Local Cache & Restart</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
