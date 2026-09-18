import { requireRole } from '@/lib/appwrite/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole('admin');

  return <>{children}</>;
}