# Calendar Events Test Scenarios

## Scenario 1: Create Calendar Event

### User Role
- Authenticated User (with `calendar:write` permission)

### Prerequisites
- User is logged in
- Calendar page is accessible

### Steps
1. Navigate to Calendar page (`/app/calendar`)
2. Click "Add Event" or click on a date
3. Fill in event form:
   - Title: `Team Meeting`
   - Description: `Weekly team sync meeting`
   - Start Date/Time: Select date and time
   - End Date/Time: Select date and time
   - Location: `Conference Room A` (optional)
   - Attendees: Select users (optional)
4. Submit the form
5. Verify event created

### Expected Results
- "Add Event" button is visible
- OR clicking date opens event form
- Event creation form opens
- Form validation works:
  - Required fields validated
  - End time after start time
  - Date picker works
  - Time picker works
- Event is created successfully
- Event appears on calendar
- Success message appears
- Activity log entry created (if applicable)

### Test Data
- Valid event:
  - Title: `Team Meeting`
  - Description: `Weekly sync`
  - Start: `2024-12-20 10:00`
  - End: `2024-12-20 11:00`
  - Location: `Conference Room A`
- Invalid data:
  - Empty title
  - End time before start time
  - Past date (if validation exists)

### Edge Cases
- Create event with very long title
- Create all-day event (if supported)
- Create recurring event (if supported)
- Create event overlapping with existing event
- Network error during creation

---

## Scenario 2: View Calendar Events

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Calendar events exist

### Steps
1. Navigate to Calendar page
2. Verify calendar displays
3. Check different views:
   - Month view
   - Week view
   - Day view
4. Verify events appear on calendar

### Expected Results
- Calendar page loads correctly
- Calendar displays current month/week/day
- Events are visible on calendar:
  - Event title shown
  - Event time shown (if applicable)
  - Event color coding (if implemented)
- Events appear on correct dates
- Multiple events on same day are visible
- Empty state displays if no events

### Edge Cases
- Calendar with no events
- Calendar with many events on same day
- Events spanning multiple days
- Events in different time zones (if applicable)

---

## Scenario 3: View Event Details

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Calendar event exists

### Steps
1. Navigate to Calendar page
2. Click on an event
3. Verify event details modal/page opens
4. Check event information:
   - Title
   - Description
   - Start/End date and time
   - Location
   - Attendees
   - Created by

### Expected Results
- Clicking event opens details
- Event details display correctly:
  - All information is accurate
  - Dates/times are formatted correctly
  - Attendees list is visible
- Details modal can be closed
- Edit/Delete buttons are visible (if user has permission)

### Edge Cases
- Event with no description
- Event with no location
- Event with no attendees
- Event with many attendees

---

## Scenario 4: Edit Calendar Event

### User Role
- Authenticated User (event creator or Admin)

### Prerequisites
- User is logged in
- Calendar event exists
- User has permission to edit

### Steps
1. Navigate to Calendar page
2. Click on event
3. Click "Edit" button
4. Modify event fields:
   - Update title
   - Update description
   - Change date/time
   - Update location
   - Add/remove attendees
5. Save changes
6. Verify event updated

### Expected Results
- Edit button is visible
- Edit form opens with current values
- All fields are editable
- Form validation works
- Event updates successfully
- Changes reflect on calendar
- Success message appears
- Activity log entry created (if applicable)

### Test Data
- Updated title: `Updated Team Meeting`
- Updated time: `14:00 - 15:00`
- New location: `Conference Room B`

### Edge Cases
- Edit with no changes
- Edit with invalid data
- Edit event created by another user (permission check)
- Network error during edit

---

## Scenario 5: Delete Calendar Event

### User Role
- Authenticated User (event creator or Admin)

### Prerequisites
- User is logged in
- Calendar event exists
- User has permission to delete

### Steps
1. Navigate to Calendar page
2. Click on event
3. Click "Delete" button
4. Confirm deletion (if confirmation dialog)
5. Verify event deleted

### Expected Results
- Delete button is visible
- Confirmation dialog appears (if implemented)
- Event is deleted successfully
- Event no longer appears on calendar
- Success message appears
- Activity log entry created (if applicable)

### Edge Cases
- Delete event created by another user (permission check)
- Cancel deletion
- Delete recurring event (if supported)
- Network error during deletion

---

## Scenario 6: Calendar Navigation

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Calendar page is accessible

### Steps
1. Navigate to Calendar page
2. Navigate calendar:
   - Click "Next Month" button
   - Click "Previous Month" button
   - Click "Today" button
   - Select specific month/year from picker
3. Verify navigation works

### Expected Results
- Navigation buttons are visible
- Next month navigation works
- Previous month navigation works
- "Today" button navigates to current date
- Month/year picker works
- Calendar updates correctly
- Events load for new month
- Current date is highlighted

### Edge Cases
- Navigate to far future/past dates
- Navigate during event loading
- Browser back/forward buttons

---

## Scenario 7: Calendar View Switching

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Calendar page is accessible
- Multiple view options available

### Steps
1. Navigate to Calendar page
2. Switch between views:
   - Month view
   - Week view
   - Day view
3. Verify each view displays correctly

### Expected Results
- View toggle buttons are visible
- Month view shows full month
- Week view shows one week
- Day view shows single day
- Events display correctly in each view
- View preference persists (if implemented)
- Navigation works in each view

### Edge Cases
- Switch views with no events
- Switch views with many events
- Switch views during event loading

---

## Scenario 8: Event Filtering

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Multiple calendar events exist
- Filter functionality exists (if implemented)

### Steps
1. Navigate to Calendar page
2. Apply filters:
   - Filter by event type/category
   - Filter by attendee
   - Filter by date range
3. Verify filtered events display
4. Clear filters

### Expected Results
- Filter options are available (if implemented)
- Filters work correctly
- Only matching events display
- Filter state persists (if implemented)
- Clear filters works
- All events display when filters cleared

### Edge Cases
- Filter with no matching events
- Multiple filters combined
- Filter with invalid date range

---

## Scenario 9: Event Notifications/Reminders

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Calendar event exists
- Notification system is enabled

### Steps
1. Create or view calendar event
2. Set reminder/notification (if available)
3. Wait for reminder time (or simulate)
4. Verify notification received

### Expected Results
- Reminder/notification option is available (if implemented)
- Reminder can be set (e.g., 15 minutes before)
- Notification appears at reminder time
- Notification contains event information
- Clicking notification navigates to event
- Notification can be dismissed

### Edge Cases
- Multiple reminders for same event
- Reminder for past event
- Notification delivery failure
- Reminder for cancelled event

---

## Scenario 10: Calendar Event Permissions

### User Role
- Standard User

### Prerequisites
- User is logged in
- Calendar events exist
- User has limited calendar permissions

### Steps
1. Navigate to Calendar page
2. Attempt to create event
3. Attempt to edit event created by another user
4. Attempt to delete event
5. Verify permission enforcement

### Expected Results
- Create button is visible (if user has `calendar:write`)
- OR create is restricted based on permissions
- Edit button is hidden/disabled for events created by others
- Delete button is hidden/disabled for events created by others
- Permission errors are displayed appropriately
- Direct API calls return 403 Forbidden

### Edge Cases
- User tries to create via direct API call
- Permission changed during session
- Event created by deleted user






