import { expect, type Locator, type Page } from '@playwright/test';

export class StatsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly achievementsSection: Locator;
  readonly progressCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h2:has-text("إحصائيات الإنجاز")');
    this.achievementsSection = page.locator('h4:has-text("الأوسمة والجوائز")').locator('..');
    this.progressCard = page.locator('h4:has-text("رحلة الختمة الحالية")').locator('..');
  }

  async goto() {
    await this.page.goto('/stats');
  }

  async getRemainingPages(): Promise<string> {
    return await this.progressCard.locator('span.font-serif.text-3xl').innerText();
  }
}
