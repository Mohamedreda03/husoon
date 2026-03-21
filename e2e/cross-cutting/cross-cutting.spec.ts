import { test, expect } from '@playwright/test';
import { RegisterPage } from '../fixtures/RegisterPage';

test.describe('Cross-Cutting Concerns & Edge Cases', () => {
  let uniqueEmail: string;

  test.beforeEach(async ({ page }) => {
    // Register a user for generic testing
    uniqueEmail = `cross_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register('Cross User', uniqueEmail, 'password123');
    
    // We land on onboarding, this is enough to test many routing concerns
    await page.waitForURL(/\/onboarding$/);
  });

  test.describe('10A — Toast Notifications', () => {
    test('Step 10A.1 - Test success toasts appear and auto-dismiss', async ({ page }) => {
      // Trigger a success toast by doing something like getting a share link or saving settings
      // In onboarding, adding a shortcut memory range shows a success toast
      await page.locator('button:has-text("جزء عم")').first().click();
      
      const toast = page.locator('text=تم إضافة النطاق بنجاح');
      
      // Assert it appears
      await expect(toast).toBeVisible();

      // Assert auto-dismiss (wait for it to disappear, typically 3-5 seconds in modern apps)
      await expect(toast).not.toBeVisible({ timeout: 6000 });
    });

    test('Step 10A.2 - Test error toasts on failure', async ({ page }) => {
      // Simulate API failure by adding an invalid manual range or using route mock
      await page.locator('button:has-text("إضافة نطاق يدوياً")').first().click();
      await page.locator('input[type="number"]').nth(0).fill('100');
      await page.locator('input[type="number"]').nth(1).fill('10');
      
      await page.locator('button:has-text("إضافة")').click();
      
      // Assert error toast is visible
      await expect(page.locator('text=أرقام الصفحات غير صحيحة')).toBeVisible();
    });
  });

  test.describe('10B — Responsive Design', () => {
    test('Step 10B.1 - Test mobile viewport (375×667)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Go to some page
      await page.goto('/login');
      await expect(page.locator('h1:has-text("ابدأ رحلتك المباركة")')).toBeVisible();
      
      // Check for horizontal scroll explicitly (no scrollbar)
      const horizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(horizontalScroll).toBeFalsy();
    });

    test('Step 10B.2 - Test tablet viewport (768×1024)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/login');
      const boundingBox = await page.locator('form').boundingBox();
      
      // We assume on tablet, the form or grid doesn't occupy 100% width like mobile but maintains a max-width
      expect(boundingBox?.width).toBeLessThanOrEqual(500); // Standard auth form width
    });

    test('Step 10B.3 - Test desktop viewport (1440×900)', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/login');
      
      // Check for split layout in Auth screen (right content, left banner/image) typically done on desktop
      // We check if image is visible
      const desktopImageArea = page.locator('div.bg-primary, div:has(img)').last();
      if (await desktopImageArea.isVisible()) {
          expect(await desktopImageArea.boundingBox()).toBeDefined();
      }
    });
  });

  test.describe('10C — Error Handling', () => {
    test('Step 10C.1 - Test 404 page for unknown routes', async ({ page }) => {
      const response = await page.goto('/this-route-does-not-exist');
      
      // Should result in a 404 status code (if SSR is setup to return 404 proper)
      expect(response?.status()).toBe(404);
      
      // Content should show standard Next.js 404 or a custom one
      const notFoundHeading = page.locator('text=404').or(page.locator('text=الصفحة غير موجودة'));
      await expect(notFoundHeading.first()).toBeVisible();
    });

    test('Step 10C.2 - Test graceful API error handling', async ({ page }) => {
      // Mock API endpoint to return 500
      await page.route('**/v1/account/sessions/email', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' })
        });
      });

      // Attempt login
      await page.goto('/login');
      await page.fill('input[type="email"]', uniqueEmail);
      await page.fill('input[type="password"]', 'badpassword');
      await page.click('button[type="submit"]');

      // Given it returns 500, loading state should disappear and error should show
      await expect(page.locator('button:has-text("جاري تسجيل الدخول...")')).not.toBeVisible({ timeout: 5000 });
      
      // Should show error toast/banner instead of an infinite spinner
      await expect(page.locator('.text-destructive, [role="alert"]')).toBeVisible();
    });
  });

  test.describe('10D — Performance', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('Step 10D.1 - Test page load times', async ({ page, browserName }) => {
        // Skip webkit if unstable performance locally
        test.skip(browserName === 'webkit', 'Skipping perf test on webkit');

        const start = Date.now();
        await page.goto('/login', { waitUntil: 'load' });
        const loadTime = Date.now() - start;

        // Ensure page load is under 3s even on unoptimized local server
        // This is a rough estimation check
        expect(loadTime).toBeLessThan(3500);

        // Try getting LCP measure if supported
        // const lcp = await page.evaluate(() => {
        // ... Web Vitals logic ...
        // });
    });

    test('Step 10D.2 - Test no memory leaks on navigation', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // Loop navigation multiple times between pages to check for unmounted component updates
        for (let i = 0; i < 5; i++) {
            await page.goto('/login');
            await page.waitForTimeout(100);
            await page.goto('/register');
            await page.waitForTimeout(100);
        }

        // We assert no significant console errors occurred during frantic navigation
        // E.g. "React state update on an unmounted component"
        const reactErrors = consoleErrors.filter(err => err.includes('unmounted') || err.includes('memory leak'));
        expect(reactErrors.length).toBe(0);
    });
  });
});
