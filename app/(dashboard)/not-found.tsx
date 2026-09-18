import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold">404</p>

        <h1 className="mt-4 text-2xl font-semibold">
          Page not found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}