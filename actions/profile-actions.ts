'use server';

import { ID } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

import { appwriteConfig } from '@/lib/appwrite/config';
import {
  createAdminClient,
  getCurrentUser,
} from '@/lib/appwrite/server';

export async function updateMyProfile(data: {
  name: string;
  phone?: string;
  designation?: string;
}) {
  const { profile } = await getCurrentUser();

  if (!profile) {
    throw new Error('Profile not found.');
  }

  const name = data.name.trim();

  if (!name) {
    throw new Error('Name is required.');
  }

  const { databases } = await createAdminClient();

  await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.profileCollectionId,
    profile.$id,
    {
      name,
      phone: data.phone?.trim() || '',
      designation: data.designation?.trim() || '',
    },
  );

  revalidatePath('/profile');
  revalidatePath('/dashboard');

  return {
    success: true,
  };
}

export async function uploadAvatar(file: File) {
  const { profile } = await getCurrentUser();

  if (!profile) {
    throw new Error('Profile not found.');
  }

  if (!file || file.size === 0) {
    throw new Error('No file selected.');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be smaller than 5MB.');
  }

  const { storage, databases } = await createAdminClient();

  if (profile.avatarId) {
    try {
      await storage.deleteFile(
        appwriteConfig.avatarsBucketId,
        String(profile.avatarId),
      );
    } catch (error) {
      console.error(
        'Failed to delete old avatar:',
        error,
      );
    }
  }

  const uploaded = await storage.createFile(
    appwriteConfig.avatarsBucketId,
    ID.unique(),
    file,
  );

  await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.profileCollectionId,
    profile.$id,
    {
      avatarId: uploaded.$id,
    },
  );

  revalidatePath('/profile');
  revalidatePath('/dashboard');

  return {
    success: true,
    avatarId: String(uploaded.$id),
  };
}