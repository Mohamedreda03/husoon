import { test, expect } from '@playwright/test';
import { SettingsPage } from '../fixtures/SettingsPage';
import { RegisterPage } from '../fixtures/RegisterPage';
import { OnboardingPage } from '../fixtures/OnboardingPage';

test.describe('Settings Tests', () => {
  let settingsPage: SettingsPage;
  let userEmail: string;
  let userName = 'Settings User';

  test.beforeEach(async ({ page }) => {
    // Generate a unique user and onboard
    userEmail = `settings_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(userName, userEmail, 'password123');
    
    await page.waitForURL(/\/onboarding$/);
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.addManualRange(1, 10);
    await onboardingPage.nextBtn.click();
    await onboardingPage.selectGoalAndStart('صفحة واحدة');

    await page.waitForURL(/^http:\/\/localhost:3000\/?$/);
    
    settingsPage = new SettingsPage(page);
    await settingsPage.goto();
  });

  test.describe('8A — Profile Section', () => {
    test('Step 8A.1 - Verify profile section renders', async ({ page }) => {
      await expect(settingsPage.heading).toBeVisible();
      
      // Avatar with first letter
      const avatarContent = await page.locator('.rounded-full:has-text("S"), .rounded-full:has-text("s")').first().isVisible();
      // We'll just softly check for the avatar container or initials.
      
      // Assert name and email
      await expect(page.locator(`text=${userName}`).first()).toBeVisible();
      await expect(page.locator(`text=${userEmail}`).first()).toBeVisible();
      
      // Memorization badge might be visible "حافظ لـ"
      await expect(page.locator('text=حافظ').first()).toBeVisible();
    });

    test('Step 8A.2 - Test name editing', async ({ page }) => {
      await settingsPage.editNameBtn.click();
      
      // Inline edit input appears
      const nameInput = page.locator('input[type="text"]').first();
      await expect(nameInput).toBeVisible();
      
      // Type new name
      await nameInput.fill('Updated Name');
      
      // Click confirm (usually a check icon next to it)
      const confirmBtn = page.locator('button', { has: page.locator('svg.lucide-check') });
      await confirmBtn.click();
      
      // Assert success toast
      await expect(page.locator('text=تم تحديث الاسم')).toBeVisible();
      
      // Assert displayed name updates
      await expect(page.locator('text=Updated Name')).toBeVisible();
    });

    test('Step 8A.3 - Test name editing cancel', async ({ page }) => {
      await settingsPage.editNameBtn.click();
      
      const nameInput = page.locator('input[type="text"]').first();
      await expect(nameInput).toBeVisible();
      await nameInput.fill('Canceled Name');
      
      // Click cancel (X icon)
      const cancelBtn = page.locator('button', { has: page.locator('svg.lucide-x') }).last(); // using last() or specific if multiple
      await cancelBtn.click();
      
      // Assert it closed and kept old name
      await expect(nameInput).not.toBeVisible();
      await expect(page.locator(`text=${userName}`).first()).toBeVisible();
      await expect(page.locator('text=Canceled Name')).not.toBeVisible();
    });
  });

  test.describe('8B — Memorization Ranges', () => {
    test('Step 8B.1 - Verify memorization ranges section renders', async ({ page }) => {
      await expect(page.locator('h3:has-text("نطاقات الحفظ الحالية")').or(page.locator('text=نطاقات الحفظ الحالية'))).toBeVisible();
      
      // Assert total pages summary
      // Because onboarding added pages 1 to 10 automatically before the test:
      await expect(page.locator('text=10 صفحة')).toBeVisible();
    });

    test('Step 8B.2 - Test adding a memorization range', async ({ page }) => {
      await settingsPage.addRangeBtn.click();
      
      // Since it might open a modal or inline form:
      const fromInput = page.locator('input[type="number"]').nth(0);
      const toInput = page.locator('input[type="number"]').nth(1);
      
      await fromInput.fill('11');
      await toInput.fill('20');
      
      const submitBtn = page.locator('button:has-text("إضافة")');
      await submitBtn.click();
      
      // Assert the new range appears
      await expect(page.locator('text=20 صفحة').first()).toBeVisible(); // Will update total to 20 pages
    });

    test('Step 8B.3 - Test invalid range validation', async ({ page }) => {
      await settingsPage.addRangeBtn.click();
      
      const fromInput = page.locator('input[type="number"]').nth(0);
      const toInput = page.locator('input[type="number"]').nth(1);
      
      await fromInput.fill('50');
      await toInput.fill('10');
      
      const submitBtn = page.locator('button:has-text("إضافة")');
      await submitBtn.click();
      
      await expect(page.locator('text=أرقام الصفحات غير صحيحة')).toBeVisible();
    });

    test('Step 8B.4 - Test removing a memorization range', async ({ page }) => {
      // Find the range item and delete button
      const removeBtn = page.locator('button', { has: page.locator('svg.lucide-trash-2') }).first();
      await removeBtn.click();
      
      // Total pages should drop to 0
      await expect(page.locator('text=0 صفحة').first()).toBeVisible();
    });

    test('Step 8B.5 - Test quick-add shortcut buttons', async ({ page }) => {
      await settingsPage.addRangeBtn.click();
      
      const juzAmmaBtn = page.locator('button:has-text("جزء عم")').first();
      await juzAmmaBtn.click();
      
      await expect(page.locator('text=تم إضافة النطاق بنجاح')).toBeVisible();
      await expect(page.locator('text=582')).toBeVisible();
    });
  });

  test.describe('8C — Daily Goal', () => {
    test('Step 8C.1 - Verify daily goal section renders', async ({ page }) => {
      await expect(page.locator('text=الوتيرة اليومية للحفظ')).toBeVisible();
      await expect(page.locator('button:has-text("صفحتان")')).toBeVisible();
    });

    test('Step 8C.2 - Test selecting different daily goals', async ({ page }) => {
      const optionBtn = page.locator('button:has-text("صفحتان")');
      await optionBtn.click();
      
      // Verify selected state
      await expect(optionBtn).toHaveClass(/border-primary|bg-primary/); // common selected tailwind classes
      
      // Estimated completion date typically shows in the UI or inside the tooltip
      await expect(page.locator('text=تاريخ الختمة المتوقع').first()).toBeVisible();
    });
  });

  test.describe('8D — Account Management', () => {
    test('Step 8D.1 - Test "Save Changes" button', async ({ page }) => {
      await page.locator('button:has-text("صفحتان")').click();
      
      await settingsPage.saveChangesBtn.click();
      
      // Loading state
      // await expect(page.locator('text=...جاري الحفظ')).toBeVisible();
      
      // Success toast
      await expect(page.locator('text=تم تحديث بيانات الحفظ بنجاح')).toBeVisible();
    });

    test('Step 8D.2 - Test "Export Data" button', async ({ page }) => {
      // Since it triggers a download, we catch the download event
      const downloadPromise = page.waitForEvent('download');
      
      await settingsPage.exportDataBtn.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.json');
      
      await expect(page.locator('text=تم تصدير البيانات بنجاح')).toBeVisible();
    });

    test('Step 8D.3 - Test "Logout" button', async ({ page }) => {
      await settingsPage.logoutBtn.click();
      await page.waitForURL(/\/login$/);
    });

    test('Step 8D.4 - Test "Reset Progress" with confirmation', async ({ page }) => {
      // Listen for the confirm dialog and accept it
      page.on('dialog', dialog => dialog.accept());
      
      await settingsPage.resetProgressBtn.click();
      
      await expect(page.locator('text=تم إعادة تعيين التقدم بنجاح')).toBeVisible();
      await page.waitForURL(/\/onboarding$/);
    });

    test('Step 8D.5 - Test "Reset Progress" cancel', async ({ page }) => {
      // Listen for the confirm dialog and dismiss it
      page.on('dialog', dialog => dialog.dismiss());
      
      await settingsPage.resetProgressBtn.click();
      
      // Should remain on settings page
      await expect(settingsPage.heading).toBeVisible();
    });
  });
});
