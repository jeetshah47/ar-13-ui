# Google Account Linking API Documentation

This document provides comprehensive documentation for the Google Account Linking API that allows users to link their Google accounts to their existing user accounts in the system.

## Overview

The Google Account Linking API enables users to link their Google accounts to their existing user accounts. This integration allows for:
- Linking Google accounts to existing users
- Storing linked account information
- Managing account links (link, unlink, check status)
- Support for future provider integrations (Microsoft, GitHub, etc.)

## Two Integration Approaches

The API supports **two different OAuth flow approaches**:

### 1. **Client-Side OAuth Flow** (Recommended for most cases)
- User authenticates with Google on the client
- Client obtains Google ID token
- Client sends ID token to backend API
- **Simpler to implement**, no server-side OAuth configuration needed
- **Use when**: You want a simple integration, mobile apps, or web apps with client-side OAuth

### 2. **Server-Side OAuth Flow** (Callback URL)
- User clicks "Link Google" button
- Backend redirects to Google OAuth
- Google redirects back to backend callback URL
- Backend handles token exchange and linking
- **More secure**, tokens never exposed to client
- **Use when**: You need refresh tokens, want server-side control, or need additional scopes

**Both approaches are supported!** Choose based on your needs.

## Base URL

All Google Account Linking API endpoints are prefixed with:
```
/api/google-account
```

## Authentication

All Google Account Linking API endpoints require:
- **Authentication**: Valid Firebase authentication token
- **Authorization**: Authenticated users can manage their own account links

### Headers Required

```http
Authorization: Bearer <firebase_token>
Content-Type: application/json
```

## Architecture

The Google Account Linking system uses a separate `userAccountLinks` collection in Firestore to store linked account information. This design allows:
- Multiple providers per user (future extensibility)
- Clean separation of concerns
- Easy querying and management

## Endpoints

### 1. Link Google Account (Client-Side Flow)

Links a Google account to the authenticated user's account using a Google ID token obtained from the client.

#### Endpoint
```http
POST /api/google-account/link
```

#### Request Body

```json
{
  "googleIdToken": "string" // Google ID token obtained from Google Sign-In
}
```

#### Google ID Token

The `googleIdToken` is obtained from Google's Sign-In flow on the client side. It is a JWT token that contains user information and can be verified using Google's tokeninfo endpoint.

**How to get the Google ID Token (Client-side example):**

```javascript
// Using Google Sign-In JavaScript SDK
async function linkGoogleAccount() {
  try {
    // Initialize Google Sign-In
    await gapi.load('auth2', async () => {
      const auth2 = await gapi.auth2.init({
        client_id: 'YOUR_GOOGLE_CLIENT_ID'
      });
      
      // Sign in user
      const googleUser = await auth2.signIn();
      const idToken = googleUser.getAuthResponse().id_token;
      
      // Send to backend
      const response = await fetch('/api/google-account/link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ googleIdToken: idToken })
      });
      
      const result = await response.json();
      console.log('Account linked:', result);
    });
  } catch (error) {
    console.error('Error linking account:', error);
  }
}
```

#### Response

**Success Response (200 OK)**
```json
{
  "message": "Google account linked successfully",
  "link": {
    "id": "link_id_123",
    "userId": "user_id_456",
    "provider": "google",
    "providerUserId": "google_user_id_789",
    "providerEmail": "user@gmail.com",
    "providerDisplayName": "John Doe",
    "isActive": true,
    "linkedAt": "2024-01-15T10:30:00.000Z",
    "created": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**

**400 Bad Request** - Missing or invalid Google ID token
```json
{
  "message": "Google ID token is required"
}
```

**401 Unauthorized** - User not authenticated
```json
{
  "message": "User not authenticated"
}
```

**404 Not Found** - User not found
```json
{
  "message": "User not found"
}
```

**409 Conflict** - Google account already linked to another user or user already has a Google account linked
```json
{
  "message": "This Google account is already linked to another user"
}
```
or
```json
{
  "message": "User already has a Google account linked"
}
```

**500 Internal Server Error** - Server error during linking
```json
{
  "message": "Failed to link Google account"
}
```

#### Example Request

```bash
curl -X POST https://your-api.com/api/google-account/link \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "googleIdToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
  }'
```

---

### 2. Initiate Server-Side OAuth Flow

Initiates a server-side OAuth flow by redirecting the user to Google's authorization page.

#### Endpoint
```http
GET /api/google-account/auth/initiate
```

#### Query Parameters (Optional)

```http
?callbackUrl=https://your-backend.com/api/google-account/auth/callback
```

If not provided, the callback URL defaults to: `{protocol}://{host}/api/google-account/auth/callback`

#### Response

**Success Response (200 OK)**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "message": "OAuth URL generated successfully"
}
```

The frontend should then redirect the user to the `authUrl` returned in the response.

#### Example Request

```bash
# Frontend makes authenticated request to get OAuth URL
curl -X GET https://your-api.com/api/google-account/auth/initiate \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"

# Response:
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&state=...",
  "message": "OAuth URL generated successfully"
}
```

#### Frontend Integration Example

```typescript
// Correct way: Make authenticated request, then redirect
async function linkGoogleAccount() {
  try {
    // Make authenticated API call to get OAuth URL
    const response = await fetch('/api/google-account/auth/initiate', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to initiate OAuth');
    }
    
    const data = await response.json();
    
    // Redirect to Google OAuth page
    window.location.href = data.authUrl;
  } catch (error) {
    console.error('Error linking Google account:', error);
    alert('Failed to link Google account. Please try again.');
  }
}

// With custom callback URL
async function linkGoogleAccount(customCallbackUrl?: string) {
  const url = customCallbackUrl 
    ? `/api/google-account/auth/initiate?callbackUrl=${encodeURIComponent(customCallbackUrl)}`
    : '/api/google-account/auth/initiate';
    
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${firebaseToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  window.location.href = data.authUrl;
}
```

---

### 3. OAuth Callback Handler

Handles the OAuth callback from Google after user authorization.

#### Endpoint
```http
GET /api/google-account/auth/callback
```

**Note**: This endpoint is called automatically by Google after user authorization. It does not require authentication (uses state token for security).

#### Query Parameters (from Google)

```http
?code=AUTHORIZATION_CODE&state=STATE_TOKEN
```

#### Response

**Success Response (302 Redirect)**
- Redirects to frontend success page: `{FRONTEND_URL}/account/linked?success=true&userId={userId}`
- If error: `{FRONTEND_URL}/account/linked?success=false&error={error_message}`

#### Flow

1. User clicks "Link Google Account"
2. Backend redirects to Google OAuth
3. User authorizes on Google
4. Google redirects to: `/api/google-account/auth/callback?code=XXX&state=YYY`
5. Backend exchanges code for tokens
6. Backend links the account
7. Backend redirects to frontend success page

#### Configuration

Make sure to configure the callback URL in your Google Cloud Console:
- Go to Google Cloud Console → APIs & Services → Credentials
- Edit your OAuth 2.0 Client ID
- Add authorized redirect URI: `https://your-backend.com/api/google-account/auth/callback`

---

### 4. Unlink Google Account

Unlinks the Google account from the authenticated user's account.

#### Endpoint
```http
POST /api/google-account/unlink
```

#### Request Body

No request body required.

#### Response

**Success Response (200 OK)**
```json
{
  "message": "Google account unlinked successfully"
}
```

**Error Responses**

**401 Unauthorized** - User not authenticated
```json
{
  "message": "User not authenticated"
}
```

**404 Not Found** - User not found or no Google account linked
```json
{
  "message": "User not found"
}
```
or
```json
{
  "message": "No Google account linked to this user"
}
```

**500 Internal Server Error** - Server error during unlinking
```json
{
  "message": "Failed to unlink Google account"
}
```

#### Example Request

```bash
curl -X POST https://your-api.com/api/google-account/unlink \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json"
```

---

### 5. Get Google Account Status

Retrieves the Google account link status for the authenticated user.

#### Endpoint
```http
GET /api/google-account/status
```

#### Request Body

No request body required.

#### Response

**Success Response (200 OK)**

When Google account is linked:
```json
{
  "linked": true,
  "link": {
    "id": "link_id_123",
    "userId": "user_id_456",
    "provider": "google",
    "providerUserId": "google_user_id_789",
    "providerEmail": "user@gmail.com",
    "providerDisplayName": "John Doe",
    "isActive": true,
    "linkedAt": "2024-01-15T10:30:00.000Z",
    "created": "2024-01-15T10:30:00.000Z"
  }
}
```

When Google account is not linked:
```json
{
  "linked": false,
  "link": null
}
```

**Error Responses**

**401 Unauthorized** - User not authenticated
```json
{
  "message": "User not authenticated"
}
```

#### Example Request

```bash
curl -X GET https://your-api.com/api/google-account/status \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

### 6. Get All Linked Accounts

Retrieves all linked accounts (Google, Microsoft, GitHub, etc.) for the authenticated user.

#### Endpoint
```http
GET /api/google-account/links
```

#### Request Body

No request body required.

#### Response

**Success Response (200 OK)**
```json
{
  "links": [
    {
      "id": "link_id_123",
      "userId": "user_id_456",
      "provider": "google",
      "providerUserId": "google_user_id_789",
      "providerEmail": "user@gmail.com",
      "providerDisplayName": "John Doe",
      "isActive": true,
      "linkedAt": "2024-01-15T10:30:00.000Z",
      "created": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

If no accounts are linked:
```json
{
  "links": []
}
```

**Error Responses**

**401 Unauthorized** - User not authenticated
```json
{
  "message": "User not authenticated"
}
```

#### Example Request

```bash
curl -X GET https://your-api.com/api/google-account/links \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

## Data Models

### UserAccountLink

The `UserAccountLink` model represents a linked account:

```typescript
interface IUserAccountLink {
  id: string;                    // Unique identifier for the link
  userId: string;                // User ID in the system
  provider: "google" | "microsoft" | "github"; // Account provider
  providerUserId: string;        // User ID in the provider's system
  providerEmail: string;         // Email from the provider
  providerDisplayName?: string;  // Display name from provider
  accessToken?: string;          // OAuth access token (optional, for future use)
  refreshToken?: string;         // OAuth refresh token (optional, for future use)
  expiresAt?: Date;              // Token expiration date (optional)
  isActive: boolean;             // Whether the link is currently active
  linkedAt: Date;                // When the account was linked
  created: Date;                 // When the record was created
  updated?: Date;                // When the record was last updated
}
```

## Complete Integration Examples

### Client-Side OAuth Flow Example

Here's a complete example using the client-side OAuth flow:

```typescript
// Google Account Linking Service
class GoogleAccountLinkingService {
  private baseUrl = 'https://your-api.com/api/google-account';
  private firebaseToken: string;

  constructor(firebaseToken: string) {
    this.firebaseToken = firebaseToken;
  }

  /**
   * Link Google account using Google ID token
   */
  async linkAccount(googleIdToken: string): Promise<IUserAccountLink> {
    const response = await fetch(`${this.baseUrl}/link`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.firebaseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ googleIdToken })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to link Google account');
    }

    const data = await response.json();
    return data.link;
  }

  /**
   * Unlink Google account
   */
  async unlinkAccount(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/unlink`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.firebaseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to unlink Google account');
    }
  }

  /**
   * Get Google account link status
   */
  async getStatus(): Promise<{ linked: boolean; link: IUserAccountLink | null }> {
    const response = await fetch(`${this.baseUrl}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.firebaseToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get account status');
    }

    return await response.json();
  }

  /**
   * Get all linked accounts
   */
  async getAllLinks(): Promise<IUserAccountLink[]> {
    const response = await fetch(`${this.baseUrl}/links`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.firebaseToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get linked accounts');
    }

    const data = await response.json();
    return data.links;
  }
}

// Usage example
async function handleGoogleLink() {
  try {
    // 1. Get Google ID token from Google Sign-In
    const googleIdToken = await getGoogleIdToken(); // Your Google Sign-In implementation
    
    // 2. Initialize the service
    const linkingService = new GoogleAccountLinkingService(firebaseAuthToken);
    
    // 3. Link the account
    const link = await linkingService.linkAccount(googleIdToken);
    console.log('Account linked successfully:', link);
    
    // 4. Check status
    const status = await linkingService.getStatus();
    console.log('Account linked:', status.linked);
    
  } catch (error) {
    console.error('Error linking account:', error);
  }
}
```

### Server-Side OAuth Flow Example

Here's a complete example using the server-side OAuth flow (callback URL):

```typescript
// Server-Side OAuth Flow Service
class GoogleAccountLinkingService {
  private baseUrl = 'https://your-api.com/api/google-account';

  /**
   * Initiate OAuth flow - redirects user to Google
   */
  initiateOAuthFlow() {
    // Simply redirect to the initiate endpoint
    // User must be authenticated first
    window.location.href = `${this.baseUrl}/auth/initiate`;
  }

  /**
   * Handle callback (usually done on backend, but frontend can check status)
   */
  async checkLinkStatus(firebaseToken: string): Promise<{ linked: boolean; link: IUserAccountLink | null }> {
    const response = await fetch(`${this.baseUrl}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get account status');
    }

    return await response.json();
  }
}

// Usage
async function handleLinkGoogleAccount() {
  try {
    const linkingService = new GoogleAccountLinkingService();
    
    // Initiate OAuth flow - this will redirect to Google
    linkingService.initiateOAuthFlow();
    
    // After user authorizes, Google redirects to callback
    // Backend handles the linking and redirects to frontend success page
    // Frontend should check the success/error query params
    
    // Example: Check if we're on the callback success page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      console.log('Account linked successfully!');
      
      // Optionally verify the link status
      const status = await linkingService.checkLinkStatus(firebaseToken);
      console.log('Link status:', status);
    } else if (urlParams.get('success') === 'false') {
      const error = urlParams.get('error');
      console.error('Failed to link account:', error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Frontend callback page handler (e.g., /account/linked)
function AccountLinkedPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const error = urlParams.get('error');
  
  if (success === 'true') {
    return <div>Account linked successfully!</div>;
  } else {
    return <div>Error: {error}</div>;
  }
}
```

## Choosing Between Client-Side and Server-Side Flow

### Use **Client-Side Flow** when:
- ✅ Simple integration is preferred
- ✅ You don't need refresh tokens
- ✅ Mobile app integration
- ✅ You want to handle OAuth entirely on the client
- ✅ You already have Google Sign-In SDK integrated

### Use **Server-Side Flow** (Callback URL) when:
- ✅ You need refresh tokens for long-term access
- ✅ You want tokens stored securely on the server
- ✅ You need additional Google API scopes
- ✅ You want full server-side control
- ✅ You're building a web application with backend

## Configuration

### Environment Variables

For **server-side OAuth flow**, add these to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (for redirect after linking)
FRONTEND_URL=https://your-frontend-url.com
```

### Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google+ API (or Google Identity API)
4. Go to APIs & Services → Credentials
5. Create OAuth 2.0 Client ID
6. Add authorized redirect URIs:
   - For server-side flow: `https://your-backend.com/api/google-account/auth/callback`
   - For client-side flow: Your frontend URL (e.g., `https://your-frontend.com`)

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- **200 OK** - Request successful
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required or failed
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource conflict (e.g., already linked)
- **500 Internal Server Error** - Server error

## Security Considerations

1. **Token Validation**: The backend verifies Google ID tokens using Google's tokeninfo endpoint
2. **Duplicate Prevention**: The system prevents:
   - Linking the same Google account to multiple users
   - Linking multiple Google accounts to the same user
3. **Authentication Required**: All endpoints require valid Firebase authentication
4. **User Isolation**: Users can only manage their own account links

## Database Schema

The `userAccountLinks` collection in Firestore stores linked account information:

```
userAccountLinks/
  {linkId}/
    - id: string
    - userId: string
    - provider: string ("google" | "microsoft" | "github")
    - providerUserId: string
    - providerEmail: string
    - providerDisplayName?: string
    - accessToken?: string
    - refreshToken?: string
    - expiresAt?: Date
    - isActive: boolean
    - linkedAt: Date
    - created: Date
    - updated?: Date
```

## Future Extensibility

The system is designed to support multiple providers:

- **Google** ✅ (Current implementation)
- **Microsoft** (Future)
- **GitHub** (Future)
- **Other OAuth providers** (Future)

To add a new provider, simply:
1. Add the provider type to the `AccountProvider` type in the model
2. Implement provider-specific verification logic in the service
3. Use the same endpoints with different provider values

## Testing

### Test Scenarios

1. **Link Google Account**
   - Successfully link a Google account
   - Attempt to link already linked account (should fail)
   - Attempt to link Google account linked to another user (should fail)

2. **Unlink Google Account**
   - Successfully unlink a Google account
   - Attempt to unlink when no account is linked (should fail)

3. **Get Status**
   - Get status when account is linked
   - Get status when account is not linked

4. **Get All Links**
   - Get all links for a user with linked accounts
   - Get all links for a user with no linked accounts

## Troubleshooting

### Common Issues

1. **"Invalid Google token"**
   - Ensure the Google ID token is valid and not expired
   - Verify the token was obtained from Google Sign-In flow

2. **"User already has a Google account linked"**
   - Check if user already has a linked account using `/status` endpoint
   - Unlink existing account before linking a new one

3. **"This Google account is already linked to another user"**
   - The Google account is linked to a different user
   - Contact support if this is unexpected

4. **Authentication errors**
   - Verify Firebase token is valid and not expired
   - Ensure token is included in Authorization header

## Support

For issues or questions regarding the Google Account Linking API, please contact the development team or refer to the main API documentation.

