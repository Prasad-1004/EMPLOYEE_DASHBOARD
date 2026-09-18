export default function AnalyticsLoading() {
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[360px] rounded-xl border bg-white p-5 shadow-sm">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="mt-6 h-[280px] rounded bg-gray-100" />
        </div>

        <div className="h-[360px] rounded-xl border bg-white p-5 shadow-sm">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="mt-6 h-[280px] rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}