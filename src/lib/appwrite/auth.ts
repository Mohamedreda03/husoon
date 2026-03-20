import { ID } from 'appwrite';
import { account, databases } from './client';
import { APPWRITE_CONFIG } from './config';

export async function registerUser(email: string, password: string, name: string) {
    try {
        const userAccount = await account.create(ID.unique(), email, password, name);
        if (!userAccount) throw new Error('فشل في إنشاء الحساب');

        // Login after registration to get session
        await loginUser(email, password);

        // Create user profile in collection
        await createUserProfile(userAccount.$id, name);

        return userAccount;
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'فشل في التسجيل');
    }
}

interface AppwriteError {
    code: number;
    type: string;
    message: string;
}

export async function loginUser(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        const appError = error as AppwriteError;
        // If session already exists, delete it and try again
        if (appError.code === 401 || appError.type === 'user_session_already_exists') {
            try {
                await account.deleteSession('current');
                return await account.createEmailPasswordSession(email, password);
            } catch {
                throw new Error('فشل في إعادة تسجيل الدخول');
            }
        }
        throw new Error(error instanceof Error ? error.message : 'فشل في تسجيل الدخول');
    }
}

export async function logoutUser() {
    try {
        await account.deleteSession('current');
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'فشل في تسجيل الخروج');
    }
}

export async function getCurrentUser() {
    try {
        const user = await account.get();
        return user;
    } catch {
        return null;
    }
}

export async function createUserProfile(userId: string, name: string) {
    try {
        await databases.createDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.users,
            ID.unique(),
            {
                userId: userId,
                name: name,
                pagesDone: 0,
                startPage: 3,
                pagesPerDay: 1.0,
                streakCount: 0,
                notificationsEnabled: false,
                notificationTime: "07:00",
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
        );
    } catch (error: unknown) {
        console.error('Error creating profile:', error);
        throw new Error(error instanceof Error ? error.message : 'فشل في إنشاء الملف الشخصي');
    }
}
