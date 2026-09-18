# Employee Performance & Workforce Analytics Platform

Production-oriented Next.js App Router HR/workforce dashboard using Appwrite, TypeScript, Tailwind CSS, AG Grid, Chart.js, React Hook Form and Zod.

## Features
- Employee/admin authentication and role-based access
- Employee CRUD, role, department, position and active/inactive status
- Profile avatar upload through Appwrite Storage
- Daily check-in/check-out with late status and working-hours calculation
- Monthly attendance summary and history
- Productivity trend, team comparison and leave analytics
- Admin reports with AG Grid filtering, sorting, pagination and CSV export
- Department CRUD
- Responsive dashboard and role-aware navigation

## Appwrite setup
Create these collections/attributes (names can be changed through `.env.local`):

### profiles
`userId` string required, `name` string required, `email` string required, `role` string required, `departmentId` string optional, `position` string optional, `status` string optional, `avatarId` string optional.

### attendance
`userId` string required, `date` string required, `checkIn` string required, `checkOut` string optional, `status` string required, `workingHours` double/float optional.

### performance
Use at least `reviewDate` string/date and one of `productivity` or `performanceScore` numeric. For team comparison, optionally include `departmentId` or `department`.

### departments
`name` string required, `description` string optional.

Create a Storage bucket for avatars. Configure appropriate file permissions. Create a server API key with only the scopes required by this application (Users, Databases and Storage operations).

## Run
1. Copy `.env.example` to `.env.local`.
2. Fill in your Appwrite project IDs and server API key.
3. `npm install`
4. `npm run dev`
5. Open `http://localhost:3000`

Never commit `.env.local` or a real Appwrite API key.
