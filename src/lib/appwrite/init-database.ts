import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY || !DATABASE_ID) {
  console.error('Missing environment variables. Please check .env.local');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

interface AttributeConfig {
  key: string;
  type: 'string' | 'integer' | 'float' | 'boolean';
  size?: number;
  required: boolean;
  default?: string | number | boolean;
  array?: boolean;
}

interface CollectionConfig {
  id: string;
  name: string;
  attributes: AttributeConfig[];
}

const COLLECTIONS: Record<string, CollectionConfig> = {
  users: {
    id: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION || 'users',
    name: 'Users',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'pagesDone', type: 'integer', required: false, default: 0 },
      { key: 'startPage', type: 'integer', required: false, default: 3 },
      { key: 'pagesPerDay', type: 'float', required: false, default: 1.0 },
      { key: 'streakCount', type: 'integer', required: false, default: 0 },
      { key: 'lastActiveDate', type: 'string', size: 50, required: false },
      { key: 'notificationsEnabled', type: 'boolean', required: false, default: false },
      { key: 'notificationTime', type: 'string', size: 10, required: false, default: '07:00' },
      { key: 'timezone', type: 'string', size: 100, required: true },
    ]
  },
  dailyLogs: {
    id: process.env.NEXT_PUBLIC_APPWRITE_LOGS_COLLECTION || 'dailyLogs',
    name: 'Daily Logs',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'date', type: 'string', size: 50, required: true },
      { key: 'pageMemorized', type: 'integer', required: false },
      { key: 'tasksCompleted', type: 'string', size: 100, required: true, array: true },
      { key: 'totalMinutes', type: 'integer', required: false, default: 0 },
      { key: 'notes', type: 'string', size: 5000, required: false },
    ]
  },
  pushSubscriptions: {
    id: process.env.NEXT_PUBLIC_APPWRITE_PUSH_COLLECTION || 'pushSubscriptions',
    name: 'Push Subscriptions',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'endpoint', type: 'string', size: 2000, required: true },
      { key: 'p256dh', type: 'string', size: 500, required: true },
      { key: 'auth', type: 'string', size: 500, required: true },
    ]
  }
};

async function setup() {
  const reset = process.argv.includes('--reset');
  try {
    // 1. Check/Create Database
    try {
      await databases.get(DATABASE_ID!);
      console.log(`Database "${DATABASE_ID}" already exists.`);
    } catch (e) {
      if ((e as { code: number }).code === 404) {
        await databases.create(DATABASE_ID!, 'Husoon Database');
        console.log(`Created Database: ${DATABASE_ID}`);
      } else {
        throw e;
      }
    }

    // 2. Create Collections
    for (const [key, config] of Object.entries(COLLECTIONS)) {
      if (reset) {
        try {
          await databases.deleteCollection(DATABASE_ID!, config.id);
          console.log(`Deleted existing collection: ${config.name}`);
          // Wait a bit for deletion to propagate
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {}
      }

      try {
        await databases.getCollection(DATABASE_ID!, config.id);
        console.log(`Collection "${config.name}" (${config.id}) already exists.`);
      } catch (e) {
        if ((e as { code: number }).code === 404) {
          await databases.createCollection(
            DATABASE_ID!,
            config.id,
            config.name,
            [
              Permission.read(Role.any()),
              Permission.write(Role.users()),
              Permission.update(Role.users()),
              Permission.delete(Role.users()),
            ]
          );
          console.log(`Created Collection: ${config.name}`);

          // Wait a bit for collection to be ready before creating attributes
          await new Promise(resolve => setTimeout(resolve, 1000));

          // 3. Create Attributes
          for (const attr of config.attributes) {
            try {
              if (attr.type === 'string') {
                await databases.createStringAttribute(DATABASE_ID!, config.id, attr.key, attr.size!, attr.required, attr.default as string, attr.array);
              } else if (attr.type === 'integer') {
                await databases.createIntegerAttribute(DATABASE_ID!, config.id, attr.key, attr.required, 0, 1000000, attr.default as number, attr.array);
              } else if (attr.type === 'float') {
                await databases.createFloatAttribute(DATABASE_ID!, config.id, attr.key, attr.required, 0, 100, attr.default as number, attr.array);
              } else if (attr.type === 'boolean') {
                await databases.createBooleanAttribute(DATABASE_ID!, config.id, attr.key, attr.required, attr.default as boolean, attr.array);
              }
              console.log(`  - Created attribute: ${attr.key}`);
              // Small delay between attributes
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (ae) {
              console.error(`  - Error creating attribute ${attr.key}:`, (ae as Error).message);
            }
          }
        } else {
          throw e;
        }
      }
    }

    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Setup failed:', (error as Error).message);
  }
}

setup();
