# Plan: Appwrite Database Initialization

## Objective
Create the required Appwrite database and collections (Users, Daily Logs, Push Subscriptions) with their respective attributes and permissions.

## Key Files & Context
- `src/lib/appwrite/config.ts`: Contains the database and collection IDs.
- `src/lib/appwrite/database.ts`: Defines the schema for `UserProfile` and `DailyLog`.
- `package.json`: Contains the `appwrite` dependency.

## Implementation Steps

### 1. Create Initialization Script
Create a new file `src/lib/appwrite/setup.ts` (or a root-level script) that:
- Initializes an Appwrite `Client` with an API Key.
- Checks for the existence of the database specified in `APPWRITE_CONFIG.databaseId`.
- Creates the database if it doesn't exist.
- Creates the collections: `users`, `dailyLogs`, and `pushSubscriptions`.
- Defines attributes for each collection based on the `database.ts` interfaces.
- Sets appropriate collection permissions (usually `Role.users()` or `Role.any()`).

### 2. Define Attributes
#### Users Collection:
- `userId`: string, required, key
- `name`: string, required
- `pagesDone`: integer, required, default 0
- `startPage`: integer, required, default 3
- `pagesPerDay`: float/double, required, default 1.0
- `streakCount`: integer, required, default 0
- `lastActiveDate`: string (ISO), optional
- `notificationsEnabled`: boolean, required, default false
- `notificationTime`: string, required, default "07:00"
- `timezone`: string, required

#### Daily Logs Collection:
- `userId`: string, required, key
- `date`: string, required
- `pageMemorized`: integer, optional
- `tasksCompleted`: string array, required
- `totalMinutes`: integer, required, default 0
- `notes`: string, optional

#### Push Subscriptions Collection:
- `userId`: string, required, key
- `endpoint`: string, required
- `p256dh`: string, required
- `auth`: string, required

### 3. Execution & Verification
- Run the script using `node` or `ts-node` (via `npx`).
- Verify that the collections and attributes have been created successfully by listing them after creation.

## Verification & Testing
- Use the script's output to confirm successful creation.
- Check for any errors during attribute creation (e.g., if attributes already exist).
- Manually verify in the Appwrite Console (if available).
