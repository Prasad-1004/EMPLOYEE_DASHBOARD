'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export function LeaveChart({ leave, absent }: { leave: number; absent: number }) {
  return <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="mb-4 text-lg font-semibold">Leave Analytics</h2><Doughnut data={{ labels: ['Leave', 'Absent'], datasets: [{ data: [leave, absent] }] }} options={{ responsive: true }} /></div>;
}
