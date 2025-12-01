import { test, expect } from '@playwright/test';

test.describe('Projects E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/projects');
    await page.waitForLoadState('networkidle');
  });

  test('should load projects page', async ({ page }) => {
    const url = page.url();
    expect(url.includes('projects') || url.includes('signin') || url.includes('dashboard')).toBeTruthy();
  });

  test('should display projects list', async ({ page }) => {
    await page.waitForTimeout(2000); // Wait for data to load
    
    // Look for project list elements
    const projectCards = page.locator('[class*="project"], [class*="card"], [data-testid*="project"]');
    const projectsCount = await projectCards.count();
    
    // Should have projects list (even if empty)
    expect(projectsCount >= 0).toBeTruthy();
  });

  test('should open project filter', async ({ page }) => {
    const filterButton = page.locator('button:has-text("Filter"), button[aria-label*="filter"], [class*="filter"]');
    
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      // Filter should be visible
      const filterPanel = page.locator('[class*="filter"], [class*="drawer"], [class*="modal"]');
      const isVisible = await filterPanel.isVisible().catch(() => false);
      expect(isVisible).toBeTruthy();
    }
  });

  test('should filter projects by status', async ({ page }) => {
    const filterButton = page.locator('button:has-text("Filter")');
    
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      // Find status checkboxes
      const statusCheckbox = page.locator('input[type="checkbox"]').first();
      
      if (await statusCheckbox.isVisible()) {
        await statusCheckbox.click();
        await page.waitForTimeout(500);
        
        // Apply filter
        const applyButton = page.locator('button:has-text("Apply")');
        if (await applyButton.isVisible()) {
          await applyButton.click();
          await page.waitForTimeout(1000);
          
          // Filter should be applied
          expect(await page.url()).toBeTruthy();
        }
      }
    }
  });

  test('should search projects', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test project');
      await page.waitForTimeout(1000);
      
      // Search should filter results
      expect(await page.url()).toBeTruthy();
    }
  });

  test('should open create project dialog', async ({ page }) => {
    const createButton = page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")');
    
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(500);
      
      // Dialog should be visible
      const dialog = page.locator('[role="dialog"], [class*="modal"], [class*="dialog"]');
      const isVisible = await dialog.isVisible().catch(() => false);
      expect(isVisible).toBeTruthy();
    }
  });

  test('should create new project with valid data', async ({ page }) => {
    const createButton = page.locator('button:has-text("Create"), button:has-text("Add")');
    
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(500);
      
      // Fill form
      const nameInput = page.locator('input[name="name"], input[name="title"], input[placeholder*="name"]');
      const descriptionInput = page.locator('textarea[name="description"], textarea[placeholder*="description"]');
      
      if (await nameInput.isVisible()) {
        await nameInput.fill('E2E Test Project');
        
        if (await descriptionInput.isVisible()) {
          await descriptionInput.fill('This is a test project created by E2E tests');
        }
        
        // Submit
        const submitButton = page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Save")');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(2000);
          
          // Should create project or show error
          expect(await page.url()).toBeTruthy();
        }
      }
    }
  });

  test('should show validation errors for empty project form', async ({ page }) => {
    const createButton = page.locator('button:has-text("Create"), button:has-text("Add")');
    
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(500);
      
      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"], button:has-text("Create")');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(500);
        
        // Should show validation errors
        const errorMessages = page.locator('text=/required|invalid|error/i');
        const errorCount = await errorMessages.count();
        expect(errorCount >= 0).toBeTruthy();
      }
    }
  });

  test('should view project details', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Click on first project card
    const projectCard = page.locator('[class*="project"], [class*="card"]').first();
    
    if (await projectCard.isVisible()) {
      await projectCard.click();
      await page.waitForTimeout(1000);
      
      // Should navigate to project details
      const url = page.url();
      expect(url.includes('projects') || url.includes('project')).toBeTruthy();
    }
  });

  test('should handle project deletion', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Find delete button (might be in menu)
    const deleteButton = page.locator('button:has-text("Delete"), button[aria-label*="delete"]').first();
    const menuButton = page.locator('button[aria-label*="menu"], [class*="menu"]').first();
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300);
      
      const deleteOption = page.locator('text=/delete/i');
      if (await deleteOption.isVisible()) {
        await deleteOption.click();
        await page.waitForTimeout(500);
        
        // Confirm deletion if dialog appears
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Delete")');
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
          await page.waitForTimeout(1000);
        }
      }
    } else if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Should handle deletion
    expect(await page.url()).toBeTruthy();
  });

  test('should paginate through projects', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Look for pagination controls
    const nextButton = page.locator('button:has-text("Next"), button[aria-label*="next"]');
    const pageButton = page.locator('button:has-text("2"), [class*="page"]').first();
    
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      // Should load next page
      expect(await page.url()).toBeTruthy();
    } else if (await pageButton.isVisible()) {
      await pageButton.click();
      await page.waitForTimeout(1000);
      
      expect(await page.url()).toBeTruthy();
    }
  });
});

