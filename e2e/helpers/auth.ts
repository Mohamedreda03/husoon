import { Page, expect } from '@playwright/test';

/**
 * Test user credentials from .env.test
 */
export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@husoon.dev',
  password: process.env.TEST_USER_PASSWORD || 'Test@12345678',
  name: 'مستخدم تجريبي',
};

/**
 * Logs in as the test user via the login page UI.
 * Waits until the dashboard loads after successful login.
 */
export async function loginViaUI(page: Page) {
  await page.goto('/login');
  await page.locator('#email').fill(TEST_USER.email);
  await page.locator('#password').fill(TEST_USER.password);
  await page.locator('button[type="submit"]').click();

  // Wait for either successful navigation OR an error alert
  const result = await Promise.race([
    page.waitForURL((url) => url.pathname === '/' || url.pathname === '/onboarding', { timeout: 30000 }).then(() => 'success'),
    page.locator('.alert').waitFor({ state: 'visible', timeout: 30000 }).then(() => 'error')
  ]);

  if (result === 'error') {
    const errorText = await page.locator('.alert').textContent();
    throw new Error(`Login failed: ${errorText?.trim()}`);
  }
}

/**
 * Registers a new user via the register page UI.
 * Uses a unique email with timestamp to avoid conflicts.
 */
export async function registerViaUI(page: Page, options?: {
  name?: string;
  email?: string;
  password?: string;
}) {
  const timestamp = Date.now();
  const name = options?.name || TEST_USER.name;
  const email = options?.email || `test-${timestamp}@husoon.dev`;
  const password = options?.password || TEST_USER.password;

  await page.goto('/register');
  await page.locator('#name').fill(name);
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('#confirmPassword').fill(password);
  await page.locator('button[type="submit"]').click();

  return { name, email, password };
}

/**
 * Logs out a user via the settings page.
 */
export async function logoutViaUI(page: Page) {
  await page.goto('/settings');
  // Click the logout button (contains "تسجيل الخروج")
  await page.getByText('تسجيل الخروج').click();
  await page.waitForURL('**/login', { timeout: 10000 });
}
