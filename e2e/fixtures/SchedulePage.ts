import { expect, type Locator, type Page } from '@playwright/test';

export class SchedulePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly copyScheduleBtn: Locator;
  readonly editPlanBtn: Locator;
  readonly focusModeBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h2:has-text("الجدول الزمني الأسبوعي")');
    this.copyScheduleBtn = page.locator('button:has-text("نسخ الجدول")');
    this.editPlanBtn = page.locator('button:has-text("تعديل الخطة")');
    this.focusModeBtn = page.locator('button:has-text("تفعيل وضع التركيز الآن")');
  }

  async goto() {
    await this.page.goto('/schedule');
  }

  async copySchedule() {
    await this.copyScheduleBtn.click();
  }

  async goToFocusMode() {
    await this.focusModeBtn.click();
  }
}
