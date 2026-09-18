'use client';

import { useState } from 'react';
import {
  deleteEmployee,
  type Employee,
} from '@/actions/employee-actions';
import { EmployeeForm } from '@/components/forms/employee-form';

type Department = {
  $id: string;
  name: string;
};

type Props = {
  employees: Employee[];
  departments: Department[];
};

export function EmployeeTable({
  employees,
  departments,
}: Props) {
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredEmployees = employees.filter((employee) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.designation.toLowerCase().includes(query)
    );
  });

  async function handleDelete(employee: Employee) {
    const confirmed = window.confirm(
      `Delete ${employee.name}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const result = await deleteEmployee(employee.$id);

      if (!result.success) {
        throw new Error('Failed to delete employee.');
      }

      window.location.reload();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete employee.',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess() {
    setShowForm(false);
    setSelectedEmployee(null);
    window.location.reload();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search employees..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500 sm:max-w-sm"
        />

        <button
          type="button"
          onClick={() => {
            setSelectedEmployee(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Add Employee
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b text-left">
              <th className="px-5 py-3 font-semibold">
                Name
              </th>

              <th className="px-5 py-3 font-semibold">
                Email
              </th>

              <th className="px-5 py-3 font-semibold">
                Designation
              </th>

              <th className="px-5 py-3 font-semibold">
                Department
              </th>

              <th className="px-5 py-3 font-semibold">
                Role
              </th>

              <th className="px-5 py-3 font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  No employees found.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => {
                const department = departments.find(
                  (item) =>
                    item.$id === employee.departmentId,
                );

                return (
                  <tr
                    key={employee.$id}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3 font-medium">
                      {employee.name}
                    </td>

                    <td className="px-5 py-3 text-slate-600">
                      {employee.email}
                    </td>

                    <td className="px-5 py-3">
                      {employee.designation || '—'}
                    </td>

                    <td className="px-5 py-3">
                      {department?.name || 'Unassigned'}
                    </td>

                    <td className="px-5 py-3 capitalize">
                      {employee.role}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowForm(true);
                          }}
                          className="rounded-md border px-3 py-1.5 text-xs font-medium"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            handleDelete(employee)
                          }
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {selectedEmployee
                  ? 'Edit Employee'
                  : 'Add Employee'}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedEmployee(null);
                }}
                className="text-xl text-slate-400"
              >
                ×
              </button>
            </div>

            <EmployeeForm
              employee={selectedEmployee}
              departments={departments}
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setSelectedEmployee(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}