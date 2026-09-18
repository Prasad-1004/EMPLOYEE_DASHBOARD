import { getMyPerformance } from '@/actions/performation-actions';
import { ProductivityChart } from '@/components/dashboard/productivity-chart';

export default async function EmployeePerformancePage() {
  const performance = await getMyPerformance();

  const records = performance.map((item) => ({
    date: String(item.date ?? ''),
    productivity: Number(item.productivity ?? 0),
    quality: Number(item.quality ?? 0),
    score: Number(item.score ?? 0),
  }));

  const average = (values: number[]) => {
    if (!values.length) return 0;

    return Math.round(
      values.reduce((sum, value) => sum + value, 0) / values.length,
    );
  };

  const averageProductivity = average(
    records.map((item) => item.productivity),
  );

  const averageQuality = average(
    records.map((item) => item.quality),
  );

  const averageScore = average(
    records.map((item) => item.score),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Performance
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Track your productivity, quality and performance score.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Avg. Productivity
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {averageProductivity}%
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Avg. Quality
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {averageQuality}%
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Avg. Score
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {averageScore}%
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Performance Trend
          </h2>

          <p className="text-sm text-slate-500">
            Your productivity, quality and overall score over time.
          </p>
        </div>

        <ProductivityChart data={records} />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Performance History
          </h2>
        </div>

        {records.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-slate-700">
              No performance records found.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Your performance records will appear here once added by an admin.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b text-left">
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Date
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Productivity
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Quality
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Score
                  </th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr
                    key={`${record.date}-${record.score}-${record.productivity}`}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3 text-slate-700">
                      {record.date
                        ? new Date(record.date).toLocaleDateString()
                        : '-'}
                    </td>

                    <td className="px-5 py-3">
                      {record.productivity}%
                    </td>

                    <td className="px-5 py-3">
                      {record.quality}%
                    </td>

                    <td className="px-5 py-3 font-semibold">
                      {record.score}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}