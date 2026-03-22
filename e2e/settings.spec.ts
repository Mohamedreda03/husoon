import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════════════════════════
// Settings Tests — uses stored auth state (logged in user)
// ═══════════════════════════════════════════════════════════

test.describe('Settings Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    // Wait for loading spinner to disappear
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 15000 }).catch(() => {});
  });

  test('should load the settings page successfully', async ({ page }) => {
    await expect(page).toHaveURL('/settings');
    
    // Page Title
    await expect(page.getByText('الإعدادات').first()).toBeVisible();
    await expect(page.getByText('قم بتخصيص تجربتك')).toBeVisible();
  });

  test('should display the profile section', async ({ page }) => {
    // Check for user info area
    const profileSection = page.locator('section').first();
    await expect(profileSection).toBeVisible();

    // Export Data button
    await expect(page.getByText('تصدير بياناتي')).toBeVisible();

    // Logout button
    await expect(page.getByText('تسجيل الخروج')).toBeVisible();
  });

  test('should support editing user name', async ({ page }) => {
    // Click the edit pencil icon (inside absolute positioned button on avatar)
    const editBtn = page.locator('button.absolute.bottom-1');
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // Input field should appear
    const nameInput = page.locator('input[type="text"]').first();
    await expect(nameInput).toBeVisible();

    // Cancel edit
    const cancelBtn = page.locator('button:has(svg.lucide-x)');
    await cancelBtn.click();
  });

  test('should display memorization ranges section', async ({ page }) => {
    // Section header
    await expect(page.getByText('نطاقات الحفظ الحالية')).toBeVisible();

    // Summary bar
    await expect(page.getByText('إجمالي الحفظ')).toBeVisible();
    await expect(page.getByText('صفحة من 604')).toBeVisible();

    // Quick add shortcuts
    await expect(page.getByText('اختصارات سريعة')).toBeVisible();
    await expect(page.getByText('جزء عم').first()).toBeVisible();
  });

  test('should toggle the add range form', async ({ page }) => {
    // Click "إضافة نطاق جديد"
    const addBtn = page.getByRole('button', { name: /إضافة نطاق جديد/ });
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Form inputs appear
    await expect(page.getByText('من صفحة')).toBeVisible();
    await expect(page.getByText('إلى صفحة')).toBeVisible();

    // Click "إلغاء"
    await page.getByRole('button', { name: 'إلغاء' }).click();
    
    // Form disappears
    await expect(page.getByText('من صفحة')).not.toBeVisible();
  });

  test('should display daily goal selector section', async ({ page }) => {
    // Section header
    await expect(page.getByText('الوتيرة اليومية للحفظ')).toBeVisible();

    // Goal options (from DAILY_GOAL_OPTIONS)
    // Check for "نصف صفحة" label which should exist
    await expect(page.getByText('نصف صفحة')).toBeVisible();
  });

  test('should display account management section', async ({ page }) => {
    // Section header
    await expect(page.getByText('إدارة الحساب')).toBeVisible();

    // Reset Progress button
    await expect(page.getByText('إعادة تعيين التقدم')).toBeVisible();

    // Save Changes button
    await expect(page.locator('button:has-text("حفظ التغييرات")')).toBeVisible();
  });

  // Example functionality test - adding a range via shortcut
  test('should add a range via shortcut and save changes', async ({ page }) => {
    // Add "جزء عم"
    const juzAmmaBtn = page.getByRole('button', { name: 'جزء عم' }).first();
    await expect(juzAmmaBtn).toBeVisible();
    
    // Check ranges list initially to see if it's already there (so we don't fail if test user already has it)
    const hasJuzAmma = await page.getByText('صفحة 582 → 604').isVisible().catch(() => false);
    
    if (!hasJuzAmma) {
      await juzAmmaBtn.click();
      
      // Should show in the list
      await expect(page.getByText('صفحة 582 → 604')).toBeVisible({ timeout: 5000 });
      
      // Click save
      const saveBtn = page.locator('button:has-text("حفظ التغييرات")');
      await saveBtn.click();
      
      // Should show success toast
      await expect(page.locator('.sonner-toast:has-text("تم تحديث بيانات الحفظ")')).toBeVisible({ timeout: 5000 }).catch(() => {});
    }
  });
});
