import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════════════════════════
// Onboarding Tests — uses stored auth state (logged in user)
// ═══════════════════════════════════════════════════════════

test.describe('Onboarding Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
  });

  test('should render step 1 — memorization ranges', async ({ page }) => {
    // Step heading
    await expect(page.getByText('ماذا حفظت من القرآن؟')).toBeVisible();
    await expect(page.getByText('حدد النطاقات التي أتممت حفظها')).toBeVisible();

    // Step indicator — step 1 should be active
    await expect(page.getByText('١')).toBeVisible();
    await expect(page.getByText('٢')).toBeVisible();
    await expect(page.getByText('الحفظ الحالي')).toBeVisible();

    // Quick add shortcuts
    await expect(page.getByText('جزء عم')).toBeVisible();
    await expect(page.getByText('جزء تبارك')).toBeVisible();
    await expect(page.getByText('نصف القرآن')).toBeVisible();

    // Manual add button
    await expect(page.getByText('إضافة نطاق يدوياً')).toBeVisible();

    // Skip button
    await expect(page.getByText('تخطي — لم أحفظ شيئاً بعد')).toBeVisible();

    // Next button
    await expect(page.getByText('التالي')).toBeVisible();
  });

  test('should add a range via quick add shortcut', async ({ page }) => {
    // Click "جزء عم" (pages 582-604)
    await page.getByText('جزء عم').click();

    // Should show a toast and then the range should be listed
    // Check that range info appears (using simple text match)
    await expect(page.getByText('582').first()).toBeVisible({ timeout: 5000 });

    // Summary should show total pages
    await expect(page.getByText('23').first()).toBeVisible();
    await expect(page.getByText('صفحة').first()).toBeVisible();
  });

  test('should add a custom range via manual form', async ({ page }) => {
    // Click "إضافة نطاق يدوياً" to show the form
    await page.getByText('إضافة نطاق يدوياً').click();

    // Fill the range form
    await expect(page.getByText('من صفحة')).toBeVisible();
    await expect(page.getByText('إلى صفحة')).toBeVisible();

    // Clear and fill the from/to inputs
    const fromInput = page.locator('input[type="number"]').first();
    const toInput = page.locator('input[type="number"]').last();

    await fromInput.fill('1');
    await toInput.fill('20');

    // Click add button
    await page.getByRole('button', { name: 'إضافة' }).click();

    // Range should appear in the list
    await expect(page.getByText('1').first()).toBeVisible({ timeout: 5000 });
  });

  test('should remove a range', async ({ page }) => {
    // First add a range
    await page.getByText('جزء عم').click();
    await expect(page.getByText('582').first()).toBeVisible({ timeout: 5000 });

    // Click remove button (X icon)
    const removeBtn = page.locator('button').filter({ has: page.locator('svg.lucide-x') });
    if (await removeBtn.count() > 0) {
      await removeBtn.first().click();
      // Range should be removed
      await expect(page.getByText('582').first()).not.toBeVisible({ timeout: 5000 });
    }
  });

  test('should navigate to step 2 via next button', async ({ page }) => {
    // Click "التالي" to go to step 2
    await page.getByRole('button', { name: /التالي/ }).click();

    // Step 2 heading
    await expect(page.getByText('ما هي وتيرة الحفظ اليومية؟')).toBeVisible();
    await expect(page.getByText('بناءً على هذا المعدل سيتم اقتراح مهامك اليومية')).toBeVisible();
  });

  test('should skip to step 2', async ({ page }) => {
    // Click skip button
    await page.getByText('تخطي — لم أحفظ شيئاً بعد').click();

    // Should be on step 2
    await expect(page.getByText('ما هي وتيرة الحفظ اليومية؟')).toBeVisible();
  });

  test('should render step 2 — daily goal selection', async ({ page }) => {
    // Navigate to step 2
    await page.getByRole('button', { name: /التالي/ }).click();

    // Wait for step 2 content
    await expect(page.getByText('ما هي وتيرة الحفظ اليومية؟')).toBeVisible();

    // Daily goal options should be visible
    // The goal options come from DAILY_GOAL_OPTIONS data
    const goalButtons = page.locator('.grid button');
    await expect(goalButtons.first()).toBeVisible();

    // Estimated completion section
    await expect(page.getByText(/الموعد المتوقع لختم القرآن/)).toBeVisible();

    // Complete button
    await expect(page.getByText('ابدأ رحلة الحفظ')).toBeVisible();

    // Back button
    await expect(page.getByText('العودة للخطوة السابقة')).toBeVisible();
  });

  test('should go back from step 2 to step 1', async ({ page }) => {
    // Go to step 2
    await page.getByRole('button', { name: /التالي/ }).click();
    await expect(page.getByText('ما هي وتيرة الحفظ اليومية؟')).toBeVisible();

    // Click back button
    await page.getByText('العودة للخطوة السابقة').click();

    // Should be back on step 1
    await expect(page.getByText('ماذا حفظت من القرآن؟')).toBeVisible();
  });
});
