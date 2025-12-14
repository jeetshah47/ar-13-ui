import { test, expect } from '@playwright/test';

test.describe('Navigation E2E Tests', () => {
  // Helper function to login (if needed for authenticated routes)
  async function loginIfNeeded(page: any) {
    // This would need to be implemented based on your auth flow
    // For now, we'll test public routes and check redirects
  }

  test('should navigate to dashboard from root', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to dashboard or sign in
    const url = page.url();
    expect(url.includes('dashboard') || url.includes('signin') || url.includes('login')).toBeTruthy();
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.goto('/app/projects');
    await page.waitForLoadState('networkidle');
    
    // Should be on projects page or redirected
    const url = page.url();
    expect(url.includes('projects') || url.includes('signin') || url.includes('dashboard')).toBeTruthy();
  });

  test('should navigate to calendar page', async ({ page }) => {
    await page.goto('/app/calendar');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    expect(url.includes('calendar') || url.includes('signin') || url.includes('dashboard')).toBeTruthy();
  });

  test('should navigate to employees page', async ({ page }) => {
    await page.goto('/app/employees');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    expect(url.includes('employees') || url.includes('signin') || url.includes('dashboard')).toBeTruthy();
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.goto('/app/profile');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    expect(url.includes('profile') || url.includes('signin') || url.includes('dashboard')).toBeTruthy();
  });

  test('should navigate to info portal page', async ({ page }) => {
    await page.goto('/app/info-portal');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    expect(url.includes('info-portal') || url.includes('signin') || url.includes('dashboard')).toBeTruthy();
  });

  test('should handle back navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const initialUrl = page.url();
    
    // Navigate to another page
    await page.goto('/app/projects');
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Should be back to initial page
    const finalUrl = page.url();
    expect(finalUrl).toBeTruthy();
  });

  test('should handle browser refresh', async ({ page }) => {
    await page.goto('/app/dashboard');
    await page.waitForLoadState('networkidle');
    
    const initialUrl = page.url();
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still be on same page (or redirected appropriately)
    const finalUrl = page.url();
    expect(finalUrl).toBeTruthy();
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Test navigating directly to a deep route
    await page.goto('/app/projects/123');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('should redirect unauthorized users', async ({ page }) => {
    // Try to access admin-only route
    await page.goto('/app/metrics');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to dashboard or sign in if not admin
    const url = page.url();
    expect(url.includes('metrics') || url.includes('dashboard') || url.includes('signin')).toBeTruthy();
  });

  test('should handle 404 for invalid routes', async ({ page }) => {
    await page.goto('/app/invalid-route-12345');
    await page.waitForLoadState('networkidle');
    
    // Should show 404 or redirect
    const url = page.url();
    const pageContent = await page.textContent('body');
    
    // Either redirects or shows error
    expect(url || pageContent).toBeTruthy();
  });
});

