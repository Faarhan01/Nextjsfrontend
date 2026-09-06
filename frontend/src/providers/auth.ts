'use client';

import { useAuthContext } from './auth-provider';
import type { UserProfile } from '../types';

export interface UseAuthReturn {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  signIn: (user: UserProfile) => void;
  signOut: () => void;
  switchUser: (userId: string) => void;
}

export function useAuth(): UseAuthReturn {
  const ctx = useAuthContext();
  return ctx;
}

export { AuthProvider, useAuthContext } from './auth-provider';