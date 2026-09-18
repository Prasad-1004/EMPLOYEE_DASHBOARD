export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type Leave = {
  $id: string;
  userId: string;
  employeeName?: string;
  departmentId?: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt?: string;
};