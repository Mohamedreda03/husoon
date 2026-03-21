import { test, expect } from '@playwright/test';
import { RegisterPage } from '../fixtures/RegisterPage';
import { LoginPage } from '../fixtures/LoginPage';

test.describe('Session & Auth Guards', () => {

  test('Step 2C.1 - Test unauthenticated user is redirected from protected pages', async ({ page }) => {
    // Array of protected routes
    const protectedRoutes = [
      '/schedule',
      '/timer',
      '/stats',
      '/settings'
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      // Wait for network idle or redirect to settle
      await page.waitForTimeout(1000); 
      
      // Should redirect to login
      expect(page.url()).toContain('/login');
      await expect(page.locator('h1:has-text("ابدأ رحلتك المباركة")')).toBeVisible();
    }
  });

  test('Step 2C.2 & 2C.3 - Test authenticated user can access protected pages and then logout', async ({ page }) => {
    // 1. Setup an authenticated session
    const uniqueEmail = `guard_${Date.now()}@example.com`;
    const password = 'password123';
    
    // Register to auto-login
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register('Auth Guard User', uniqueEmail, password);
    await page.waitForURL(/\/onboarding$/); // Wait until signed up

    // Optional: We can complete onboarding here, or just navigate away.
    // The onboarding redirection logic might force-redirect to onboarding if no profile exists,
    // so let's verify if `/settings` passes or forces `/onboarding` for a new user.
    // Based on the app logic, some pages allow access even if onboarding isn't fully complete, 
    // or they bounce to `/onboarding`. Both mean the user is authenticated (not bounced to `/login`).

    const protectedRoutes = [
      '/schedule',
      '/timer',
      '/stats',
      '/settings'
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForTimeout(1000); 
      // User should NOT be on login page
      expect(page.url()).not.toContain('/login');
    }

    // 2. Test logout (Step 2C.3)
    await page.goto('/settings');
    await page.locator('button:has-text("تسجيل الخروج")').click();
    
    // Ensure we are redirected to login after logout
    await page.waitForURL(/\/login$/);
    await expect(page.locator('h1:has-text("ابدأ رحلتك المباركة")')).toBeVisible();

    // 3. Verify we can no longer access protected routes after logout
    await page.goto('/schedule');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
  });
});
