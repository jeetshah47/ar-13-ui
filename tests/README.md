# End-to-End Test Scenarios

This directory contains comprehensive end-to-end test scenarios for the AR-13 UI application. These scenarios document the complete business workflows and user journeys that should be tested.

## Overview

The AR-13 UI is a project management and operations dashboard with the following main features:
- **Project Management**: Create, manage, and track projects
- **Task Management**: Create tasks, assign them, track time, and manage workflow
- **Calendar**: Schedule and manage events
- **Employee Management**: Manage employees and their profiles
- **Vacation Management**: Request and approve vacation/leave requests
- **Dashboard**: Overview of projects, tasks, and activities
- **Info Portal**: Document and file management
- **Role-Based Access Control**: Admin and Standard user roles with granular permissions

## Test Scenario Structure

Each test scenario document follows this structure:
1. **Scenario Name**: Clear, descriptive name
2. **User Role**: Admin or Standard user
3. **Prerequisites**: What needs to be set up before the test
4. **Steps**: Detailed step-by-step instructions
5. **Expected Results**: What should happen at each step
6. **Test Data**: Sample data to use
7. **Edge Cases**: Additional scenarios to consider

## Test Scenarios by Feature

### Authentication & Authorization
- [Authentication Workflows](./scenarios/01-authentication.md)
- [Role-Based Access Control](./scenarios/02-authorization.md)

### Project Management
- [Project CRUD Operations](./scenarios/03-project-management.md)
- [Project Filtering and Search](./scenarios/04-project-filtering.md)

### Task Management
- [Task Lifecycle](./scenarios/05-task-lifecycle.md)
- [Task Assignment and Transfer](./scenarios/06-task-assignment.md)
- [Time Tracking](./scenarios/07-time-tracking.md)
- [File Attachments](./scenarios/08-file-attachments.md)
- [Activity Logs and Comments](./scenarios/09-activity-logs.md)

### Calendar Management
- [Calendar Events](./scenarios/10-calendar-events.md)

### Employee Management
- [Employee Management](./scenarios/11-employee-management.md)

### Vacation Management
- [Vacation Request Workflow](./scenarios/12-vacation-management.md)

### Dashboard
- [Dashboard Overview](./scenarios/13-dashboard.md)

### Info Portal
- [Document Management](./scenarios/14-info-portal.md)

### Integration Scenarios
- [Cross-Feature Workflows](./scenarios/15-integration-scenarios.md)

## Running Tests

These scenarios are designed to be implemented using Playwright or similar E2E testing frameworks. The existing E2E tests in the `e2e/` directory provide implementation examples.

To run existing E2E tests:
```bash
npm run test:e2e
```

## Test Data Requirements

Before running E2E tests, ensure you have:
1. Test user accounts (Admin and Standard roles)
2. Sample projects and tasks
3. Test files for upload scenarios
4. Calendar events for testing

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Clean up test data after each test run
3. **Realistic Data**: Use realistic test data that matches production scenarios
4. **Error Cases**: Test both happy paths and error scenarios
5. **Accessibility**: Verify accessibility requirements are met
6. **Performance**: Monitor performance metrics during tests

## Notes

- Some scenarios require backend API to be running
- WebSocket functionality should be tested for real-time features
- File upload scenarios require proper file storage configuration
- Permission-based scenarios require proper RBAC setup






