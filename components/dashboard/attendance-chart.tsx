'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AttendanceChartProps {
  presentCount: number;
  lateCount: number;
}

export function AttendanceChart({ presentCount, lateCount }: AttendanceChartProps) {
  const data = {
    labels: ['Present (On Time)', 'Late'],
    datasets: [
      {
        label: 'Number of Records',
        data: [presentCount, lateCount],
        backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(245, 158, 11, 0.6)'],
        borderColor: ['rgb(16, 185, 129)', 'rgb(245, 158, 11)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Overall Attendance Status' },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <Bar data={data} options={options} />
    </div>
  );
}