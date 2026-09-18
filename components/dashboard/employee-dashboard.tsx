import Link from 'next/link';

type EmployeeStats = {
  my?: {
    attendance?: number;
    present?: number;
    late?: number;
    productivity?: number;
    quality?: number;
    score?: number;
    approvedLeaves?: number;
    pendingLeaves?: number;
    rejectedLeaves?: number;
  };
};

type EmployeeDashboardProps = {
  stats: EmployeeStats;
};

function number(value?: number): number {
  return Number.isFinite(value) ? value! : 0;
}

export function EmployeeDashboard({
  stats,
}: EmployeeDashboardProps) {
  const my = stats.my || {};

  const cards = [
    {
      title: 'My Attendance',
      value: number(my.attendance),
      href: '/employee/attendance',
    },
    {
      title: 'Present Days',
      value: number(my.present),
      href: '/employee/attendance',
    },
    {
      title: 'Late Days',
      value: number(my.late),
      href: '/employee/attendance',
    },
    {
      title: 'Performance Score',
      value: number(my.score),
      href: '/employee/performance',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          My Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your attendance, performance and leave.
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

      <div className="grid gap-6 md:grid-cols-3">
        <SummaryCard
          title="Productivity"
          value={number(my.productivity)}
        />

        <SummaryCard
          title="Quality"
          value={number(my.quality)}
        />

        <SummaryCard
          title="Approved Leaves"
          value={number(my.approvedLeaves)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <QuickLink
          title="My Attendance"
          description="Check your attendance and working hours."
          href="/employee/attendance"
        />

        <QuickLink
          title="My Performance"
          description="Review your performance records."
          href="/employee/performance"
        />

        <QuickLink
          title="My Leave"
          description="Apply for leave and track requests."
          href="/leave"
        />
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}%
      </p>
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
      <h2 className="font-semibold">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>

      <span className="mt-4 inline-block text-sm font-medium">
        Open →
      </span>
    </Link>
  );
}