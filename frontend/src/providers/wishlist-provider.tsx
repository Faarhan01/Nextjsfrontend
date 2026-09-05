'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CustomWishlist, UserProfile } from '../types';
import { useToastContext } from './toast-provider';

interface WishlistContextValue {
  customWishlists: CustomWishlist[];
  wishlist: string[];
  setCustomWishlists: React.Dispatch<React.SetStateAction<CustomWishlist[]>>;
  toggleWishlist: (id: string, name?: string) => void;
  toggleProductInLists: (productId: string, listIds: string[]) => void;
  createWishlist: (name: string, description?: string, icon?: string) => CustomWishlist;
  deleteWishlist: (listId: string) => void;
  renameWishlist: (listId: string, newName: string, newDesc?: string) => void;
  resetDefaultWishlists: () => void;
  loadForUser: (user: UserProfile | null) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function loadUserCustomWishlists(user: UserProfile | null): CustomWishlist[] {
  if (typeof window === 'undefined') return [];
  if (!user) return [];
  try {
    const saved = localStorage.getItem(`mrbulk_custom_wishlists_${user.id}`) || localStorage.getItem(`luxestore_custom_wishlists_${user.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}

  let initialProdIds = ['prod-1', 'prod-4'];
  if (user.id === 'usr-vip-02') initialProdIds = ['prod-2', 'prod-5'];
  if (user.id === 'usr-cust-03') initialProdIds = ['prod-3'];

  return [
    {
      id: 'list-favourites',
      name: 'Favourites',
      description: 'Your primary saved items',
      icon: 'heart',
      productIds: initialProdIds,
      createdAt: new Date().toISOString(),
      isDefault: true
    },
    {
      id: 'list-gift-ideas',
      name: 'Gift Ideas',
      description: 'Presents for upcoming celebrations & holidays',
      icon: 'gift',
      productIds: ['prod-2'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'list-dream-closet',
      name: 'Dream Closet',
      description: 'Curated products saved for later',
      icon: 'sparkles',
      productIds: [],
      createdAt: new Date().toISOString()
    }
  ];
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [customWishlists, setCustomWishlists] = useState<CustomWishlist[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const toast = useToastContext();

  useEffect(() => {
    try {
      const savedUserRaw = localStorage.getItem('mrbulk_user') || localStorage.getItem('luxestore_user');
      let user: UserProfile | null = null;
      if (savedUserRaw && savedUserRaw !== 'null' && savedUserRaw !== 'none') {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed && typeof parsed === 'object') {
          user = parsed;
          setUserId(user.id);
        }
      }
      setCustomWishlists(loadUserCustomWishlists(user));
      setHydrated(true);
    } catch {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (userId) {
        localStorage.setItem(`mrbulk_custom_wishlists_${userId}`, JSON.stringify(customWishlists));
      }
    } catch {}
  }, [customWishlists, userId, hydrated]);

  const wishlist: string[] = Array.from(new Set(customWishlists.flatMap((l) => l.productIds)));

  const toggleWishlist = useCallback(
    (id: string, name?: string) => {
      const isSaved = wishlist.includes(id);
      setCustomWishlists((prev) => {
        let lists = [...prev];
        if (lists.length === 0) {
          lists = [
            {
              id: 'list-favourites',
              name: 'Favourites',
              description: 'Your primary saved items',
              icon: 'heart',
              productIds: [],
              createdAt: new Date().toISOString(),
              isDefault: true
            }
          ];
        }
        const defaultIdx = lists.findIndex((l) => l.isDefault) !== -1 ? lists.findIndex((l) => l.isDefault) : 0;
        const targetList = { ...lists[defaultIdx] };
        if (isSaved) {
          return lists.map((l) => ({
            ...l,
            productIds: l.productIds.filter((pId) => pId !== id)
          }));
        } else {
          targetList.productIds = Array.from(new Set([...targetList.productIds, id]));
          const updated = [...lists];
          updated[defaultIdx] = targetList;
          return updated;
        }
      });
      if (isSaved) {
        toast.showToast(`Removed ${name || 'item'} from wishlist`, 'info');
      } else {
        toast.showToast(`Saved ${name || 'item'} to wishlist!`, 'success');
      }
    },
    [wishlist, toast]
  );

  const toggleProductInLists = useCallback((productId: string, listIds: string[]) => {
    setCustomWishlists((prev) =>
      prev.map((list) => {
        const shouldInclude = listIds.includes(list.id);
        const alreadyHas = list.productIds.includes(productId);
        if (shouldInclude && !alreadyHas) {
          return { ...list, productIds: [...list.productIds, productId] };
        } else if (!shouldInclude && alreadyHas) {
          return { ...list, productIds: list.productIds.filter((id) => id !== productId) };
        }
        return list;
      })
    );
  }, []);

  const createWishlist = useCallback(
    (name: string, description?: string, icon: string = 'heart'): CustomWishlist => {
      const newList: CustomWishlist = {
        id: `list-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        description: description?.trim(),
        icon,
        productIds: [],
        createdAt: new Date().toISOString()
      };
      setCustomWishlists((prev) => [...prev, newList]);
      toast.showToast(`Created new wishlist: "${name}"`, 'success');
      return newList;
    },
    [toast]
  );

  const deleteWishlist = useCallback(
    (listId: string) => {
      const listToDelete = customWishlists.find((l) => l.id === listId);
      if (listToDelete?.isDefault) {
        toast.showToast('Cannot delete default Favourites list', 'error');
        return;
      }
      setCustomWishlists((prev) => prev.filter((l) => l.id !== listId));
      toast.showToast(`Deleted wishlist "${listToDelete?.name}"`, 'info');
    },
    [customWishlists, toast]
  );

  const renameWishlist = useCallback(
    (listId: string, newName: string, newDesc?: string) => {
      setCustomWishlists((prev) =>
        prev.map((l) => (l.id === listId ? { ...l, name: newName.trim(), description: newDesc?.trim() } : l))
      );
      toast.showToast('Wishlist updated successfully', 'success');
    },
    [toast]
  );

  const resetDefaultWishlists = useCallback(() => {
    setCustomWishlists([
      {
        id: 'list-favourites',
        name: 'Favourites',
        description: 'Your primary saved items',
        icon: 'heart',
        productIds: [],
        createdAt: new Date().toISOString(),
        isDefault: true
      }
    ]);
    toast.showToast('Wishlists reset to default', 'info');
  }, [toast]);

  const loadForUser = useCallback((user: UserProfile | null) => {
    setUserId(user?.id || null);
    setCustomWishlists(loadUserCustomWishlists(user));
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        customWishlists,
        wishlist,
        setCustomWishlists,
        toggleWishlist,
        toggleProductInLists,
        createWishlist,
        deleteWishlist,
        renameWishlist,
        resetDefaultWishlists,
        loadForUser
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlistContext must be used within WishlistProvider');
  return ctx;
}