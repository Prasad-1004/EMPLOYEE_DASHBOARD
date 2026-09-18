import { requireRole } from '@/lib/appwrite/server';
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from '@/actions/department-actions';

export default async function DepartmentsPage() {
  await requireRole('admin');

  const result = await getDepartments();

  async function handleCreate(formData: FormData) {
    'use server';

    await createDepartment(formData);
  }

  async function handleUpdate(formData: FormData) {
    'use server';

    const id = String(formData.get('id') ?? '');
    const name = String(formData.get('name') ?? '');
    const description = String(
      formData.get('description') ?? '',
    );

    if (!id) {
      throw new Error('Department ID is required.');
    }

    await updateDepartment(id, name, description);
  }

  async function handleDelete(formData: FormData) {
    'use server';

    const id = String(formData.get('id') ?? '');

    if (!id) {
      throw new Error('Department ID is required.');
    }

    await deleteDepartment(id);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Department Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create and manage company departments.
        </p>
      </div>

      {/* Add Department */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          Add Department
        </h2>

        <form
          action={handleCreate}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <input
            type="text"
            name="name"
            placeholder="Department name"
            required
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Department
          </button>
        </form>
      </div>

      {/* Departments */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full min-w-[750px] text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b text-left">
              <th className="px-5 py-3 font-semibold">
                Department
              </th>

              <th className="px-5 py-3 font-semibold">
                Description
              </th>

              <th className="px-5 py-3 font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {result.departments.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  No departments found.
                </td>
              </tr>
            ) : (
              result.departments.map((department) => (
                <tr
                  key={department.$id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {String(department.name ?? '')}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {String(
                      department.description ?? '—',
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <form action={handleUpdate}>
                        <input
                          type="hidden"
                          name="id"
                          value={String(department.$id)}
                        />

                        <input
                          type="hidden"
                          name="name"
                          value={String(
                            department.name ?? '',
                          )}
                        />

                        <input
                          type="hidden"
                          name="description"
                          value={String(
                            department.description ?? '',
                          )}
                        />

                        <button
                          type="submit"
                          className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                        >
                          Save
                        </button>
                      </form>

                      <form action={handleDelete}>
                        <input
                          type="hidden"
                          name="id"
                          value={String(department.$id)}
                        />

                        <button
                          type="submit"
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}