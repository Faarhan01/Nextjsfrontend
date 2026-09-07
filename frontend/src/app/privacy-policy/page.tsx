import type { Metadata } from 'next';
import PrivacyPolicyTemplate from '@modules/content/templates/privacy-policy-page';

export const metadata: Metadata = {
  title: 'Privacy Policy — Mrbulk',
  description: 'Read the Mrbulk privacy policy for how we handle your personal data and privacy.',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyTemplate />;
}

