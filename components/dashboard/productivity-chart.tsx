'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type ProductivityRecord = {
  date: string;
  productivity: number;
  quality: number;
  score: number;
};

type ProductivityChartProps = {
  data?: ProductivityRecord[];
  labels?: string[];
  values?: number[];
};

export function ProductivityChart({
  data,
  labels,
  values,
}: ProductivityChartProps) {
  const chartData: ProductivityRecord[] =
    data ??
    (labels ?? []).map((month, index) => ({
      date: month,
      productivity: Number(values?.[index] ?? 0),
      quality: 0,
      score: 0,
    }));

  const sortedData = [...chartData].sort((a, b) =>
    String(a.date).localeCompare(String(b.date)),
  );

  const chartLabels = sortedData.length
    ? sortedData.map((item) => item.date)
    : ['No data'];

  const productivity = sortedData.length
    ? sortedData.map((item) => item.productivity)
    : [0];

  const quality = sortedData.length
    ? sortedData.map((item) => item.quality)
    : [0];

  const score = sortedData.length
    ? sortedData.map((item) => item.score)
    : [0];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">
        Productivity Trend
      </h2>

      <div className="h-[320px]">
        <Line
          data={{
            labels: chartLabels,
            datasets: [
              {
                fill: true,
                label: 'Productivity',
                data: productivity,
                tension: 0.35,
              },
              ...(sortedData.some((item) => item.quality > 0)
                ? [
                    {
                      label: 'Quality',
                      data: quality,
                      tension: 0.35,
                    },
                  ]
                : []),
              ...(sortedData.some((item) => item.score > 0)
                ? [
                    {
                      label: 'Score',
                      data: score,
                      tension: 0.35,
                    },
                  ]
                : []),
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
              },
            },
          }}
        />
      </div>
    </div>
  );
}