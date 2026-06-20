import React from 'react';
import { AdminLayout } from '../components/admin-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Console | PressCMS',
  description: 'Editorial workspace and publishing management console.',
};

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
