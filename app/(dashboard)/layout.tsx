import { getCurrentUser } from '@/lib/appwrite/server';
import { Sidebar } from '@/components/common/sidebar';
import { Navbar } from '@/components/common/navbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar role={profile?.role ?? 'employee'} />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}