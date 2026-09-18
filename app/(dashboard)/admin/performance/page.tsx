import { getEmployees } from '@/actions/employee-actions';
import { getAllPerformance } from '@/actions/performation-actions';

import { PerformanceForm } from '@/components/forms/performance-form';
import { PerformanceTable } from '@/components/tables/performance-table';

import { requireRole } from '@/lib/appwrite/server';

export default async function PerformancePage() {
  await requireRole('admin');

  const [performance, employees] =
    await Promise.all([
      getAllPerformance(),
      getEmployees(),
    ]);

  const employeeOptions =
    employees
      .map((employee) => ({
        $id: String(
          employee.$id ?? '',
        ),

        userId: String(
          employee.userId ?? '',
        ),

        name: employee.name
          ? String(employee.name)
          : undefined,

        email: employee.email
          ? String(employee.email)
          : undefined,
      }))
      .filter(
        (employee) =>
          employee.userId.trim() !== '',
      );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Performance Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track and manage employee performance.
        </p>
      </div>

      <PerformanceForm
        employees={employeeOptions}
      />

      <PerformanceTable
        performance={performance}
        employees={employeeOptions}
      />
    </div>
  );
}