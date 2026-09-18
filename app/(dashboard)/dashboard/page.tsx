import { redirect } from 'next/navigation';

import { getDashboardStats } from '@/actions/analytics-actions';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { EmployeeDashboard } from '@/components/dashboard/employee-dashboard';
import { getCurrentUser } from '@/lib/appwrite/server';

export default async function DashboardPage() {
  const { profile } = await getCurrentUser();

  if (!profile) {
    redirect('/login');
  }

  const stats = await getDashboardStats();

  if (profile.role === 'admin') {
    return <AdminDashboard stats={stats} />;
  }

  return <EmployeeDashboard stats={stats} />;
}