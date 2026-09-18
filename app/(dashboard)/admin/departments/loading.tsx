export default function DepartmentsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
        </div>

        <div className="h-10 w-36 rounded-lg bg-gray-200" />
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="h-10 w-full rounded-lg bg-gray-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-24 rounded bg-gray-200" />

            <div className="mt-5 flex gap-2">
              <div className="h-9 w-16 rounded-lg bg-gray-200" />
              <div className="h-9 w-16 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}