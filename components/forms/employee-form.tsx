'use client';

import { useState } from 'react';
import {
  createEmployee,
  updateEmployee,
  type Employee,
} from '@/actions/employee-actions';

type Department = {
  $id: string;
  name: string;
};

type Role = 'employee' | 'admin';

type Props = {
  employee?: Employee | null;
  departments: Department[];
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function EmployeeForm({
  employee,
  departments,
  onSuccess,
  onCancel,
}: Props) {
  const isEdit = Boolean(employee);

  const [name, setName] = useState(employee?.name ?? '');
  const [email, setEmail] = useState(employee?.email ?? '');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(employee?.phone ?? '');
  const [designation, setDesignation] = useState(
    employee?.designation ?? '',
  );

  const [departmentId, setDepartmentId] = useState(
    employee?.departmentId ?? '',
  );

  const [role, setRole] = useState<Role>(
    employee?.role === 'admin' ? 'admin' : 'employee',
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      if (!name.trim()) {
        throw new Error('Name is required.');
      }

      if (!email.trim()) {
        throw new Error('Email is required.');
      }

      if (isEdit && employee) {
        const result = await updateEmployee(employee.$id, {
          name: name.trim(),
          email: email.trim(),
          password: password || undefined,
          phone: phone.trim(),
          designation: designation.trim(),
          departmentId,
          role,
        });

        if (!result.success) {
          throw new Error('Failed to update employee.');
        }
      } else {
        if (!password) {
          throw new Error('Password is required.');
        }

        const result = await createEmployee({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          designation: designation.trim(),
          departmentId,
          role,
        });

        if (!result.success) {
          throw new Error('Failed to create employee.');
        }
      }

      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          value={name}
          onChange={setName}
          required
        />

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />

        <Field
          label={isEdit ? 'Password (optional)' : 'Password'}
          type="password"
          value={password}
          onChange={setPassword}
          required={!isEdit}
        />

        <Field
          label="Phone"
          value={phone}
          onChange={setPhone}
        />

        <Field
          label="Designation"
          value={designation}
          onChange={setDesignation}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Department
          </label>

          <select
            value={departmentId}
            onChange={(event) =>
              setDepartmentId(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Select department</option>

            {departments.map((department) => (
              <option
                key={department.$id}
                value={department.$id}
              >
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Role
          </label>

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as Role)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? 'Saving...'
            : isEdit
              ? 'Update Employee'
              : 'Add Employee'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}