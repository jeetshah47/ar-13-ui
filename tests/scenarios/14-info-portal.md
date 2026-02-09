# Info Portal (Document Management) Test Scenarios

## Scenario 1: Browse File System

### User Role
- Authenticated User (with `infoPortal:read` permission)

### Prerequisites
- User is logged in
- Info Portal is accessible
- File system/NAS is configured

### Steps
1. Navigate to Info Portal page (`/app/info-portal`)
2. Verify file explorer displays
3. Browse folders:
   - Click on folder to open
   - Navigate to subfolders
   - Use breadcrumb navigation
4. Verify files and folders display

### Expected Results
- Info Portal page loads correctly
- File explorer interface displays
- Folders are clickable
- Files are visible
- Breadcrumb navigation works
- Current path is displayed
- Empty folders show appropriate message

### Edge Cases
- Empty file system
- Very deep folder structure
- Folders with many files
- Special characters in folder/file names

---

## Scenario 2: View Folder Contents

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Folder exists with files

### Steps
1. Navigate to Info Portal page
2. Click on a folder
3. Verify folder detail page loads
4. Check folder contents:
   - Files list
   - Subfolders list
   - File information (name, size, date)
5. Navigate back

### Expected Results
- Folder detail page loads
- URL reflects folder path: `/app/info-portal/folder?path=...`
- Files and subfolders are listed
- File information displays:
  - Name
  - Size
  - Modified date
  - Type/icon
- Navigation back works
- Breadcrumb shows current location

### Edge Cases
- Empty folder
- Folder with many files (pagination if needed)
- Folder with mixed file types
- Folder with very long file names

---

## Scenario 3: Search Files and Folders

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Files and folders exist
- Search functionality exists (if implemented)

### Steps
1. Navigate to Info Portal page
2. Use search functionality (if available)
3. Enter search query:
   - Search by file name
   - Search by folder name
4. Verify search results
5. Clear search

### Expected Results
- Search box is visible (if implemented)
- Search works for file names
- Search works for folder names
- Search results display correctly
- Search is case-insensitive (or as designed)
- Clear search works
- All files/folders display when search cleared

### Edge Cases
- Search with no results
- Search with special characters
- Search across multiple folders
- Very long search query

---

## Scenario 4: Upload File to Folder

### User Role
- Authenticated User (with `infoPortal:write` permission)

### Prerequisites
- User is logged in
- Folder exists
- User has write permission

### Steps
1. Navigate to Info Portal page
2. Open a folder
3. Click "Upload" button (if available)
4. Select file from local system
5. Wait for upload to complete
6. Verify file appears in folder

### Expected Results
- Upload button is visible (if user has permission)
- File upload dialog opens
- File uploads successfully
- Upload progress shows (if implemented)
- File appears in folder contents
- Success message appears
- File information is correct

### Test Data
- Files: `document.pdf`, `image.png`, `data.csv`

### Edge Cases
- Upload very large file
- Upload unsupported file type
- Upload duplicate file name
- Network error during upload
- Upload to read-only folder

---

## Scenario 5: Download File

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- File exists in folder

### Steps
1. Navigate to Info Portal page
2. Open folder containing file
3. Click on file or download button
4. Verify file downloads

### Expected Results
- File is clickable or download button visible
- Clicking file initiates download
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

## Scenario 6: Preview File

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- File exists (image, PDF, etc.)

### Steps
1. Navigate to Info Portal page
2. Open folder containing file
3. Click on file (or preview button)
4. Verify file preview opens
5. Check preview functionality:
   - File displays correctly
   - Zoom in/out (if available)
   - Close preview

### Expected Results
- File preview opens
- Preview works for supported formats:
  - Images (PNG, JPG, etc.)
  - PDFs
  - Text files
- Preview modal/page can be closed
- Preview loads with authentication

### Edge Cases
- Unsupported file format
- Very large file (performance)
- Corrupted file
- Preview with network error

---

## Scenario 7: Create Folder

### User Role
- Authenticated User (with `infoPortal:write` permission)

### Prerequisites
- User is logged in
- User has write permission

### Steps
1. Navigate to Info Portal page
2. Open a folder
3. Click "New Folder" or "Create Folder" button
4. Enter folder name
5. Confirm creation
6. Verify folder created

### Expected Results
- "New Folder" button is visible (if user has permission)
- Folder creation dialog/form opens
- Folder name input works
- Validation prevents:
  - Empty name
  - Invalid characters
  - Duplicate name
- Folder is created successfully
- New folder appears in folder contents
- Success message appears

### Test Data
- Valid folder name: `New Folder`
- Invalid names: ``, `Folder/Name`, `Folder\Name`

### Edge Cases
- Create folder with duplicate name
- Create folder with special characters
- Create folder with very long name
- Network error during creation

---

## Scenario 8: Delete File or Folder

### User Role
- Authenticated User (with `infoPortal:delete` permission)

### Prerequisites
- User is logged in
- File or folder exists
- User has delete permission

### Steps
1. Navigate to Info Portal page
2. Open folder containing file/folder
3. Click delete button/icon on item
4. Confirm deletion (if confirmation dialog)
5. Verify item deleted

### Expected Results
- Delete button/icon is visible (if user has permission)
- Confirmation dialog appears (if implemented)
- File/folder is deleted successfully
- Item no longer appears in folder contents
- Success message appears
- Activity log entry created (if applicable)

### Edge Cases
- Delete folder with contents (may require confirmation)
- Delete read-only file/folder
- Cancel deletion
- Network error during deletion
- Delete last item in folder

---

## Scenario 9: Rename File or Folder

### User Role
- Authenticated User (with `infoPortal:write` permission)

### Prerequisites
- User is logged in
- File or folder exists
- User has write permission
- Rename functionality exists (if implemented)

### Steps
1. Navigate to Info Portal page
2. Open folder containing item
3. Click rename button/icon (or right-click)
4. Enter new name
5. Save changes
6. Verify item renamed

### Expected Results
- Rename option is available (if implemented)
- Rename input appears
- Current name is pre-filled
- Validation prevents:
  - Empty name
  - Invalid characters
  - Duplicate name
- Item is renamed successfully
- New name appears in folder contents
- Success message appears

### Edge Cases
- Rename with duplicate name
- Rename with special characters
- Rename with very long name
- Cancel rename
- Network error during rename

---

## Scenario 10: Info Portal Permissions

### User Role
- Standard User

### Prerequisites
- User is logged in
- User has limited info portal permissions

### Steps
1. Navigate to Info Portal page
2. Attempt to perform actions:
   - Upload file
   - Create folder
   - Delete file
   - Rename file
3. Verify permission enforcement

### Expected Results
- Read access works (can view files/folders)
- Write actions are restricted:
  - Upload button hidden/disabled (if no `infoPortal:write`)
  - Delete button hidden/disabled (if no `infoPortal:delete`)
- Permission errors displayed appropriately
- Direct API calls return 403 Forbidden

### Edge Cases
- User tries to upload via direct API call
- Permission changed during session
- Read-only folder access






