'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserProfile } from '../types';

export interface AuthContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  handleSignIn: (user: UserProfile) => void;
  onSignIn: (user: UserProfile) => void;
  handleSignOut: () => void;
  onSignOut: () => void;
  handleSwitchUser: (userId: string) => void;
  onSwitchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const handleSignIn = useCallback((user: UserProfile) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
  }, []);

  const onSignIn = handleSignIn;

  const handleSignOut = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const onSignOut = handleSignOut;

  const handleSwitchUser = useCallback((userId: string) => {
    setCurrentUser((prev) => (prev?.id === userId ? null : { ...prev, id: userId }));
  }, []);

  const onSwitchUser = handleSwitchUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        handleSignIn,
        onSignIn,
        handleSignOut,
        onSignOut,
        handleSwitchUser,
        onSwitchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
