type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Unable to load data',
  description = 'Something went wrong while loading this section.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <h3 className="text-base font-semibold text-red-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-red-700">
        {description}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
        >
          Try again
        </button>
      )}
    </div>
  );
}