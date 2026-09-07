import type { Metadata } from 'next';
import ReturnsPolicyTemplate from '@modules/content/templates/returns-policy-page';

export const metadata: Metadata = {
  title: 'Returns Policy — Mrbulk',
  description: 'Learn about Mrbulk returns, exchanges, and refund policies for South African customers.',
};

export default function ReturnsPolicyPage() {
  return <ReturnsPolicyTemplate />;
}

