'use client';

import { useToastContext } from './toast-provider';
import type { ToastMessage } from '../components/ui/Toast';

export interface UseToastReturn {
  toasts: ToastMessage[];
  showToast: (
    messageOrTitle: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    description?: string
  ) => void;
  dismissToast: (id: string) => void;
}

export function useToast(): UseToastReturn {
  const ctx = useToastContext();
  return ctx;
}

export { ToastProvider, useToastContext } from './toast-provider';