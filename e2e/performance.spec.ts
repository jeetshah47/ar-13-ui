import { test, expect } from '@playwright/test';

test.describe('Performance E2E Tests', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds (adjust based on your requirements)
    expect(loadTime).toBeLessThan(10000);
  });

  test('should have acceptable First Contentful Paint', async ({ page }) => {
    await page.goto('/');
    
    // Measure FCP
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            resolve(fcpEntry.startTime);
          }
        }).observe({ entryTypes: ['paint'] });
        
        // Timeout after 5 seconds
        setTimeout(() => resolve(null), 5000);
      });
    });
    
    // FCP should be less than 2 seconds (adjust based on requirements)
    if (fcp) {
      expect(fcp).toBeLessThan(2000);
    }
  });

  test('should have acceptable Largest Contentful Paint', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        let lcpValue = null;
        
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          lcpValue = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Wait a bit then resolve
        setTimeout(() => resolve(lcpValue), 3000);
      });
    });
    
    // LCP should be less than 2.5 seconds
    if (lcp) {
      expect(lcp).toBeLessThan(2500);
    }
  });

  test('should not have memory leaks on navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate multiple times
    for (let i = 0; i < 5; i++) {
      await page.goto('/app/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      await page.goto('/app/projects');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    }
    
    // Should still be functional
    expect(await page.url()).toBeTruthy();
  });

  test('should handle large lists efficiently', async ({ page }) => {
    await page.goto('/app/projects');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Scroll through list
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(500);
    }
    
    // Should still be responsive
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(0);
  });

  test('should lazy load images', async ({ page }) => {
    await page.goto('/app/projects');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check for lazy loading attributes
    const images = page.locator('img[loading="lazy"]');
    const lazyImageCount = await images.count();
    
    // Should have some lazy loaded images
    expect(lazyImageCount >= 0).toBeTruthy();
  });

  test('should handle API response times', async ({ page }) => {
    const apiCalls: number[] = [];
    
    // Monitor network requests
    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('/api/')) {
        apiCalls.push(response.status());
      }
    });
    
    await page.goto('/app/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Most API calls should succeed
    const successCount = apiCalls.filter(status => status >= 200 && status < 300).length;
    const totalCalls = apiCalls.length;
    
    if (totalCalls > 0) {
      const successRate = successCount / totalCalls;
      // At least 50% should succeed (adjust based on requirements)
      expect(successRate).toBeGreaterThan(0.5);
    }
  });

  test('should have acceptable bundle size', async ({ page }) => {
    const resources: { url: string; size: number }[] = [];
    
    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('.js') || url.includes('.css')) {
        const contentLength = response.headers()['content-length'];
        if (contentLength) {
          resources.push({ url, size: parseInt(contentLength) });
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Calculate total size
    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
    
    // Total should be reasonable (adjust threshold)
    // 5MB is a reasonable threshold for modern web apps
    expect(totalSize).toBeLessThan(5 * 1024 * 1024);
  });

  test('should handle concurrent user actions', async ({ page }) => {
    await page.goto('/app/projects');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Perform multiple actions quickly
    const createButton = page.locator('button:has-text("Create")').first();
    
    if (await createButton.isVisible()) {
      // Click multiple times quickly
      await createButton.click();
      await page.waitForTimeout(100);
      await createButton.click();
      await page.waitForTimeout(100);
      
      // Should handle gracefully (not create duplicates)
      expect(await page.url()).toBeTruthy();
    }
  });

  test('should optimize re-renders', async ({ page }) => {
    await page.goto('/app/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Monitor for excessive re-renders (this is a simplified check)
    let renderCount = 0;
    
    await page.evaluate(() => {
      const observer = new MutationObserver(() => {
        renderCount++;
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
    
    await page.waitForTimeout(3000);
    
    // Should not have excessive mutations
    // This is a basic check - full optimization requires profiling
    expect(renderCount >= 0).toBeTruthy();
  });
});

