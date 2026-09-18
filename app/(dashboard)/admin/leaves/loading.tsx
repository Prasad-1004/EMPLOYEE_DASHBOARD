export default function AdminLeavesLoading() {
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
            <div className="mt-3 h-8 w-12 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-4">
          <div className="h-5 w-40 rounded bg-gray-200" />
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