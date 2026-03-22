import { test as setup, expect } from '@playwright/test';
import { loginViaUI, registerViaUI, TEST_USER } from './helpers/auth';

const authFile = 'e2e/.auth/user.json';

/**
 * Global setup: logs in once and saves the browser storage state
 * so that all subsequent tests start authenticated.
 */
setup('authenticate as test user', async ({ page }) => {
  try {
    await loginViaUI(page);
  } catch (error: any) {
    if (error.message.includes('غير صحيحة') || error.message.includes('Login failed')) {
      console.log('Test user not found, registering new test user...');
      await registerViaUI(page, {
        email: TEST_USER.email,
        password: TEST_USER.password,
        name: TEST_USER.name
      });
    } else {
      throw error;
    }
  }

  // Verify we're on the dashboard or onboarding (authenticated)
  await expect(page).toHaveURL((url) => {
    const path = url.pathname;
    return path === '/' || path === '/onboarding';
  }, { timeout: 10000 });

  // Save storage state for reuse
  await page.context().storageState({ path: authFile });
});
