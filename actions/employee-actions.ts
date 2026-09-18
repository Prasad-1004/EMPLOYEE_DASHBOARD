'use server';

import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

import { appwriteConfig } from '@/lib/appwrite/config';
import {
  createAdminClient,
  getCurrentUser,
} from '@/lib/appwrite/server';

export type Employee = {
  $id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  departmentId: string;
  role: string;
  avatarId: string;
};

type EmployeeInput = {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  designation?: string;
  departmentId?: string;
  role?: 'employee' | 'admin';
};

async function requireAdmin() {
  const { profile } = await getCurrentUser();

  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  return profile;
}

function mapEmployee(document: any): Employee {
  return {
    $id: String(document.$id),
    userId: String(document.userId ?? ''),
    name: String(document.name ?? ''),
    email: String(document.email ?? ''),
    phone: String(document.phone ?? ''),
    designation: String(document.designation ?? ''),
    departmentId: String(document.departmentId ?? ''),
    role: String(document.role ?? 'employee'),
    avatarId: String(document.avatarId ?? ''),
  };
}

export async function getEmployees(): Promise<Employee[]> {
  await requireAdmin();

  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.profileCollectionId,
    [Query.limit(5000)],
  );

  return result.documents.map(mapEmployee);
}

export async function createEmployee(data: EmployeeInput) {
  await requireAdmin();

  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const password = data.password?.trim() ?? '';

  if (!name) {
    throw new Error('Name is required.');
  }

  if (!email) {
    throw new Error('Email is required.');
  }

  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  const { users, databases } = await createAdminClient();

  let userId = '';

  try {
    const user = await users.create(
      ID.unique(),
      email,
      undefined,
      password,
      name,
    );

    userId = user.$id;

    const employee = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.profileCollectionId,
      ID.unique(),
      {
        userId,
        name,
        email,
        phone: data.phone?.trim() ?? '',
        designation: data.designation?.trim() ?? '',
        departmentId: data.departmentId?.trim() ?? '',
        role: data.role ?? 'employee',
        avatarId: '',
      },
    );

    revalidatePath('/admin/employees');
    revalidatePath('/dashboard');

    return {
      success: true,
      employee,
    };
  } catch (error: any) {
    if (userId) {
      try {
        await users.delete(userId);
      } catch (deleteError) {
        console.error(
          'Failed to rollback Appwrite user:',
          deleteError,
        );
      }
    }

    if (
      error?.code === 409 ||
      error?.type === 'user_target_already_exists'
    ) {
      throw new Error(
        'An account with this email already exists.',
      );
    }

    console.error('Create employee error:', error);

    throw new Error(
      error?.message || 'Failed to create employee.',
    );
  }
}

export async function updateEmployee(
  profileId: string,
  data: EmployeeInput,
) {
  await requireAdmin();

  if (!profileId) {
    throw new Error('Employee ID is required.');
  }

  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();

  if (!name) {
    throw new Error('Name is required.');
  }

  if (!email) {
    throw new Error('Email is required.');
  }

  const { databases, users } = await createAdminClient();

  const existing = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.profileCollectionId,
    profileId,
  );

  const existingUserId = String(existing.userId ?? '');
  const existingEmail = String(existing.email ?? '')
    .trim()
    .toLowerCase();

  if (!existingUserId) {
    throw new Error('Employee account is not linked correctly.');
  }

  const currentUser = await getCurrentUser();

  if (
    currentUser.profile?.$id === profileId &&
    data.role &&
    data.role !== 'admin'
  ) {
    throw new Error(
      'You cannot remove your own admin role.',
    );
  }

  try {
    /*
     * Update name.
     */
    await users.updateName(existingUserId, name);

    /*
     * Only update email when it actually changed.
     * Appwrite throws 409 when the target email already exists.
     */
    if (email !== existingEmail) {
      try {
        await users.updateEmail(existingUserId, email);
      } catch (error: any) {
        if (
          error?.code === 409 ||
          error?.type === 'user_target_already_exists'
        ) {
          throw new Error(
            'This email address is already used by another account.',
          );
        }

        throw error;
      }
    }

    /*
     * Update password only when supplied.
     */
    if (data.password?.trim()) {
      const password = data.password.trim();

      if (password.length < 8) {
        throw new Error(
          'Password must be at least 8 characters.',
        );
      }

      await users.updatePassword(
        existingUserId,
        password,
      );
    }

    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.profileCollectionId,
      profileId,
      {
        name,
        email,
        phone: data.phone?.trim() ?? '',
        designation: data.designation?.trim() ?? '',
        departmentId: data.departmentId?.trim() ?? '',
        role: data.role ?? existing.role ?? 'employee',
      },
    );

    revalidatePath('/admin/employees');
    revalidatePath('/dashboard');
    revalidatePath('/profile');

    return {
  success: true,
  employee: {
    $id: String(updated.$id),
    userId: String(updated.userId ?? ''),
    name: String(updated.name ?? ''),
    email: String(updated.email ?? ''),
    phone: String(updated.phone ?? ''),
    designation: String(updated.designation ?? ''),
    departmentId: String(updated.departmentId ?? ''),
    role: String(updated.role ?? 'employee'),
    avatarId: String(updated.avatarId ?? ''),
  },
};
  } catch (error: any) {
    console.error('Update employee error:', error);

    throw new Error(
      error?.message || 'Failed to update employee.',
    );
  }
}

export async function deleteEmployee(profileId: string) {
  const adminProfile = await requireAdmin();

  if (!profileId) {
    throw new Error('Employee ID is required.');
  }

  const { databases, users } = await createAdminClient();

  const existing = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.profileCollectionId,
    profileId,
  );

  const userId = String(existing.userId ?? '');

  if (adminProfile.$id === profileId) {
    throw new Error('You cannot delete your own account.');
  }

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.profileCollectionId,
      profileId,
    );
  } catch (error) {
    console.error('Failed to delete employee profile:', error);
    throw new Error('Failed to delete employee profile.');
  }

  if (userId) {
    try {
      await users.delete(userId);
    } catch (error) {
      console.error(
        'Failed to delete Appwrite user:',
        error,
      );
    }
  }

  revalidatePath('/admin/employees');
  revalidatePath('/dashboard');

  return {
    success: true,
  };
}