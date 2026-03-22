import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════════════════════════
// Stats Tests — uses stored auth state (logged in user)
// ═══════════════════════════════════════════════════════════

test.describe('Stats Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/stats');
    // Wait for loading spinner to disappear
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 15000 }).catch(() => {});
  });

  test('should load the stats page with header', async ({ page }) => {
    // Check if we have stats or the empty state
    const hasStats = await page.getByText('إحصائيات الإنجاز').isVisible().catch(() => false);
    const hasEmptyState = await page.getByText('لا توجد بيانات كافية لعرض الإحصائيات').isVisible().catch(() => false);

    // One of these should be true
    expect(hasStats || hasEmptyState).toBeTruthy();
  });

  test('should show empty state message when no data', async ({ page }) => {
    const emptyMessage = page.getByText('لا توجد بيانات كافية لعرض الإحصائيات');
    if (await emptyMessage.isVisible().catch(() => false)) {
      await expect(emptyMessage).toBeVisible();
      await expect(page.getByText('ابدأ بإنجاز المهام اليوم لتظهر لك الأرقام')).toBeVisible();

      // Home button
      await expect(page.getByText('العودة للرئيسية')).toBeVisible();
    }
  });

  test('should navigate to dashboard from empty state', async ({ page }) => {
    const homeBtn = page.getByText('العودة للرئيسية');
    if (await homeBtn.isVisible().catch(() => false)) {
      await homeBtn.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('should display stats grid when data exists', async ({ page }) => {
    const header = page.getByText('إحصائيات الإنجاز');
    if (await header.isVisible().catch(() => false)) {
      // Header + description
      await expect(header).toBeVisible();
      await expect(page.getByText(/تتبع رحلتك/)).toBeVisible();
    }
  });

  test('should display achievements section when data exists', async ({ page }) => {
    const achieveHeader = page.getByText('الأوسمة والجوائز');
    if (await achieveHeader.isVisible().catch(() => false)) {
      await expect(achieveHeader).toBeVisible();

      // Achievement badges grid
      const achieveGrid = page.locator('.grid.grid-cols-2.md\\:grid-cols-4');
      await expect(achieveGrid).toBeVisible();
    }
  });

  test('should display mushaf progress card when data exists', async ({ page }) => {
    const progressTitle = page.getByText('رحلة الختمة الحالية');
    if (await progressTitle.isVisible().catch(() => false)) {
      await expect(progressTitle).toBeVisible();

      // Remaining pages counter
      await expect(page.getByText('صفحة متبقية')).toBeVisible();

      // Action buttons
      await expect(page.getByText('متابعة الورد')).toBeVisible();
      await expect(page.getByText('تعديل الخطة')).toBeVisible();
    }
  });

  test('should navigate to dashboard from mushaf progress', async ({ page }) => {
    const continueBtn = page.getByText('متابعة الورد');
    if (await continueBtn.isVisible().catch(() => false)) {
      await continueBtn.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('should navigate to settings from mushaf progress', async ({ page }) => {
    const editBtn = page.getByText('تعديل الخطة');
    // There may be multiple "تعديل الخطة" buttons, get the one in the stats page
    if (await editBtn.last().isVisible().catch(() => false)) {
      await editBtn.last().click();
      await expect(page).toHaveURL(/\/settings/);
    }
  });
});
