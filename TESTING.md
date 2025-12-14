# Testing Guide

This project uses **Vitest** for unit/integration tests and **Playwright** for end-to-end (E2E) tests.

## Setup

All testing dependencies are already installed. If you need to reinstall:

```bash
npm install
npx playwright install --with-deps chromium
```

## Running Tests

### Unit/Integration Tests (Vitest)

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug
```

### Run All Tests

```bash
npm run test:all
```

## Test Structure

### Unit Tests

Unit tests are located alongside the components they test, using the `.test.tsx` or `.test.ts` extension.

Example: `src/common/components/Sidebar/MainSiderBar.test.tsx`

### Test Utilities

Test utilities are located in `src/test/`:
- `setup.ts` - Global test setup and mocks
- `utils.tsx` - Custom render function with providers (Redux, Router, Theme, etc.)

### E2E Tests

E2E tests are located in the `e2e/` directory and use the `.spec.ts` extension.

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../../test/utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should navigate to dashboard', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Dashboard');
  await expect(page).toHaveURL(/.*dashboard/);
});
```

## Test Configuration

### Vitest Configuration

Vitest is configured in `vite.config.ts`. Key settings:
- Environment: `jsdom` (for DOM testing)
- Setup file: `src/test/setup.ts`
- Coverage provider: `v8`

### Playwright Configuration

Playwright is configured in `playwright.config.ts`. Key settings:
- Base URL: `http://localhost:5173`
- Test directory: `e2e/`
- Browsers: Chromium, Firefox, WebKit

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it.

2. **Use Accessible Queries**: Prefer `getByRole`, `getByLabelText`, etc. over `getByTestId`.

3. **Mock External Dependencies**: Mock API calls, external services, and complex dependencies.

4. **Keep Tests Isolated**: Each test should be independent and not rely on other tests.

5. **Use Descriptive Test Names**: Test names should clearly describe what is being tested.

6. **Test User Interactions**: Use `userEvent` for simulating user interactions.

7. **Clean Up**: Use `afterEach` hooks to clean up state between tests.

## Coverage

To generate coverage reports:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory.

## Troubleshooting

### Tests fail with "Cannot find module"

Make sure all dependencies are installed:
```bash
npm install
```

### Playwright tests fail to start

Make sure the dev server is running or Playwright will start it automatically. Check `playwright.config.ts` for the `webServer` configuration.

### Mock issues

Check `src/test/setup.ts` for global mocks. Component-specific mocks should be in the test file using `vi.mock()`.

## CI/CD Integration

For CI/CD pipelines, use:

```bash
# Run tests once (no watch mode)
npm run test:run

# Run E2E tests (Playwright will handle browser installation)
npm run test:e2e
```

Make sure to set `CI=true` environment variable for optimal CI behavior.

