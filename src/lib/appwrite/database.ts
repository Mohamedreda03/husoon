import { Query, ID, Models } from "appwrite";
import { databases } from "./client";
import { APPWRITE_CONFIG } from "./config";

export interface UserProfile extends Models.Document {
  userId: string;
  name: string;
  pagesDone: number;
  startPage: number;
  pagesPerDay: number;
  streakCount: number;
  lastActiveDate?: string;
  memorizedRanges: string; // JSON string: MemorizedRange[]
  dailyGoalType: string; // DailyGoalType
  dailyGoalValue: number;
  timezone: string;
}

export interface DailyLog extends Models.Document {
  userId: string;
  date: string;
  pageMemorized?: number;
  tasksCompleted: string[];
  totalMinutes: number;
  notes?: string;
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  try {
    const response = await databases.listDocuments<UserProfile>(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.users,
      [Query.equal("userId", userId)],
    );
    return response.documents.length > 0 ? response.documents[0] : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function getUserLogs(userId: string) {
  try {
    const response = await databases.listDocuments<DailyLog>(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.dailyLogs,
      [
        Query.equal("userId", userId),
        Query.orderDesc("date"),
        Query.limit(100),
      ],
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching user logs:", error);
    throw error;
  }
}

export async function updateUserProfile(
  profileId: string,
  data: Partial<Omit<UserProfile, keyof Models.Document>>,
) {
  return await databases.updateDocument<UserProfile>(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.collections.users,
    profileId,
    data,
  );
}

export async function getTodayLog(
  userId: string,
  date: string,
): Promise<DailyLog | null> {
  try {
    const response = await databases.listDocuments<DailyLog>(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.dailyLogs,
      [Query.equal("userId", userId), Query.equal("date", date)],
    );
    return response.documents.length > 0 ? response.documents[0] : null;
  } catch (error) {
    console.error("Error fetching today log:", error);
    return null;
  }
}

export async function createOrUpdateLog(
  userId: string,
  date: string,
  data: Partial<Omit<DailyLog, keyof Models.Document>>,
) {
  const existingLog = await getTodayLog(userId, date);
  if (existingLog) {
    return await databases.updateDocument<DailyLog>(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.dailyLogs,
      existingLog.$id,
      data,
    );
  } else {
    return await databases.createDocument<DailyLog>(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.dailyLogs,
      ID.unique(),
      {
        userId,
        date,
        tasksCompleted: [],
        totalMinutes: 0,
        ...data,
      },
    );
  }
}

export async function getLogHistory(userId: string, limit: number = 30) {
  return await databases.listDocuments<DailyLog>(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.collections.dailyLogs,
    [
      Query.equal("userId", userId),
      Query.orderDesc("date"),
      Query.limit(limit),
    ],
  );
}
