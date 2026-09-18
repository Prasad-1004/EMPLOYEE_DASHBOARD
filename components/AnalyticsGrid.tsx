// 'use client';

// import { useState } from 'react';
// import { AgGridReact } from 'ag-grid-react';

// interface AnalyticsGridProps {
//   rowData: any[];
// }

// export default function AnalyticsGrid({ rowData }: AnalyticsGridProps) {
//   const [colDefs] = useState<any[]>([
//     { field: 'userId', headerName: 'User ID', filter: true, sortable: true, flex: 1 },
//     { field: 'date', headerName: 'Date', filter: true, sortable: true, flex: 1 },
//     { 
//       field: 'checkIn', 
//       headerName: 'Check In Time', 
//       flex: 1,
//       valueFormatter: (params: any) => params.value ? new Date(params.value).toLocaleTimeString() : 'N/A'
//     },
//     { 
//       field: 'checkOut', 
//       headerName: 'Check Out Time', 
//       flex: 1,
//       valueFormatter: (params: any) => params.value ? new Date(params.value).toLocaleTimeString() : 'N/A'
//     },
//     { field: 'status', headerName: 'Status', filter: true, flex: 1 }
//   ]);

//   return (
//     <div className="ag-theme-quartz h-[450px] w-full shadow-sm rounded-xl overflow-hidden border border-gray-200">
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={colDefs}
//         pagination={true}
//         paginationPageSize={10}
//         domLayout="normal"
//       />
//     </div>
//   );
// }


'use client';

import { useState, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';

interface AnalyticsGridProps {
  rowData: any[];
}

export default function AnalyticsGrid({ rowData }: AnalyticsGridProps) {
  // Grid-এর API অ্যাক্সেস করার জন্য useRef ব্যবহার করছি
  const gridRef = useRef<AgGridReact>(null);

  const [colDefs] = useState<any[]>([
    { field: 'userId', headerName: 'User ID', filter: true, sortable: true, flex: 1 },
    { field: 'date', headerName: 'Date', filter: true, sortable: true, flex: 1 },
    { 
      field: 'checkIn', 
      headerName: 'Check In Time', 
      flex: 1,
      valueFormatter: (params: any) => params.value ? new Date(params.value).toLocaleTimeString() : 'N/A'
    },
    { 
      field: 'checkOut', 
      headerName: 'Check Out Time', 
      flex: 1,
      valueFormatter: (params: any) => params.value ? new Date(params.value).toLocaleTimeString() : 'N/A'
    },
    { field: 'status', headerName: 'Status', filter: true, flex: 1 }
  ]);

  // CSV ডাউনলোড করার ফাংশন
  const onExportClick = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv({
      fileName: 'workforce_attendance_report.csv',
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={onExportClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download CSV
        </button>
      </div>

      {/* AG Grid Table */}
      <div className="ag-theme-quartz h-[450px] w-full shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
          domLayout="normal"
        />
      </div>
    </div>
  );
}
export function ReportsTable({attendance,performance}:{attendance:any[];performance:any[]}){
 const rows=[...attendance.map(x=>({type:'Attendance',userId:x.userId,date:x.date,status:x.status,score:'',workingHours:x.workingHours??0})),...performance.map(x=>({type:'Performance',userId:x.userId??x.employeeId,date:x.reviewDate,status:'Reviewed',score:x.productivity??x.performanceScore??0,workingHours:''}))];
 const ref=useRef<AgGridReact>(null); const exportCsv=useCallback(()=>ref.current?.api.exportDataAsCsv({fileName:'workforce-reports.csv'}),[]);
 const cols=[{field:'type',headerName:'Report Type',filter:true,sortable:true},{field:'userId',headerName:'Employee',filter:true,sortable:true,flex:1},{field:'date',headerName:'Date',filter:true,sortable:true},{field:'status',filter:true,sortable:true},{field:'score',headerName:'Productivity / Score',filter:true,sortable:true},{field:'workingHours',headerName:'Working Hours',filter:true,sortable:true}];
 return <div className="space-y-3"><div className="flex justify-end"><button onClick={exportCsv} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">Export CSV</button></div><div className="ag-theme-quartz h-[560px] rounded-xl border"><AgGridReact ref={ref} rowData={rows} columnDefs={cols as any} pagination paginationPageSize={15} paginationPageSizeSelector={[15,30,50]}/></div></div>
}
