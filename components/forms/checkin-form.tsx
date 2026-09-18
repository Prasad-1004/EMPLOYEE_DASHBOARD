'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  checkInUser,
  checkOutUser,
} from '@/actions/attendance-actions';

interface AttendanceRecord {
  $id: string;
  userId?: string;
  date?: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  workingHours?: number;
}

interface CheckinFormProps {
  todayRecord: AttendanceRecord | null;
}

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

function formatDuration(
  totalSeconds: number,
): string {
  const safeSeconds = Math.max(
    0,
    Math.floor(totalSeconds),
  );

  const hours = Math.floor(
    safeSeconds / 3600,
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60,
  );

  const seconds =
    safeSeconds % 60;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(' : ');
}

function getElapsedSeconds(
  record: AttendanceRecord | null,
): number {
  if (!record?.checkIn) {
    return 0;
  }

  if (record.checkOut) {
    const savedHours = Number(
      record.workingHours ?? 0,
    );

    if (
      Number.isFinite(savedHours) &&
      savedHours >= 0
    ) {
      return Math.floor(
        savedHours * 3600,
      );
    }

    const checkInTime =
      new Date(
        record.checkIn,
      ).getTime();

    const checkOutTime =
      new Date(
        record.checkOut,
      ).getTime();

    if (
      Number.isFinite(checkInTime) &&
      Number.isFinite(checkOutTime) &&
      checkOutTime >= checkInTime
    ) {
      return Math.floor(
        (checkOutTime -
          checkInTime) /
          1000,
      );
    }

    return 0;
  }

  const checkInTime =
    new Date(
      record.checkIn,
    ).getTime();

  if (!Number.isFinite(checkInTime)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(
      (Date.now() -
        checkInTime) /
        1000,
    ),
  );
}

export function CheckinForm({
  todayRecord,
}: CheckinFormProps) {
  const [record, setRecord] =
    useState<AttendanceRecord | null>(
      todayRecord,
    );

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const [now, setNow] =
    useState(() => Date.now());

  useEffect(() => {
    setRecord(todayRecord);
  }, [todayRecord]);

  /*
   * LIVE TIMER
   *
   * Timer runs only when the employee
   * has checked in but has not checked out.
   */
  useEffect(() => {
    if (
      !record?.checkIn ||
      record.checkOut
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setNow(Date.now());
      }, 1000);

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [
    record?.checkIn,
    record?.checkOut,
  ]);

  const workingSeconds =
    useMemo(() => {
      if (
        record?.checkIn &&
        !record.checkOut
      ) {
        const checkInTime =
          new Date(
            record.checkIn,
          ).getTime();

        if (
          !Number.isFinite(
            checkInTime,
          )
        ) {
          return 0;
        }

        return Math.max(
          0,
          Math.floor(
            (now -
              checkInTime) /
              1000,
          ),
        );
      }

      return getElapsedSeconds(
        record,
      );
    }, [
      record,
      now,
    ]);

  const workingHoursDisplay =
    formatDuration(
      workingSeconds,
    );

  async function handleCheckIn() {
    setLoading(true);
    setMessage(null);

    try {
      /*
       * checkInUser() returns:
       *
       * {
       *   success: true,
       *   attendance: {...}
       * }
       */
      const result =
        await checkInUser();

      if (
        result.success &&
        result.attendance
      ) {
        setRecord({
          $id: String(
            result.attendance.$id,
          ),

          userId: String(
            result.attendance.userId ??
              '',
          ),

          date: String(
            result.attendance.date ??
              '',
          ),

          checkIn:
            result.attendance
              .checkIn
              ? String(
                  result.attendance
                    .checkIn,
                )
              : undefined,

          checkOut:
            result.attendance
              .checkOut
              ? String(
                  result.attendance
                    .checkOut,
                )
              : undefined,

          status: String(
            result.attendance.status ??
              'present',
          ),

          workingHours: Number(
            result.attendance
              .workingHours ?? 0,
          ),
        });
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Failed to check in.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckOut() {
    if (!record?.$id) {
      setMessage(
        'Attendance record not found.',
      );
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      /*
       * checkOutUser() returns:
       *
       * {
       *   success: true,
       *   attendance: {...}
       * }
       */
      const result =
        await checkOutUser(
          record.$id,
        );

      if (
        result.success &&
        result.attendance
      ) {
        setRecord({
          $id: String(
            result.attendance.$id ??
              record.$id,
          ),

          userId: String(
            result.attendance.userId ??
              record.userId ??
              '',
          ),

          date: String(
            result.attendance.date ??
              record.date ??
              '',
          ),

          checkIn:
            result.attendance
              .checkIn
              ? String(
                  result.attendance
                    .checkIn,
                )
              : record.checkIn,

          checkOut:
            result.attendance
              .checkOut
              ? String(
                  result.attendance
                    .checkOut,
                )
              : undefined,

          status: String(
            result.attendance.status ??
              record.status ??
              'present',
          ),

          workingHours: Number(
            result.attendance
              .workingHours ??
              workingSeconds / 3600,
          ),
        });
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Failed to check out.',
      );
    } finally {
      setLoading(false);
    }
  }

  const status =
    String(
      record?.status ?? '',
    ).toLowerCase();

  const statusClass =
    status === 'late'
      ? 'bg-amber-100 text-amber-800'
      : status === 'present'
        ? 'bg-emerald-100 text-emerald-800'
        : 'bg-gray-100 text-gray-700';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Today's Attendance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track your check-in, check-out and
            working time.
          </p>
        </div>

        {record && (
          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold uppercase ${statusClass}`}
          >
            {status || 'present'}
          </span>
        )}
      </div>

      {/* ERROR / MESSAGE */}
      {message && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {message}
        </div>
      )}

      {/* ATTENDANCE INFO */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* CHECK IN */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm font-medium text-gray-500">
            Check In
          </p>

          <p className="mt-2 text-2xl font-bold tracking-wide text-gray-900">
            {formatClockTime(
              record?.checkIn,
            )}
          </p>
        </div>

        {/* CHECK OUT */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm font-medium text-gray-500">
            Check Out
          </p>

          <p className="mt-2 text-2xl font-bold tracking-wide text-gray-900">
            {formatClockTime(
              record?.checkOut,
            )}
          </p>
        </div>

        {/* STATUS */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm font-medium text-gray-500">
            Status
          </p>

          <p className="mt-2 text-2xl font-bold capitalize text-gray-900">
            {record?.status ||
              'Not Checked In'}
          </p>
        </div>

        {/* WORKING HOURS */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-700">
            Working Hours
          </p>

          <p className="mt-2 whitespace-nowrap text-2xl font-bold tracking-wide text-emerald-800">
            {workingHoursDisplay}
          </p>

          {record &&
            !record.checkOut && (
              <p className="mt-1 text-xs font-medium text-emerald-600">
                ● Live
              </p>
            )}

          {record?.checkOut && (
            <p className="mt-1 text-xs font-medium text-emerald-600">
              Attendance Completed
            </p>
          )}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex flex-wrap gap-3">
        {!record && (
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={loading}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'Checking In...'
              : 'Check In'}
          </button>
        )}

        {record &&
          !record.checkOut && (
            <button
              type="button"
              onClick={handleCheckOut}
              disabled={loading}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Checking Out...'
                : 'Check Out'}
            </button>
          )}

        {record?.checkOut && (
          <div className="rounded-lg bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700">
            Attendance Completed
          </div>
        )}
      </div>
    </div>
  );
}