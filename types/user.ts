export type UserRole = "admin" | "employee";

export interface User {
  $id: string;
  $createdAt: string;
  $updatedAt: string;

  userId: string;
  firstName: string;
  lastName: string;
  email: string;

  role: UserRole;

  department: string;
  position: string;

  profilePicture?: string;
  joiningDate?: string;
}