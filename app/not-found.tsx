import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-500">404</p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Page not found
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}