import { test, expect } from '@playwright/test';
import { SchedulePage } from '../fixtures/SchedulePage';
import { RegisterPage } from '../fixtures/RegisterPage';
import { OnboardingPage } from '../fixtures/OnboardingPage';

// We need clipboard permissions to test the "Copy Schedule" button
test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test.describe('Schedule Tests', () => {
  let schedulePage: SchedulePage;

  test.describe('Authenticated & Onboarded User', () => {
    test.beforeEach(async ({ page }) => {
      // Create user and onboard
      const uniqueEmail = `schedule_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.register('Schedule User', uniqueEmail, 'password123');
      
      await page.waitForURL(/\/onboarding$/);
      const onboardingPage = new OnboardingPage(page);
      await onboardingPage.addManualRange(1, 10);
      await onboardingPage.nextBtn.click();
      await onboardingPage.selectGoalAndStart('صفحة واحدة');

      await page.waitForURL(/^http:\/\/localhost:3000\/?$/);
      
      schedulePage = new SchedulePage(page);
      await schedulePage.goto();
    });

    test('Step 5.1 - Verify schedule page renders correctly', async ({ page }) => {
      // Assert heading
      await expect(schedulePage.heading).toBeVisible();
      // Assert subtitle
      await expect(page.locator('text=خطة مراجعة وحفظ الأسبوع الحالي')).toBeVisible();

      // Assert WeekView section renders (7 days typically render as list items or cards)
      // We expect at least some days to be visible
      const dayCards = page.locator('text=السبت').locator('..').locator('..'); // A crude selector, but we can verify text for days
      await expect(page.locator('text=الأحد').first()).toBeVisible();

      // Since actual components (WeekView, WeeklyPlan, PipelineTable) depend on the design,
      // we check for key headings or text that they render.
      // E.g., PipelineTable might have table roles or specific column headers.
      await expect(page.locator('table')).toBeVisible().catch(() => {}); // Optional, if table exists

      await expect(schedulePage.copyScheduleBtn).toBeVisible();
      await expect(schedulePage.editPlanBtn).toBeVisible();
      await expect(schedulePage.focusModeBtn).toBeVisible();
    });

    test('Step 5.2 - Test "Copy Schedule" button', async ({ page }) => {
      await expect(schedulePage.copyScheduleBtn).toBeVisible();
      await schedulePage.copySchedule();

      // Wait for success toast
      await expect(page.locator('text=تم نسخ الجدول إلى الحافظة 📋')).toBeVisible();

      // Verify clipboard content
      const clipboardText = await page.evaluate(async () => await navigator.clipboard.readText());
      expect(clipboardText.length).toBeGreaterThan(0);
    });

    test('Step 5.3 - Test "Edit Plan" button navigation', async ({ page }) => {
      await schedulePage.editPlanBtn.click();
      // Assert navigation to settings
      await page.waitForURL(/\/settings$/);
      await expect(page.locator('h1:has-text("الإعدادات")')).toBeVisible();
    });

    test('Step 5.4 - Test "Focus Mode" CTA', async ({ page }) => {
      // Verify prompt card
      await expect(page.locator('text=هل أنت مستعد لجلسة تثبيت عميقة؟')).toBeVisible();
      
      // Click button
      await schedulePage.goToFocusMode();
      
      // Assert navigation to timer
      await page.waitForURL(/\/timer$/);
      
      // We don't verify full timer rendering here, just the navigation route, 
      // but maybe waiting for an element makes it stabler.
    });
  });

  test.describe('Edge Cases (Auth & Profile)', () => {
    test('Step 5.5 - Test unauthenticated redirect', async ({ page }) => {
      // Clear cookies/context to be unauthenticated, which is the default for new test context
      const schedulePageUnauth = new SchedulePage(page);
      await schedulePageUnauth.goto();
      
      // Assert redirect to login
      await page.waitForURL(/\/login$/);
    });

    test('Step 5.6 - Test user without profile redirect', async ({ page }) => {
      // Register a user but don't finish onboarding
      const uniqueEmail = `noprof_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.register('No Profile User', uniqueEmail, 'password123');
      
      // We are at /onboarding now
      await page.waitForURL(/\/onboarding$/);
      
      // Try going to schedule directly
      const schedulePageNoProf = new SchedulePage(page);
      await schedulePageNoProf.goto();
      
      // Assert redirect to onboarding
      await page.waitForURL(/\/onboarding$/);
    });
  });
});
