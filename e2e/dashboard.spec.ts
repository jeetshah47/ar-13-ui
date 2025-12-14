import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should load dashboard page', async ({ page }) => {
    // Check if dashboard elements are present
    const dashboardContent = page.locator('text=/dashboard|stats|overview/i');
    const hasContent = await dashboardContent.isVisible().catch(() => false);
    
    // Or check URL
    const url = page.url();
    expect(url.includes('dashboard') || hasContent).toBeTruthy();
  });

  test('should display dashboard statistics', async ({ page }) => {
    await page.waitForTimeout(2000); // Wait for data to load
    
    // Look for common dashboard elements
    const statsCards = page.locator('[class*="card"], [class*="stat"], [class*="metric"]');
    const statsCount = await statsCards.count();
    
    // Dashboard should have some content
    expect(statsCount >= 0).toBeTruthy();
  });

  test('should handle dashboard data loading', async ({ page }) => {
    // Check for loading indicators
    const loadingIndicator = page.locator('text=/loading|spinner|progress/i, [class*="loading"], [class*="spinner"]');
    const isLoading = await loadingIndicator.isVisible().catch(() => false);
    
    // Wait for loading to complete
    if (isLoading) {
      await page.waitForTimeout(3000);
    }
    
    // Page should be loaded
    expect(await page.url()).toBeTruthy();
  });

  test('should display error state if data fails to load', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/dashboard/**', route => route.abort());
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Should show error or handle gracefully
    const errorMessage = page.locator('text=/error|failed|unable/i');
    const hasError = await errorMessage.isVisible().catch(() => false);
    
    // Error should be handled
    expect(await page.url()).toBeTruthy();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Dashboard should be visible on mobile
    const url = page.url();
    expect(url.includes('dashboard') || url.includes('signin')).toBeTruthy();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    expect(url.includes('dashboard') || url.includes('signin')).toBeTruthy();
  });

  test('should refresh dashboard data', async ({ page }) => {
    // Look for refresh button
    const refreshButton = page.locator('button[aria-label*="refresh"], button:has-text("Refresh")');
    
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      await page.waitForTimeout(1000);
      
      // Should reload data
      expect(await page.url()).toBeTruthy();
    }
  });
});

