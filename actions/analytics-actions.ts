
'use server';

import { Query } from 'node-appwrite';

import {
  createAdminClient,
  getCurrentUser,
} from '@/lib/appwrite/server';

import { appwriteConfig } from '@/lib/appwrite/config';

type PlainRecord = {
  [key: string]: any;
};

function toPlainObject(
  document: any,
): PlainRecord {
  const plain: PlainRecord = {};

  if (!document) {
    return plain;
  }

  Object.keys(document).forEach((key) => {
    const value = document[key];

    if (
      value === null ||
      value === undefined
    ) {
      plain[key] = value;
      return;
    }

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      plain[key] = value;
      return;
    }

    try {
      plain[key] = String(value);
    } catch {
      plain[key] = '';
    }
  });

  return plain;
}

function toNumber(
  value: any,
): number {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
}

function round(
  value: number,
): number {
  return Math.round(
    Number.isFinite(value) ? value : 0,
  );
}

function getDateValue(
  record: PlainRecord,
): string {
  return String(
    record.date ??
      record.reviewDate ??
      record.createdAt ??
      record.$createdAt ??
      '',
  );
}

function getMonthKey(
  record: PlainRecord,
): string {
  const date = getDateValue(record);

  if (!date) {
    return '';
  }

  return date.slice(0, 7);
}

async function requireAdmin() {
  const { profile } =
    await getCurrentUser();

  if (
    !profile ||
    String(profile.role) !== 'admin'
  ) {
    throw new Error('Unauthorized');
  }

  return profile;
}

export async function getDashboardStats() {
  const { user, profile } =
    await getCurrentUser();

  if (!profile) {
    throw new Error(
      'Authentication required.',
    );
  }

  const { databases } =
    await createAdminClient();

  const today = new Intl.DateTimeFormat(
    'en-CA',
    {
      timeZone:
        process.env.APP_TIMEZONE ||
        'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
  ).format(new Date());

  const [
    employeeResult,
    attendanceResult,
    leaveResult,
    performanceResult,
  ] = await Promise.all([
    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.profileCollectionId,
      [
        Query.limit(5000),
      ],
    ),

    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      [
        Query.limit(5000),
      ],
    ),

    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.leaveCollectionId,
      [
        Query.limit(5000),
      ],
    ),

    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.performanceCollectionId,
      [
        Query.limit(5000),
      ],
    ),
  ]);

  const employees =
    employeeResult.documents.map(
      toPlainObject,
    );

  const attendance =
    attendanceResult.documents.map(
      toPlainObject,
    );

  const leaves =
    leaveResult.documents.map(
      toPlainObject,
    );

  const performance =
    performanceResult.documents.map(
      toPlainObject,
    );

  /*
   * =========================
   * ADMIN / GLOBAL STATS
   * =========================
   */

  const activeEmployees =
    employees.filter(
      (employee) =>
        String(
          employee.status ?? '',
        ).toLowerCase() !==
        'inactive',
    );

  const todayAttendance =
    attendance.filter(
      (item) =>
        String(item.date ?? '') ===
        today,
    );

  const present =
    todayAttendance.filter(
      (item) =>
        String(
          item.status ?? '',
        ).toLowerCase() ===
        'present',
    ).length;

  const late =
    todayAttendance.filter(
      (item) =>
        String(
          item.status ?? '',
        ).toLowerCase() ===
        'late',
    ).length;

  const absent = Math.max(
    0,
    activeEmployees.length -
      todayAttendance.length,
  );

  const workingHours =
    todayAttendance
      .map((item) =>
        toNumber(
          item.workingHours,
        ),
      )
      .filter(
        (value) => value > 0,
      );

  const averageWorkingHours =
    workingHours.length > 0
      ? workingHours.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) /
        workingHours.length
      : 0;

  const pendingLeaves =
    leaves.filter(
      (leave) =>
        String(
          leave.status ?? '',
        ).toLowerCase() ===
        'pending',
    ).length;

  const performanceScores =
    performance
      .map((item) =>
        toNumber(
          item.score ??
            item.performanceScore ??
            0,
        ),
      )
      .filter(
        (value) => value > 0,
      );

  const averageScore =
    performanceScores.length > 0
      ? performanceScores.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) /
        performanceScores.length
      : 0;

  /*
   * =========================
   * CURRENT EMPLOYEE STATS
   * =========================
   */

  const myAttendance =
    attendance.filter(
      (item) =>
        String(
          item.userId ?? '',
        ) === user.$id,
    );

  const myTodayAttendance =
    myAttendance.find(
      (item) =>
        String(item.date ?? '') ===
        today,
    ) ?? null;

  const myPresent =
    myAttendance.filter(
      (item) =>
        String(
          item.status ?? '',
        ).toLowerCase() ===
        'present',
    ).length;

  const myLate =
    myAttendance.filter(
      (item) =>
        String(
          item.status ?? '',
        ).toLowerCase() ===
        'late',
    ).length;

  const myPerformance =
    performance.filter(
      (item) =>
        String(
          item.userId ?? '',
        ) === user.$id,
    );

  const myProductivityValues =
    myPerformance
      .map((item) =>
        toNumber(
          item.productivity ??
            item.productivityScore ??
            0,
        ),
      )
      .filter(
        (value) => value >= 0,
      );

  const myQualityValues =
    myPerformance
      .map((item) =>
        toNumber(
          item.quality ??
            item.qualityScore ??
            0,
        ),
      )
      .filter(
        (value) => value >= 0,
      );

  const myScoreValues =
    myPerformance
      .map((item) =>
        toNumber(
          item.score ??
            item.performanceScore ??
            0,
        ),
      )
      .filter(
        (value) => value >= 0,
      );

  const myProductivity =
    myProductivityValues.length > 0
      ? myProductivityValues.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) /
        myProductivityValues.length
      : 0;

  const myQuality =
    myQualityValues.length > 0
      ? myQualityValues.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) /
        myQualityValues.length
      : 0;

  const myScore =
    myScoreValues.length > 0
      ? myScoreValues.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) /
        myScoreValues.length
      : 0;

  const myApprovedLeaves =
    leaves.filter(
      (leave) =>
        String(
          leave.userId ?? '',
        ) === user.$id &&
        String(
          leave.status ?? '',
        ).toLowerCase() ===
        'approved',
    ).length;

  const myPendingLeaves =
    leaves.filter(
      (leave) =>
        String(
          leave.userId ?? '',
        ) === user.$id &&
        String(
          leave.status ?? '',
        ).toLowerCase() ===
        'pending',
    ).length;

  const myRejectedLeaves =
    leaves.filter(
      (leave) =>
        String(
          leave.userId ?? '',
        ) === user.$id &&
        String(
          leave.status ?? '',
        ).toLowerCase() ===
        'rejected',
    ).length;

  /*
   * =========================
   * RETURN
   * =========================
   */

  return {
    totalEmployees:
      activeEmployees.length,

    present,

    late,

    leave: pendingLeaves,

    pendingLeaves,

    absent,

    averageWorkingHours:
      Number(
        averageWorkingHours.toFixed(2),
      ),

    score: round(
      averageScore,
    ),

    performance: round(
      averageScore,
    ),

    /*
     * Employee-specific dashboard
     */

    my: {
      attendance:
        myAttendance.length,

      present:
        myPresent,

      late:
        myLate,

      productivity:
        round(myProductivity),

      quality:
        round(myQuality),

      score:
        round(myScore),

      approvedLeaves:
        myApprovedLeaves,

      pendingLeaves:
        myPendingLeaves,

      rejectedLeaves:
        myRejectedLeaves,

      todayCheckedIn:
        Boolean(
          myTodayAttendance?.checkIn,
        ),

      todayCheckedOut:
        Boolean(
          myTodayAttendance?.checkOut,
        ),
    },
  };
}

export async function getAnalytics() {
  await requireAdmin();

  const { databases } =
    await createAdminClient();

  /*
   * IMPORTANT
   *
   * Do NOT use:
   *
   * Query.orderDesc('date')
   * Query.orderAsc('date')
   * Query.equal('date', ...)
   *
   * on the Performance collection.
   *
   * The current Appwrite Performance collection
   * does not expose "date" as a queryable schema
   * attribute.
   *
   * We therefore fetch Performance records without
   * a date query and process/sort them locally.
   */

  const [
    attendanceResult,
    performanceResult,
    leaveResult,
    departmentResult,
    employeeResult,
  ] = await Promise.all([
    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.attendanceCollectionId,
      [
        Query.limit(5000),
      ],
    ),

    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.performanceCollectionId,
      [
        Query.limit(5000),
      ],
    ),

    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.leaveCollectionId,
      [
        Query.limit(5000),
      ],
    ),

    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.departmentsCollectionId,
      [
        Query.limit(500),
      ],
    ),

    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.profileCollectionId,
      [
        Query.limit(5000),
      ],
    ),
  ]);

  const attendance =
    attendanceResult.documents.map(
      toPlainObject,
    );

  const performance =
    performanceResult.documents.map(
      toPlainObject,
    );

  const leaves =
    leaveResult.documents.map(
      toPlainObject,
    );

  const departments =
    departmentResult.documents.map(
      toPlainObject,
    );

  const employees =
    employeeResult.documents.map(
      toPlainObject,
    );

  /*
   * ATTENDANCE
   */

  const totalAttendance =
    attendance.length;

  const presentAttendance =
    attendance.filter(
      (item) =>
        String(
          item.status ?? '',
        ).toLowerCase() ===
        'present',
    ).length;

  const lateAttendance =
    attendance.filter(
      (item) =>
        String(
          item.status ?? '',
        ).toLowerCase() ===
        'late',
    ).length;

  const absentAttendance =
    attendance.filter(
      (item) =>
        String(
          item.status ?? '',
        ).toLowerCase() ===
        'absent',
    ).length;

  const attendanceRate =
    totalAttendance > 0
      ? round(
          (presentAttendance /
            totalAttendance) *
            100,
        )
      : 0;

  /*
   * PERFORMANCE
   */

  const productivityValues =
    performance
      .map((item) =>
        toNumber(
          item.productivity ??
            item.productivityScore ??
            0,
        ),
      )
      .filter(
        (value) => value >= 0,
      );

  const qualityValues =
    performance
      .map((item) =>
        toNumber(
          item.quality ??
            item.qualityScore ??
            0,
        ),
      )
      .filter(
        (value) => value >= 0,
      );

  const scoreValues =
    performance
      .map((item) =>
        toNumber(
          item.score ??
            item.performanceScore ??
            0,
        ),
      )
      .filter(
        (value) => value >= 0,
      );

  const averageProductivity =
    productivityValues.length > 0
      ? productivityValues.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) /
        productivityValues.length
      : 0;

  const averageQuality =
    qualityValues.length > 0
      ? qualityValues.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) /
        qualityValues.length
      : 0;

  const averageScore =
    scoreValues.length > 0
      ? scoreValues.reduce(
          (sum, value) =>
            sum + value,
          0,
        ) /
        scoreValues.length
      : 0;

  /*
   * PRODUCTIVITY TREND
   *
   * Group performance records by month.
   * No Appwrite date query is used.
   */

  const monthlyPerformance: Record<
    string,
    {
      productivity: number[];
      quality: number[];
      score: number[];
    }
  > = {};

  performance.forEach(
    (item) => {
      const month =
        getMonthKey(item);

      if (!month) {
        return;
      }

      if (!monthlyPerformance[month]) {
        monthlyPerformance[month] = {
          productivity: [],
          quality: [],
          score: [],
        };
      }

      monthlyPerformance[
        month
      ].productivity.push(
        toNumber(
          item.productivity ??
            item.productivityScore ??
            0,
        ),
      );

      monthlyPerformance[
        month
      ].quality.push(
        toNumber(
          item.quality ??
            item.qualityScore ??
            0,
        ),
      );

      monthlyPerformance[
        month
      ].score.push(
        toNumber(
          item.score ??
            item.performanceScore ??
            0,
        ),
      );
    },
  );

  const productivityTrend =
    Object.entries(
      monthlyPerformance,
    )
      .sort(([a], [b]) =>
        a.localeCompare(b),
      )
      .slice(-12)
      .map(
        ([date, values]) => {
          const productivity =
            values.productivity
              .length > 0
              ? values.productivity.reduce(
                  (sum, value) =>
                    sum + value,
                  0,
                ) /
                values.productivity
                  .length
              : 0;

          const quality =
            values.quality.length > 0
              ? values.quality.reduce(
                  (sum, value) =>
                    sum + value,
                  0,
                ) /
                values.quality.length
              : 0;

          const score =
            values.score.length > 0
              ? values.score.reduce(
                  (sum, value) =>
                    sum + value,
                  0,
                ) /
                values.score.length
              : 0;

          return {
            date,
            productivity:
              round(
                productivity,
              ),
            quality:
              round(quality),
            score:
              round(score),
          };
        },
      );

  /*
   * TEAM / DEPARTMENT COMPARISON
   */

  const departmentMap =
    new Map<string, string>();

  departments.forEach(
    (department) => {
      departmentMap.set(
        String(
          department.$id ?? '',
        ),
        String(
          department.name ??
            'Unassigned',
        ),
      );
    },
  );

  const teamData: Record<
    string,
    {
      total: number;
      productivity: number;
      quality: number;
      score: number;
    }
  > = {};

  performance.forEach(
    (item) => {
      const departmentId =
        String(
          item.departmentId ??
            '',
        );

      const departmentName =
        departmentMap.get(
          departmentId,
        ) ??
        String(
          item.department ??
            'Unassigned',
        );

      if (!teamData[departmentName]) {
        teamData[
          departmentName
        ] = {
          total: 0,
          productivity: 0,
          quality: 0,
          score: 0,
        };
      }

      const productivity =
        toNumber(
          item.productivity ??
            item.productivityScore ??
            0,
        );

      const quality =
        toNumber(
          item.quality ??
            item.qualityScore ??
            0,
        );

      const score =
        toNumber(
          item.score ??
            item.performanceScore ??
            0,
        );

      teamData[
        departmentName
      ].total += 1;

      teamData[
        departmentName
      ].productivity +=
        productivity;

      teamData[
        departmentName
      ].quality += quality;

      teamData[
        departmentName
      ].score += score;
    },
  );

  const teamComparison =
    Object.entries(
      teamData,
    )
      .map(
        ([department, values]) => ({
          department,

          value:
            values.total > 0
              ? round(
                  values.score /
                    values.total,
                )
              : 0,

          productivity:
            values.total > 0
              ? round(
                  values.productivity /
                    values.total,
                )
              : 0,

          quality:
            values.total > 0
              ? round(
                  values.quality /
                    values.total,
                )
              : 0,

          score:
            values.total > 0
              ? round(
                  values.score /
                    values.total,
                )
              : 0,
        }),
      )
      .sort(
        (a, b) =>
          b.value - a.value,
      );

  /*
   * LEAVE ANALYTICS
   */

  const totalLeaves =
    leaves.length;

  const pendingLeaves =
    leaves.filter(
      (leave) =>
        String(
          leave.status ?? '',
        ).toLowerCase() ===
        'pending',
    ).length;

  const approvedLeaves =
    leaves.filter(
      (leave) =>
        String(
          leave.status ?? '',
        ).toLowerCase() ===
        'approved',
    ).length;

  const rejectedLeaves =
    leaves.filter(
      (leave) =>
        String(
          leave.status ?? '',
        ).toLowerCase() ===
        'rejected',
    ).length;

  /*
   * WORKFORCE
   */

  const activeEmployees =
    employees.filter(
      (employee) =>
        String(
          employee.status ?? '',
        ).toLowerCase() !==
        'inactive',
    );

  /*
   * Return shape matches the
   * current Analytics page.
   */

  return {
    attendance: {
      total: totalAttendance,
      present:
        presentAttendance,
      late:
        lateAttendance,
      absent:
        absentAttendance,
      rate:
        attendanceRate,
    },

    performance: {
      productivity:
        round(
          averageProductivity,
        ),

      quality:
        round(
          averageQuality,
        ),

      score:
        round(
          averageScore,
        ),
    },

    leave: {
      total:
        totalLeaves,

      pending:
        pendingLeaves,

      approved:
        approvedLeaves,

      rejected:
        rejectedLeaves,
    },

    productivityTrend,

    teamComparison,

    employees:
      activeEmployees.length,

    totalEmployees:
      activeEmployees.length,

    departmentCount:
      departments.length,

    leaveCount:
      totalLeaves,

    absentCount:
      absentAttendance,
  };
}
