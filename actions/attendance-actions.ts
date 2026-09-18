'use server';

import { ID, Query } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import {
  createAdminClient,
  getCurrentUser,
  requireRole,
} from '@/lib/appwrite/server';

function getToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone:
      process.env.APP_TIMEZONE || 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function getCurrentTime() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone:
      process.env.APP_TIMEZONE || 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}

/* =========================
   PLAIN ATTENDANCE OBJECT
========================= */

function toPlainAttendance(document: any) {
  return {
    $id: String(document.$id ?? ''),
    userId: String(document.userId ?? ''),
    date: String(document.date ?? ''),
    status: String(document.status ?? ''),
    checkIn: document.checkIn
      ? String(document.checkIn)
      : undefined,
    checkOut: document.checkOut
      ? String(document.checkOut)
      : undefined,
    workingHours: Number(
      document.workingHours ?? 0,
    ),
  };
}

/* =========================
   EMPLOYEE CHECK IN
========================= */

export async function checkInUser() {
  const { user } = await getCurrentUser();

  const { databases } =
    await createAdminClient();

  const today = getToday();

  const existing =
    await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      [
        Query.equal(
          'userId',
          user.$id,
        ),
        Query.equal(
          'date',
          today,
        ),
        Query.limit(1),
      ],
    );

  if (existing.documents.length > 0) {
    throw new Error(
      'You have already checked in today.',
    );
  }

  const now = new Date();

  const checkIn =
    now.toISOString();

  const [hour, minute] =
    getCurrentTime()
      .split(':')
      .map(Number);

  const currentMinutes =
    hour * 60 + minute;

  const lateAfter =
    9 * 60 + 30;

  const status =
    currentMinutes > lateAfter
      ? 'late'
      : 'present';

  const document =
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      ID.unique(),
      {
        userId: user.$id,
        date: today,
        checkIn,
        checkOut: null,
        status,
        workingHours: 0,
      },
    );

  return {
    success: true as const,
    attendance: toPlainAttendance(
      document,
    ),
  };
}

/* =========================
   EMPLOYEE CHECK OUT
========================= */

export async function checkOutUser(
  documentId: string,
) {
  const { user } =
    await getCurrentUser();

  const { databases } =
    await createAdminClient();

  const document =
    await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      documentId,
    );

  if (
    String(document.userId) !==
    user.$id
  ) {
    throw new Error(
      'Unauthorized.',
    );
  }

  if (!document.checkIn) {
    throw new Error(
      'Check-in record not found.',
    );
  }

  if (document.checkOut) {
    throw new Error(
      'You have already checked out.',
    );
  }

  const checkOut =
    new Date().toISOString();

  const checkInTime =
    new Date(
      String(document.checkIn),
    ).getTime();

  const checkOutTime =
    new Date(
      checkOut,
    ).getTime();

  const workingHours =
    Number(
      Math.max(
        0,
        (checkOutTime -
          checkInTime) /
          (1000 * 60 * 60),
      ).toFixed(2),
    );

  const updated =
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      documentId,
      {
        checkOut,
        workingHours,
      },
    );

  return {
    success: true as const,
    attendance:
      toPlainAttendance(updated),
  };
}

/* =========================
   MY ATTENDANCE
========================= */

export async function getMyAttendance(
  month?: string,
) {
  const { user } =
    await getCurrentUser();

  const { databases } =
    await createAdminClient();

  const queries = [
    Query.equal(
      'userId',
      user.$id,
    ),
    Query.limit(500),
  ];

  if (month) {
    queries.push(
      Query.greaterThanEqual(
        'date',
        `${month}-01`,
      ),
      Query.lessThanEqual(
        'date',
        `${month}-31`,
      ),
    );
  }

  const result =
    await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      queries,
    );

  return result.documents
    .map(toPlainAttendance)
    .sort((a, b) =>
      b.date.localeCompare(a.date),
    );
}

/* =========================
   ADMIN - ALL ATTENDANCE
========================= */

export async function getAllAttendance(
  date?: string,
) {
  await requireRole('admin');

  const { databases } =
    await createAdminClient();

  const queries = [
    Query.limit(500),
  ];

  if (date) {
    queries.push(
      Query.equal(
        'date',
        date,
      ),
    );
  }

  const result =
    await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      queries,
    );

  return result.documents
    .map(toPlainAttendance)
    .sort((a, b) =>
      b.date.localeCompare(a.date),
    );
}

/* =========================
   ADMIN - UPDATE ATTENDANCE
========================= */

export async function updateAttendance(
  attendanceId: string,
  data: {
    status?: string;
    checkIn?: string;
    checkOut?: string;
    workingHours?: number;
  },
) {
  await requireRole('admin');

  const { databases } =
    await createAdminClient();

  const payload: Record<
    string,
    unknown
  > = {};

  if (
    data.status !== undefined
  ) {
    payload.status =
      data.status;
  }

  if (
    data.checkIn !== undefined
  ) {
    payload.checkIn =
      data.checkIn || null;
  }

  if (
    data.checkOut !== undefined
  ) {
    payload.checkOut =
      data.checkOut || null;
  }

  if (
    data.workingHours !== undefined
  ) {
    payload.workingHours =
      data.workingHours;
  }

  const updated =
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      attendanceId,
      payload,
    );

  return {
    success: true,
    attendance:
      toPlainAttendance(updated),
  };
}

/* =========================
   ADMIN - CREATE ATTENDANCE
========================= */

export async function createAttendance(
  data: {
    userId: string;
    date: string;
    status: string;
    checkIn?: string;
    checkOut?: string;
    workingHours?: number;
  },
) {
  await requireRole('admin');

  const { databases } =
    await createAdminClient();

  const existing =
    await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      [
        Query.equal(
          'userId',
          data.userId,
        ),
        Query.equal(
          'date',
          data.date,
        ),
        Query.limit(1),
      ],
    );

  if (
    existing.documents.length > 0
  ) {
    throw new Error(
      'Attendance already exists for this employee and date.',
    );
  }

  const document =
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      ID.unique(),
      {
        userId: data.userId,
        date: data.date,
        status: data.status,
        checkIn:
          data.checkIn || null,
        checkOut:
          data.checkOut || null,
        workingHours:
          data.workingHours ?? 0,
      },
    );

  return {
    success: true,
    attendance:
      toPlainAttendance(document),
  };
}

/* =========================
   ADMIN - DELETE ATTENDANCE
========================= */

export async function deleteAttendance(
  attendanceId: string,
) {
  await requireRole('admin');

  const { databases } =
    await createAdminClient();

  await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.attendanceCollectionId,
    attendanceId,
  );

  return {
    success: true,
  };
}