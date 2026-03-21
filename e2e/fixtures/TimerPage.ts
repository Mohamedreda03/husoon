import { expect, type Locator, type Page } from '@playwright/test';

export class TimerPage {
  readonly page: Page;
  readonly timerDisplay: Locator;
  readonly playBtn: Locator;
  readonly pauseBtn: Locator;
  readonly resetBtn: Locator;
  readonly taskItems: Locator;
  readonly completedSessionsCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.timerDisplay = page.locator('.font-serif.text-7xl'); // Based on typical timer styling
    this.playBtn = page.locator('button', { has: page.locator('svg.lucide-play') });
    this.pauseBtn = page.locator('button', { has: page.locator('svg.lucide-pause') });
    this.resetBtn = page.locator('button', { has: page.locator('svg.lucide-rotate-ccw') });
    this.taskItems = page.locator('button.w-full.text-right'); // Task selector items
    this.completedSessionsCount = page.locator('text=جلسات اليوم').locator('..').locator('span.font-serif');
  }

  async goto() {
    await this.page.goto('/timer');
  }

  async selectTask(index: number) {
    await this.taskItems.nth(index).click();
  }

  async startTimer() {
    await this.playBtn.click();
  }

  async pauseTimer() {
    await this.pauseBtn.click();
  }
}
