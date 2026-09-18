export default function LeaveLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-36 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="h-5 w-32 rounded bg-gray-200" />

          <div className="mt-5 space-y-4">
            <div className="h-10 rounded-lg bg-gray-200" />
            <div className="h-10 rounded-lg bg-gray-200" />
            <div className="h-24 rounded-lg bg-gray-200" />
            <div className="h-10 rounded-lg bg-gray-200" />
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <div className="h-5 w-32 rounded bg-gray-200" />

          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-16 rounded-lg bg-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}