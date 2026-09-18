import { Query } from 'node-appwrite';

import { createSessionClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';

import { CheckinForm } from '@/components/forms/checkin-form';

type AttendanceRecord = {
  $id: string;
  userId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  workingHours?: number;
};

function formatClockTime(
  isoString?: string,
): string {
  if (!isoString) {
    return '-- : -- : --';
  }

  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return '-- : -- : --';
  }

  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatWorkingHours(
  value: unknown,
): string {
  const hours = Number(value ?? 0);

  if (
    !Number.isFinite(hours) ||
    hours < 0
  ) {
    return '00 : 00 : 00';
  }

  const totalSeconds = Math.floor(
    hours * 60 * 60,
  );

  const hh = Math.floor(
    totalSeconds / 3600,
  );

  const mm = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const ss =
    totalSeconds % 60;

  return [
    String(hh).padStart(2, '0'),
    String(mm).padStart(2, '0'),
    String(ss).padStart(2, '0'),
  ].join(' : ');
}

export default async function EmployeeAttendancePage() {
  const {
    account,
    databases,
  } = await createSessionClient();

  const user =
    await account.get();

  /*
   * Current date in India.
   */
  const todayStr =
    new Intl.DateTimeFormat(
      'en-CA',
      {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
    ).format(
      new Date(),
    );

  /*
   * TODAY'S ATTENDANCE
   */
  const todayResponse =
    await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      [
        Query.equal(
          'userId',
          user.$id,
        ),
        Query.equal(
          'date',
          todayStr,
        ),
        Query.limit(1),
      ],
    );

  const todayDocument =
    todayResponse.documents[0];

  const todayRecord: AttendanceRecord | null =
    todayDocument
      ? {
          $id: String(
            todayDocument.$id ??
              '',
          ),

          userId: String(
            todayDocument.userId ??
              user.$id,
          ),

          date: String(
            todayDocument.date ??
              todayStr,
          ),

          checkIn:
            todayDocument.checkIn
              ? String(
                  todayDocument.checkIn,
                )
              : undefined,

          checkOut:
            todayDocument.checkOut
              ? String(
                  todayDocument.checkOut,
                )
              : undefined,

          status: String(
            todayDocument.status ??
              'present',
          ),

          workingHours: Number(
            todayDocument.workingHours ??
              0,
          ),
        }
      : null;

  /*
   * ATTENDANCE HISTORY
   */
  const historyResponse =
    await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      [
        Query.equal(
          'userId',
          user.$id,
        ),
        Query.orderDesc(
          '$createdAt',
        ),
        Query.limit(30),
      ],
    );

  const history: AttendanceRecord[] =
    historyResponse.documents.map(
      (document) => ({
        $id: String(
          document.$id ?? '',
        ),

        userId: String(
          document.userId ?? '',
        ),

        date: String(
          document.date ?? '',
        ),

        checkIn:
          document.checkIn
            ? String(
                document.checkIn,
              )
            : undefined,

        checkOut:
          document.checkOut
            ? String(
                document.checkOut,
              )
            : undefined,

        status: String(
          document.status ??
            '',
        ),

        workingHours: Number(
          document.workingHours ??
            0,
        ),
      }),
    );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Attendance
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Record your daily attendance and
          monitor your working time.
        </p>
      </div>

      {/* TODAY'S ATTENDANCE */}
      <CheckinForm
        todayRecord={todayRecord}
      />

      {/* ATTENDANCE HISTORY */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">
            Attendance History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your recent attendance records.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                  Date
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                  Check In
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                  Check Out
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                  Working Hours
                </th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No attendance history found.
                  </td>
                </tr>
              )}

              {history.map(
                (record) => {
                  const status =
                    String(
                      record.status ??
                        '',
                    ).toLowerCase();

                  const statusClass =
                    status === 'late'
                      ? 'bg-yellow-100 text-yellow-800'
                      : status ===
                          'present'
                        ? 'bg-green-100 text-green-800'
                        : status ===
                            'absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-700';

                  return (
                    <tr
                      key={
                        record.$id
                      }
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      {/* DATE */}
                      <td className="px-6 py-5 text-sm font-medium text-gray-900">
                        {record.date ||
                          '-'}
                      </td>

                      {/* CHECK IN */}
                      <td className="px-6 py-5 text-sm font-medium tracking-wide text-gray-700">
                        {formatClockTime(
                          record.checkIn,
                        )}
                      </td>

                      {/* CHECK OUT */}
                      <td className="px-6 py-5 text-sm font-medium tracking-wide text-gray-700">
                        {formatClockTime(
                          record.checkOut,
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusClass}`}
                        >
                          {status ||
                            'unknown'}
                        </span>
                      </td>

                      {/* WORKING HOURS */}
                      <td className="px-6 py-5 text-sm font-semibold tracking-wide text-gray-700">
                        {formatWorkingHours(
                          record.workingHours,
                        )}
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}