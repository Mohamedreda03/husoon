import { test, expect } from '@playwright/test';
import { OnboardingPage } from '../fixtures/OnboardingPage';
import { RegisterPage } from '../fixtures/RegisterPage';

test.describe('Onboarding Flow', () => {
  let onboardingPage: OnboardingPage;

  test.beforeEach(async ({ page }) => {
    // Generate a unique user for each onboarding test to ensure clean state
    const uniqueEmail = `onboarding_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.nameInput.fill('Onboarding User');
    await registerPage.emailInput.fill(uniqueEmail);
    await registerPage.passwordInput.fill('password123');
    await registerPage.confirmPasswordInput.fill('password123');
    await registerPage.submitButton.click();

    // Wait until navigated to onboarding
    await page.waitForURL(/\/onboarding$/);
    onboardingPage = new OnboardingPage(page);
  });

  test('Step 3.1 - Verify onboarding page renders for new user', async ({ page }) => {
    // Assert heading
    await expect(onboardingPage.heading).toBeVisible();
    // Assert step 1 indicator is active
    await expect(onboardingPage.step1Indicator).toBeVisible();
    await expect(page.locator('h2:has-text("ماذا حفظت من القرآن؟")')).toBeVisible();
  });

  test('Step 3.2 - Test Step 1: Memorization range selection (Quick-add)', async ({ page }) => {
    await expect(onboardingPage.juzAmmaShortcut).toBeVisible();
    await onboardingPage.juzAmmaShortcut.click();

    // Assert range 582 -> 604 appears in the list
    await expect(page.locator('text=582')).toBeVisible();
    await expect(page.locator('text=604')).toBeVisible();
    // Assert total pages summary updates (diff is 23 pages for Juz Amma)
    await expect(page.locator('text=23 صفحة')).toBeVisible();
  });

  test('Step 3.3 - Test manual range addition', async ({ page }) => {
    await expect(onboardingPage.addManualRangeBtn).toBeVisible();
    await onboardingPage.addManualRange(1, 20);

    // Assert the new range appears in the list
    await expect(page.locator('text=1').nth(0)).toBeVisible(); // Check logic depending on UI, roughly expecting "1" and "20"
    await expect(page.locator('text=20').nth(0)).toBeVisible();
    // Assert total pages
    await expect(page.locator('text=20 صفحة')).toBeVisible();
  });

  test('Step 3.4 - Test range removal', async ({ page }) => {
    // First add a range
    await onboardingPage.addManualRange(1, 20);
    await expect(page.locator('text=20 صفحة')).toBeVisible();

    // Find the remove button for the range we just added
    // The exact selector depends on Shadcn UI implementation, usually a trash or X icon button inside the list item
    const removeBtn = page.locator('button', { has: page.locator('svg.lucide-trash-2, svg.lucide-x') }).first();
    await removeBtn.click();

    // Assert range is removed, total pages should be 0
    await expect(page.locator('text=0 صفحة')).toBeVisible();
  });

  test('Step 3.5 - Test "Skip" option', async ({ page }) => {
    await expect(onboardingPage.skipLink).toBeVisible();
    await onboardingPage.skipStep1();

    // Assert navigates to step 2 directly
    await expect(page.locator('h2:has-text("ما هي وتيرة الحفظ اليومية؟")')).toBeVisible();
    await expect(onboardingPage.step2Indicator).toBeVisible();
  });

  test('Step 3.6 - Test navigation to Step 2', async ({ page }) => {
    // Navigate via next button instead of skip
    await onboardingPage.addManualRange(1, 20);
    await onboardingPage.nextBtn.click();

    await expect(page.locator('h2:has-text("ما هي وتيرة الحفظ اليومية؟")')).toBeVisible();
    await expect(onboardingPage.step2Indicator).toBeVisible();
  });

  test('Step 3.7 - Test Step 2: Daily goal selection', async ({ page }) => {
    // Go to step 2
    await onboardingPage.skipStep1();
    
    await expect(onboardingPage.onePageGoalBtn).toBeVisible();
    await expect(onboardingPage.twoPagesGoalBtn).toBeVisible();

    await onboardingPage.twoPagesGoalBtn.click();
    // In Shadcn UI, selection often changes classes, we can check if it has a primary/selected styling or just assume click works 
    // and wait for estimated completion date text to appear/update.
    await expect(page.locator('text=تاريخ الختمة المتوقع')).toBeVisible();
  });

  test('Step 3.8 - Test "Back" button on Step 2', async ({ page }) => {
    await onboardingPage.addManualRange(1, 20);
    await onboardingPage.nextBtn.click();
    await expect(page.locator('h2:has-text("ما هي وتيرة الحفظ اليومية؟")')).toBeVisible();

    const backBtn = page.locator('button:has-text("العودة للخطوة السابقة")');
    await backBtn.click();

    // Assert return to step 1
    await expect(page.locator('h2:has-text("ماذا حفظت من القرآن؟")')).toBeVisible();
    // Assert data is preserved
    await expect(page.locator('text=20 صفحة')).toBeVisible();
  });

  test('Step 3.9 - Test completing onboarding', async ({ page }) => {
    // Add a range
    await onboardingPage.addManualRange(1, 20);
    // Go next
    await onboardingPage.nextBtn.click();
    // Select Goal
    await onboardingPage.selectGoalAndStart('صفحة واحدة');

    // Assert loading state
    await expect(page.locator('text=جاري التحضير...')).toBeVisible();

    // Assert redirect to dashboard (/)
    await page.waitForURL(/^http:\/\/localhost:3000\/?$/);
    
    // Assert profile data is saved by checking a dashboard element (like TodayCard or Daily Hadith)
    await expect(page.locator('text=نصيحة اليوم،')).toBeVisible();
  });
});
