import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us — Mrbulk',
  description: 'Learn about Mrbulk, operated by Mr Cheap General Dealer ZA, and our mission for South African e-commerce.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
