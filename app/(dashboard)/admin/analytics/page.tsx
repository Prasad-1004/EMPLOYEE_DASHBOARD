import { getAnalytics } from '@/actions/analytics-actions';
import { ProductivityChart } from '@/components/dashboard/productivity-chart';
import { requireRole } from '@/lib/appwrite/server';

export default async function AnalyticsPage() {
  await requireRole('admin');

  const analytics = await getAnalytics();

  const labels = analytics.productivityTrend.map(
    (item) => item.date,
  );

  const values =
    analytics.productivityTrend.map(
      (item) => item.productivity,
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Workforce Analytics
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Analyze attendance, performance and leave
          data.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Attendance Rate"
          value={`${analytics.attendance.rate}%`}
        />

        <StatCard
          title="Productivity"
          value={`${analytics.performance.productivity}%`}
        />

        <StatCard
          title="Quality"
          value={`${analytics.performance.quality}%`}
        />

        <StatCard
          title="Performance Score"
          value={`${analytics.performance.score}%`}
        />
      </div>

      <ProductivityChart
        labels={labels}
        values={values}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Attendance
          </h2>

          <div className="mt-5 grid grid-cols-3 gap-4">
            <Metric
              label="Total"
              value={analytics.attendance.total}
            />

            <Metric
              label="Present"
              value={analytics.attendance.present}
            />

            <Metric
              label="Late"
              value={analytics.attendance.late}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Leave Summary
          </h2>

          <div className="mt-5 grid grid-cols-3 gap-4">
            <Metric
              label="Approved"
              value={analytics.leave.approved}
            />

            <Metric
              label="Pending"
              value={analytics.leave.pending}
            />

            <Metric
              label="Rejected"
              value={analytics.leave.rejected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
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

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold">
        {value}
      </p>
    </div>
  );
}