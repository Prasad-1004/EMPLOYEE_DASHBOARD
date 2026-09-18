import { Models } from "appwrite";

export type UserRole = "admin" | "employee";

export interface Employee {
  $id: string;
  $createdAt: string;
  $updatedAt: string;

  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;

  department: string;
  position: string;

  role: UserRole;

  joiningDate?: string;
}

export interface AuthUser extends Models.User<Models.Preferences> {
  role?: UserRole;
  employeeId?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  position: string;
  profilePicture?: File;
}

export interface CreateEmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  position: string;
  role: UserRole;
  joiningDate: string;
  profilePicture?: File;
}