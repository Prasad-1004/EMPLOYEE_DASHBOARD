export default function AttendanceLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-52 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-80 rounded bg-gray-200" />
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="h-10 w-full md:w-56 rounded-lg bg-gray-200" />
          <div className="h-10 w-full md:w-44 rounded-lg bg-gray-200" />
          <div className="h-10 w-full md:w-32 rounded-lg bg-gray-200" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-4">
          <div className="h-5 w-36 rounded bg-gray-200" />
        </div>

        <div className="space-y-4 p-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-4 md:grid-cols-7"
            >
              {Array.from({ length: 7 }).map((__, column) => (
                <div
                  key={column}
                  className="h-5 rounded bg-gray-200"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}