import type { Metadata } from 'next';
import WishlistTemplate from '@modules/products/templates/wishlist-page';

export const metadata: Metadata = {
  title: 'My Wishlist — Mrbulk',
  description: 'View and manage your saved favorites and wishlists at Mrbulk.',
};

export default function WishlistPage() {
  return <WishlistTemplate />;
}

