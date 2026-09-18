'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ID } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '@/lib/appwrite/server';
import { appwriteConfig } from '@/lib/appwrite/config';
import { LoginSchema, SignupSchema } from '@/lib/validators/auth';
import { z } from 'zod';

export async function signupUser(formData: z.infer<typeof SignupSchema>) {
  const parsed = SignupSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  const { name, email, password } = parsed.data;
  try {
    const { account, databases } = await createAdminClient();
    const user = await account.create(ID.unique(), email, password, name);
    await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.profileCollectionId, ID.unique(), { userId: user.$id, name, email, role: 'employee', departmentId: null, position: '', status: 'active' });
    return await loginUser({ email, password });
  } catch (e: any) { return { error: e?.message ?? 'Failed to sign up.' }; }
}

export async function loginUser(formData: z.infer<typeof LoginSchema>) {
  const parsed = LoginSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid credentials.' };
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(parsed.data.email, parsed.data.password);
    const store = await cookies();
    store.set('my-custom-session', session.secret, { path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
    return { success: true };
  } catch (e: any) { return { error: e?.message ?? 'Invalid credentials.' }; }
}

export async function logoutUser() {
  try { const { account } = await createSessionClient(); await account.deleteSession('current'); } catch {}
  (await cookies()).delete('my-custom-session');
  redirect('/login');
}

export async function logout() {
  await logoutUser();
}
