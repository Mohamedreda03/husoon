import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly togglePasswordButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.togglePasswordButton = page.locator('button', { has: page.locator('svg.lucide-eye') });
    this.rememberMeCheckbox = page.locator('input[type="checkbox"]');
    this.registerLink = page.locator('text=إنشاء حساب جديد');
  }

  async goto() {
    await this.page.goto('/login');
    await expect(this.page.locator('text=ابدأ رحلتك المباركة')).toBeVisible();
  }

  async login(email: string, password: string = 'password123') {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async verifyError(message: string) {
    await expect(this.page.locator(`text=${message}`)).toBeVisible();
  }
}
