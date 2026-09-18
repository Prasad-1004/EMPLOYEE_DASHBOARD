
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarProps = {
  role?: string;
};

type MenuItem = {
  label: string;
  href: string;
};

const employeeMenu: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'My Attendance',
    href: '/employee/attendance',
  },
  {
    label: 'My Performance',
    href: '/employee/performance',
  },
  {
    label: 'My Leave',
    href: '/leave',
  },
  {
    label: 'My Profile',
    href: '/profile',
  },
];

const adminMenu: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Employees',
    href: '/admin/employees',
  },
  {
    label: 'Departments',
    href: '/admin/departments',
  },
  {
    label: 'Attendance',
    href: '/admin/attendance',
  },
  {
    label: 'Performance',
    href: '/admin/performance',
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
  },
  {
    label: 'Leave Management',
    href: '/admin/leaves',
  },
  {
    label: 'Reports',
    href: '/admin/reports',
  },
  {
    label: 'My Profile',
    href: '/profile',
  },
];

function isActive(pathname: string, href: string) {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ role = 'employee' }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = role === 'admin' ? adminMenu : employeeMenu;

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r bg-white md:block">
      <div className="sticky top-0 flex min-h-screen flex-col">
        {/* Logo */}
        <div className="border-b px-6 py-5">
          <Link href="/dashboard" className="block">
            <h1 className="text-lg font-bold text-gray-900">
              HR & Workforce
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Performance Analytics
            </p>
          </Link>
        </div>

        {/* Role */}
        <div className="border-b px-6 py-4">
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Account
            </p>

            <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
              {role}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <p className="text-center text-xs text-gray-400">
            Employee Performance
          </p>
          <p className="mt-1 text-center text-xs text-gray-400">
            & Workforce Analytics
          </p>
        </div>
      </div>
    </aside>
  );
}
