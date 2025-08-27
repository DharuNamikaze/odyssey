# Authentication Implementation Guide

This document provides step-by-step instructions for implementing and maintaining the authentication system in Odyssey.

## 🎯 What We've Implemented

### ✅ Completed Features
- [x] Firebase Google Authentication
- [x] Middleware route protection
- [x] Protected route components
- [x] Authentication context
- [x] Secure cookie management
- [x] Logout functionality
- [x] Token validation

### 🔄 Current Status
All protected routes are now properly secured with double-layer protection:
- **Server-side**: Middleware checks
- **Client-side**: ProtectedRoute components

## 📋 Implementation Checklist

### 1. Core Files Created/Modified

#### Authentication Context
- [x] `context/AuthContext.tsx` - Global auth state management
- [x] `src/app/layout.tsx` - Wrapped with AuthProvider

#### Route Protection
- [x] `src/app/middleware.ts` - Server-side protection
- [x] `components/ProtectedRoute.tsx` - Client-side protection

#### Protected Pages
- [x] `src/app/Dashboard/page.tsx` - Wrapped with ProtectedRoute
- [x] `src/app/Achievements/page.tsx` - Wrapped with ProtectedRoute
- [x] `src/app/Habits/page.tsx` - Wrapped with ProtectedRoute
- [x] `src/app/GritEngine/page.tsx` - Wrapped with ProtectedRoute
- [x] `src/app/Inbox/page.tsx` - Wrapped with ProtectedRoute
- [x] `src/app/Pages/page.tsx` - Wrapped with ProtectedRoute
- [x] `src/app/Pages/[id]/page.tsx` - Wrapped with ProtectedRoute

#### Utilities
- [x] `lib/cookies.ts` - Cookie management functions
- [x] `components/NavBar.tsx` - Added logout button

#### API Endpoints
- [x] `src/app/api/auth/verify/route.ts` - Token verification
- [x] `src/app/api/auth/logout/route.ts` - Logout handling

## 🔧 How to Add New Protected Routes

### Step 1: Update Middleware
Add the new route to `src/app/middleware.ts`:

```typescript
// Add to protected routes check
if (request.nextUrl.pathname.startsWith('/NewRoute') ||
    request.nextUrl.pathname.startsWith('/ExistingRoute')) {
  return NextResponse.redirect(new URL('/', request.url));
}

// Add to config matcher
export const config = {
  matcher: [
    '/NewRoute/:path*',  // Add this line
    // ... existing routes
  ]
};
```

### Step 2: Wrap Component with ProtectedRoute
```typescript
// src/app/NewRoute/page.tsx
import ProtectedRoute from '../../components/ProtectedRoute';

export default function NewRoute() {
  return (
    <ProtectedRoute>
      <div>Your protected content here</div>
    </ProtectedRoute>
  );
}
```

### Step 3: Test Authentication
1. Try accessing `/NewRoute` without logging in
2. Verify redirect to home page
3. Sign in and verify access works
4. Test logout redirects properly

## 🚨 Troubleshooting Common Issues

### Issue: Routes Not Protected
**Symptoms**: Can access protected routes without authentication

**Solutions**:
1. Check middleware configuration
2. Verify ProtectedRoute wrapper
3. Clear browser cache
4. Restart development server

### Issue: Infinite Redirects
**Symptoms**: Page keeps redirecting to login

**Solutions**:
1. Check authentication context
2. Verify cookie settings
3. Check Firebase configuration
4. Clear browser cookies

### Issue: Token Not Being Set
**Symptoms**: User signs in but gets redirected

**Solutions**:
1. Check Firebase environment variables
2. Verify AuthContext is working
3. Check browser console for errors
4. Verify cookie permissions

## 🔍 Debugging Steps

### 1. Check Authentication State
```typescript
// In browser console
console.log('Auth Context:', useAuth());
console.log('Cookies:', document.cookie);
console.log('Firebase User:', auth.currentUser);
```

### 2. Verify Middleware
- Check Network tab for redirects
- Look for middleware execution in console
- Verify cookie presence in Application tab

### 3. Test Protected Routes
```bash
# Test without authentication
curl http://localhost:3000/Dashboard
# Should redirect to home page

# Test with valid token
curl -H "Cookie: token=valid_token" http://localhost:3000/Dashboard
# Should return page content
```

## 📝 Code Examples

### Creating a New Protected Component
```typescript
'use client';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function MyProtectedComponent() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Welcome, {user?.displayName}!</h1>
        <p>This is protected content</p>
      </div>
    </ProtectedRoute>
  );
}
```

### Adding Authentication to Existing Component
```typescript
// Before: No protection
export default function MyComponent() {
  return <div>Unprotected content</div>;
}

// After: With protection
import ProtectedRoute from '../components/ProtectedRoute';

export default function MyComponent() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

### Custom Authentication Logic
```typescript
import { useAuth } from '../context/AuthContext';

export default function CustomAuthComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <div>Please sign in to continue</div>;
  }

  // Custom authentication logic
  if (user.email?.endsWith('@company.com')) {
    return <div>Company users only</div>;
  }

  return <div>Access denied</div>;
}
```

## 🔐 Security Best Practices

### 1. Never Expose Sensitive Data
```typescript
// ❌ Wrong - Exposing user ID in client
const userId = user.uid; // Visible in browser

// ✅ Correct - Use server-side validation
const response = await fetch('/api/protected', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 2. Always Validate Tokens
```typescript
// ❌ Wrong - No validation
if (user) { /* allow access */ }

// ✅ Correct - Validate with middleware
// Middleware handles this automatically
```

### 3. Secure Cookie Settings
```typescript
// ✅ Secure cookie configuration
setCookie('token', idToken, {
  maxAge: 3600,
  secure: true,
  sameSite: 'strict'
});
```

## 📊 Testing Checklist

### Authentication Flow Tests
- [ ] Unauthenticated user redirected to login
- [ ] Authenticated user can access protected routes
- [ ] Logout clears session and redirects
- [ ] Token expiration triggers re-authentication
- [ ] Invalid tokens are rejected

### Route Protection Tests
- [ ] All protected routes require authentication
- [ ] Public routes remain accessible
- [ ] Middleware redirects work correctly
- [ ] ProtectedRoute components render properly

### Error Handling Tests
- [ ] Network errors handled gracefully
- [ ] Invalid tokens show appropriate messages
- [ ] Authentication failures don't crash app
- [ ] Loading states display correctly

## 🔄 Maintenance Tasks

### Weekly
- [ ] Check authentication logs
- [ ] Verify Firebase quotas
- [ ] Test authentication flow
- [ ] Review security alerts

### Monthly
- [ ] Update dependencies
- [ ] Review authentication policies
- [ ] Test with different browsers
- [ ] Performance optimization

### Quarterly
- [ ] Security audit
- [ ] Code review
- [ ] User feedback analysis
- [ ] Feature enhancement planning

---

**Document Version**: 1.0.0  
**Last Updated**: December 2024  
**Next Review**: January 2025
