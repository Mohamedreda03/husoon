import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════════════════════════
// Schedule Tests — uses stored auth state (logged in user)
// ═══════════════════════════════════════════════════════════

test.describe('Schedule Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/schedule');
    // Wait for loading spinner to disappear
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 15000 }).catch(() => {});
  });

  test('should load the schedule page with header', async ({ page }) => {
    // Check for the page header
    await expect(page.getByText('الجدول الزمني الأسبوعي')).toBeVisible();
    await expect(page.getByText('خطة مراجعة وحفظ الأسبوع الحالي')).toBeVisible();
  });

  test('should display the week view section', async ({ page }) => {
    // WeekView is rendered as a grid section with day cards
    const weekSection = page.locator('section.grid');
    await expect(weekSection.first()).toBeVisible();
  });

  test('should display the weekly plan section', async ({ page }) => {
    // The grid with WeeklyPlan and PipelineTable
    const strategyGrid = page.locator('.grid.grid-cols-1.lg\\:grid-cols-3');
    await expect(strategyGrid).toBeVisible();
  });

  test('should display the pipeline table section', async ({ page }) => {
    // PipelineTable is in the lg:col-span-2 area
    const pipelineSection = page.locator('.lg\\:col-span-2');
    await expect(pipelineSection.first()).toBeVisible();
  });

  test('should have copy schedule button', async ({ page }) => {
    const copyBtn = page.getByText('📋 نسخ الجدول');
    await expect(copyBtn).toBeVisible();
  });

  test('should have edit plan button that navigates to settings', async ({ page }) => {
    const editPlanBtn = page.getByText('تعديل الخطة');
    await expect(editPlanBtn.first()).toBeVisible();
    await editPlanBtn.first().click();
    await expect(page).toHaveURL(/\/settings/);
  });

  test('should display the focus mode CTA card', async ({ page }) => {
    // Focus mode section with tertiary container
    await expect(page.getByText('هل أنت مستعد لجلسة تثبيت عميقة؟')).toBeVisible();
    await expect(page.getByText('تفعيل وضع التركيز الآن')).toBeVisible();
  });

  test('should navigate to timer from focus mode CTA', async ({ page }) => {
    await page.getByText('تفعيل وضع التركيز الآن').click();
    await expect(page).toHaveURL(/\/timer/);
  });
});
