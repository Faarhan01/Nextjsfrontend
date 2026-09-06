'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '../types';
import { MOCK_USERS } from '../data/presets';
import { useToastContext } from './toast-provider';
import { useCartContext } from './cart-provider';
import { useWishlistContext } from './wishlist-provider';

interface AuthContextValue {
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

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [hydrated, setHydrated] = useState(false);
  const toast = useToastContext();
  const cart = useCartContext();
  const wishlist = useWishlistContext();

  useEffect(() => {
    try {
      const savedUserRaw = localStorage.getItem('mrbulk_user') || localStorage.getItem('luxestore_user');
      if (savedUserRaw && savedUserRaw !== 'null' && savedUserRaw !== 'none') {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed && typeof parsed === 'object') {
          setCurrentUser(parsed);
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (currentUser) {
        localStorage.setItem('mrbulk_user', JSON.stringify(currentUser));
      } else {
        localStorage.setItem('mrbulk_user', 'null');
      }
    } catch {}
  }, [currentUser, hydrated]);

  const signIn = useCallback(
    (user: UserProfile) => {
      setCurrentUser(user);
      cart.loadForUser(user);
      wishlist.loadForUser(user);
      setAuthModalOpen(false);
      toast.showToast(`Welcome back, ${user.name}!`, 'success');
    },
    [cart, wishlist, toast]
  );

  const signOut = useCallback(() => {
    setCurrentUser(null);
    cart.loadForUser(null);
    wishlist.loadForUser(null);
    toast.showToast('Signed out successfully', 'info');
  }, [cart, wishlist, toast]);

  const switchUser = useCallback(
    (userId: string) => {
      const targetUser = MOCK_USERS.find((u) => u.id === userId);
      if (targetUser) {
        signIn(targetUser);
      }
    },
    [signIn]
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        signIn,
        signOut,
        switchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}