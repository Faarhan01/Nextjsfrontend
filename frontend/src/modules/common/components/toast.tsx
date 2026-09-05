'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map(toast => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';

          const bgColor = isError
            ? 'bg-rose-900/90 border-rose-700/50 text-rose-100'
            : isSuccess
            ? 'bg-emerald-900/90 border-emerald-700/50 text-emerald-100'
            : isWarning
            ? 'bg-amber-900/90 border-amber-700/50 text-amber-100'
            : 'bg-slate-900/90 border-slate-700/50 text-slate-100';

          const iconColor = isError
            ? 'text-rose-400'
            : isSuccess
            ? 'text-emerald-400'
            : isWarning
            ? 'text-amber-400'
            : 'text-blue-400';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start gap-3.5 ${bgColor}`}
            >
              <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                {isError && <AlertCircle className="w-5 h-5" />}
                {isSuccess && <CheckCircle2 className="w-5 h-5" />}
                {isWarning && <AlertTriangle className="w-5 h-5" />}
                {!isError && !isSuccess && !isWarning && <Info className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold tracking-wide">{toast.title}</h4>
                {toast.description && (
                  <p className="text-xs opacity-85 mt-0.5 leading-relaxed break-words">{toast.description}</p>
                )}
                {toast.action && (
                  <button
                    onClick={toast.action.onClick}
                    className="mt-2 text-xs font-semibold underline underline-offset-2 hover:opacity-100"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
