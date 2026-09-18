'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createPerformance } from '@/actions/performation-actions';

type Employee = {
  $id: string;
  userId: string;
  name?: string;
  email?: string;
};

type Props = {
  employees: Employee[];
};

export function PerformanceForm({
  employees,
}: Props) {
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [date, setDate] = useState('');
  const [productivity, setProductivity] = useState('0');
  const [quality, setQuality] = useState('0');
  const [tasksCompleted, setTasksCompleted] = useState('0');
  const [tasksAssigned, setTasksAssigned] = useState('0');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) return;

    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    const formUserId = String(
      formData.get('userId') ?? '',
    ).trim();

    const formDate = String(
      formData.get('date') ?? '',
    ).trim();

    const formProductivity = Number(
      formData.get('productivity') ?? 0,
    );

    const formQuality = Number(
      formData.get('quality') ?? 0,
    );

    const formTasksCompleted = Number(
      formData.get('tasksCompleted') ?? 0,
    );

    const formTasksAssigned = Number(
      formData.get('tasksAssigned') ?? 0,
    );

    const formNotes = String(
      formData.get('notes') ?? '',
    ).trim();

    console.log('SUBMIT VALUES:', {
      userId: formUserId,
      date: formDate,
      productivity: formProductivity,
      quality: formQuality,
      tasksCompleted: formTasksCompleted,
      tasksAssigned: formTasksAssigned,
      notes: formNotes,
    });

    if (!formUserId) {
      setError('Please select an employee.');
      return;
    }

    if (!formDate) {
      setError('Please select a date.');
      return;
    }

    if (
      !Number.isFinite(formProductivity) ||
      formProductivity < 0 ||
      formProductivity > 100
    ) {
      setError(
        'Productivity must be between 0 and 100.',
      );
      return;
    }

    if (
      !Number.isFinite(formQuality) ||
      formQuality < 0 ||
      formQuality > 100
    ) {
      setError(
        'Quality must be between 0 and 100.',
      );
      return;
    }

    if (
      !Number.isFinite(formTasksCompleted) ||
      formTasksCompleted < 0
    ) {
      setError(
        'Tasks completed cannot be negative.',
      );
      return;
    }

    if (
      !Number.isFinite(formTasksAssigned) ||
      formTasksAssigned < 0
    ) {
      setError(
        'Tasks assigned cannot be negative.',
      );
      return;
    }

    if (
      formTasksCompleted >
      formTasksAssigned
    ) {
      setError(
        'Tasks completed cannot exceed tasks assigned.',
      );
      return;
    }

    setLoading(true);

    try {
      const result = await createPerformance({
        userId: formUserId,
        date: formDate,
        productivity: formProductivity,
        quality: formQuality,
        taskCompleted: formTasksCompleted,
        tasksAssigned: formTasksAssigned,
        notes: formNotes,
      });

      if (!result?.success) {
        throw new Error(
          'Failed to create performance record.',
        );
      }

      form.reset();

      setUserId('');
      setDate('');
      setProductivity('0');
      setQuality('0');
      setTasksCompleted('0');
      setTasksAssigned('0');
      setNotes('');
      setError('');

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create performance record.',
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
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Add Performance Record
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Record employee productivity and performance.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee
          </label>

          <select
            name="userId"
            value={userId}
            onChange={(event) =>
              setUserId(event.target.value)
            }
            disabled={loading}
            className="mt-1.5 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              Select employee
            </option>

            {employees
              .filter(
                (employee) =>
                  employee.userId?.trim(),
              )
              .map((employee) => (
                <option
                  key={employee.userId}
                  value={employee.userId}
                >
                  {employee.name ||
                    employee.email ||
                    employee.userId}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>

          <input
            name="date"
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            disabled={loading}
            className="mt-1.5 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <NumberField
          name="productivity"
          label="Productivity (%)"
          value={productivity}
          onChange={setProductivity}
          max={100}
          disabled={loading}
        />

        <NumberField
          name="quality"
          label="Quality (%)"
          value={quality}
          onChange={setQuality}
          max={100}
          disabled={loading}
        />

        <NumberField
          name="tasksCompleted"
          label="Tasks Completed"
          value={tasksCompleted}
          onChange={setTasksCompleted}
          disabled={loading}
        />

        <NumberField
          name="tasksAssigned"
          label="Tasks Assigned"
          value={tasksAssigned}
          onChange={setTasksAssigned}
          disabled={loading}
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>

          <textarea
            name="notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={4}
            disabled={loading}
            placeholder="Performance notes..."
            className="mt-1.5 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? 'Saving...'
            : 'Add Performance'}
        </button>
      </div>
    </form>
  );
}

function NumberField({
  name,
  label,
  value,
  onChange,
  max,
  disabled,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        name={name}
        type="number"
        min={0}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-1.5 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500 disabled:bg-gray-100"
      />
    </div>
  );
}