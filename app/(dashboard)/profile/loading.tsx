export default function ProfileLoading() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="h-6 w-36 rounded bg-gray-200" />

        <div className="mt-6 flex items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-gray-200" />

          <div>
            <div className="h-10 w-32 rounded-lg bg-gray-200" />
            <div className="mt-2 h-3 w-48 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="h-6 w-44 rounded bg-gray-200" />

        <div className="mt-6 space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="mt-2 h-10 w-full rounded-lg bg-gray-200" />
            </div>
          ))}

          <div className="h-10 w-32 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}