import { requireRole } from '@/lib/appwrite/server';
import { getEmployees } from '@/actions/employee-actions';
import { getDepartments } from '@/actions/department-actions';
import { EmployeeTable } from '@/components/tables/employee-table';

type Department = {
  $id: string;
  name: string;
};

export default async function EmployeesPage() {
  await requireRole('admin');

  const [employees, departmentResult] = await Promise.all([
    getEmployees(),
    getDepartments(),
  ]);

  const departments: Department[] = departmentResult.departments.map(
    (department) => ({
      $id: String(department.$id),
      name: String(department.name ?? ''),
    }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Employee Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage employees, roles and department assignments.
        </p>
      </div>

      <EmployeeTable
        employees={employees}
        departments={departments}
      />
    </div>
  );
}