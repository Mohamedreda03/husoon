import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════════════════════════
// Timer Tests — uses stored auth state (logged in user)
// ═══════════════════════════════════════════════════════════

test.describe('Timer Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/timer');
    // Wait for loading spinner to disappear
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 15000 }).catch(() => {});
  });

  test('should load the timer page successfully', async ({ page }) => {
    await expect(page).toHaveURL('/timer');
    await expect(page.locator('main')).toBeVisible();
  });

  test('should display the timer display section', async ({ page }) => {
    // TimerDisplay is in the lg:col-span-7 area
    const timerSection = page.locator('.lg\\:col-span-7');
    await expect(timerSection).toBeVisible();
  });

  test('should display the task selector section', async ({ page }) => {
    // TaskSelector is in the lg:col-span-5 area
    const taskSection = page.locator('.lg\\:col-span-5');
    await expect(taskSection).toBeVisible();
  });

  test('should display the daily tip card', async ({ page }) => {
    // Tip of the day card
    await expect(page.getByText('نصيحة اليوم للتركيز')).toBeVisible();

    // The tip content should have text
    const tipCard = page.locator('.bg-tertiary-container');
    await expect(tipCard).toBeVisible();
  });

  test('should display quick stats cards', async ({ page }) => {
    // Sessions today card
    await expect(page.getByText('جلسات اليوم')).toBeVisible();

    // Total tasks card
    await expect(page.getByText('إجمالي المهام')).toBeVisible();
  });

  test('should have a two-column layout on desktop', async ({ page }) => {
    // Verify the grid layout exists
    const grid = page.locator('.grid.grid-cols-1.lg\\:grid-cols-12');
    await expect(grid).toBeVisible();
  });
});
