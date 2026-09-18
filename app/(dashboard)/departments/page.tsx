import { requireRole } from '@/lib/appwrite/server'; import { getDepartments } from '@/actions/department-actions'; import { DepartmentManager } from '@/components/forms/department-manager';
export default async function DepartmentsPage(){await requireRole('admin');const {departments}=await getDepartments();return <DepartmentManager initialDepartments={departments}/>}
