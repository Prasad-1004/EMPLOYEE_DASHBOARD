'use server';

import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

import {
  createAdminClient,
  getCurrentUser,
  requireRole,
} from '@/lib/appwrite/server';

import { appwriteConfig } from '@/lib/appwrite/config';

export type LeaveStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

export type LeaveRecord = {
  $id: string;
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
};

export type CreateLeaveInput = {
  startDate: string;
  endDate: string;
  reason: string;
};

export type UpdateLeaveInput = {
  status?: LeaveStatus;
  startDate?: string;
  endDate?: string;
  reason?: string;
};

function toPlainLeave(
  document: any,
): LeaveRecord {
  const status = String(
    document?.status ?? 'pending',
  ).toLowerCase();

  let safeStatus: LeaveStatus = 'pending';

  if (
    status === 'approved' ||
    status === 'rejected'
  ) {
    safeStatus = status;
  }

  return {
    $id: String(
      document?.$id ?? '',
    ),

    userId: String(
      document?.userId ?? '',
    ),

    startDate: String(
      document?.startDate ?? '',
    ),

    endDate: String(
      document?.endDate ?? '',
    ),

    reason: String(
      document?.reason ?? '',
    ),

    status: safeStatus,

    createdAt: String(
      document?.createdAt ??
        document?.$createdAt ??
        '',
    ),
  };
}

function validateDates(
  startDate: string,
  endDate: string,
) {
  if (!startDate) {
    throw new Error(
      'Start date is required.',
    );
  }

  if (!endDate) {
    throw new Error(
      'End date is required.',
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    throw new Error(
      'Invalid leave dates.',
    );
  }

  if (end < start) {
    throw new Error(
      'End date cannot be before start date.',
    );
  }
}

export async function createLeave(
  input: CreateLeaveInput,
) {
  const { user } =
    await getCurrentUser();

  const startDate = String(
    input.startDate ?? '',
  ).trim();

  const endDate = String(
    input.endDate ?? '',
  ).trim();

  const reason = String(
    input.reason ?? '',
  ).trim();

  validateDates(
    startDate,
    endDate,
  );

  if (!reason) {
    throw new Error(
      'Leave reason is required.',
    );
  }

  if (reason.length > 500) {
    throw new Error(
      'Leave reason is too long.',
    );
  }

  const { databases } =
    await createAdminClient();

  const result =
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.leaveCollectionId,
      ID.unique(),
      {
        userId: user.$id,
        startDate,
        endDate,
        reason,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    );

  const leave =
    toPlainLeave(result);

  revalidatePath('/leave');
  revalidatePath('/admin/leaves');
  revalidatePath('/dashboard');

  return {
    success: true,
    leave,
  };
}

export async function getMyLeaves(): Promise<
  LeaveRecord[]
> {
  const { user } =
    await getCurrentUser();

  const { databases } =
    await createAdminClient();

  const result =
    await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.leaveCollectionId,
      [
        Query.equal(
          'userId',
          user.$id,
        ),
        Query.limit(5000),
      ],
    );

  return result.documents
    .map(toPlainLeave)
    .sort(
      (a, b) =>
        new Date(
          b.createdAt,
        ).getTime() -
        new Date(
          a.createdAt,
        ).getTime(),
    );
}

export async function getAllLeaves(): Promise<
  LeaveRecord[]
> {
  await requireRole('admin');

  const { databases } =
    await createAdminClient();

  const result =
    await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.leaveCollectionId,
      [
        Query.limit(5000),
      ],
    );

  return result.documents
    .map(toPlainLeave)
    .sort(
      (a, b) =>
        new Date(
          b.createdAt,
        ).getTime() -
        new Date(
          a.createdAt,
        ).getTime(),
    );
}

export async function updateLeave(
  id: string,
  input: UpdateLeaveInput,
) {
  await requireRole('admin');

  if (!id) {
    throw new Error(
      'Leave ID is required.',
    );
  }

  const data: Record<
    string,
    string
  > = {};

  if (
    input.status !== undefined
  ) {
    const status = String(
      input.status,
    ).toLowerCase();

    if (
      status !== 'pending' &&
      status !== 'approved' &&
      status !== 'rejected'
    ) {
      throw new Error(
        'Invalid leave status.',
      );
    }

    data.status = status;
  }

  if (
    input.startDate !== undefined
  ) {
    data.startDate = String(
      input.startDate,
    ).trim();
  }

  if (
    input.endDate !== undefined
  ) {
    data.endDate = String(
      input.endDate,
    ).trim();
  }

  if (
    input.reason !== undefined
  ) {
    data.reason = String(
      input.reason,
    ).trim();
  }

  if (
    data.startDate ||
    data.endDate
  ) {
    const existing =
      await getLeaveById(id);

    validateDates(
      data.startDate ??
        existing.startDate,
      data.endDate ??
        existing.endDate,
    );
  }

  const { databases } =
    await createAdminClient();

  const updated =
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.leaveCollectionId,
      id,
      data,
    );

  const leave =
    toPlainLeave(updated);

  revalidatePath('/leave');
  revalidatePath('/admin/leaves');
  revalidatePath('/dashboard');

  return {
    success: true,
    leave,
  };
}

export async function deleteLeave(
  id: string,
) {
  await requireRole('admin');

  if (!id) {
    throw new Error(
      'Leave ID is required.',
    );
  }

  const { databases } =
    await createAdminClient();

  await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.leaveCollectionId,
    id,
  );

  revalidatePath('/leave');
  revalidatePath('/admin/leaves');
  revalidatePath('/dashboard');

  return {
    success: true,
  };
}

async function getLeaveById(
  id: string,
): Promise<LeaveRecord> {
  const { databases } =
    await createAdminClient();

  const document =
    await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.leaveCollectionId,
      id,
    );

  return toPlainLeave(
    document,
  );
}