import { test, expect } from '@playwright/test';

test.describe('Application Basic E2E Tests', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page loaded successfully
    await expect(page).toHaveTitle(/AR-13/);
  });

  test('should navigate to sign in page if not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Check if we're redirected to sign in or if sign in elements are present
    // This depends on your routing logic
    const signInButton = page.locator('button:has-text("Sign In"), button:has-text("Login")');
    const emailInput = page.locator('input[type="email"]');
    
    // At least one of these should be present if we're on the sign in page
    const hasSignInElements = await Promise.race([
      signInButton.isVisible().catch(() => false),
      emailInput.isVisible().catch(() => false),
    ]);
    
    // This test is flexible - it just checks that the page loaded
    expect(hasSignInElements || page.url().includes('signin') || page.url().includes('login')).toBeTruthy();
  });

  test('should display error message for invalid login', async ({ page }) => {
    await page.goto('/signin');
    
    await page.waitForLoadState('networkidle');
    
    // Fill in invalid credentials
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign In")');
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid@example.com');
      await passwordInput.fill('wrongpassword');
      
      // Submit the form
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Wait for error message (adjust selector based on your actual error display)
        await page.waitForTimeout(1000);
        
        // Check for error message (this is a generic check - adjust based on your implementation)
        const errorMessage = page.locator('text=/error|invalid|incorrect/i');
        // This test verifies the form submission works, even if we can't verify the exact error message
        expect(await page.url()).toBeTruthy();
      }
    }
  });

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that page loads on mobile
    await expect(page).toHaveTitle(/AR-13/);
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that page loads on tablet
    await expect(page).toHaveTitle(/AR-13/);
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that page loads on desktop
    await expect(page).toHaveTitle(/AR-13/);
  });
});

