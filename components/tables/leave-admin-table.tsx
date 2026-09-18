'use client';

import { useMemo, useState } from 'react';

import {
  deleteLeave,
  updateLeave,
  type LeaveRecord,
  type LeaveStatus,
} from '@/actions/leave-actions';

type Employee = {
  userId: string;
  name?: string;
  email?: string;
};

type Props = {
  leaves: LeaveRecord[];
  employees?: Employee[];
};

export function LeaveAdminTable({
  leaves,
  employees = [],
}: Props) {
  const [rows, setRows] =
    useState<LeaveRecord[]>(leaves);

  const [loadingId, setLoadingId] =
    useState<string | null>(null);

  const employeeMap = useMemo(() => {
    return new Map(
      employees.map((employee) => [
        employee.userId,
        employee.name ||
          employee.email ||
          employee.userId,
      ]),
    );
  }, [employees]);

  async function handleStatusChange(
    id: string,
    status: LeaveStatus,
  ) {
    setLoadingId(id);

    try {
      const result =
        await updateLeave(id, {
          status,
        });

      const updated =
        result.leave;

      setRows((current) =>
        current.map((row) =>
          row.$id === id
            ? {
                ...row,
                ...updated,
              }
            : row,
        ),
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update leave.',
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this leave request?',
      );

    if (!confirmed) {
      return;
    }

    setLoadingId(id);

    try {
      await deleteLeave(id);

      setRows((current) =>
        current.filter(
          (row) =>
            row.$id !== id,
        ),
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete leave.',
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Leave Requests
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {rows.length} leave requests
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Employee
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Start Date
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                End Date
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Reason
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {rows.map((leave) => {
              const employeeName =
                employeeMap.get(
                  leave.userId,
                ) ||
                leave.userId;

              const isLoading =
                loadingId ===
                leave.$id;

              return (
                <tr
                  key={leave.$id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {employeeName}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {leave.startDate}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {leave.endDate}
                  </td>

                  <td className="max-w-xs px-4 py-4 text-gray-600">
                    <span className="line-clamp-2">
                      {leave.reason}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        leave.status ===
                        'approved'
                          ? 'bg-green-100 text-green-700'
                          : leave.status ===
                            'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {leave.status
                        .charAt(0)
                        .toUpperCase() +
                        leave.status.slice(
                          1,
                        )}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleStatusChange(
                            leave.$id,
                            'approved',
                          )
                        }
                        className="rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleStatusChange(
                            leave.$id,
                            'rejected',
                          )
                        }
                        className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleDelete(
                            leave.$id,
                          )
                        }
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}