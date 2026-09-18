export type AttendanceStatus = "present" | "absent" | "late" | "leave";

export interface Attendance {
  $id: string;

  employeeId: string;

  date: string;

  checkIn?: string;
  checkOut?: string;

  status: AttendanceStatus;

  workingHours?: number;

  createdAt?: string;
  updatedAt?: string;
}