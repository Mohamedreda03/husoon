import { Client, Databases, Permission, Role, IndexType, OrderBy } from 'node-appwrite';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY || !DATABASE_ID) {
  console.error('❌ Missing environment variables. Please check .env.local');
  console.error('Required: NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY, NEXT_PUBLIC_APPWRITE_DATABASE_ID');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// ────────────────────────────────────────────────────────────────────
// Schema Definition
// ────────────────────────────────────────────────────────────────────

interface AttributeConfig {
  key: string;
  type: 'string' | 'integer' | 'float' | 'boolean';
  size?: number;
  required: boolean;
  default?: string | number | boolean;
  array?: boolean;
  min?: number;
  max?: number;
}

interface IndexConfig {
  key: string;
  type: IndexType;
  attributes: string[];
  orders?: OrderBy[];
}

interface CollectionConfig {
  id: string;
  name: string;
  attributes: AttributeConfig[];
  indexes: IndexConfig[];
}

const COLLECTIONS: Record<string, CollectionConfig> = {
  users: {
    id: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION || 'users',
    name: 'Users',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'pagesDone', type: 'integer', required: false, default: 0, min: 0, max: 1000000 },
      { key: 'startPage', type: 'integer', required: false, default: 1, min: 1, max: 604 },
      { key: 'pagesPerDay', type: 'float', required: false, default: 1.0, min: 0, max: 100 },
      { key: 'streakCount', type: 'integer', required: false, default: 0, min: 0, max: 1000000 },
      { key: 'lastActiveDate', type: 'string', size: 50, required: false },
      { key: 'memorizedRanges', type: 'string', size: 5000, required: false, default: '[]' },
      { key: 'dailyGoalType', type: 'string', size: 20, required: false, default: 'page' },
      { key: 'dailyGoalValue', type: 'integer', required: false, default: 1, min: 0, max: 100 },
      { key: 'dailyGoalUnit', type: 'string', size: 20, required: false, default: 'face' },
      { key: 'timezone', type: 'string', size: 100, required: true },
    ],
    indexes: [
      { key: 'idx_userId', type: IndexType.Unique, attributes: ['userId'] },
    ],
  },
  dailyLogs: {
    id: process.env.NEXT_PUBLIC_APPWRITE_LOGS_COLLECTION || 'dailyLogs',
    name: 'Daily Logs',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'date', type: 'string', size: 50, required: true },
      { key: 'pageMemorized', type: 'integer', required: false, min: 0, max: 1000000 },
      { key: 'tasksCompleted', type: 'string', size: 100, required: true, array: true },
      { key: 'totalMinutes', type: 'integer', required: false, default: 0, min: 0, max: 1000000 },
      { key: 'notes', type: 'string', size: 5000, required: false },
    ],
    indexes: [
      { key: 'idx_userId', type: IndexType.Key, attributes: ['userId'] },
      { key: 'idx_userId_date', type: IndexType.Unique, attributes: ['userId', 'date'] },
      { key: 'idx_date', type: IndexType.Key, attributes: ['date'], orders: [OrderBy.Desc] },
    ],
  },
};

// ────────────────────────────────────────────────────────────────────
// Helper Functions
// ────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function createAttribute(databaseId: string, collectionId: string, attr: AttributeConfig) {
  try {
    if (attr.type === 'string') {
      await databases.createStringAttribute(
        databaseId, collectionId, attr.key,
        attr.size!, attr.required,
        attr.default as string | undefined,
        attr.array
      );
    } else if (attr.type === 'integer') {
      await databases.createIntegerAttribute(
        databaseId, collectionId, attr.key,
        attr.required,
        attr.min ?? 0,
        attr.max ?? 1000000,
        attr.default as number | undefined,
        attr.array
      );
    } else if (attr.type === 'float') {
      await databases.createFloatAttribute(
        databaseId, collectionId, attr.key,
        attr.required,
        attr.min ?? 0,
        attr.max ?? 100,
        attr.default as number | undefined,
        attr.array
      );
    } else if (attr.type === 'boolean') {
      await databases.createBooleanAttribute(
        databaseId, collectionId, attr.key,
        attr.required,
        attr.default as boolean | undefined,
        attr.array
      );
    }
    console.log(`    ✅ Created attribute: ${attr.key} (${attr.type})`);
  } catch (e) {
    const code = (e as { code?: number }).code;
    if (code === 409) {
      console.log(`    ⏭️  Attribute already exists: ${attr.key}`);
    } else {
      console.error(`    ❌ Error creating attribute ${attr.key}:`, (e as Error).message);
    }
  }
}

async function createIndex(databaseId: string, collectionId: string, idx: IndexConfig) {
  try {
    await databases.createIndex(
      databaseId, collectionId, idx.key,
      idx.type, idx.attributes,
      idx.orders
    );
    console.log(`    ✅ Created index: ${idx.key}`);
  } catch (e) {
    const code = (e as { code?: number }).code;
    if (code === 409) {
      console.log(`    ⏭️  Index already exists: ${idx.key}`);
    } else {
      console.error(`    ❌ Error creating index ${idx.key}:`, (e as Error).message);
    }
  }
}

// ────────────────────────────────────────────────────────────────────
// Main Setup
// ────────────────────────────────────────────────────────────────────

async function setup() {
  const mode = process.argv.includes('--reset') ? 'reset'
    : process.argv.includes('--migrate') ? 'migrate'
    : 'create';

  console.log(`\n🕌 Husoon Database Setup`);
  console.log(`   Mode: ${mode}`);
  console.log(`   Database: ${DATABASE_ID}`);
  console.log(`   Endpoint: ${APPWRITE_ENDPOINT}\n`);

  try {
    // 1. Check/Create Database
    try {
      await databases.get(DATABASE_ID!);
      console.log(`📦 Database "${DATABASE_ID}" exists.`);
    } catch (e) {
      if ((e as { code: number }).code === 404) {
        await databases.create(DATABASE_ID!, 'Husoon Database');
        console.log(`📦 Created Database: ${DATABASE_ID}`);
      } else {
        throw e;
      }
    }

    // 2. Process each collection
    for (const [key, config] of Object.entries(COLLECTIONS)) {
      console.log(`\n── Collection: ${config.name} (${config.id}) ──`);

      // Reset mode: delete existing collection first
      if (mode === 'reset') {
        try {
          await databases.deleteCollection(DATABASE_ID!, config.id);
          console.log(`  🗑️  Deleted existing collection`);
          await delay(2000);
        } catch { /* Collection might not exist */ }
      }

      // Check if collection exists
      let collectionExists = false;
      try {
        await databases.getCollection(DATABASE_ID!, config.id);
        collectionExists = true;
        console.log(`  📂 Collection already exists`);
      } catch (e) {
        if ((e as { code: number }).code !== 404) throw e;
      }

      // Create collection if it doesn't exist
      if (!collectionExists) {
        await databases.createCollection(
          DATABASE_ID!, config.id, config.name,
          [
            Permission.read(Role.any()),
            Permission.write(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
          ]
        );
        console.log(`  📂 Created collection`);
        await delay(1000);
      }

      // Create/Migrate attributes
      // In "create" mode: only if collection was just created
      // In "migrate" or "reset" mode: always try (duplicates are caught by 409)
      if (!collectionExists || mode === 'migrate' || mode === 'reset') {
        console.log(`  📋 Processing ${config.attributes.length} attributes...`);
        for (const attr of config.attributes) {
          await createAttribute(DATABASE_ID!, config.id, attr);
          await delay(500);
        }

        // Wait for attributes to be ready before creating indexes
        console.log(`  ⏳ Waiting for attributes to be ready...`);
        await delay(3000);

        // Create indexes
        if (config.indexes.length > 0) {
          console.log(`  🔍 Processing ${config.indexes.length} indexes...`);
          for (const idx of config.indexes) {
            await createIndex(DATABASE_ID!, config.id, idx);
            await delay(1000);
          }
        }
      } else {
        console.log(`  ⏭️  Skipping attributes (collection exists, use --migrate to add new attributes)`);
      }
    }

    console.log('\n✅ Setup completed successfully!\n');

    // Print usage hints
    if (mode === 'create') {
      console.log('💡 Tips:');
      console.log('   --migrate  → Add missing attributes to existing collections');
      console.log('   --reset    → Delete and recreate all collections (WARNING: data loss)');
    }

  } catch (error) {
    console.error('\n❌ Setup failed:', (error as Error).message);
    process.exit(1);
  }
}

setup();
