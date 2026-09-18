import {
  getAllLeaves,
} from '@/actions/leave-actions';

import {
  getEmployees,
} from '@/actions/employee-actions';

import {
  LeaveAdminTable,
} from '@/components/tables/leave-admin-table';

import {
  requireRole,
} from '@/lib/appwrite/server';

export default async function AdminLeavesPage() {
  await requireRole('admin');

  const [
    leaves,
    employees,
  ] = await Promise.all([
    getAllLeaves(),
    getEmployees(),
  ]);

  const employeeOptions =
    employees.map((employee) => ({
      userId: String(
        employee.userId ?? '',
      ),

      name: employee.name
        ? String(employee.name)
        : undefined,

      email: employee.email
        ? String(employee.email)
        : undefined,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Leave Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review and manage employee leave requests.
        </p>
      </div>

      <LeaveAdminTable
        leaves={leaves}
        employees={employeeOptions}
      />
    </div>
  );
}