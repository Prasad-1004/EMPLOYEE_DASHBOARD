export default function EmployeeProfileLoading() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      <div className="h-8 w-40 rounded bg-gray-200" />

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-gray-200" />

          <div className="space-y-2">
            <div className="h-5 w-40 rounded bg-gray-200" />
            <div className="h-4 w-56 rounded bg-gray-200" />
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="mt-2 h-10 w-full rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}