import Link from 'next/link';

type AdminStats = {
  totalEmployees?: number;
  presentToday?: number;
  lateToday?: number;
  pendingLeaves?: number;
  totalAttendance?: number;
  totalPerformance?: number;
  totalLeaves?: number;
};

type AdminDashboardProps = {
  stats: AdminStats;
};

function number(value?: number) {
  return Number.isFinite(value) ? value : 0;
}

export function AdminDashboard({
  stats,
}: AdminDashboardProps) {
  const cards = [
    {
      title: 'Total Employees',
      value: number(stats.totalEmployees),
      href: '/admin/employees',
    },
    {
      title: 'Present Today',
      value: number(stats.presentToday),
      href: '/admin/attendance',
    },
    {
      title: 'Late Today',
      value: number(stats.lateToday),
      href: '/admin/attendance',
    },
    {
      title: 'Pending Leaves',
      value: number(stats.pendingLeaves),
      href: '/admin/leaves',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor employees, attendance, performance and leave.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">
              {card.title}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <QuickLink
          title="Employee Management"
          description="Add, edit, delete and assign departments."
          href="/admin/employees"
        />

        <QuickLink
          title="Attendance"
          description="Review daily attendance and working hours."
          href="/admin/attendance"
        />

        <QuickLink
          title="Performance"
          description="Manage employee performance records."
          href="/admin/performance"
        />

        <QuickLink
          title="Analytics"
          description="View workforce analytics and trends."
          href="/admin/analytics"
        />

        <QuickLink
          title="Leave Management"
          description="Approve or reject employee leave requests."
          href="/admin/leaves"
        />

        <QuickLink
          title="Reports"
          description="View and export workforce reports."
          href="/admin/reports"
        />
      </div>
    </div>
  );
}

function QuickLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>

      <span className="mt-4 inline-block text-sm font-medium">
        Open →
      </span>
    </Link>
  );
}