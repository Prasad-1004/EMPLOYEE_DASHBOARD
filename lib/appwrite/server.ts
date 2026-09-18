import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  Account,
  Client,
  Databases,
  Query,
  Storage,
  Users,
} from 'node-appwrite';
import { appwriteConfig } from './config';

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  const cookieStore = await cookies();
  const session = cookieStore.get('my-custom-session');

  if (!session?.value) {
    throw new Error('No active session');
  }

  client.setSession(session.value);

  return {
    account: new Account(client),
    databases: new Databases(client),
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.apiKey);

  return {
    account: new Account(client),
    databases: new Databases(client),
    users: new Users(client),
    storage: new Storage(client),
  };
}

export async function getCurrentUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.profileCollectionId,
      [
        Query.equal('userId', user.$id),
        Query.limit(1),
      ],
    );

    return {
      user,
      profile: result.documents[0] ?? null,
    };
  } catch {
    redirect('/login');
  }
}

export async function requireRole(role: 'admin' | 'employee') {
  const data = await getCurrentUser();

  if (data.profile?.role !== role) {
    redirect('/dashboard');
  }

  return data;
}