import type { Metadata } from 'next';
import ReturnsPolicyPageClient from './ReturnsPolicyPageClient';

export const metadata: Metadata = {
  title: 'Returns Policy — Mrbulk',
  description: 'Learn about Mrbulk returns, exchanges, and refund policies for South African customers.',
};

export default function ReturnsPolicyPage() {
  return <ReturnsPolicyPageClient />;
}
