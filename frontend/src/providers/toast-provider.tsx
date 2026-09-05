'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ToastMessage } from '../components/ui/Toast';

interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (
    messageOrTitle: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    description?: string
  ) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const showToast = useCallback(
    (
      messageOrTitle: string,
      type: 'success' | 'error' | 'warning' | 'info' = 'success',
      description?: string
    ) => {
      const newToast: ToastMessage = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        type,
        title: messageOrTitle,
        description
      };
      setToasts((prev) => [...prev.slice(-4), newToast]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        timersRef.current.delete(newToast.id);
      }, 4500);
      timersRef.current.set(newToast.id, timer);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider');
  return ctx;
}