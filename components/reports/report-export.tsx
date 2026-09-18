'use client';

type Props = {
  report: {
    attendance: Record<string, unknown>[];
    performance: Record<string, unknown>[];
    leaves: Record<string, unknown>[];
  };
};

function escapeCsv(value: unknown) {
  const text = String(value ?? '');

  if (
    text.includes(',') ||
    text.includes('"') ||
    text.includes('\n')
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function downloadCsv(
  filename: string,
  rows: Record<string, unknown>[]
) {
  if (!rows.length) {
    alert('No data available');
    return;
  }

  const headers = Object.keys(rows[0]);

  const csv = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) =>
      headers.map((header) => escapeCsv(row[header])).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export function ReportExport({ report }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() =>
          downloadCsv(
            'attendance-report.csv',
            report.attendance
          )
        }
        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Export Attendance
      </button>

      <button
        type="button"
        onClick={() =>
          downloadCsv(
            'performance-report.csv',
            report.performance
          )
        }
        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Export Performance
      </button>

      <button
        type="button"
        onClick={() =>
          downloadCsv(
            'leave-report.csv',
            report.leaves
          )
        }
        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Export Leaves
      </button>

      <button
        type="button"
        onClick={() => {
          const combined = [
            ...report.attendance.map((item) => ({
              reportType: 'attendance',
              ...item,
            })),

            ...report.performance.map((item) => ({
              reportType: 'performance',
              ...item,
            })),

            ...report.leaves.map((item) => ({
              reportType: 'leave',
              ...item,
            })),
          ];

          downloadCsv('workforce-report.csv', combined);
        }}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Export All
      </button>
    </div>
  );
}