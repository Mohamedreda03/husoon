export const APPWRITE_CONFIG = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  collections: {
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
    dailyLogs: process.env.NEXT_PUBLIC_APPWRITE_LOGS_COLLECTION!,
    sessions: process.env.NEXT_PUBLIC_APPWRITE_SESSIONS_COLLECTION!,
    pushSubs: process.env.NEXT_PUBLIC_APPWRITE_PUSH_COLLECTION!,
  }
}
