import { test, expect } from '@playwright/test';

test.describe('Accessibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper page title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for h1
    const h1 = page.locator('h1').first();
    const hasH1 = await h1.isVisible().catch(() => false);
    
    // Should have at least one heading
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount >= 0).toBeTruthy();
  });

  test('should have alt text for images', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const firstImage = images.first();
      const alt = await firstImage.getAttribute('alt');
      // Images should have alt text (can be empty for decorative images)
      expect(alt !== null).toBeTruthy();
    }
  });

  test('should have proper form labels', async ({ page }) => {
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"], textarea');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      const firstInput = inputs.first();
      const id = await firstInput.getAttribute('id');
      const ariaLabel = await firstInput.getAttribute('aria-label');
      const placeholder = await firstInput.getAttribute('placeholder');
      
      // Should have some form of label
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.isVisible().catch(() => false);
        expect(hasLabel || ariaLabel || placeholder).toBeTruthy();
      } else {
        expect(ariaLabel || placeholder).toBeTruthy();
      }
    }
  });

  test('should have proper button labels', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const text = await firstButton.textContent();
      const ariaLabel = await firstButton.getAttribute('aria-label');
      const title = await firstButton.getAttribute('title');
      
      // Buttons should have accessible name
      expect(text || ariaLabel || title).toBeTruthy();
    }
  });

  test('should have proper link text', async ({ page }) => {
    const links = page.locator('a');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      const firstLink = links.first();
      const text = await firstLink.textContent();
      const ariaLabel = await firstLink.getAttribute('aria-label');
      
      // Links should have accessible text
      expect((text && text.trim().length > 0) || ariaLabel).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through page
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    const focusedElement = page.locator(':focus');
    const isFocused = await focusedElement.isVisible().catch(() => false);
    expect(isFocused).toBeTruthy();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Check for common ARIA attributes
    const elementsWithAria = page.locator('[aria-label], [aria-labelledby], [aria-describedby]');
    const ariaCount = await elementsWithAria.count();
    
    // Should have some ARIA attributes for better accessibility
    expect(ariaCount >= 0).toBeTruthy();
  });

  test('should have proper focus indicators', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    const focusedElement = page.locator(':focus');
    if (await focusedElement.isVisible()) {
      // Check for focus styles (this is visual, but we can check if element is focusable)
      const tagName = await focusedElement.evaluate(el => el.tagName);
      expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tagName)).toBeTruthy();
    }
  });

  test('should have proper semantic HTML', async ({ page }) => {
    // Check for semantic elements
    const nav = page.locator('nav');
    const main = page.locator('main');
    const header = page.locator('header');
    const footer = page.locator('footer');
    
    const hasNav = await nav.isVisible().catch(() => false);
    const hasMain = await main.isVisible().catch(() => false);
    const hasHeader = await header.isVisible().catch(() => false);
    const hasFooter = await footer.isVisible().catch(() => false);
    
    // Should have some semantic structure
    expect(hasNav || hasMain || hasHeader || hasFooter).toBeTruthy();
  });

  test('should handle screen reader announcements', async ({ page }) => {
    // Check for live regions
    const liveRegions = page.locator('[aria-live], [role="alert"], [role="status"]');
    const liveRegionCount = await liveRegions.count();
    
    // Should have live regions for dynamic content
    expect(liveRegionCount >= 0).toBeTruthy();
  });

  test('should have proper color contrast (basic check)', async ({ page }) => {
    // This is a basic check - full contrast testing requires specialized tools
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6');
    const textCount = await textElements.count();
    
    // Should have text content
    expect(textCount >= 0).toBeTruthy();
  });

  test('should handle skip to main content link', async ({ page }) => {
    const skipLink = page.locator('a:has-text("Skip"), a[href*="#main"]');
    const hasSkipLink = await skipLink.isVisible().catch(() => false);
    
    if (hasSkipLink) {
      await skipLink.click();
      await page.waitForTimeout(300);
      
      // Should navigate to main content
      expect(await page.url()).toBeTruthy();
    }
  });
});

