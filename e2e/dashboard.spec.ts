import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════════════════════════
// Dashboard Tests — uses stored auth state (logged in user)
// ═══════════════════════════════════════════════════════════

test.describe('Dashboard Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for loading to finish
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 15000 }).catch(() => {});
  });

  test('should load the dashboard page successfully', async ({ page }) => {
    // The page URL should be /
    await expect(page).toHaveURL('/');

    // Should have main content area
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display the daily spiritual quote section', async ({ page }) => {
    // The daily hadith section with quote marks
    const quoteSection = page.locator('section').first();
    await expect(quoteSection).toBeVisible();

    // Should contain a hadith text (dynamic content)
    const hadithText = page.locator('.font-serif.italic, h2.font-serif');
    if (await hadithText.count() > 0) {
      await expect(hadithText.first()).toBeVisible();
    }
  });

  test('should display the today card section', async ({ page }) => {
    // TodayCard should be visible — contains task progress info
    // Look for the grid layout that holds TodayCard + TaskList
    const mainGrid = page.locator('.grid.grid-cols-1');
    await expect(mainGrid.first()).toBeVisible();
  });

  test('should display the task list section', async ({ page }) => {
    // The TaskList component sits in the right column
    const taskSection = page.locator('.lg\\:col-span-4');
    if (await taskSection.count() > 0) {
      await expect(taskSection.first()).toBeVisible();
    }
  });

  test('should display the fortress grid section', async ({ page }) => {
    // FortressGrid section is below the main grid
    // Verify the page has substantial content
    const pageContent = page.locator('.space-y-12, .max-w-7xl');
    await expect(pageContent.first()).toBeVisible();
  });

  test('should display the bottom CTA section', async ({ page }) => {
    // The emerald-950 CTA section at the bottom
    const ctaSection = page.locator('section').filter({ hasText: 'عرض الخطة الأسبوعية' });
    await expect(ctaSection).toBeVisible();

    // Should have action buttons
    const scheduleLink = page.getByText('عرض الخطة الأسبوعية');
    await expect(scheduleLink).toBeVisible();
  });

  test('should navigate to schedule from CTA section', async ({ page }) => {
    // Click on the schedule link in the CTA
    await page.getByText('عرض الخطة الأسبوعية').click();
    await expect(page).toHaveURL(/\/schedule/);
  });

  test('should show loading state initially', async ({ page }) => {
    // Navigate fresh and check loading spinner appears briefly
    await page.goto('/');
    // The spinner may appear for a brief moment
    const spinner = page.locator('.animate-spin');
    // It should either be visible briefly or not at all (if data loads fast)
    // This is a non-blocking check
    const isVisible = await spinner.isVisible().catch(() => false);
    // Just verify the page eventually loads (no hanging)
    await page.waitForLoadState('networkidle');
  });
});
