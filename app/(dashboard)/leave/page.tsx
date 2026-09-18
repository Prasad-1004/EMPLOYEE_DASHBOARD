import {
  getMyLeaves,
} from '@/actions/leave-actions';

import { LeaveForm } from '@/components/forms/leave-form';

export default async function LeavePage() {
  const leaves =
    await getMyLeaves();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Leave
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Apply for leave and track your leave requests.
        </p>
      </div>

      <LeaveForm />

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">
            My Leave Requests
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  Start Date
                </th>

                <th className="px-4 py-3 text-left">
                  End Date
                </th>

                <th className="px-4 py-3 text-left">
                  Reason
                </th>

                <th className="px-4 py-3 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {leaves.map((leave) => (
                <tr key={leave.$id}>
                  <td className="px-4 py-4">
                    {leave.startDate}
                  </td>

                  <td className="px-4 py-4">
                    {leave.endDate}
                  </td>

                  <td className="px-4 py-4">
                    {leave.reason}
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
                        leave.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}

              {leaves.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
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
    </div>
  );
}