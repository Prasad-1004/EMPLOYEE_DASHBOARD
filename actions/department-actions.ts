'use server';
import { ID, Query } from 'node-appwrite';
import { createAdminClient, requireRole } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { revalidatePath } from 'next/cache';

export async function getDepartments() {
  try { const { databases } = await createAdminClient(); const r = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.departmentsCollectionId, [Query.orderAsc('name'), Query.limit(500)]); return { departments: r.documents }; }
  catch (e: any) { return { departments: [], error: e?.message ?? 'Failed to load departments.' }; }
}
export async function createDepartment(formData: FormData) {
  try { await requireRole('admin'); const name = String(formData.get('name') ?? '').trim(); const description = String(formData.get('description') ?? '').trim(); if (!name) return { error: 'Department name is required.' }; const { databases } = await createAdminClient(); await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.departmentsCollectionId, ID.unique(), { name, description }); revalidatePath('/departments'); return { success: true }; }
  catch (e: any) { return { error: e?.message ?? 'Failed to create department.' }; }
}
export async function updateDepartment(id: string, name: string, description = '') {
  try { await requireRole('admin'); if (!name.trim()) return { error: 'Department name is required.' }; const { databases } = await createAdminClient(); await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.departmentsCollectionId, id, { name: name.trim(), description }); revalidatePath('/departments'); return { success: true }; }
  catch (e: any) { return { error: e?.message ?? 'Failed to update department.' }; }
}
export async function deleteDepartment(id: string) {
  try { await requireRole('admin'); const { databases } = await createAdminClient(); await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.departmentsCollectionId, id); revalidatePath('/departments'); return { success: true }; }
  catch (e: any) { return { error: e?.message ?? 'Failed to delete department.' }; }
}
