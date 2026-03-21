import { expect, type Locator, type Page } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly profileName: Locator;
  readonly editNameBtn: Locator;
  readonly addRangeBtn: Locator;
  readonly saveChangesBtn: Locator;
  readonly logoutBtn: Locator;
  readonly exportDataBtn: Locator;
  readonly resetProgressBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h2:has-text("الإعدادات")');
    this.profileName = page.locator('h3.font-bold.text-xl.text-primary');
    this.editNameBtn = page.locator('button', { has: page.locator('svg.lucide-edit-2') });
    this.addRangeBtn = page.locator('button:has-text("إضافة نطاق جديد")');
    this.saveChangesBtn = page.locator('button:has-text("حفظ التغييرات")');
    this.logoutBtn = page.locator('button:has-text("تسجيل الخروج")');
    this.exportDataBtn = page.locator('button:has-text("تصدير بياناتي")');
    this.resetProgressBtn = page.locator('button:has-text("إعادة تعيين التقدم")');
  }

  async goto() {
    await this.page.goto('/settings');
  }

  async clickLogout() {
    await this.logoutBtn.click();
  }

  async saveChanges() {
    await this.saveChangesBtn.click();
  }
}
