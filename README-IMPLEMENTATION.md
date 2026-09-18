# Implementation Checklist

This build covers the requested HR + Workforce Analytics flow:

- Authentication: Appwrite email/password login and employee self-signup.
- RBAC: server-side `requireRole('admin')` protects admin pages/actions.
- Employee management: add, edit, delete, role, department, position and active/inactive status.
- Profile: Appwrite Storage avatar upload.
- Attendance: daily check-in, late detection after 09:30, check-out and calculated working hours.
- Monthly attendance: present/late/leave counts and total working hours.
- Analytics: attendance status, productivity trend, leave/absence and department/team comparison.
- Admin reports: combined attendance/performance AG Grid with filtering, sorting, pagination and CSV export.
- Departments: create, edit and delete.
- Dashboard: employee count, present/late, leave, absent and average working hours.
- Role-aware navigation: employees do not receive admin navigation links.
- Redirect loop: middleware only handles authentication state; application pages handle role access.

## Important Appwrite permissions

For security, configure collection permissions so employees can access only the documents they should see, while admin operations are performed with the server API key. The server API key must never be exposed to client-side code.

## First admin

After creating the Appwrite collections, copy `.env.example` to `.env.local`, fill it in, then run:

`npm run create-admin -- admin@example.com StrongPassword "System Admin"`

The command creates an Appwrite user and matching `profiles` document with `role=admin`.
