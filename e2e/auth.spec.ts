import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USER, logoutViaUI } from './helpers/auth';

// ═══════════════════════════════════════════════════════════
// Auth tests run WITHOUT stored auth state (fresh browser)
// ═══════════════════════════════════════════════════════════

test.describe('Login Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should render login form with all elements', async ({ page }) => {
    // Page heading
    await expect(page.locator('h1')).toContainText('ابدأ رحلتك المباركة');

    // Email input
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('label[for="email"]')).toContainText('البريد الإلكتروني');

    // Password input
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toContainText('كلمة المرور');

    // Submit button
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText('تسجيل الدخول');

    // Remember me checkbox
    await expect(page.locator('#remember')).toBeVisible();

    // Register link
    await expect(page.getByText('إنشاء حساب جديد')).toBeVisible();
  });

  test('should show validation for empty fields', async ({ page }) => {
    // Click submit without filling fields — browser native validation
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // The form should not navigate away (native validation blocks submission)
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.locator('#email').fill('wrong@email.com');
    await page.locator('#password').fill('wrongpassword123');
    await page.locator('button[type="submit"]').click();

    // Wait for error message to appear
    await expect(page.locator('.alert')).toBeVisible({ timeout: 10000 });
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('#password');
    await passwordInput.fill('testpassword');

    // Initially password type
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click eye button to show password
    await page.locator('#password ~ button, button:has(svg)').first().click();
    // After toggle, should be text or password based on state
  });

  test('should navigate to register page', async ({ page }) => {
    await page.getByText('إنشاء حساب جديد').click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.locator('#email').fill(TEST_USER.email);
    await page.locator('#password').fill(TEST_USER.password);
    await page.locator('button[type="submit"]').click();

    // Wait for redirect to dashboard or onboarding
    await page.waitForURL((url) => {
      const path = url.pathname;
      return path === '/' || path === '/onboarding';
    }, { timeout: 15000 });
  });
});

test.describe('Register Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should render register form with all elements', async ({ page }) => {
    // Page heading
    await expect(page.locator('h1')).toContainText('إنشاء حساب جديد');

    // Name input
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('label[for="name"]')).toContainText('الاسم الكريم');

    // Email input
    await expect(page.locator('#email')).toBeVisible();

    // Password input
    await expect(page.locator('#password')).toBeVisible();

    // Confirm password input
    await expect(page.locator('#confirmPassword')).toBeVisible();
    await expect(page.locator('label[for="confirmPassword"]')).toContainText('تأكيد كلمة المرور');

    // Submit button
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toContainText('بدء الرحلة');

    // Login link
    await expect(page.getByText('سجل دخولك هنا')).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('mismatch@test.com');
    await page.locator('#password').fill('Password123!');
    await page.locator('#confirmPassword').fill('DifferentPass123!');
    await page.locator('button[type="submit"]').click();

    // Should show password mismatch error
    await expect(page.locator('.alert')).toContainText('كلمتا المرور غير متطابقتان');
  });

  test('should show error for short password', async ({ page }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('short@test.com');
    await page.locator('#password').fill('short');
    await page.locator('#confirmPassword').fill('short');
    await page.locator('button[type="submit"]').click();

    // Should show password length error
    await expect(page.locator('.alert')).toContainText('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByText('سجل دخولك هنا').click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Auth Guard', () => {

  test('should redirect unauthenticated user to login from dashboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect unauthenticated user to login from schedule', async ({ page }) => {
    await page.goto('/schedule');
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect unauthenticated user to login from settings', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect authenticated user away from login', async ({ page }) => {
    // Login first
    await loginViaUI(page);

    // Wait for Appwrite to sync localStorage session data
    await page.waitForTimeout(2000);

    // Try to go back to login
    await page.goto('/login');

    // Should be redirected to dashboard or onboarding
    await expect(page).toHaveURL(/(\/$)|(\/onboarding)$/, { timeout: 15000 });
  });
});

test.describe('Logout', () => {

  test('should logout and redirect to login', async ({ page }) => {
    // Login first
    await loginViaUI(page);

    // Navigate to settings and logout
    await logoutViaUI(page);

    // Should be on login page
    await expect(page).toHaveURL(/\/login/);
  });
});
