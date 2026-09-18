export default function EmployeePerformanceLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-52 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-80 rounded bg-gray-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="mt-3 h-8 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="h-5 w-40 rounded bg-gray-200" />
        <div className="mt-6 h-[300px] rounded-lg bg-gray-100" />
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="h-5 w-40 rounded bg-gray-200" />

        <div className="mt-5 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-12 rounded-lg bg-gray-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}