# Activity Logs and Comments Test Scenarios

## Scenario 1: View Activity Logs

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists with activity logs

### Steps
1. Navigate to task details page
2. Scroll to "Activity Logs" section
3. Verify activity logs display
4. Check log entries:
   - Action type (task created, status changed, etc.)
   - User who performed action
   - Timestamp
   - Details/description

### Expected Results
- Activity logs section is visible
- All activity logs are displayed
- Logs are in chronological order (newest first or oldest first)
- Each log entry shows:
  - Action icon/type
  - User name and avatar
  - Timestamp (formatted: e.g., "2 hours ago")
  - Action description
  - Related data (if applicable)
- Logs are formatted correctly
- Empty state displays if no logs

### Test Data
- Activity types:
  - Task created
  - Status changed
  - Task assigned
  - File uploaded
  - Time logged
  - Comment added

---

## Scenario 2: Add Comment to Activity Log

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists
- Activity log exists

### Steps
1. Navigate to task details page
2. View activity logs section
3. Find an activity log entry
4. Click "Reply" or "Comment" button
5. Enter comment text
6. Submit comment
7. Verify comment appears

### Expected Results
- Reply/Comment button is visible on activity logs
- Comment input field appears
- Rich text editor works (if implemented)
- Comment can be submitted
- Comment appears under activity log
- Comment shows:
  - User name
  - Timestamp
  - Comment text
- Activity log entry created for comment
- Success message appears

### Test Data
- Comment text: `This looks good, thanks!`
- Long comment: Multiple paragraphs
- Comment with formatting (if rich text supported)

### Edge Cases
- Empty comment (should be prevented)
- Very long comment
- Comment with special characters
- Comment with links/mentions (if supported)
- Network error during comment submission

---

## Scenario 3: View Comment Thread

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists
- Activity log has comments/replies

### Steps
1. Navigate to task details page
2. View activity logs section
3. Find activity log with comments
4. Click to expand comment thread
5. View all comments in thread
6. Verify thread display

### Expected Results
- Comment thread is expandable/collapsible
- All comments in thread are visible
- Comments are in chronological order
- Thread shows:
  - Original activity log
  - All replies/comments
  - User names and timestamps
- Thread can be collapsed
- New comments appear in thread

### Edge Cases
- Thread with many comments
- Thread with deleted comments
- Thread with comments from deleted users

---

## Scenario 4: Edit Comment

### User Role
- Authenticated User (who wrote the comment)

### Prerequisites
- User is logged in
- Task exists
- Comment exists that user wrote

### Steps
1. Navigate to task details page
2. View activity logs section
3. Find comment user wrote
4. Click "Edit" button on comment
5. Modify comment text
6. Save changes
7. Verify comment updated

### Expected Results
- Edit button is visible on user's own comments
- Edit form opens with current comment text
- Comment can be modified
- Changes save successfully
- Updated comment displays
- "Edited" indicator appears (if implemented)
- Activity log entry created (if implemented)

### Edge Cases
- Edit comment written by another user (should not be allowed)
- Edit with no changes
- Cancel edit
- Network error during edit

---

## Scenario 5: Delete Comment

### User Role
- Authenticated User (who wrote the comment, or Admin)

### Prerequisites
- User is logged in
- Task exists
- Comment exists

### Steps
1. Navigate to task details page
2. View activity logs section
3. Find comment
4. Click "Delete" button on comment
5. Confirm deletion (if confirmation dialog)
6. Verify comment deleted

### Expected Results
- Delete button is visible on user's own comments (or Admin can delete any)
- Confirmation dialog appears (if implemented)
- Comment is deleted successfully
- Comment no longer appears in thread
- Activity log entry created (if implemented)
- Success message appears

### Edge Cases
- Delete comment written by another user (permission check)
- Delete comment with replies (behavior may vary)
- Cancel deletion
- Network error during deletion

---

## Scenario 6: Activity Log Filtering

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists with many activity logs of different types

### Steps
1. Navigate to task details page
2. View activity logs section
3. Apply filters (if available):
   - Filter by activity type
   - Filter by user
   - Filter by date range
4. Verify filtered results
5. Clear filters

### Expected Results
- Filter options are available (if implemented)
- Filter by activity type works
- Filter by user works
- Filter by date range works
- Filtered logs display correctly
- Clear filters works
- All logs display when filters cleared

### Edge Cases
- Filter with no matching results
- Multiple filters combined
- Filter with invalid date range

---

## Scenario 7: Real-Time Activity Log Updates

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists
- WebSocket/real-time updates are enabled

### Steps
1. Navigate to task details page
2. View activity logs section
3. Have another user perform action (e.g., add comment, change status)
4. Verify activity log appears in real-time

### Expected Results
- New activity logs appear automatically
- No page refresh required
- Real-time updates work via WebSocket
- Activity log appears at correct position
- Notification may appear (if implemented)
- Updates work for multiple users simultaneously

### Edge Cases
- WebSocket connection lost
- Multiple simultaneous updates
- Update during filter application
- Update during comment editing

---

## Scenario 8: Activity Log Pagination

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists with many activity logs (more than one page)

### Steps
1. Navigate to task details page
2. View activity logs section
3. Scroll to bottom (or click "Load More")
4. Verify more logs load
5. Continue loading until all logs loaded

### Expected Results
- Pagination or "Load More" works
- More logs load when scrolling/clicking
- All logs are accessible
- Loading indicator shows during load
- Performance is acceptable with many logs

### Edge Cases
- Last page of logs
- Load during active updates
- Very large number of logs

---

## Scenario 9: Activity Log Mentions/Notifications

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists
- Mention feature exists (if implemented)

### Steps
1. Navigate to task details page
2. Add comment to activity log
3. Mention another user (e.g., `@username`)
4. Submit comment
5. Verify mentioned user receives notification

### Expected Results
- Mention syntax works (e.g., `@username`)
- Mentioned user is highlighted/linked
- Mentioned user receives notification
- Notification contains:
  - Task information
  - Comment text
  - Link to activity log
- Clicking notification navigates to activity log

### Edge Cases
- Mention non-existent user
- Mention multiple users
- Mention in edited comment
- Notification delivery failure

---

## Scenario 10: Activity Log on Project Level

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Project exists with activity

### Steps
1. Navigate to project details page
2. View project activity logs (if available)
3. Verify project-level activity logs display
4. Check log types:
   - Project created
   - Project updated
   - Member added/removed
   - Task created
   - Other project-level actions

### Expected Results
- Project activity logs section is visible
- Project-level activity logs display
- Logs show project-related actions
- Logs are in chronological order
- Logs can be filtered/searched (if implemented)

### Edge Cases
- Project with no activity
- Project with many activities
- Activities from deleted tasks/users






