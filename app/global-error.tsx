'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Something went wrong
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              An unexpected application error occurred.
              Please try again.
            </p>

            <button
              type="button"
              onClick={() => reset()}
              className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}