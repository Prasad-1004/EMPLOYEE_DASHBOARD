import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters');

export const employeeSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: emailSchema,
  phone: z.string().trim().optional(),
  designation: z.string().trim().optional(),
  departmentId: z.string().trim().optional(),
  role: z.enum(['admin', 'employee']),
});

export const leaveSchema = z
  .object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    reason: z
      .string()
      .trim()
      .min(3, 'Reason must be at least 3 characters'),
  })
  .refine(
    (data) => data.endDate >= data.startDate,
    {
      message: 'End date must be on or after start date',
      path: ['endDate'],
    },
  );

export const performanceSchema = z.object({
  userId: z.string().min(1, 'Employee is required'),
  date: z.string().min(1, 'Date is required'),
  productivity: z.number().min(0).max(100),
  quality: z.number().min(0).max(100),
  tasksCompleted: z.number().min(0),
  tasksAssigned: z.number().min(0),
  notes: z.string().trim().optional(),
});