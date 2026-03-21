import { expect, type Locator, type Page } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[placeholder="الاسم الثلاثي"]');
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[placeholder="••••••••"]').nth(0);
    this.confirmPasswordInput = page.locator('input[placeholder="••••••••"]').nth(1);
    this.submitButton = page.locator('button[type="submit"]');
    this.loginLink = page.locator('text=سجل دخولك هنا');
  }

  async goto() {
    await this.page.goto('/register');
    await expect(this.page.locator('text=إنشاء حساب جديد').first()).toBeVisible();
  }

  async register(name: string, email: string, password: string = 'password123') {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.submitButton.click();
  }

  async verifyError(message: string) {
    await expect(this.page.locator(`text=${message}`)).toBeVisible();
  }
}
