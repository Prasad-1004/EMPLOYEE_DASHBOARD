'use client';
import {Bar} from 'react-chartjs-2'; import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Tooltip,Legend} from 'chart.js'; ChartJS.register(CategoryScale,LinearScale,BarElement,Tooltip,Legend);
export function TeamComparisonChart({data}:{data:{name:string;score:number}[]}){return <div className="rounded-xl border bg-white p-6 shadow-sm"><h2 className="mb-4 text-lg font-semibold">Team Comparison</h2><Bar data={{labels:data.map(x=>x.name),datasets:[{label:'Average performance',data:data.map(x=>x.score)}]}} options={{responsive:true}}/></div>}
