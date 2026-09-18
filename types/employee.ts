import { UserRole } from "./user";

export interface Employee {
  $id: string;

  userId: string;

  firstName: string;
  lastName: string;
  email: string;

  profilePicture?: string;

  department: string;
  position: string;

  role: UserRole;

  joiningDate: string;

  createdAt?: string;
  updatedAt?: string;
}