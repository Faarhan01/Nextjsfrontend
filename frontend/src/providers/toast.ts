'use client';

import { useToastContext } from './toast-provider';
import type { ToastMessage } from '@modules/common/components/toast';

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