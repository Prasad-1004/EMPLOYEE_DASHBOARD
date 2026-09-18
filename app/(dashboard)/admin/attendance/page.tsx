import { requireRole } from '@/lib/appwrite/server';
import { getAllAttendance } from '@/actions/attendance-actions';
import { getEmployees } from '@/actions/employee-actions';
import { AttendanceAdminTable } from '@/components/tables/attendance-admin-table';

type AttendanceRecord = {
  $id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  workingHours: number;
};

type Employee = {
  $id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  departmentId?: string;
  role?: string;
  avatarFileId?: string;
};

export default async function AdminAttendancePage() {
  await requireRole('admin');

  const [attendance, employees] = await Promise.all([
    getAllAttendance(),
    getEmployees(),
  ]);

  const attendanceList =
    attendance as unknown as AttendanceRecord[];

  const employeeList =
    employees as unknown as Employee[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Attendance Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View, filter, edit, delete and export employee attendance records.
        </p>
      </div>

      <AttendanceAdminTable
        attendance={attendanceList}
        employees={employeeList}
      />
    </div>
  );
}