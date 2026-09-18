'use client';

export default function GlobalError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            An unexpected error occurred. Please try again.
          </p>

          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}