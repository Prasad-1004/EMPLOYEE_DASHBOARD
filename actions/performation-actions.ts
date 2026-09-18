'use server';

import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

import {
  createAdminClient,
  getCurrentUser,
  requireRole,
} from '@/lib/appwrite/server';

import { appwriteConfig } from '@/lib/appwrite/config';

type PerformanceInput = {
  userId: string;
  date: string;
  productivity: number;
  quality: number;
  taskCompleted: number;
  tasksAssigned: number;
  notes?: string;
};

type UpdatePerformanceInput = {
  userId?: string;
  date?: string;
  productivity?: number;
  quality?: number;
  tasksCompleted?: number;
  taskCompleted?: number;
  tasksAssigned?: number;
  taskAssigned?: number;
  score?: number;
  notes?: string;
};

type PerformanceRecord = {
  $id: string;
  userId: string;
  date: string;
  productivity: number;
  quality: number;
  tasksCompleted: number;
  tasksAssigned: number;
  score: number;
  notes: string;
  $createdAt?: string;
  $updatedAt?: string;
};

function calculateScore(
  productivity: number,
  quality: number,
  tasksCompleted: number,
  tasksAssigned: number,
): number {
  const safeProductivity = Math.min(
    100,
    Math.max(0, Number(productivity) || 0),
  );

  const safeQuality = Math.min(
    100,
    Math.max(0, Number(quality) || 0),
  );

  const safeTasksCompleted = Math.max(
    0,
    Number(tasksCompleted) || 0,
  );

  const safeTasksAssigned = Math.max(
    0,
    Number(tasksAssigned) || 0,
  );

  const taskCompletion =
    safeTasksAssigned > 0
      ? Math.min(
          100,
          (safeTasksCompleted / safeTasksAssigned) * 100,
        )
      : 0;

  const score =
    safeProductivity * 0.5 +
    safeQuality * 0.3 +
    taskCompletion * 0.2;

  return Math.round(
    Math.min(100, Math.max(0, score)),
  );
}

function toPlainPerformance(
  document: any,
): PerformanceRecord {
  return {
    $id: String(document.$id ?? ''),

    userId: String(
      document.userId ?? '',
    ),

    date: String(
      document.date ?? '',
    ),

    productivity: Number(
      document.productivity ?? 0,
    ),

    quality: Number(
      document.quality ?? 0,
    ),

    /*
     * Appwrite:
     * taskCompleted
     *
     * Frontend:
     * tasksCompleted
     */
    tasksCompleted: Number(
      document.taskCompleted ?? 0,
    ),

    /*
     * Appwrite:
     * taskAssigned
     *
     * Frontend:
     * tasksAssigned
     */
    tasksAssigned: Number(
      document.taskAssigned ?? 0,
    ),

    score: Number(
      document.score ?? 0,
    ),

    notes: String(
      document.notes ?? '',
    ),

    $createdAt: document.$createdAt
      ? String(document.$createdAt)
      : undefined,

    $updatedAt: document.$updatedAt
      ? String(document.$updatedAt)
      : undefined,
  };
}

function validatePerformanceInput(
  data: PerformanceInput,
) {
  if (!data.userId?.trim()) {
    throw new Error(
      'Employee is required.',
    );
  }

  if (!data.date?.trim()) {
    throw new Error(
      'Date is required.',
    );
  }

  const productivity = Number(
    data.productivity,
  );

  const quality = Number(
    data.quality,
  );

  const taskCompleted = Number(
    data.taskCompleted,
  );

  const taskAssigned = Number(
    data.tasksAssigned,
  );

  if (
    !Number.isFinite(productivity) ||
    productivity < 0 ||
    productivity > 100
  ) {
    throw new Error(
      'Productivity must be between 0 and 100.',
    );
  }

  if (
    !Number.isFinite(quality) ||
    quality < 0 ||
    quality > 100
  ) {
    throw new Error(
      'Quality must be between 0 and 100.',
    );
  }

  if (
    !Number.isFinite(taskCompleted) ||
    taskCompleted < 0
  ) {
    throw new Error(
      'Tasks completed cannot be negative.',
    );
  }

  if (
    !Number.isFinite(taskAssigned) ||
    taskAssigned < 0
  ) {
    throw new Error(
      'Tasks assigned cannot be negative.',
    );
  }

  if (taskCompleted > taskAssigned) {
    throw new Error(
      'Tasks completed cannot exceed tasks assigned.',
    );
  }
}

export async function createPerformance(
  data: PerformanceInput,
) {
  try {
    await requireRole('admin');

    validatePerformanceInput(data);

    const userId = String(
      data.userId ?? '',
    ).trim();

    const date = String(
      data.date ?? '',
    ).trim();

    const productivity = Number(
      data.productivity,
    );

    const quality = Number(
      data.quality,
    );

    const taskCompleted = Number(
      data.taskCompleted,
    );

    const tasksAssigned = Number(
      data.tasksAssigned,
    );

    const score = calculateScore(
      productivity,
      quality,
      taskCompleted,
      tasksAssigned,
    );

    const { databases } =
      await createAdminClient();

    /*
     * IMPORTANT
     *
     * Appwrite schema:
     *
     * taskCompleted
     * taskAssigned
     *
     * NOT:
     *
     * tasksCompleted
     * tasksAssigned
     */
    const documentData = {
      userId,
      date,
      productivity,
      quality,
      taskCompleted,
      taskAssigned: tasksAssigned,
      score,
      notes: String(
        data.notes ?? '',
      ).trim(),
    };

    console.log(
      'CREATE PERFORMANCE DATA:',
      documentData,
    );

    const created =
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.performanceCollectionId,
        ID.unique(),
        documentData,
      );

    console.log(
      'PERFORMANCE CREATED:',
      created.$id,
    );

    revalidatePath(
      '/admin/performance',
    );

    revalidatePath(
      '/employee/performance',
    );

    revalidatePath(
      '/dashboard',
    );

    revalidatePath(
      '/admin/analytics',
    );

    return {
      success: true,
      performance:
        toPlainPerformance(created),
    };
  } catch (error: any) {
    console.error(
      'CREATE PERFORMANCE FAILED:',
      error,
    );

    throw new Error(
      error?.message ||
        'Failed to create performance record.',
    );
  }
}

export async function updatePerformance(
  performanceId: string,
  data: UpdatePerformanceInput,
) {
  try {
    await requireRole('admin');

    if (!performanceId) {
      throw new Error(
        'Performance ID is required.',
      );
    }

    const { databases } =
      await createAdminClient();

    const existing =
      await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.performanceCollectionId,
        performanceId,
      );

    const userId =
      data.userId?.trim() ||
      String(
        existing.userId ?? '',
      );

    const date =
      data.date?.trim() ||
      String(
        existing.date ?? '',
      );

    const productivity =
      data.productivity !== undefined
        ? Number(data.productivity)
        : Number(
            existing.productivity ?? 0,
          );

    const quality =
      data.quality !== undefined
        ? Number(data.quality)
        : Number(
            existing.quality ?? 0,
          );

    /*
     * Accept both frontend naming styles.
     *
     * Frontend:
     * tasksCompleted
     *
     * Appwrite:
     * taskCompleted
     */
    const taskCompleted =
      data.taskCompleted !== undefined
        ? Number(data.taskCompleted)
        : data.tasksCompleted !== undefined
          ? Number(data.tasksCompleted)
          : Number(
              existing.taskCompleted ?? 0,
            );

    /*
     * Accept both naming styles.
     *
     * Frontend:
     * tasksAssigned
     *
     * Appwrite:
     * taskAssigned
     */
    const taskAssigned =
      data.taskAssigned !== undefined
        ? Number(data.taskAssigned)
        : data.tasksAssigned !== undefined
          ? Number(data.tasksAssigned)
          : Number(
              existing.taskAssigned ?? 0,
            );

    const notes =
      data.notes !== undefined
        ? String(data.notes).trim()
        : String(
            existing.notes ?? '',
          );

    validatePerformanceInput({
      userId,
      date,
      productivity,
      quality,
      taskCompleted,
      tasksAssigned: taskAssigned,
      notes,
    });

    const score = calculateScore(
      productivity,
      quality,
      taskCompleted,
      taskAssigned,
    );

    const updateData = {
      userId,
      date,
      productivity,
      quality,

      // Appwrite attribute
      taskCompleted,

      // Appwrite attribute
      taskAssigned,

      score,
      notes,
    };

    console.log(
      'UPDATE PERFORMANCE DATA:',
      updateData,
    );

    const updated =
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.performanceCollectionId,
        performanceId,
        updateData,
      );

    console.log(
      'PERFORMANCE UPDATED:',
      updated.$id,
    );

    revalidatePath(
      '/admin/performance',
    );

    revalidatePath(
      '/employee/performance',
    );

    revalidatePath(
      '/dashboard',
    );

    revalidatePath(
      '/admin/analytics',
    );

    return {
      success: true,
      performance:
        toPlainPerformance(updated),
    };
  } catch (error: any) {
    console.error(
      'UPDATE PERFORMANCE FAILED:',
      error,
    );

    throw new Error(
      error?.message ||
        'Failed to update performance record.',
    );
  }
}

export async function deletePerformance(
  performanceId: string,
) {
  try {
    await requireRole('admin');

    if (!performanceId) {
      throw new Error(
        'Performance ID is required.',
      );
    }

    const { databases } =
      await createAdminClient();

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.performanceCollectionId,
      performanceId,
    );

    revalidatePath(
      '/admin/performance',
    );

    revalidatePath(
      '/employee/performance',
    );

    revalidatePath(
      '/dashboard',
    );

    revalidatePath(
      '/admin/analytics',
    );

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      'DELETE PERFORMANCE FAILED:',
      error,
    );

    throw new Error(
      error?.message ||
        'Failed to delete performance record.',
    );
  }
}

export async function getAllPerformance(): Promise<
  PerformanceRecord[]
> {
  await requireRole('admin');

  const { databases } =
    await createAdminClient();

  const result =
    await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.performanceCollectionId,
      [
        Query.limit(5000),
      ],
    );

  return result.documents
    .map(toPlainPerformance)
    .sort((a, b) =>
      String(b.date).localeCompare(
        String(a.date),
      ),
    );
}

export async function getMyPerformance(): Promise<
  PerformanceRecord[]
> {
  const { user } =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      'Authentication required.',
    );
  }

  const { databases } =
    await createAdminClient();

  const result =
    await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.performanceCollectionId,
      [
        Query.equal(
          'userId',
          user.$id,
        ),
        Query.limit(5000),
      ],
    );

  return result.documents
    .map(toPlainPerformance)
    .sort((a, b) =>
      String(b.date).localeCompare(
        String(a.date),
      ),
    );
}