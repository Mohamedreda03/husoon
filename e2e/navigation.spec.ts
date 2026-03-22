import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════════════════════════
// Navigation Tests — uses stored auth state (logged in user)
// ═══════════════════════════════════════════════════════════

test.describe('App Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for initial load
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 15000 }).catch(() => {});
  });

  // Desktop Navigation Test (Sidebar)
  test('should navigate using desktop sidebar items', async ({ page, isMobile }) => {
    // Skip if mobile viewport
    test.skip(isMobile, 'Sidebar is only visible on desktop viewports');

    // Make sure viewport is large enough to show sidebar
    await page.setViewportSize({ width: 1280, height: 800 });
    
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check all sidebar links
    const navItems = [
      { name: 'لوحة التحكم', url: '/' },
      { name: 'الجدول الزمني', url: '/schedule' },
      { name: 'وضع التركيز', url: '/timer' },
      { name: 'الإحصائيات', url: '/stats' },
      { name: 'الإعدادات', url: '/settings' },
    ];

    for (const item of navItems) {
      // Find the link by exact text
      const link = sidebar.getByText(item.name, { exact: true });
      await expect(link).toBeVisible();
      
      // Click and verify URL
      await link.click();
      
      // Wait for navigation and verify URL ends with the expected path
      await page.waitForURL(`**${item.url === '/' ? '' : item.url}`);
      let currentUrl = page.url();
      if (item.url === '/') {
        // Special case for root to avoid matching any trailing characters
        expect(new URL(currentUrl).pathname).toBe('/');
      } else {
        expect(currentUrl).toContain(item.url);
      }
    }
  });

  // Mobile Navigation Test (Bottom Nav)
  test('should navigate using mobile bottom navbar', async ({ page, isMobile }) => {
    // Skip if desktop viewport
    test.skip(!isMobile, 'Mobile nav is only visible on mobile viewports');
    
    // Specifically look for the mobile bottom nav that has fixed classes
    const mobileNav = page.locator('nav.md\\:hidden.fixed.bottom-0');
    await expect(mobileNav).toBeVisible();

    // Check all mobile nav links
    const navItems = [
      { name: 'اليوم', url: '/' },
      { name: 'المؤقت', url: '/timer' },
      { name: 'الجدول', url: '/schedule' },
      { name: 'التقدم', url: '/stats' },
      { name: 'الإعدادات', url: '/settings' },
    ];

    for (const item of navItems) {
      // Find the actual link element
      const link = mobileNav.getByRole('link', { name: item.name });
      await expect(link).toBeVisible();
      
      // Native click to bypass React Query devtools overlaps in the Playwright engine
      await link.evaluate((node) => (node as HTMLElement).click());
      
      // Wait for navigation
      const expectedPath = item.url === '/' ? /(\/$)/ : new RegExp(`.*${item.url}$`);
      await expect(page).toHaveURL(expectedPath, { timeout: 15000 });
      
      let currentUrl = page.url();
      if (item.url === '/') {
        expect(new URL(currentUrl).pathname).toBe('/');
      } else {
        expect(currentUrl).toContain(item.url);
      }
    }
  });

  test('should start memorization CTA button in sidebar', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Sidebar is only visible on desktop viewports');
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Navigate away from home first
    await page.goto('/settings');
    
    const sidebar = page.locator('aside');
    const ctaBtn = sidebar.getByText('ابدأ المراجعة');
    await expect(ctaBtn).toBeVisible();
    
    await ctaBtn.click();
    
    // Should navigate to dashboard
    await expect(page).toHaveURL('/');
  });
});
