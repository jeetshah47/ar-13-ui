# Vacation Management Test Scenarios

## Scenario 1: Create Vacation Request

### User Role
- Authenticated User (with `vacation:write` permission)

### Prerequisites
- User is logged in
- Vacation page is accessible

### Steps
1. Navigate to Vacations page (`/app/vacations`)
2. Click "Add Request" button
3. Fill in vacation request form:
   - Request Type: Select `Vacation`, `Sick Leave`, or `Work Remotely`
   - Start Date: Select start date
   - End Date: Select end date
   - Duration Type: Select `Days` or `Hours`
   - Duration: Enter number
   - Reason/Comments: Enter reason (optional)
4. Submit the form
5. Verify request created

### Expected Results
- "Add Request" button is visible
- Vacation request form opens
- Form validation works:
  - Required fields validated
  - End date after start date
  - Duration is positive number
- Request is created successfully
- Request appears in "Employee's Vacations" tab
- Request status is "Pending"
- Success message appears

### Test Data
- Vacation request:
  - Type: `Vacation`
  - Start: `2024-12-25`
  - End: `2024-12-27`
  - Duration: `3 days`
  - Reason: `Holiday vacation`
- Sick leave:
  - Type: `Sick Leave`
  - Start: `2024-12-20`
  - End: `2024-12-20`
  - Duration: `1 day`

### Edge Cases
- Request with end date before start date
- Request with zero duration
- Request with very long duration
- Request overlapping with existing approved request
- Network error during creation

---

## Scenario 2: View Vacation Requests (Admin)

### User Role
- Admin

### Prerequisites
- User is logged in as Admin
- Vacation requests exist

### Steps
1. Navigate to Vacations page
2. Click "Vacation Requests" tab
3. Verify vacation requests display
4. Check request information:
   - User name
   - Request type
   - Dates
   - Duration
   - Status
   - Reason

### Expected Results
- "Vacation Requests" tab is visible (Admin only)
- All pending requests are displayed
- Request cards show:
  - User information
  - Request details
  - Status badge
  - Approve/Reject buttons
- Requests are sorted appropriately
- Empty state displays if no requests

### Edge Cases
- No pending requests
- Many pending requests
- Requests from deleted users

---

## Scenario 3: Approve Vacation Request (Admin)

### User Role
- Admin

### Prerequisites
- User is logged in as Admin
- Vacation request exists with "Pending" status

### Steps
1. Navigate to Vacations page
2. Click "Vacation Requests" tab
3. Find pending request
4. Click "Approve" button
5. Optionally add review comments
6. Confirm approval
7. Verify request approved

### Expected Results
- "Approve" button is visible on pending requests
- Approval confirmation works (if implemented)
- Review comments field works (if available)
- Request is approved successfully
- Request status changes to "Approved"
- Request appears in "Employee's Vacations" with approved status
- Success message appears
- Notification sent to requester (if implemented)

### Test Data
- Review comments: `Approved. Enjoy your vacation!`

### Edge Cases
- Approve request with overlapping dates
- Approve request exceeding vacation balance
- Network error during approval
- Approve already approved/rejected request

---

## Scenario 4: Reject Vacation Request (Admin)

### User Role
- Admin

### Prerequisites
- User is logged in as Admin
- Vacation request exists with "Pending" status

### Steps
1. Navigate to Vacations page
2. Click "Vacation Requests" tab
3. Find pending request
4. Click "Reject" button
5. Add rejection reason/comments
6. Confirm rejection
7. Verify request rejected

### Expected Results
- "Reject" button is visible on pending requests
- Rejection confirmation works (if implemented)
- Rejection reason field works
- Request is rejected successfully
- Request status changes to "Rejected"
- Request appears in "Employee's Vacations" with rejected status
- Success message appears
- Notification sent to requester (if implemented)

### Test Data
- Rejection reason: `Request conflicts with project deadline`

### Edge Cases
- Reject without reason (if required)
- Reject already approved/rejected request
- Network error during rejection

---

## Scenario 5: View Employee Vacations

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Employees exist with vacation data

### Steps
1. Navigate to Vacations page
2. Click "Employee's Vacations" tab
3. Verify employee vacation cards display
4. Check vacation statistics:
   - Total vacations taken
   - Sick leave taken
   - Work remotely days
   - Remaining balance (if available)

### Expected Results
- "Employee's Vacations" tab is visible
- Employee cards display for all users
- Each card shows:
  - Employee name
  - Vacation statistics
  - Breakdown by type
- Statistics are calculated correctly
- Cards are sorted appropriately

### Edge Cases
- Employees with no vacation requests
- Employees with many vacation requests
- Statistics calculation accuracy

---

## Scenario 6: View Vacation Calendar

### User Role
- Admin

### Prerequisites
- User is logged in as Admin
- Vacation requests exist (approved)

### Steps
1. Navigate to Vacations page
2. Click "Calendar" tab
3. Verify vacation calendar displays
4. Check calendar shows:
   - Approved vacation dates
   - Employee names on dates
   - Different colors for different types
5. Navigate calendar (next/previous month)

### Expected Results
- "Calendar" tab is visible (Admin only)
- Calendar displays correctly
- Approved vacations appear on calendar
- Employee names are visible on dates
- Calendar navigation works
- Different request types are distinguishable (if color-coded)

### Edge Cases
- Calendar with no vacations
- Multiple employees on same date
- Vacations spanning multiple days
- Calendar navigation to different months

---

## Scenario 7: Edit Vacation Request

### User Role
- Authenticated User (request creator)

### Prerequisites
- User is logged in
- Vacation request exists with "Pending" status
- Edit functionality exists (if implemented)

### Steps
1. Navigate to Vacations page
2. Find user's pending request
3. Click "Edit" button (if available)
4. Modify request fields
5. Save changes
6. Verify request updated

### Expected Results
- Edit button is visible on pending requests
- Edit form opens with current values
- All fields are editable
- Changes save successfully
- Updated request reflects changes
- Success message appears

### Edge Cases
- Edit already approved/rejected request (should not be allowed)
- Edit with invalid data
- Network error during edit

---

## Scenario 8: Cancel Vacation Request

### User Role
- Authenticated User (request creator)

### Prerequisites
- User is logged in
- Vacation request exists with "Pending" or "Approved" status
- Cancel functionality exists (if implemented)

### Steps
1. Navigate to Vacations page
2. Find user's request
3. Click "Cancel" button (if available)
4. Confirm cancellation
5. Verify request cancelled

### Expected Results
- Cancel button is visible on user's requests
- Cancellation confirmation works
- Request is cancelled successfully
- Request status changes to "Cancelled" or is removed
- Success message appears
- Notification sent to admin (if implemented)

### Edge Cases
- Cancel already rejected request
- Cancel during active vacation period
- Network error during cancellation

---

## Scenario 9: Vacation Request Permissions

### User Role
- Standard User

### Prerequisites
- User is logged in
- User does NOT have `vacation:approve` permission

### Steps
1. Navigate to Vacations page
2. Verify available tabs
3. Attempt to access "Vacation Requests" tab
4. Attempt to approve/reject request
5. Verify permission enforcement

### Expected Results
- "Vacation Requests" tab is NOT visible (Standard users)
- Only "Employee's Vacations" tab is visible
- Cannot approve/reject requests
- Permission errors displayed appropriately
- Direct API calls return 403 Forbidden

### Edge Cases
- User tries to approve via direct API call
- Permission changed during session

---

## Scenario 10: Vacation Statistics and Reporting

### User Role
- Admin

### Prerequisites
- User is logged in as Admin
- Multiple vacation requests exist
- Reporting feature exists (if implemented)

### Steps
1. Navigate to Vacations page
2. View vacation statistics (if available)
3. Check statistics:
   - Total requests by status
   - Requests by type
   - Requests by month/period
   - Employee vacation balances
4. Export reports (if available)

### Expected Results
- Statistics section is visible (if implemented)
- Statistics are accurate
- Breakdowns by status, type, period are available
- Reports can be generated/exported (if implemented)
- Data updates when requests change

### Edge Cases
- Statistics with no data
- Statistics with large datasets
- Export functionality performance






