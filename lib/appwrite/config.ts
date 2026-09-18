const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
};

export const appwriteConfig = {
  endpoint: requiredEnv('NEXT_PUBLIC_APPWRITE_ENDPOINT'),
  projectId: requiredEnv('NEXT_PUBLIC_APPWRITE_PROJECT_ID'),
  databaseId: requiredEnv('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),

  profileCollectionId: requiredEnv(
    'NEXT_PUBLIC_APPWRITE_COLLECTION_PROFILES'
  ),

  attendanceCollectionId: requiredEnv(
    'NEXT_PUBLIC_APPWRITE_COLLECTION_ATTENDANCE'
  ),

  performanceCollectionId: requiredEnv(
    'NEXT_PUBLIC_APPWRITE_COLLECTION_PERFORMANCE'
  ),

  departmentsCollectionId: requiredEnv(
    'NEXT_PUBLIC_APPWRITE_COLLECTION_DEPARTMENTS'
  ),

  leaveCollectionId: requiredEnv(
    'NEXT_PUBLIC_APPWRITE_COLLECTION_LEAVE'
  ),

  avatarsBucketId: requiredEnv(
    'NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_AVATARS'
  ),

  apiKey: requiredEnv('APPWRITE_API_KEY'),
};

export const appTimezone =
  process.env.APP_TIMEZONE || 'Asia/Kolkata';