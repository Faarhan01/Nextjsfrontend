import type { Metadata } from 'next';
import AdminDashboardTemplate from '@modules/admin/templates/admin-dashboard';

export const metadata: Metadata = {
  title: 'Admin Portal & Management — Mrbulk',
  description: 'Manage products, view store stats, and access admin tools for Mrbulk.',
};

export default function AdminPage() {
  return <AdminDashboardTemplate />;
}

