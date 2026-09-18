import { requireRole } from '@/lib/appwrite/server';
import { getAnalytics } from '@/actions/analytics-actions';
import { AttendanceChart } from '@/components/dashboard/attendance-chart';
import { ProductivityChart } from '@/components/dashboard/productivity-chart';
import { LeaveChart } from '@/components/dashboard/leave-chart';

export default async function AnalyticsPage() {
  await requireRole('admin');

  const data = await getAnalytics();

  const productivityTrend = data.productivityTrend ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Performance & Workforce Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Workforce attendance, productivity and leave analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Attendance</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {data.attendance.rate}%
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Productivity</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {data.performance.productivity}%
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Performance Score</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {data.performance.score}%
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Leaves</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {data.leave.total}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AttendanceChart
          presentCount={data.attendance.present}
          lateCount={data.attendance.late}
        />

        <LeaveChart
          leave={data.leave.total}
          absent={Math.max(
            0,
            data.attendance.total - data.attendance.present,
          )}
        />
      </div>

      <ProductivityChart
        data={productivityTrend.map((item) => ({
          date: String(item.date),
          productivity: Number(item.productivity),
          quality: 0,
          score: 0,
        }))}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Quality</p>
          <p className="mt-2 text-2xl font-bold">
            {data.performance.quality}%
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Present</p>
          <p className="mt-2 text-2xl font-bold">
            {data.attendance.present}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Late</p>
          <p className="mt-2 text-2xl font-bold">
            {data.attendance.late}
          </p>
        </div>
      </div>
    </div>
  );
}