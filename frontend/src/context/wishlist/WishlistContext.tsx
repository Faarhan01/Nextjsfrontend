'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { CustomWishlist } from '../types';

export interface WishlistContextType {
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
  customWishlists: CustomWishlist[];
  setCustomWishlists: React.Dispatch<React.SetStateAction<CustomWishlist[]>>;
  handleToggleWishlist: (id: string, name?: string) => void;
  onToggleWishlist: (id: string, name?: string) => void;
  handleToggleProductInLists: (productId: string, listIds: string[]) => void;
  onToggleProductInLists: (productId: string, listIds: string[]) => void;
  handleCreateWishlist: (name: string, description?: string, icon?: string) => CustomWishlist;
  onCreateWishlist: (name: string, description?: string, icon?: string) => CustomWishlist;
  handleDeleteWishlist: (listId: string) => void;
  onDeleteWishlist: (listId: string) => void;
  handleRenameWishlist: (listId: string, newName: string, newDesc?: string) => void;
  onRenameWishlist: (listId: string, newName: string, newDesc?: string) => void;
  handleResetDefaultWishlists: () => void;
  onResetDefaultWishlists: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const DEFAULT_WISHLIST_IDS = ['wishlist', 'favorites'];

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [customWishlists, setCustomWishlists] = useState<CustomWishlist[]>([]);

  const handleToggleWishlist = useCallback((id: string, name?: string) => {
    setWishlist((prev) => {
      if (prev.includes(id)) {
        return prev.filter((w) => w !== id);
      }
      return [...prev, id];
    });
  }, []);

  const onToggleWishlist = handleToggleWishlist;

  const handleToggleProductInLists = useCallback((productId: string, listIds: string[]) => {
    setCustomWishlists((prev) =>
      prev.map((list) => {
        if (!listIds.includes(list.id)) return list;
        const isInList = list.productIds.includes(productId);
        return {
          ...list,
          productIds: isInList
            ? list.productIds.filter((pid) => pid !== productId)
            : [...list.productIds, productId],
        };
      })
    );
  }, []);

  const onToggleProductInLists = handleToggleProductInLists;

  const handleCreateWishlist = useCallback(
    (name: string, description?: string, icon?: string): CustomWishlist => {
      const newList: CustomWishlist = {
        id: `custom-${Date.now()}`,
        name,
        description,
        icon,
        productIds: [],
        createdAt: new Date().toISOString(),
      };
      setCustomWishlists((prev) => [...prev, newList]);
      return newList;
    },
    []
  );

  const onCreateWishlist = handleCreateWishlist;

  const handleDeleteWishlist = useCallback((listId: string) => {
    setCustomWishlists((prev) => prev.filter((list) => list.id !== listId));
  }, []);

  const onDeleteWishlist = handleDeleteWishlist;

  const handleRenameWishlist = useCallback((listId: string, newName: string, newDesc?: string) => {
    setCustomWishlists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, name: newName, description: newDesc } : list
      )
    );
  }, []);

  const onRenameWishlist = handleRenameWishlist;

  const handleResetDefaultWishlists = useCallback(() => {
    setCustomWishlists([]);
    setWishlist([]);
  }, []);

  const onResetDefaultWishlists = handleResetDefaultWishlists;

  const value = useMemo(
    () => ({
      wishlist,
      setWishlist,
      customWishlists,
      setCustomWishlists,
      handleToggleWishlist,
      onToggleWishlist,
      handleToggleProductInLists,
      onToggleProductInLists,
      handleCreateWishlist,
      onCreateWishlist,
      handleDeleteWishlist,
      onDeleteWishlist,
      handleRenameWishlist,
      onRenameWishlist,
      handleResetDefaultWishlists,
      onResetDefaultWishlists,
    }),
    [
      wishlist,
      customWishlists,
      handleToggleWishlist,
      handleToggleProductInLists,
      handleCreateWishlist,
      handleDeleteWishlist,
      handleRenameWishlist,
      handleResetDefaultWishlists,
    ]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
