import type { Metadata } from 'next';
import TermsAndConditionsPageClient from './TermsAndConditionsPageClient';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Mrbulk',
  description: 'Review the terms and conditions for using the Mrbulk marketplace and website.',
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsPageClient />;
}
