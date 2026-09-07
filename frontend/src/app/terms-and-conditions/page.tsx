import type { Metadata } from 'next';
import TermsAndConditionsTemplate from '@modules/content/templates/terms-and-conditions-page';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Mrbulk',
  description: 'Review the terms and conditions for using the Mrbulk marketplace and website.',
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsTemplate />;
}

