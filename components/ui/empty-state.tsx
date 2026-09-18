type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
        —
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900">
        {title}
      </h3>

      {description && (
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}