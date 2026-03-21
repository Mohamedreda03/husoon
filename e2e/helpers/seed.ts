/**
 * Seed data helpers for E2E tests using Appwrite client.
 * In a real scenario, this might use a Server SDK with an API key, 
 * but for E2E tests, it can authenticate via client SDK or directly interact with the DB.
 */
import { Client, Account, Databases, ID } from 'appwrite';
import { TEST_USERS } from './constants';

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'husoon');

const account = new Account(client);
const databases = new Databases(client);

const setupTestUser = async () => {
  try {
    // Try to create the user
    await account.create(
      ID.unique(),
      TEST_USERS.existingUser.email,
      TEST_USERS.existingUser.password,
      TEST_USERS.existingUser.name
    );
  } catch (err: any) {
    if (err.code !== 409) { // Ignore if user already exists
      console.error('Failed to setup test user', err);
    }
  }
};

export { account, databases, setupTestUser };
