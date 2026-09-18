export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-80 rounded bg-gray-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="mt-3 h-9 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-full rounded bg-gray-200" />
            <div className="mt-2 h-4 w-2/3 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}