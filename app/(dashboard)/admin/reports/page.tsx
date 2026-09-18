import { getReportData } from '@/actions/report-actions';
import { ReportExport } from '@/components/reports/report-export';

export default async function ReportsPage() {
  const report = await getReportData();

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Reports
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Export workforce attendance, performance and leave
          reports.
        </p>
      </div>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Export Reports
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Download the current Appwrite data as CSV files.
        </p>

        <div className="mt-5">
          <ReportExport report={report} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Attendance Records"
          value={report.attendance.length}
        />

        <SummaryCard
          title="Performance Records"
          value={report.performance.length}
        />

        <SummaryCard
          title="Leave Requests"
          value={report.leaves.length}
        />
      </section>
    </main>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}