import type { Metadata } from 'next';
import WishlistPageClient from './WishlistPageClient';

export const metadata: Metadata = {
  title: 'My Wishlist — Mrbulk',
  description: 'View and manage your saved favorites and wishlists at Mrbulk.',
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
