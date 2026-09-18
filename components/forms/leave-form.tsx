'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  createLeave,
} from '@/actions/leave-actions';

export function LeaveForm() {
  const router = useRouter();

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');

  const [reason, setReason] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage('');
    setError('');

    if (!startDate) {
      setError(
        'Please select a start date.',
      );
      return;
    }

    if (!endDate) {
      setError(
        'Please select an end date.',
      );
      return;
    }

    if (
      new Date(endDate) <
      new Date(startDate)
    ) {
      setError(
        'End date cannot be before start date.',
      );
      return;
    }

    if (!reason.trim()) {
      setError(
        'Please enter a reason.',
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await createLeave({
          startDate,
          endDate,
          reason: reason.trim(),
        });

      if (!result?.success) {
        throw new Error(
          'Failed to apply for leave.',
        );
      }

      setStartDate('');
      setEndDate('');
      setReason('');

      setMessage(
        'Leave application submitted successfully.',
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to apply for leave.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Apply for Leave
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Submit a new leave request.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="leave-start-date"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>

          <input
            id="leave-start-date"
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="leave-end-date"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            End Date
          </label>

          <input
            id="leave-end-date"
            type="date"
            value={endDate}
            onChange={(event) =>
              setEndDate(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="leave-reason"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Reason
        </label>

        <textarea
          id="leave-reason"
          value={reason}
          onChange={(event) =>
            setReason(
              event.target.value,
            )
          }
          rows={4}
          maxLength={500}
          placeholder="Enter your leave reason..."
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? 'Submitting...'
            : 'Apply for Leave'}
        </button>
      </div>
    </form>
  );
}