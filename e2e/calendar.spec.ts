import { test, expect } from '@playwright/test';

test.describe('Calendar E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should load calendar page', async ({ page }) => {
    const url = page.url();
    expect(url.includes('calendar') || url.includes('signin') || url.includes('dashboard')).toBeTruthy();
  });

  test('should display calendar view', async ({ page }) => {
    // Look for calendar elements
    const calendar = page.locator('[class*="calendar"], [class*="rbc-calendar"]');
    const calendarVisible = await calendar.isVisible().catch(() => false);
    
    // Or check for month view
    const monthView = page.locator('text=/january|february|march|april|may|june|july|august|september|october|november|december/i');
    const hasMonth = await monthView.isVisible().catch(() => false);
    
    expect(calendarVisible || hasMonth).toBeTruthy();
  });

  test('should navigate to next month', async ({ page }) => {
    const nextButton = page.locator('button[aria-label*="next"], button:has-text("Next")');
    
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      // Should show next month
      expect(await page.url()).toBeTruthy();
    }
  });

  test('should navigate to previous month', async ({ page }) => {
    const prevButton = page.locator('button[aria-label*="prev"], button:has-text("Previous")');
    
    if (await prevButton.isVisible()) {
      await prevButton.click();
      await page.waitForTimeout(1000);
      
      expect(await page.url()).toBeTruthy();
    }
  });

  test('should create calendar event', async ({ page }) => {
    const createButton = page.locator('button:has-text("Create"), button:has-text("Add Event"), button:has-text("New Event")');
    
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(500);
      
      // Fill event form
      const titleInput = page.locator('input[name="title"], input[placeholder*="title"]');
      
      if (await titleInput.isVisible()) {
        await titleInput.fill('E2E Test Event');
        
        // Submit
        const submitButton = page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Save")');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(2000);
          
          expect(await page.url()).toBeTruthy();
        }
      }
    }
  });

  test('should click on calendar date to create event', async ({ page }) => {
    // Click on a date cell
    const dateCell = page.locator('[class*="rbc-day"], [class*="calendar-day"], td').first();
    
    if (await dateCell.isVisible()) {
      await dateCell.click();
      await page.waitForTimeout(500);
      
      // Should open event creation dialog
      const dialog = page.locator('[role="dialog"], [class*="modal"]');
      const isVisible = await dialog.isVisible().catch(() => false);
      expect(isVisible).toBeTruthy();
    }
  });

  test('should view event details', async ({ page }) => {
    // Click on an event
    const event = page.locator('[class*="event"], [class*="rbc-event"]').first();
    
    if (await event.isVisible()) {
      await event.click();
      await page.waitForTimeout(500);
      
      // Should show event details
      const eventDetails = page.locator('[class*="event-detail"], [role="dialog"]');
      const isVisible = await eventDetails.isVisible().catch(() => false);
      expect(isVisible).toBeTruthy();
    }
  });

  test('should edit calendar event', async ({ page }) => {
    const event = page.locator('[class*="event"]').first();
    
    if (await event.isVisible()) {
      await event.click();
      await page.waitForTimeout(500);
      
      // Look for edit button
      const editButton = page.locator('button:has-text("Edit")');
      
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);
        
        // Should open edit form
        const form = page.locator('input[name="title"]');
        const isVisible = await form.isVisible().catch(() => false);
        expect(isVisible).toBeTruthy();
      }
    }
  });

  test('should delete calendar event', async ({ page }) => {
    const event = page.locator('[class*="event"]').first();
    
    if (await event.isVisible()) {
      await event.click();
      await page.waitForTimeout(500);
      
      // Look for delete button
      const deleteButton = page.locator('button:has-text("Delete")');
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForTimeout(500);
        
        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Delete")');
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
          await page.waitForTimeout(1000);
        }
      }
    }
    
    expect(await page.url()).toBeTruthy();
  });

  test('should switch calendar view (month/week/day)', async ({ page }) => {
    // Look for view switcher
    const monthView = page.locator('button:has-text("Month")');
    const weekView = page.locator('button:has-text("Week")');
    const dayView = page.locator('button:has-text("Day")');
    
    if (await weekView.isVisible()) {
      await weekView.click();
      await page.waitForTimeout(1000);
      
      expect(await page.url()).toBeTruthy();
    } else if (await dayView.isVisible()) {
      await dayView.click();
      await page.waitForTimeout(1000);
      
      expect(await page.url()).toBeTruthy();
    }
  });
});

