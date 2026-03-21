import { test, expect } from '@playwright/test';
import { RegisterPage } from '../fixtures/RegisterPage';

test.describe('Registration Flow', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('Step 2A.1 - Verify registration page renders correctly', async ({ page }) => {
    await expect(page.locator('h1:has-text("إنشاء حساب جديد")')).toBeVisible();
    await expect(registerPage.nameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.confirmPasswordInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
    await expect(registerPage.loginLink).toBeVisible();
  });

  test('Step 2A.2 - Test successful user registration', async ({ page }) => {
    // Generate unique email to avoid conflicts
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    
    await registerPage.register('Test User', uniqueEmail, 'password123');
    
    // Expect successful redirect to onboarding
    await page.waitForURL(/\/onboarding$/);
    await expect(page.locator('text=ماذا حفظت من القرآن؟')).toBeVisible();
  });

  test('Step 2A.3 - Test registration with mismatched passwords', async ({ page }) => {
    await registerPage.nameInput.fill('Test User');
    await registerPage.emailInput.fill(`testuser_${Date.now()}@example.com`);
    await registerPage.passwordInput.fill('password123');
    await registerPage.confirmPasswordInput.fill('different123');
    await registerPage.submitButton.click();
    
    await registerPage.verifyError('كلمتا المرور غير متطابقتان');
  });

  test('Step 2A.4 - Test registration with short password (< 8 chars)', async ({ page }) => {
    await registerPage.nameInput.fill('Test User');
    await registerPage.emailInput.fill(`testuser_${Date.now()}@example.com`);
    await registerPage.passwordInput.fill('short');
    await registerPage.confirmPasswordInput.fill('short');
    await registerPage.submitButton.click();
    
    await registerPage.verifyError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  });

  test('Step 2A.5 - Test registration with already existing email', async ({ page }) => {
    // Register initial user
    const uniqueEmail = `conflict_${Date.now()}@example.com`;
    await registerPage.register('Original User', uniqueEmail, 'password123');
    await page.waitForURL(/\/onboarding$/);
    
    // Logout first (simplistic way by navigating manually or re-triggering signup in isolated context)
    // Note: Playwright test blocks are isolated by default, so we don't share session, 
    // but the DB retains the user.
  });

  test('Step 2A.5 - Test Registration with existing email (isolated)', async ({ page }) => {
    // Since Appwrite DB holds the user, we'll try registering again with the same known email
    // Or we'll create the user properly here:
    const uniqueEmail = `conflict2_${Date.now()}@example.com`;
    await registerPage.register('User 1', uniqueEmail, 'password123');
    await page.waitForURL(/\/onboarding$/);

    // Context isolation issue in parallel: let's clear cookies using another context
    const newContext = await page.context().browser()!.newContext();
    const newPage = await newContext.newPage();
    const newRegisterPage = new RegisterPage(newPage);
    await newRegisterPage.goto();

    await newRegisterPage.register('User 2', uniqueEmail, 'password123');
    await newRegisterPage.verifyError('هذا البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول');
    
    await newContext.close();
  });

  test('Step 2A.6 - Test empty form submission', async ({ page }) => {
    await registerPage.submitButton.click();
    
    // Check if HTML5 validation message appears on first required input
    const isNameInvalid = await registerPage.nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isNameInvalid).toBe(true);
    
    // Ensure we are still on the registration page
    expect(page.url()).toContain('/register');
  });

  test('Step 2A.7 - Test password visibility toggle', async ({ page }) => {
    // Check first password field
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'password');
    // First toggle button
    const toggle1 = page.locator('button', { has: page.locator('svg.lucide-eye') }).nth(0);
    await toggle1.click();
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'text');
    await toggle1.click();
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'password');

    // Check confirm password field
    await expect(registerPage.confirmPasswordInput).toHaveAttribute('type', 'password');
    // Second toggle button
    const toggle2 = page.locator('button', { has: page.locator('svg.lucide-eye') }).nth(1);
    await toggle2.click();
    await expect(registerPage.confirmPasswordInput).toHaveAttribute('type', 'text');
    await toggle2.click();
    await expect(registerPage.confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  test('Step 2A.8 - Test navigation link to login page', async ({ page }) => {
    await registerPage.loginLink.click();
    await page.waitForURL(/\/login$/);
    await expect(page.locator('h1:has-text("ابدأ رحلتك المباركة")')).toBeVisible();
  });
});
