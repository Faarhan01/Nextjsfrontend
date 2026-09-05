'use client';

import { useWishlistContext } from './wishlist-provider';
import type { CustomWishlist } from '../types';

export interface UseWishlistsReturn {
  customWishlists: CustomWishlist[];
  wishlist: string[];
  toggleWishlist: (id: string, name?: string) => void;
  toggleProductInLists: (productId: string, listIds: string[]) => void;
  createWishlist: (name: string, description?: string, icon?: string) => CustomWishlist;
  deleteWishlist: (listId: string) => void;
  renameWishlist: (listId: string, newName: string, newDesc?: string) => void;
  resetDefaultWishlists: () => void;
}

export function useWishlists(): UseWishlistsReturn {
  const ctx = useWishlistContext();
  return {
    customWishlists: ctx.customWishlists,
    wishlist: ctx.wishlist,
    toggleWishlist: ctx.toggleWishlist,
    toggleProductInLists: ctx.toggleProductInLists,
    createWishlist: ctx.createWishlist,
    deleteWishlist: ctx.deleteWishlist,
    renameWishlist: ctx.renameWishlist,
    resetDefaultWishlists: ctx.resetDefaultWishlists
  };
}

export { WishlistProvider, useWishlistContext } from './wishlist-provider';