'use server';

import { Query } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { createAdminClient, getCurrentUser } from '@/lib/appwrite/server';

export async function getReportData() {
  const { profile } = await getCurrentUser();

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const { databases } = await createAdminClient();

  const [attendance, performance, leaves] = await Promise.all([
    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      [Query.limit(5000)]
    ),

    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.performanceCollectionId,
      [Query.limit(5000)]
    ),

    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.leaveCollectionId,
      [Query.limit(5000)]
    ),
  ]);

  return {
    attendance: attendance.documents.map((item) => ({
      id: item.$id,
      userId: item.userId,
      date: item.date,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      status: item.status,
      workingHours: item.workingHours,
    })),

    performance: performance.documents.map((item) => ({
      id: item.$id,
      userId: item.userId,
      date: item.date,
      productivity: item.productivity,
      quality: item.quality,
      tasksCompleted: item.tasksCompleted,
      tasksAssigned: item.tasksAssigned,
      score: item.score,
      notes: item.notes,
    })),

    leaves: leaves.documents.map((item) => ({
      id: item.$id,
      userId: item.userId,
      startDate: item.startDate,
      endDate: item.endDate,
      reason: item.reason,
      status: item.status,
      createdAt: item.createdAt,
    })),
  };
}