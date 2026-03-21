import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly finishDayBtn: Locator;
  readonly viewScheduleLink: Locator;
  readonly todayCard: Locator;
  readonly taskList: Locator;
  readonly fortressGrid: Locator;

  constructor(page: Page) {
    this.page = page;
    this.finishDayBtn = page.locator('button:has-text("تسجيل حفظ اليوم")');
    this.viewScheduleLink = page.locator('a:has-text("عرض الخطة الأسبوعية")');
    this.todayCard = page.locator('h2:has-text("ورد اليوم")').locator('..'); // Assuming Next.js renders TodayCard like this
    this.taskList = page.locator('text=مهام اليوم').locator('..');
    this.fortressGrid = page.locator('h3:has-text("حصن القرآن")').locator('..');
  }

  async goto() {
    await this.page.goto('/');
  }

  async toggleTask(index: number) {
    const checkboxes = this.taskList.locator('input[type="checkbox"]');
    await checkboxes.nth(index).click();
  }

  async finishDay() {
    await this.finishDayBtn.click();
  }
}
