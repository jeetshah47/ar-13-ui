# E2E Test Suite

This directory contains comprehensive end-to-end tests for the AR-13 application using Playwright.

## Test Files

### Core Functionality
- **`example.spec.ts`** - Basic application loading and responsive design tests
- **`auth.spec.ts`** - Authentication flows (login, signup, validation, errors)
- **`navigation.spec.ts`** - Navigation between pages and route handling
- **`dashboard.spec.ts`** - Dashboard page functionality and data loading

### Feature-Specific Tests
- **`projects.spec.ts`** - Project management (CRUD, filtering, searching, pagination)
- **`tasks.spec.ts`** - Task management (create, update, assign, filter, time tracking)
- **`calendar.spec.ts`** - Calendar events (create, view, edit, delete, navigation)

### UI & UX Tests
- **`ui-interactions.spec.ts`** - UI interactions (modals, dropdowns, file uploads, drag & drop)
- **`accessibility.spec.ts`** - Accessibility compliance (ARIA, keyboard navigation, semantic HTML)
- **`performance.spec.ts`** - Performance metrics (load times, FCP, LCP, bundle size)

## Test Coverage

### Authentication (9 tests)
- ✅ Sign in page display
- ✅ Form validation (empty, invalid email, short password)
- ✅ Password visibility toggle
- ✅ Invalid credentials handling
- ✅ Navigation to sign up
- ✅ Network error handling
- ✅ Form data persistence

### Navigation (10 tests)
- ✅ Dashboard navigation
- ✅ Projects page navigation
- ✅ Calendar page navigation
- ✅ Employees page navigation
- ✅ Profile page navigation
- ✅ Info portal navigation
- ✅ Back navigation
- ✅ Browser refresh
- ✅ Direct URL navigation
- ✅ Unauthorized redirects
- ✅ 404 handling

### Dashboard (7 tests)
- ✅ Page loading
- ✅ Statistics display
- ✅ Data loading states
- ✅ Error state handling
- ✅ Mobile responsiveness
- ✅ Tablet responsiveness
- ✅ Data refresh

### Projects (11 tests)
- ✅ Projects list display
- ✅ Filter functionality
- ✅ Status filtering
- ✅ Search functionality
- ✅ Create project dialog
- ✅ Create project with valid data
- ✅ Form validation
- ✅ View project details
- ✅ Delete project
- ✅ Pagination

### Tasks (7 tests)
- ✅ Tasks display
- ✅ Create task
- ✅ Update task status
- ✅ Assign task to user
- ✅ Filter tasks by status
- ✅ Add time spent
- ✅ Delete task

### Calendar (9 tests)
- ✅ Calendar page load
- ✅ Calendar view display
- ✅ Month navigation (next/previous)
- ✅ Create event
- ✅ Click date to create event
- ✅ View event details
- ✅ Edit event
- ✅ Delete event
- ✅ View switching (month/week/day)

### UI Interactions (13 tests)
- ✅ Sidebar toggle on mobile
- ✅ Modal close (Escape key, backdrop click)
- ✅ Keyboard navigation
- ✅ Toast notifications
- ✅ Dropdown selections
- ✅ Checkbox toggles
- ✅ Radio button selection
- ✅ File upload
- ✅ Infinite scroll / load more
- ✅ Tooltip display
- ✅ Drag and drop
- ✅ Copy to clipboard

### Accessibility (13 tests)
- ✅ Page title
- ✅ Heading hierarchy
- ✅ Image alt text
- ✅ Form labels
- ✅ Button labels
- ✅ Link text
- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ Screen reader announcements
- ✅ Color contrast (basic)
- ✅ Skip to main content

### Performance (10 tests)
- ✅ Page load time
- ✅ First Contentful Paint (FCP)
- ✅ Largest Contentful Paint (LCP)
- ✅ Memory leak detection
- ✅ Large list handling
- ✅ Image lazy loading
- ✅ API response times
- ✅ Bundle size
- ✅ Concurrent actions
- ✅ Re-render optimization

## Running Tests

### Run All Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npx playwright test e2e/auth.spec.ts
```

### Run Tests in UI Mode
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode
```bash
npm run test:e2e:headed
```

### Run Tests in Debug Mode
```bash
npm run test:e2e:debug
```

### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in Parallel
```bash
npx playwright test --workers=4
```

## Test Structure

Each test file follows this structure:
1. **Setup** - Navigate to page and wait for load
2. **Action** - Perform user interactions
3. **Assertion** - Verify expected behavior

## Best Practices

1. **Wait for Load States**: Always use `waitForLoadState('networkidle')` after navigation
2. **Conditional Checks**: Use `isVisible()` checks before interacting with elements
3. **Timeouts**: Use appropriate timeouts for async operations
4. **Error Handling**: Tests should handle cases where elements might not be present
5. **Flexible Assertions**: Tests should be resilient to UI changes

## Notes

- Tests are designed to be resilient and handle cases where elements might not be present
- Some tests require the backend API to be running
- Tests use flexible selectors to adapt to UI changes
- Performance tests may need adjustment based on actual performance requirements
- Accessibility tests provide basic checks; full audit requires specialized tools

## CI/CD Integration

Tests are configured to:
- Run in parallel by default
- Retry on failure in CI (2 retries)
- Generate HTML reports
- Take screenshots on failure
- Collect traces on retry

## Future Enhancements

- [ ] Add visual regression tests
- [ ] Add API mocking for faster tests
- [ ] Add test data fixtures
- [ ] Add cross-browser testing
- [ ] Add mobile device testing
- [ ] Add API integration tests
- [ ] Add security testing
- [ ] Add load/stress testing

