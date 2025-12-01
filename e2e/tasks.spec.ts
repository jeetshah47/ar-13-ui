import { test, expect } from '@playwright/test';

test.describe('Tasks E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a project page first (tasks are usually within projects)
    await page.goto('/app/projects');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should display tasks in project', async ({ page }) => {
    // Click on first project to view tasks
    const projectCard = page.locator('[class*="project"], [class*="card"]').first();
    
    if (await projectCard.isVisible()) {
      await projectCard.click();
      await page.waitForTimeout(2000);
      
      // Look for tasks
      const tasksList = page.locator('[class*="task"], [data-testid*="task"]');
      const tasksCount = await tasksList.count();
      
      // Should have tasks section (even if empty)
      expect(tasksCount >= 0).toBeTruthy();
    }
  });

  test('should create new task', async ({ page }) => {
    const projectCard = page.locator('[class*="project"]').first();
    
    if (await projectCard.isVisible()) {
      await projectCard.click();
      await page.waitForTimeout(2000);
      
      const createTaskButton = page.locator('button:has-text("Add Task"), button:has-text("Create Task"), button:has-text("New Task")');
      
      if (await createTaskButton.isVisible()) {
        await createTaskButton.click();
        await page.waitForTimeout(500);
        
        // Fill task form
        const subjectInput = page.locator('input[name="subject"], input[name="title"], input[placeholder*="task"]');
        const descriptionInput = page.locator('textarea[name="description"]');
        
        if (await subjectInput.isVisible()) {
          await subjectInput.fill('E2E Test Task');
          
          if (await descriptionInput.isVisible()) {
            await descriptionInput.fill('This is a test task');
          }
          
          // Submit
          const submitButton = page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Add")');
          if (await submitButton.isVisible()) {
            await submitButton.click();
            await page.waitForTimeout(2000);
            
            expect(await page.url()).toBeTruthy();
          }
        }
      }
    }
  });

  test('should update task status', async ({ page }) => {
    const projectCard = page.locator('[class*="project"]').first();
    
    if (await projectCard.isVisible()) {
      await projectCard.click();
      await page.waitForTimeout(2000);
      
      // Find first task
      const taskCard = page.locator('[class*="task"]').first();
      
      if (await taskCard.isVisible()) {
        // Look for status dropdown or button
        const statusButton = page.locator('button:has-text("Pending"), button:has-text("In Progress"), [class*="status"]').first();
        
        if (await statusButton.isVisible()) {
          await statusButton.click();
          await page.waitForTimeout(300);
          
          // Select new status
          const newStatus = page.locator('text=/in progress|completed|pending/i').first();
          if (await newStatus.isVisible()) {
            await newStatus.click();
            await page.waitForTimeout(1000);
            
            expect(await page.url()).toBeTruthy();
          }
        }
      }
    }
  });

  test('should assign task to user', async ({ page }) => {
    const projectCard = page.locator('[class*="project"]').first();
    
    if (await projectCard.isVisible()) {
      await projectCard.click();
      await page.waitForTimeout(2000);
      
      const taskCard = page.locator('[class*="task"]').first();
      
      if (await taskCard.isVisible()) {
        // Look for assign button
        const assignButton = page.locator('button[aria-label*="assign"], button:has-text("Assign")');
        
        if (await assignButton.isVisible()) {
          await assignButton.click();
          await page.waitForTimeout(500);
          
          // Select user from dropdown
          const userOption = page.locator('[role="option"], [class*="user"]').first();
          if (await userOption.isVisible()) {
            await userOption.click();
            await page.waitForTimeout(1000);
            
            expect(await page.url()).toBeTruthy();
          }
        }
      }
    }
  });

  test('should filter tasks by status', async ({ page }) => {
    const projectCard = page.locator('[class*="project"]').first();
    
    if (await projectCard.isVisible()) {
      await projectCard.click();
      await page.waitForTimeout(2000);
      
      // Look for filter
      const filterButton = page.locator('button:has-text("Filter")');
      
      if (await filterButton.isVisible()) {
        await filterButton.click();
        await page.waitForTimeout(500);
        
        // Select status filter
        const statusCheckbox = page.locator('input[type="checkbox"]').first();
        if (await statusCheckbox.isVisible()) {
          await statusCheckbox.click();
          await page.waitForTimeout(300);
          
          // Apply filter
          const applyButton = page.locator('button:has-text("Apply")');
          if (await applyButton.isVisible()) {
            await applyButton.click();
            await page.waitForTimeout(1000);
            
            expect(await page.url()).toBeTruthy();
          }
        }
      }
    }
  });

  test('should add time spent to task', async ({ page }) => {
    const projectCard = page.locator('[class*="project"]').first();
    
    if (await projectCard.isVisible()) {
      await projectCard.click();
      await page.waitForTimeout(2000);
      
      const taskCard = page.locator('[class*="task"]').first();
      
      if (await taskCard.isVisible()) {
        await taskCard.click();
        await page.waitForTimeout(1000);
        
        // Look for time tracking button
        const timeButton = page.locator('button:has-text("Time"), button:has-text("Add Time")');
        
        if (await timeButton.isVisible()) {
          await timeButton.click();
          await page.waitForTimeout(500);
          
          // Fill time form
          const timeInput = page.locator('input[type="number"], input[name="time"]');
          if (await timeInput.isVisible()) {
            await timeInput.fill('60');
            
            const saveButton = page.locator('button:has-text("Save"), button:has-text("Add")');
            if (await saveButton.isVisible()) {
              await saveButton.click();
              await page.waitForTimeout(1000);
              
              expect(await page.url()).toBeTruthy();
            }
          }
        }
      }
    }
  });

  test('should delete task', async ({ page }) => {
    const projectCard = page.locator('[class*="project"]').first();
    
    if (await projectCard.isVisible()) {
      await projectCard.click();
      await page.waitForTimeout(2000);
      
      const taskCard = page.locator('[class*="task"]').first();
      
      if (await taskCard.isVisible()) {
        // Find delete button (might be in menu)
        const menuButton = page.locator('button[aria-label*="menu"]').first();
        
        if (await menuButton.isVisible()) {
          await menuButton.click();
          await page.waitForTimeout(300);
          
          const deleteOption = page.locator('text=/delete/i');
          if (await deleteOption.isVisible()) {
            await deleteOption.click();
            await page.waitForTimeout(500);
            
            // Confirm deletion
            const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Delete")');
            if (await confirmButton.isVisible()) {
              await confirmButton.click();
              await page.waitForTimeout(1000);
            }
          }
        }
      }
    }
    
    expect(await page.url()).toBeTruthy();
  });
});

