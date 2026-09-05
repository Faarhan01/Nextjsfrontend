import type { Metadata } from 'next';
import FaqPageClient from './FaqPageClient';

export const metadata: Metadata = {
  title: 'FAQ — Mrbulk',
  description: 'Find answers to frequently asked questions about orders, shipping, returns, and selling on Mrbulk.',
};

export default function FaqPage() {
  return <FaqPageClient />;
}
