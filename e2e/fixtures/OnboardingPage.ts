import { expect, type Locator, type Page } from '@playwright/test';

export class OnboardingPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly step1Indicator: Locator;
  readonly step2Indicator: Locator;
  
  // Step 1 Elements
  readonly addManualRangeBtn: Locator;
  readonly fromPageInput: Locator;
  readonly toPageInput: Locator;
  readonly submitRangeBtn: Locator;
  readonly juzAmmaShortcut: Locator;
  readonly skipLink: Locator;
  readonly nextBtn: Locator;

  // Step 2 Elements
  readonly onePageGoalBtn: Locator;
  readonly twoPagesGoalBtn: Locator;
  readonly startJourneyBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1:has-text("حصون")');
    this.step1Indicator = page.locator('text=الحفظ الحالي');
    this.step2Indicator = page.locator('text=الخطة');
    
    // Step 1
    this.addManualRangeBtn = page.locator('button:has-text("إضافة نطاق يدوياً")');
    this.fromPageInput = page.locator('input[type="number"]').nth(0);
    this.toPageInput = page.locator('input[type="number"]').nth(1);
    this.submitRangeBtn = page.locator('button:has-text("إضافة")');
    this.juzAmmaShortcut = page.locator('button:has-text("جزء عم")');
    this.skipLink = page.locator('button:has-text("تخطي — لم أحفظ شيئاً بعد")');
    this.nextBtn = page.locator('button:has-text("التالي")');
    
    // Step 2
    this.onePageGoalBtn = page.locator('button:has-text("صفحة واحدة")');
    this.twoPagesGoalBtn = page.locator('button:has-text("صفحتان")');
    this.startJourneyBtn = page.locator('button:has-text("ابدأ رحلة الحفظ")');
  }

  async goto() {
    await this.page.goto('/onboarding');
  }

  async addManualRange(from: number, to: number) {
    await this.addManualRangeBtn.click();
    await this.fromPageInput.fill(from.toString());
    await this.toPageInput.fill(to.toString());
    await this.submitRangeBtn.click();
  }

  async skipStep1() {
    await this.skipLink.click();
  }

  async goToStep2() {
    await this.nextBtn.click();
    await expect(this.page.locator('text=ما هي وتيرة الحفظ اليومية؟')).toBeVisible();
  }

  async selectGoalAndStart(goalText: string) {
    await this.page.locator(`button:has-text("${goalText}")`).click();
    await this.startJourneyBtn.click();
  }
}
