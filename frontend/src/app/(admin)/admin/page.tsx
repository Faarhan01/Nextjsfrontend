import type { Metadata } from 'next';
import AdminPageClient from './AdminPageClient';

export const metadata: Metadata = {
  title: 'Admin Portal & Management — Mrbulk',
  description: 'Manage products, view store stats, and access admin tools for Mrbulk.',
};

export default function AdminPage() {
  return <AdminPageClient />;
}
