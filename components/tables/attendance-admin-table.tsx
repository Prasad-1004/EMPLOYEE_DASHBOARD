
'use client';

import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
} from 'ag-grid-community';

import {
  deleteAttendance,
  updateAttendance,
} from '@/actions/attendance-actions';

ModuleRegistry.registerModules([AllCommunityModule]);

type AttendanceRecord = {
  $id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  workingHours: number;
};

type Employee = {
  $id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  departmentId?: string;
  role?: string;
  avatarFileId?: string;
};

type Props = {
  attendance: AttendanceRecord[];
  employees: Employee[];
};

type GridClickEvent = {
  target: EventTarget | null;
};

export function AttendanceAdminTable({
  attendance,
  employees,
}: Props) {
  const [rowData, setRowData] =
    useState<AttendanceRecord[]>(attendance);

  const [selectedEmployee, setSelectedEmployee] =
    useState<string>('all');

  const [selectedStatus, setSelectedStatus] =
    useState<string>('all');

  const employeeMap = useMemo(() => {
    const map = new Map<string, Employee>();

    employees.forEach((employee) => {
      if (employee.userId) {
        map.set(employee.userId, employee);
      }
    });

    return map;
  }, [employees]);

  const filteredData = useMemo(() => {
    return rowData.filter((item) => {
      const employeeMatch =
        selectedEmployee === 'all' ||
        item.userId === selectedEmployee;

      const statusMatch =
        selectedStatus === 'all' ||
        item.status === selectedStatus;

      return employeeMatch && statusMatch;
    });
  }, [rowData, selectedEmployee, selectedStatus]);

  const columnDefs = useMemo<ColDef<AttendanceRecord>[]>(
    () => [
      {
        headerName: 'Employee',
        field: 'userId',
        colId: 'employee',
        flex: 1.5,
        filter: true,
        sortable: true,

        valueGetter: (params) => {
          const userId = String(
            params.data?.userId || '',
          );

          const employee = employeeMap.get(userId);

          if (employee) {
            return `${employee.name} (${employee.email})`;
          }

          return userId || '-';
        },
      },

      {
        headerName: 'Date',
        field: 'date',
        colId: 'date',
        flex: 1,
        filter: true,
        sortable: true,
      },

      {
        headerName: 'Check In',
        field: 'checkIn',
        colId: 'checkIn',
        flex: 1,
        filter: true,
        sortable: true,

        valueFormatter: (params) =>
          params.value || '-',
      },

      {
        headerName: 'Check Out',
        field: 'checkOut',
        colId: 'checkOut',
        flex: 1,
        filter: true,
        sortable: true,

        valueFormatter: (params) =>
          params.value || '-',
      },

      {
        headerName: 'Status',
        field: 'status',
        colId: 'status',
        flex: 0.9,
        filter: true,
        sortable: true,

        cellRenderer: (params: {
          value: string;
        }) => {
          const status = String(
            params.value || '',
          ).toLowerCase();

          let className =
            'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold';

          if (status === 'present') {
            className +=
              ' bg-green-100 text-green-700';
          } else if (status === 'late') {
            className +=
              ' bg-yellow-100 text-yellow-700';
          } else if (status === 'absent') {
            className +=
              ' bg-red-100 text-red-700';
          } else {
            className +=
              ' bg-gray-100 text-gray-700';
          }

          return `
            <span class="${className}">
              ${params.value || '-'}
            </span>
          `;
        },
      },

      {
        headerName: 'Working Hours',
        field: 'workingHours',
        colId: 'workingHours',
        flex: 1,
        filter: 'agNumberColumnFilter',
        sortable: true,

        valueFormatter: (params) => {
          const hours = Number(params.value || 0);

          return `${hours.toFixed(2)} hrs`;
        },
      },

      {
        headerName: 'Actions',
        colId: 'actions',
        flex: 1.3,
        sortable: false,
        filter: false,

        cellRenderer: (params: {
          data: AttendanceRecord;
        }) => {
          const id = params.data.$id;

          return `
            <button
              type="button"
              data-action="edit"
              data-id="${id}"
              style="
                margin-right: 8px;
                padding: 5px 10px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                background: white;
                cursor: pointer;
              "
            >
              Edit
            </button>

            <button
              type="button"
              data-action="delete"
              data-id="${id}"
              style="
                padding: 5px 10px;
                border: 1px solid #fecaca;
                border-radius: 6px;
                background: #fef2f2;
                color: #b91c1c;
                cursor: pointer;
              "
            >
              Delete
            </button>
          `;
        },
      },
    ],
    [employeeMap],
  );

  async function handleGridClick(
    event: GridClickEvent,
  ) {
    const target =
      event.target as HTMLElement | null;

    if (!target) {
      return;
    }

    const button = target.closest(
      'button[data-action]',
    ) as HTMLButtonElement | null;

    if (!button) {
      return;
    }

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (!id) {
      return;
    }

    const record = rowData.find(
      (item) => item.$id === id,
    );

    if (!record) {
      return;
    }

    if (action === 'delete') {
      const confirmed = window.confirm(
        'Are you sure you want to delete this attendance record?',
      );

      if (!confirmed) {
        return;
      }

      try {
        await deleteAttendance(id);

        setRowData((current) =>
          current.filter(
            (item) => item.$id !== id,
          ),
        );
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : 'Failed to delete attendance record.',
        );
      }

      return;
    }

    if (action === 'edit') {
      const checkIn = window.prompt(
        'Check-in time:',
        record.checkIn || '',
      );

      if (checkIn === null) {
        return;
      }

      const checkOut = window.prompt(
        'Check-out time:',
        record.checkOut || '',
      );

      if (checkOut === null) {
        return;
      }

      const status = window.prompt(
        'Status:',
        record.status || 'present',
      );

      if (status === null) {
        return;
      }

      try {
        const result = await updateAttendance(
          id,
          {
            checkIn: checkIn.trim(),
            checkOut: checkOut.trim(),
            status: status.trim(),
          },
        );

        const updatedAttendance =
          result.attendance;

        setRowData((current) =>
          current.map((item) => {
            if (item.$id !== id) {
              return item;
            }

            return {
              ...item,
              checkIn: String(
                updatedAttendance.checkIn ??
                  checkIn.trim(),
              ),
              checkOut: String(
                updatedAttendance.checkOut ??
                  checkOut.trim(),
              ),
              status: String(
                updatedAttendance.status ??
                  status.trim(),
              ),
              workingHours: Number(
                updatedAttendance.workingHours ??
                  record.workingHours ??
                  0,
              ),
            };
          }),
        );
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : 'Failed to update attendance record.',
        );
      }
    }
  }

  function exportCSV() {
    const headers = [
      'Employee',
      'Email',
      'Date',
      'Check In',
      'Check Out',
      'Status',
      'Working Hours',
    ];

    const rows = filteredData.map((item) => {
      const employee =
        employeeMap.get(item.userId);

      return [
        employee?.name || item.userId || '',
        employee?.email || '',
        item.date || '',
        item.checkIn || '',
        item.checkOut || '',
        item.status || '',
        Number(
          item.workingHours || 0,
        ).toFixed(2),
      ];
    });

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replaceAll(
                '"',
                '""',
              )}"`,
          )
          .join(','),
      )
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      `attendance-report-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  }

  function clearFilters() {
    setSelectedEmployee('all');
    setSelectedStatus('all');
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm lg:flex-row lg:items-end">
        <div className="flex-1">
          <label
            htmlFor="attendance-employee-filter"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Employee
          </label>

          <select
            id="attendance-employee-filter"
            value={selectedEmployee}
            onChange={(event) =>
              setSelectedEmployee(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="all">
              All Employees
            </option>

            {employees.map((employee) => (
              <option
                key={employee.userId}
                value={employee.userId}
              >
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="attendance-status-filter"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="attendance-status-filter"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="all">
              All Status
            </option>

            <option value="present">
              Present
            </option>

            <option value="late">
              Late
            </option>

            <option value="absent">
              Absent
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={exportCSV}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing{' '}
          <span className="font-semibold text-gray-900">
            {filteredData.length}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-gray-900">
            {rowData.length}
          </span>{' '}
          attendance records
        </p>

        <p>
          Employees:{' '}
          <span className="font-semibold text-gray-900">
            {employees.length}
          </span>
        </p>
      </div>

      {/* AG Grid */}
      <div
        className="ag-theme-quartz w-full overflow-hidden rounded-xl border"
        style={{
          height: 600,
        }}
        onClick={handleGridClick}
      >
        <AgGridReact<AttendanceRecord>
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[
            10,
            20,
            50,
            100,
          ]}
          animateRows={true}
          suppressCellFocus={true}
        />
      </div>
    </div>
  );
}

