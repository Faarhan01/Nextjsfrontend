import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us — Mrbulk',
  description: 'Get in touch with the Mrbulk team for support, partnerships, or enquiries.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
