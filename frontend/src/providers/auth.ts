'use client';

import { useAuthContext } from './auth-provider';
import type { UserProfile } from '../types';

export interface UseAuthReturn {
  currentUser: UserProfile | null;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  signIn: (user: UserProfile) => void;
  signOut: () => void;
  switchUser: (userId: string) => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setCurrentUser: (user: UserProfile | null) => void;
}

export function useAuth(): UseAuthReturn {
  const ctx = useAuthContext();
  return ctx;
}

export { AuthProvider, useAuthContext } from './auth-provider';