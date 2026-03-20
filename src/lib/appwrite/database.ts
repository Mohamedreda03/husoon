import { Query, ID, Models } from 'appwrite';
import { databases } from './client';
import { APPWRITE_CONFIG } from './config';

export interface UserProfile extends Models.Document {
    userId: string;
    name: string;
    pagesDone: number;
    startPage: number;
    pagesPerDay: number;
    streakCount: number;
    lastActiveDate?: string;
    notificationsEnabled: boolean;
    notificationTime: string;
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

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
        const response = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.users,
            [Query.equal('userId', userId)]
        );
        return response.documents.length > 0 ? (response.documents[0] as unknown as UserProfile) : null;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

export async function getUserLogs(userId: string) {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.dailyLogs,
      [
        Query.equal('userId', userId),
        Query.orderDesc('date'),
        Query.limit(100), // Fetch last 100 days for stats
      ]
    );
    return response.documents as unknown as DailyLog[];
  } catch (error) {
    console.error('Error fetching user logs:', error);
    throw error;
  }
}

export async function updateUserProfile(profileId: string, data: Partial<UserProfile>) {
    return await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.users,
        profileId,
        data
    );
}

export async function getTodayLog(userId: string, date: string): Promise<DailyLog | null> {
    try {
        const response = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.dailyLogs,
            [Query.equal('userId', userId), Query.equal('date', date)]
        );
        return response.documents.length > 0 ? (response.documents[0] as unknown as DailyLog) : null;
    } catch (error) {
        console.error('Error fetching today log:', error);
        return null;
    }
}

export async function createOrUpdateLog(userId: string, date: string, data: Partial<DailyLog>) {
    const existingLog = await getTodayLog(userId, date);
    if (existingLog) {
        return await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.dailyLogs,
            existingLog.$id,
            data
        );
    } else {
        return await databases.createDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.dailyLogs,
            ID.unique(),
            {
                userId,
                date,
                tasksCompleted: [],
                totalMinutes: 0,
                ...data
            }
        );
    }
}

export async function getLogHistory(userId: string, limit: number = 30) {
    return await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.dailyLogs,
        [Query.equal('userId', userId), Query.orderDesc('date'), Query.limit(limit)]
    );
}

export async function savePushSubscription(userId: string, sub: PushSubscription) {
    // Find if user already has a subscription to update it, or create a new one
    try {
        const existing = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.pushSubs,
            [Query.equal('userId', userId), Query.equal('endpoint', sub.endpoint)]
        );

        const subData = {
            userId,
            endpoint: sub.endpoint,
            p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')!) as unknown as number[])),
            auth: btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')!) as unknown as number[])),
        };

        if (existing.documents.length > 0) {
            return await databases.updateDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collections.pushSubs,
                existing.documents[0].$id,
                subData
            );
        } else {
            return await databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collections.pushSubs,
                ID.unique(),
                subData
            );
        }
    } catch (error) {
        console.error('Error saving push subscription:', error);
        throw error;
    }
}
