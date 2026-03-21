/**
 * Shared helper functions for authentication in E2E tests.
 */
import { Page, expect } from '@playwright/test';

export async function loginUser(page: Page, email: string, password: string = 'testpassword123') {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect to happen (either onboarding or dashboard)
  await page.waitForURL(/\/(onboarding)?$/);
}

export async function registerUser(page: Page, name: string, email: string, password: string = 'testpassword123') {
  await page.goto('/register');
  await page.fill('input[id="name"]', name);
  await page.fill('input[type="email"]', email);
  await page.fill('input[id="password"]', password);
  await page.fill('input[id="confirmPassword"]', password);
  await page.click('button[type="submit"]');

  // Wait for redirect to onboarding
  await page.waitForURL(/\/onboarding$/);
}

export async function logoutUser(page: Page) {
  // Navigate to settings and logout
  await page.goto('/settings');
  await page.click('text="تسجيل الخروج"');
  await page.waitForURL(/\/login$/);
}
