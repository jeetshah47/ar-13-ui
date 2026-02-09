# File Attachments Test Scenarios

## Scenario 1: Upload File to Task

### User Role
- Authenticated User (with task access)

### Prerequisites
- User is logged in
- Task exists
- User has permission to upload files
- File storage is configured

### Steps
1. Navigate to task details page
2. Find "File Attachments" section
3. Click "Upload File" or "Add Attachment" button
4. Select file from local system:
   - Image file (e.g., `screenshot.png`)
   - Document file (e.g., `document.pdf`)
   - Other file types
5. Wait for upload to complete
6. Verify file appears in attachments list

### Expected Results
- "Upload File" button is visible
- File upload dialog/modal opens
- File picker works correctly
- File uploads successfully
- Upload progress indicator shows (if implemented)
- File appears in attachments list with:
  - File name
  - File size
  - Upload date
  - Uploaded by (user name)
- Success message appears
- Activity log entry created

### Test Data
- Image files: `screenshot.png`, `diagram.jpg`
- Document files: `specification.pdf`, `requirements.docx`
- Other files: `data.csv`, `archive.zip`
- File sizes: Small (< 1MB), Medium (1-10MB), Large (> 10MB)

### Edge Cases
- Upload very large file (size limit)
- Upload unsupported file type
- Upload file with special characters in name
- Upload multiple files simultaneously
- Network error during upload
- Cancel upload in progress
- Upload duplicate file name

---

## Scenario 2: Link File from NAS/Storage

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists
- NAS/Storage integration is configured
- Files exist in storage

### Steps
1. Navigate to task details page
2. Find "File Attachments" section
3. Click "Link File" or "Browse Storage" button
4. Navigate storage file browser
5. Select file from storage
6. Confirm file linking
7. Verify file appears in attachments

### Expected Results
- "Link File" button is visible
- File browser modal opens
- Storage navigation works:
  - Browse folders
  - Search files
  - Select file
- File is linked successfully
- Linked file appears in attachments list
- File shows as "linked" (different from uploaded)
- Success message appears
- Activity log entry created

### Edge Cases
- Link file that doesn't exist
- Link file user doesn't have access to
- Link file that is already linked
- Network error during linking
- Storage unavailable

---

## Scenario 3: View File Attachment

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists with file attachments

### Steps
1. Navigate to task details page
2. View "File Attachments" section
3. Click on file attachment
4. Verify file opens/displays

### Expected Results
- File attachments section displays all files
- File information is visible:
  - File name
  - File size
  - File type/icon
  - Upload date
  - Uploaded by
- Clicking file:
  - Opens file in new tab/window, OR
  - Downloads file, OR
  - Displays file preview (for images/PDFs)
- File opens correctly
- File content is accessible

### Edge Cases
- File that no longer exists
- Corrupted file
- Very large file (performance)
- File with special characters in name

---

## Scenario 4: Preview Image Attachment

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists with image attachments

### Steps
1. Navigate to task details page
2. View file attachments section
3. Click on image file (e.g., `.png`, `.jpg`)
4. Verify image preview opens
5. Check preview functionality:
   - Image displays correctly
   - Zoom in/out (if available)
   - Close preview
6. Close preview

### Expected Results
- Image files are identifiable (icon or thumbnail)
- Clicking image opens preview modal
- Image displays in preview:
  - Correct orientation
  - Proper scaling
  - Full image visible
- Preview modal can be closed
- Zoom functionality works (if implemented)
- Image loads with authentication (if required)

### Test Data
- Image formats: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`
- Image sizes: Small thumbnails, Large images

### Edge Cases
- Very large image (performance)
- Corrupted image file
- Unsupported image format
- Image with unusual dimensions

---

## Scenario 5: Download File Attachment

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists with file attachments

### Steps
1. Navigate to task details page
2. View file attachments section
3. Click download button/icon on file
4. Verify file downloads

### Expected Results
- Download button/icon is visible
- Clicking download initiates download
- File downloads successfully
- Downloaded file has correct name
- Downloaded file is not corrupted
- Download works with authentication

### Edge Cases
- Download very large file
- Download during slow network
- Download file that no longer exists
- Cancel download in progress

---

## Scenario 6: Delete File Attachment

### User Role
- Authenticated User (who uploaded file, or Admin)

### Prerequisites
- User is logged in
- Task exists with file attachments
- User has permission to delete files

### Steps
1. Navigate to task details page
2. View file attachments section
3. Click delete button/icon on file
4. Confirm deletion (if confirmation dialog)
5. Verify file deleted

### Expected Results
- Delete button/icon is visible
- Confirmation dialog appears (if implemented)
- File is deleted successfully
- File no longer appears in attachments list
- Activity log entry created
- Success message appears
- File is removed from storage (or marked as deleted)

### Edge Cases
- Delete file uploaded by another user (permission check)
- Delete linked file (behavior may differ)
- Cancel deletion
- Network error during deletion
- Delete last file attachment

---

## Scenario 7: File Attachment Permissions

### User Role
- Standard User

### Prerequisites
- User is logged in
- Task exists
- User has limited file permissions

### Steps
1. Navigate to task details page
2. Attempt to upload file
3. Attempt to delete file uploaded by another user
4. Verify permission enforcement

### Expected Results
- Upload button is visible (if user has permission)
- OR upload is restricted based on permissions
- Delete button is hidden/disabled for files uploaded by others
- Permission errors are displayed appropriately
- Direct API calls return 403 Forbidden

### Edge Cases
- User tries to upload via direct API call
- Permission changed during session
- File operations on task user doesn't have access to

---

## Scenario 8: Multiple File Upload

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists
- Multiple files available for upload

### Steps
1. Navigate to task details page
2. Click "Upload File"
3. Select multiple files (using Ctrl/Cmd + click)
4. Confirm upload
5. Wait for all uploads to complete
6. Verify all files appear in attachments

### Expected Results
- Multiple file selection works
- All selected files appear in upload queue
- Files upload in parallel or sequentially
- Upload progress shows for each file
- All files appear in attachments list after upload
- Success message shows count of uploaded files
- Activity log entries created for each file

### Test Data
- Multiple files: `file1.pdf`, `file2.png`, `file3.docx`
- Mixed file types and sizes

### Edge Cases
- Upload many files simultaneously
- Upload mix of valid and invalid files
- Cancel some uploads while others continue
- Network error during multiple uploads
- File size limits exceeded

---

## Scenario 9: File Attachment Search/Filter

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists with many file attachments

### Steps
1. Navigate to task details page
2. View file attachments section
3. Use search/filter (if available):
   - Search by file name
   - Filter by file type
   - Filter by date
4. Verify search/filter results

### Expected Results
- Search/filter functionality is available (if implemented)
- Search works for file names
- Filter by file type works
- Filter by date works
- Results update in real-time or on submit
- Clear search/filter works
- All files display when filters cleared

### Edge Cases
- Search with no results
- Filter with no matching files
- Search with special characters
- Multiple filters combined

---

## Scenario 10: File Attachment Size and Type Validation

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists
- File size and type restrictions are configured

### Steps
1. Navigate to task details page
2. Attempt to upload files:
   - File exceeding size limit
   - Unsupported file type
   - Empty file (0 bytes)
3. Verify validation messages

### Expected Results
- File size validation works
- File type validation works
- Clear error messages displayed:
  - "File size exceeds maximum limit"
  - "File type not supported"
  - "File is empty"
- Upload is prevented for invalid files
- Valid files still upload successfully

### Test Data
- Large file: > 50MB (if limit is 50MB)
- Unsupported types: `.exe`, `.bat`, etc.
- Empty file: 0 bytes

### Edge Cases
- File exactly at size limit
- File with no extension
- File with incorrect extension
- Very small file (< 1KB)






