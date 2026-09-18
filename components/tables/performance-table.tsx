'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AgGridReact } from 'ag-grid-react';

import type { ColDef } from 'ag-grid-community';

import {
  AllCommunityModule,
  ModuleRegistry,
  ValidationModule,
} from 'ag-grid-community';

import {
  deletePerformance,
  updatePerformance,
} from '@/actions/performation-actions';

ModuleRegistry.registerModules([
  AllCommunityModule,
  ValidationModule,
]);

type Employee = {
  $id: string;
  userId: string;
  name?: string;
  email?: string;
};

type Performance = {
  $id: string;
  userId: string;
  date: string;
  productivity: number;
  quality: number;
  tasksCompleted: number;
  tasksAssigned: number;
  score: number;
  notes?: string;
};

type GridPerformance = Performance & {
  employeeName: string;
};

type Props = {
  performance: Performance[];
  employees: Employee[];
};

export function PerformanceTable({
  performance,
  employees,
}: Props) {
  const router = useRouter();

  const [rows, setRows] =
    useState<Performance[]>(performance);

  const [editing, setEditing] =
    useState<Performance | null>(null);

  const [loading, setLoading] =
    useState(false);

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

  const gridRows =
    useMemo<GridPerformance[]>(
      () =>
        rows.map((row) => ({
          ...row,
          employeeName:
            employeeMap.get(row.userId) ||
            row.userId,
        })),
      [rows, employeeMap],
    );

  const columnDefs =
    useMemo<ColDef<GridPerformance>[]>(
      () => [
        {
          field: 'employeeName',
          headerName: 'Employee',
          sortable: true,
          filter: true,
          flex: 1,
          minWidth: 180,
        },

        {
          field: 'date',
          headerName: 'Date',
          sortable: true,
          filter: true,
          width: 130,
        },

        {
          field: 'productivity',
          headerName: 'Productivity',
          sortable: true,
          filter: 'agNumberColumnFilter',
          width: 140,
          valueFormatter: (params) =>
            `${params.value ?? 0}%`,
        },

        {
          field: 'quality',
          headerName: 'Quality',
          sortable: true,
          filter: 'agNumberColumnFilter',
          width: 120,
          valueFormatter: (params) =>
            `${params.value ?? 0}%`,
        },

        {
          headerName: 'Tasks',
          sortable: true,
          filter: false,
          width: 120,
          valueGetter: (params) =>
            `${params.data?.tasksCompleted ?? 0}/${params.data?.tasksAssigned ?? 0}`,
        },

        {
          field: 'score',
          headerName: 'Score',
          sortable: true,
          filter: 'agNumberColumnFilter',
          width: 110,
          valueFormatter: (params) =>
            `${params.value ?? 0}%`,
        },

        {
          field: 'notes',
          headerName: 'Notes',
          sortable: true,
          filter: true,
          flex: 1,
          minWidth: 180,
        },

        {
          headerName: 'Actions',
          sortable: false,
          filter: false,
          width: 170,

          cellRenderer: (params: {
            data: GridPerformance;
          }) => (
            <div className="flex gap-2 py-2">
              <button
                type="button"
                onClick={() =>
                  setEditing(params.data)
                }
                className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
              >
                Edit
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleDelete(
                    params.data.$id,
                  )
                }
                className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          ),
        },
      ],
      [loading],
    );

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        'Delete this performance record?',
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      await deletePerformance(id);

      setRows((current) =>
        current.filter(
          (row) =>
            row.$id !== id,
        ),
      );

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete record.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!editing) {
      return;
    }

    setLoading(true);

    try {
      const result =
        await updatePerformance(
          editing.$id,
          {
            date: editing.date,

            productivity:
              Number(
                editing.productivity,
              ),

            quality:
              Number(
                editing.quality,
              ),

            tasksCompleted:
              Number(
                editing.tasksCompleted,
              ),

            tasksAssigned:
              Number(
                editing.tasksAssigned,
              ),

            notes:
              editing.notes || '',
          },
        );

      const updated =
        result.performance;

      setRows((current) =>
        current.map((row) =>
          row.$id === editing.$id
            ? {
                ...row,
                ...updated,

                productivity:
                  Number(
                    updated.productivity,
                  ),

                quality:
                  Number(
                    updated.quality,
                  ),

                tasksCompleted:
                  Number(
                    updated.tasksCompleted,
                  ),

                tasksAssigned:
                  Number(
                    updated.tasksAssigned,
                  ),

                score:
                  Number(
                    updated.score,
                  ),
              }
            : row,
        ),
      );

      setEditing(null);

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update record.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">
            Performance Records
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {rows.length} records
          </p>
        </div>

        <div
          className="ag-theme-quartz"
          style={{
            width: '100%',
            height: 600,
          }}
        >
          <AgGridReact<GridPerformance>
            rowData={gridRows}
            columnDefs={columnDefs}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
            }}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[
              10,
              25,
              50,
              100,
            ]}
            animateRows={true}
            suppressCellFocus={true}
          />
        </div>
      </div>

      {editing && (
        <EditPerformanceModal
          performance={editing}
          loading={loading}
          onClose={() =>
            setEditing(null)
          }
          onChange={setEditing}
          onSave={handleSave}
        />
      )}
    </>
  );
}

function EditPerformanceModal({
  performance,
  loading,
  onClose,
  onChange,
  onSave,
}: {
  performance: Performance;
  loading: boolean;
  onClose: () => void;
  onChange: (
    value: Performance,
  ) => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Edit Performance
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field
            label="Date"
            type="date"
            value={performance.date}
            onChange={(value) =>
              onChange({
                ...performance,
                date: value,
              })
            }
          />

          <Field
            label="Productivity"
            type="number"
            value={
              performance.productivity
            }
            onChange={(value) =>
              onChange({
                ...performance,
                productivity:
                  Number(value),
              })
            }
          />

          <Field
            label="Quality"
            type="number"
            value={performance.quality}
            onChange={(value) =>
              onChange({
                ...performance,
                quality:
                  Number(value),
              })
            }
          />

          <Field
            label="Tasks Completed"
            type="number"
            value={
              performance.tasksCompleted
            }
            onChange={(value) =>
              onChange({
                ...performance,
                tasksCompleted:
                  Number(value),
              })
            }
          />

          <Field
            label="Tasks Assigned"
            type="number"
            value={
              performance.tasksAssigned
            }
            onChange={(value) =>
              onChange({
                ...performance,
                tasksAssigned:
                  Number(value),
              })
            }
          />

          <Field
            label="Notes"
            value={
              performance.notes || ''
            }
            onChange={(value) =>
              onChange({
                ...performance,
                notes: value,
              })
            }
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading
              ? 'Saving...'
              : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  type = 'text',
  onChange,
}: {
  label: string;
  value: string | number;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        min={
          type === 'number'
            ? 0
            : undefined
        }
        max={
          type === 'number' &&
          [
            'Productivity',
            'Quality',
          ].includes(label)
            ? 100
            : undefined
        }
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-1.5 w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
      />
    </label>
  );
}