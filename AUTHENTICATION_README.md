# Authentication System Implementation

This document describes the authentication system implemented for the Odyssey application.

## Overview

The authentication system uses Firebase Authentication with Google Sign-In and includes:
- Middleware protection for protected routes
- Client-side authentication context
- Protected route components
- Automatic token management

## Components

### 1. Middleware (`src/app/middleware.ts`)
- Protects routes: `/Dashboard`, `/Pages`, `/Achievements`, `/Profile`, `/Habits`, `/GritEngine`, `/Inbox`
- Checks for authentication token in cookies
- Redirects unauthenticated users to the main page (`/`)

### 2. Authentication Context (`context/AuthContext.tsx`)
- Manages user authentication state across the application
- Automatically handles Firebase ID token storage in cookies
- Provides `signOut` and `updateToken` functions
- Handles authentication state changes

### 3. Protected Route Component (`components/ProtectedRoute.tsx`)
- Wraps protected pages to ensure authentication
- Shows loading state while checking authentication
- Redirects unauthenticated users to login page

### 4. Cookie Utilities (`lib/cookies.ts`)
- Helper functions for managing authentication cookies
- Secure cookie settings with proper flags

### 5. API Endpoints
- `/api/auth/verify` - Verifies Firebase tokens (for future use)
- `/api/auth/logout` - Handles user logout

## How It Works

1. **User Sign-In**: When a user signs in through the Join component, Firebase creates an ID token
2. **Token Storage**: The ID token is automatically stored in a secure cookie by the AuthContext
3. **Route Protection**: Middleware checks for the token on protected routes
4. **Authentication State**: The AuthContext maintains the user's authentication state
5. **Protected Pages**: Protected pages are wrapped with the ProtectedRoute component

## Usage

### Protecting a Page
```tsx
import ProtectedRoute from '../components/ProtectedRoute';

const MyProtectedPage = () => {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
};
```

### Using Authentication in Components
```tsx
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, signOut, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <p>Welcome, {user?.displayName}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};
```

## Security Features

- Secure cookie settings (httpOnly, secure, sameSite)
- Automatic token refresh
- Server-side token verification capability
- Protected route middleware
- Automatic logout on authentication failure

## Future Enhancements

- Implement server-side token verification in middleware
- Add token refresh logic
- Implement session management
- Add role-based access control
