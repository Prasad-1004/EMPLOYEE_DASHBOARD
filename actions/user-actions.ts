'use server';
import { ID, Query } from 'node-appwrite';
import { createAdminClient, requireRole } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { revalidatePath } from 'next/cache';

export interface UserPayload { name: string; email: string; password?: string; role: 'admin'|'employee'; departmentId?: string; position?: string; status?: 'active'|'inactive'; }
export async function getEmployees() { const { databases } = await createAdminClient(); const r = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.profileCollectionId, [Query.orderAsc('name'), Query.limit(500)]); return r.documents; }
export async function createUserByAdmin(payload: UserPayload) {
  try { await requireRole('admin'); if (!payload.name.trim() || !payload.email.trim() || !payload.password || payload.password.length < 8) return { error: 'Name, email and a password of at least 8 characters are required.' }; const { users, databases } = await createAdminClient(); const u = await users.create(ID.unique(), payload.email, payload.password, payload.name); await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.profileCollectionId, ID.unique(), { userId:u.$id,name:payload.name,email:payload.email,role:payload.role,departmentId:payload.departmentId||null,position:payload.position||'',status:payload.status||'active' }); revalidatePath('/admin/employees'); revalidatePath('/dashboard'); return { success:true }; }
  catch(e:any){ return {error:e?.message??'Failed to create user.'}; }
}
export async function updateUserByAdmin(payload: { profileId:string; userId:string } & UserPayload) {
  try { await requireRole('admin'); const { users, databases } = await createAdminClient(); await users.updateName(payload.userId,payload.name); await users.updateEmail(payload.userId,payload.email); if(payload.password) await users.updatePassword(payload.userId,payload.password); await databases.updateDocument(appwriteConfig.databaseId,appwriteConfig.profileCollectionId,payload.profileId,{name:payload.name,email:payload.email,role:payload.role,departmentId:payload.departmentId||null,position:payload.position||'',status:payload.status||'active'}); revalidatePath('/admin/employees'); revalidatePath('/dashboard'); return {success:true}; }
  catch(e:any){ return {error:e?.message??'Failed to update user.'}; }
}
export async function deleteUserByAdmin(profileId:string,userId:string){
  try { const current=await requireRole('admin'); if(userId===current.user.$id) return {error:'You cannot delete your own account.'}; const {users,databases}=await createAdminClient(); await users.delete(userId); await databases.deleteDocument(appwriteConfig.databaseId,appwriteConfig.profileCollectionId,profileId); revalidatePath('/admin/employees'); revalidatePath('/dashboard'); return {success:true}; }
  catch(e:any){ return {error:e?.message??'Failed to delete user.'}; }
}
