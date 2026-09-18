'use client';

import { useEffect } from 'react';

export default function EmployeeAttendanceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Employee attendance error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600">
          !
        </div>

        <h2 className="mt-4 text-xl font-semibold">
          Unable to load attendance
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Something went wrong while loading your attendance.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}