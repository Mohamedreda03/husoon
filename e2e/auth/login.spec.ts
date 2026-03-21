import { test, expect } from '@playwright/test';
import { LoginPage } from '../fixtures/LoginPage';
import { RegisterPage } from '../fixtures/RegisterPage';

test.describe('Login Flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Step 2B.1 - Verify login page renders correctly', async ({ page }) => {
    await expect(page.locator('h1:has-text("ابدأ رحلتك المباركة")')).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(page.locator('text=نسيت كلمة المرور؟')).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });

  test('Step 2B.2 - Test successful login with valid credentials', async ({ page }) => {
    // First register a new user to ensure valid credentials exist in the DB
    const uniqueEmail = `login_${Date.now()}@example.com`;
    const password = 'password123';
    
    // Quick registration flow purely for setup
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register('Login Test User', uniqueEmail, password);
    await page.waitForURL(/\/onboarding$/); // wait till signed up
    
    // Logout by navigating to settings and clicking logout, or using isolated context wrapper
    await page.goto('/settings');
    await page.locator('button:has-text("تسجيل الخروج")').click();
    await page.waitForURL(/\/login$/);

    // Now test the actual login
    await loginPage.goto();
    await loginPage.login(uniqueEmail, password);
    
    // It should redirect to onboarding or dashboard since it's a new user with/without a profile
    await page.waitForURL(/\/(onboarding)?$/);
  });

  test('Step 2B.3 - Test login with invalid credentials', async ({ page }) => {
    await loginPage.login(`wrongemail_${Date.now()}@example.com`, 'wrongpassword123');
    
    // In actual implementation, error should be descriptive
    await loginPage.verifyError('فشل في تسجيل الدخول');
  });

  test('Step 2B.4 - Test login with empty fields', async ({ page }) => {
    await loginPage.submitButton.click();
    
    // Check if HTML5 validation message appears on first required input
    const isEmailInvalid = await loginPage.emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isEmailInvalid).toBe(true);
    
    // Ensure we are still on the login page
    expect(page.url()).toContain('/login');
  });

  test('Step 2B.5 - Test password visibility toggle', async ({ page }) => {
    // Initially password
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle to text
    await loginPage.togglePasswordButton.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    
    // Click toggle back to password
    await loginPage.togglePasswordButton.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('Step 2B.6 - Test "Remember me" checkbox', async () => {
    await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
    
    await loginPage.rememberMeCheckbox.check();
    await expect(loginPage.rememberMeCheckbox).toBeChecked();
    
    await loginPage.rememberMeCheckbox.uncheck();
    await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
  });

  test('Step 2B.7 - Test navigation link to register page', async ({ page }) => {
    await loginPage.registerLink.click();
    await page.waitForURL(/\/register$/);
    await expect(page.locator('h1:has-text("إنشاء حساب جديد")')).toBeVisible();
  });
});
