# Info Portal API Documentation

This document provides the API endpoints, request, and response formats for the Info Portal feature.

## Base URL

All Info Portal API endpoints are prefixed with:
```
/api/info-portal
```

## Endpoints

### 1. Get All Folders

Retrieves a list of all folders in the Info Portal.

#### Endpoint
```http
GET /api/info-portal/folders
```

#### Request
No request body required.

#### Response
```json
{
  "folders": [
    {
      "id": "string",
      "name": "string",
      "pageCount": "number",
      "color": "string",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ],
  "totalFolders": "number"
}
```

#### Example Response
```json
{
  "folders": [
    {
      "id": "1",
      "name": "Medical App",
      "pageCount": 5,
      "color": "#FFF7E3",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    },
    {
      "id": "2",
      "name": "Fortune website",
      "pageCount": 8,
      "color": "#C1FFEE",
      "createdAt": "2024-01-10T09:00:00Z",
      "updatedAt": "2024-01-18T16:20:00Z"
    }
  ],
  "totalFolders": 2
}
```

---

### 2. Get Folder by ID

Retrieves a specific folder with its pages.

#### Endpoint
```http
GET /api/info-portal/folders/:folderId
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `folderId` | string | Yes | The unique identifier of the folder |

#### Request
No request body required.

#### Response
```json
{
  "folder": {
    "id": "string",
    "name": "string",
    "color": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)",
    "pages": [
      {
        "id": "string",
        "title": "string",
        "lastModified": "string",
        "isActive": "boolean",
        "folderId": "string",
        "createdAt": "string (ISO 8601)",
        "updatedAt": "string (ISO 8601)"
      }
    ]
  }
}
```

#### Example Response
```json
{
  "folder": {
    "id": "3",
    "name": "Time tracker - personal account",
    "color": "#E7E3FD",
    "createdAt": "2024-01-12T11:00:00Z",
    "updatedAt": "2024-01-25T10:30:00Z",
    "pages": [
      {
        "id": "1",
        "title": "Technical task",
        "lastModified": "Sep 12, 2020",
        "isActive": true,
        "folderId": "3",
        "createdAt": "2024-01-12T11:00:00Z",
        "updatedAt": "2024-01-12T11:00:00Z"
      },
      {
        "id": "2",
        "title": "Project Specification",
        "lastModified": "Sep 24, 2020",
        "isActive": false,
        "folderId": "3",
        "createdAt": "2024-01-13T09:00:00Z",
        "updatedAt": "2024-01-24T14:00:00Z"
      }
    ]
  }
}
```

---

### 3. Create Folder

Creates a new folder.

#### Endpoint
```http
POST /api/info-portal/folders
```

#### Request
```json
{
  "name": "string",
  "color": "string"
}
```

#### Request Body Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Name of the folder (max 255 characters) |
| `color` | string | Yes | Hex color code for the folder (e.g., "#FFF7E3") |

#### Example Request
```json
{
  "name": "New Project Folder",
  "color": "#FFF7E3"
}
```

#### Response
```json
{
  "folder": {
    "id": "string",
    "name": "string",
    "pageCount": 0,
    "color": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

#### Example Response
```json
{
  "folder": {
    "id": "5",
    "name": "New Project Folder",
    "pageCount": 0,
    "color": "#FFF7E3",
    "createdAt": "2024-01-25T12:00:00Z",
    "updatedAt": "2024-01-25T12:00:00Z"
  }
}
```

---

### 4. Update Folder

Updates an existing folder.

#### Endpoint
```http
PUT /api/info-portal/folders/:folderId
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `folderId` | string | Yes | The unique identifier of the folder |

#### Request
```json
{
  "name": "string",
  "color": "string"
}
```

#### Request Body Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Updated name of the folder |
| `color` | string | No | Updated hex color code for the folder |

#### Example Request
```json
{
  "name": "Updated Folder Name",
  "color": "#C1FFEE"
}
```

#### Response
```json
{
  "folder": {
    "id": "string",
    "name": "string",
    "pageCount": "number",
    "color": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

---

### 5. Delete Folder

Deletes a folder and all its pages.

#### Endpoint
```http
DELETE /api/info-portal/folders/:folderId
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `folderId` | string | Yes | The unique identifier of the folder |

#### Request
No request body required.

#### Response
```json
{
  "message": "Folder deleted successfully"
}
```

---

### 6. Get Page Content

Retrieves the content of a specific page including sections and attachments.

#### Endpoint
```http
GET /api/info-portal/pages/:pageId
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageId` | string | Yes | The unique identifier of the page |

#### Request
No request body required.

#### Response
```json
{
  "page": {
    "id": "string",
    "title": "string",
    "lastModified": "string",
    "isActive": "boolean",
    "folderId": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)",
    "sections": [
      {
        "id": "string",
        "title": "string",
        "content": "string",
        "order": "number"
      }
    ],
    "attachments": [
      {
        "id": "string",
        "name": "string",
        "date": "string",
        "imageUrl": "string",
        "fileUrl": "string",
        "fileType": "string",
        "fileSize": "number"
      }
    ]
  }
}
```

#### Example Response
```json
{
  "page": {
    "id": "1",
    "title": "Technical task",
    "lastModified": "Sep 12, 2020",
    "isActive": true,
    "folderId": "3",
    "createdAt": "2024-01-12T11:00:00Z",
    "updatedAt": "2024-01-12T11:00:00Z",
    "sections": [
      {
        "id": "1",
        "title": "Requirements for website design",
        "content": "When developing the site, predominantly light styles should be used...",
        "order": 1
      },
      {
        "id": "2",
        "title": "Requirements for the presentation of the main page",
        "content": "The main page of the site must contain a graphic part...",
        "order": 2
      }
    ],
    "attachments": [
      {
        "id": "1",
        "name": "site screens.png",
        "date": "Sep 19, 2020 | 10:52 AM",
        "imageUrl": "/assets/attachment/image-demo.png",
        "fileUrl": "/uploads/attachments/site-screens.png",
        "fileType": "image/png",
        "fileSize": 245678
      }
    ]
  }
}
```

---

### 7. Create Page

Creates a new page in a folder.

#### Endpoint
```http
POST /api/info-portal/folders/:folderId/pages
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `folderId` | string | Yes | The unique identifier of the folder |

#### Request
```json
{
  "title": "string"
}
```

#### Request Body Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Title of the page (max 255 characters) |

#### Example Request
```json
{
  "title": "New Page Title"
}
```

#### Response
```json
{
  "page": {
    "id": "string",
    "title": "string",
    "lastModified": "string",
    "isActive": "boolean",
    "folderId": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)",
    "sections": [],
    "attachments": []
  }
}
```

---

### 8. Update Page

Updates an existing page (title, active state, etc.).

#### Endpoint
```http
PUT /api/info-portal/pages/:pageId
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageId` | string | Yes | The unique identifier of the page |

#### Request
```json
{
  "title": "string",
  "isActive": "boolean"
}
```

#### Request Body Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Updated title of the page |
| `isActive` | boolean | No | Whether the page is currently active/selected |

#### Example Request
```json
{
  "title": "Updated Page Title",
  "isActive": true
}
```

#### Response
```json
{
  "page": {
    "id": "string",
    "title": "string",
    "lastModified": "string",
    "isActive": "boolean",
    "folderId": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

---

### 9. Delete Page

Deletes a page and all its content.

#### Endpoint
```http
DELETE /api/info-portal/pages/:pageId
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageId` | string | Yes | The unique identifier of the page |

#### Request
No request body required.

#### Response
```json
{
  "message": "Page deleted successfully"
}
```

---

### 10. Update Page Sections

Updates the sections (content) of a page.

#### Endpoint
```http
PUT /api/info-portal/pages/:pageId/sections
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageId` | string | Yes | The unique identifier of the page |

#### Request
```json
{
  "sections": [
    {
      "id": "string (optional, for update)",
      "title": "string",
      "content": "string",
      "order": "number"
    }
  ]
}
```

#### Request Body Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sections` | array | Yes | Array of section objects |
| `sections[].id` | string | No | Section ID (required for updates, omit for new sections) |
| `sections[].title` | string | Yes | Section title |
| `sections[].content` | string | Yes | Section content/body |
| `sections[].order` | number | Yes | Display order of the section |

#### Example Request
```json
{
  "sections": [
    {
      "title": "Requirements for website design",
      "content": "When developing the site, predominantly light styles should be used...",
      "order": 1
    },
    {
      "id": "2",
      "title": "Updated Section Title",
      "content": "Updated content...",
      "order": 2
    }
  ]
}
```

#### Response
```json
{
  "sections": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "order": "number",
      "pageId": "string",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

---

### 11. Upload Page Attachment

Uploads a file attachment to a page.

#### Endpoint
```http
POST /api/info-portal/pages/:pageId/attachments
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageId` | string | Yes | The unique identifier of the page |

#### Request
Form data with file upload:
- `file`: File (image, document, etc.)
- `name`: string (optional, defaults to file name)

#### Response
```json
{
  "attachment": {
    "id": "string",
    "name": "string",
    "date": "string",
    "imageUrl": "string",
    "fileUrl": "string",
    "fileType": "string",
    "fileSize": "number",
    "pageId": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

---

### 12. Delete Page Attachment

Deletes an attachment from a page.

#### Endpoint
```http
DELETE /api/info-portal/attachments/:attachmentId
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `attachmentId` | string | Yes | The unique identifier of the attachment |

#### Request
No request body required.

#### Response
```json
{
  "message": "Attachment deleted successfully"
}
```

---

### 13. Get Statistics

Retrieves statistics for the Info Portal dashboard.

#### Endpoint
```http
GET /api/info-portal/statistics
```

#### Request
No request body required.

#### Response
```json
{
  "statistics": {
    "currentProjects": "number",
    "ongoingProjectsLastMonth": "number",
    "growth": "number"
  }
}
```

#### Example Response
```json
{
  "statistics": {
    "currentProjects": 10,
    "ongoingProjectsLastMonth": 7,
    "growth": 3
  }
}
```

---

## Data Models

### Folder
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the folder |
| `name` | string | Name of the folder |
| `pageCount` | number | Number of pages in the folder |
| `color` | string | Hex color code for the folder |
| `createdAt` | string | ISO 8601 timestamp of creation |
| `updatedAt` | string | ISO 8601 timestamp of last update |

### Page
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the page |
| `title` | string | Title of the page |
| `lastModified` | string | Human-readable last modified date |
| `isActive` | boolean | Whether the page is currently active/selected |
| `folderId` | string | ID of the parent folder |
| `createdAt` | string | ISO 8601 timestamp of creation |
| `updatedAt` | string | ISO 8601 timestamp of last update |

### Section
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the section |
| `title` | string | Title of the section |
| `content` | string | Content/body of the section |
| `order` | number | Display order of the section |
| `pageId` | string | ID of the parent page |
| `createdAt` | string | ISO 8601 timestamp of creation |
| `updatedAt` | string | ISO 8601 timestamp of last update |

### Attachment
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the attachment |
| `name` | string | Name of the file |
| `date` | string | Human-readable upload date |
| `imageUrl` | string | URL for image preview |
| `fileUrl` | string | URL for downloading the file |
| `fileType` | string | MIME type of the file |
| `fileSize` | number | Size of the file in bytes |
| `pageId` | string | ID of the parent page |
| `createdAt` | string | ISO 8601 timestamp of creation |
| `updatedAt` | string | ISO 8601 timestamp of last update |

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Auth token missing"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

