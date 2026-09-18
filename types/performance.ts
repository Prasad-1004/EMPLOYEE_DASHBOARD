export interface Performance {
  $id: string;

  employeeId: string;

  productivity: number;

  attendanceRate: number;

  performanceScore: number;

  reviewDate: string;

  createdAt?: string;
  updatedAt?: string;
}