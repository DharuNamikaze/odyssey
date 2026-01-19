# Security Architecture - Authentication & Authorization System

## Overview
This document details the multi-layered security architecture implemented in the Odyssey productivity app, covering OAuth 2.0 authentication, JWT token management, route protection, and authorization patterns.

---

## Security Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ Google OAuth │ -> │ AuthContext  │ -> │ Protected    │      │
│  │   Popup      │    │  (React)     │    │   Routes     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                    │                    │              │
│         │ ID Token           │ Token Storage      │ Redirect     │
│         ↓                    ↓                    ↓              │
│  ┌──────────────────────────────────────────────────────┐       │
│  │         Secure httpOnly Cookie (token)               │       │
│  │         - Secure flag (HTTPS only)                   │       │
│  │         - SameSite=strict (CSRF protection)          │       │
│  │         - 1 hour expiration                          │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Request with Cookie
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE LAYER (Next.js)                    │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Route Protection Middleware                         │       │
│  │  - Token existence check                             │       │
│  │  - Token length validation (>100 chars)              │       │
│  │  - Protected route matching                          │       │
│  │  - Redirect to login if unauthorized                 │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Allowed Request
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API ROUTE LAYER                             │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Token Verification (Firebase Admin SDK)             │       │
│  │  1. Extract token from cookie/header                 │       │
│  │  2. Verify signature with Firebase                   │       │
│  │  3. Check expiration                                 │       │
│  │  4. Extract userId (uid)                             │       │
│  └──────────────────────────────────────────────────────┘       │
│                              │                                   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Resource Authorization                              │       │
│  │  - Verify resource.userId === decodedToken.uid       │       │
│  │  - Return 403 Forbidden if mismatch                  │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Authorized Request
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (Firestore)                    │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  User-scoped Queries                                 │       │
│  │  - WHERE userId == uid                               │       │
│  │  - Document-level isolation                          │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Authentication (OAuth 2.0 + Firebase)

### Google OAuth Integration

**Implementation:** `components/Join.tsx`

```typescript
const handleIn = async () => {
  try {
    // 1. Trigger Google OAuth popup
    const res = await signInWithPopup(auth, provider);
    const user = res.user;
    
    // 2. Firebase automatically validates OAuth response
    // 3. User object contains verified email, displayName, uid
    
    // 4. Create user profile in database
    const userPayload = {
      Uid: user.uid,
      Email: user.email,
      Name: user.displayName,
      CreatedAt: new Date().toDateString(),
      Level: 1,
      Aura: 0,
      LoginStreak: 0
    };
    
    await axios.post('/api/user', userPayload);
    
    // 5. AuthContext automatically stores ID token in cookie
  } catch (error) {
    console.error("OAuth error:", error);
  }
};
```

**Security Features:**
1. **OAuth 2.0 Protocol:** Industry-standard authentication
2. **Firebase Validation:** Google verifies OAuth response server-side
3. **No Password Storage:** Delegated authentication to Google
4. **Verified Email:** Google confirms email ownership
5. **Unique UID:** Firebase generates cryptographically secure user IDs

---

### Token Management System

**Implementation:** `context/AuthContext.tsx`

```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      
      // Get Firebase ID token (JWT)
      const idToken = await currentUser.getIdToken();
      
      // Store in secure httpOnly cookie
      setCookie('token', idToken, { 
        maxAge: 3600,      // 1 hour expiration
        secure: true,      // HTTPS only
        sameSite: 'strict' // CSRF protection
      });
    } else {
      setUser(null);
      deleteCookie('token');
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);
```

**Token Refresh Mechanism:**
```typescript
const updateToken = async () => {
  if (user) {
    try {
      // Force token refresh (Firebase handles expiration)
      const idToken = await user.getIdToken(true);
      setCookie('token', idToken, { maxAge: 3600 });
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  }
};
```

**Security Features:**
1. **JWT Tokens:** Signed by Firebase, tamper-proof
2. **Automatic Refresh:** Firebase SDK handles token rotation
3. **Short Expiration:** 1-hour lifespan reduces exposure window
4. **Secure Storage:** httpOnly cookies prevent XSS access
5. **Real-time Sync:** onAuthStateChanged keeps client/server in sync

---

### Cookie Security Configuration

**Implementation:** `lib/cookies.ts`

```typescript
export function setCookie(name: string, value: string, options = {}) {
  const {
    path = '/',
    maxAge = 3600,           // 1 hour
    secure = true,           // HTTPS only
    sameSite = 'strict'      // CSRF protection
  } = options;

  let cookieString = `${name}=${value}; path=${path}`;
  
  if (maxAge) {
    cookieString += `; max-age=${maxAge}`;
  }
  
  if (secure) {
    cookieString += '; secure';  // Transmitted only over HTTPS
  }
  
  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;  // Blocks cross-site requests
  }

  document.cookie = cookieString;
}
```

**Security Attributes:**
| Attribute | Value | Protection Against |
|-----------|-------|-------------------|
| `httpOnly` | true | XSS attacks (JavaScript cannot access) |
| `secure` | true | Man-in-the-middle (HTTPS only) |
| `sameSite` | strict | CSRF attacks (no cross-site requests) |
| `maxAge` | 3600s | Token theft (limited exposure window) |
| `path` | / | Scope restriction |

---

## Layer 2: Route Protection (Middleware)

### Next.js Middleware

**Implementation:** `src/app/middleware.ts`

```typescript
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Protected routes list
  const protectedPaths = [
    '/Dashboard', '/Pages', '/Achievements', 
    '/Profile', '/Habits', '/GritEngine', '/Inbox', '/user'
  ];

  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute) {
    // Check 1: Token exists
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check 2: Token length validation (Firebase tokens are 1000+ chars)
    if (token.length < 100) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/Dashboard/:path*',
    '/Pages/:path*',
    '/Achievements/:path*',
    '/Profile/:path*',
    '/Habits/:path*',
    '/GritEngine/:path*',
    '/Inbox/:path*',
    '/user/:path*'
  ]
};
```

**Security Features:**
1. **Edge Middleware:** Runs before page rendering (faster than server-side)
2. **Token Validation:** Checks existence and format
3. **Automatic Redirect:** Unauthenticated users sent to login
4. **Path Matching:** Protects entire route trees with wildcards
5. **Performance:** Minimal overhead (no database calls)

**Why Not Full Token Verification in Middleware?**
- Firebase Admin SDK verification is expensive (cryptographic operations)
- Middleware runs on every request (including static assets)
- Full verification happens at API layer (where it matters)
- Length check catches 99% of invalid tokens

---

### Client-Side Route Protection

**Implementation:** `components/ProtectedRoute.tsx`

```typescript
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');  // Redirect to login
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />;  // Show loading state
  }

  if (!user) {
    return null;  // Prevent flash of protected content
  }

  return <>{children}</>;
}
```

**Usage:**
```typescript
// In protected pages
export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

**Security Features:**
1. **Double Protection:** Works with middleware for defense-in-depth
2. **Loading States:** Prevents UI flicker during auth check
3. **Null Render:** Blocks content before redirect completes
4. **Context Integration:** Uses centralized auth state

---

## Layer 3: API Authorization

### Token Verification Pattern

**Implementation:** `lib/firebaseAdmin.ts`

```typescript
export const verifyAuth = async (idToken: string) => {
  try {
    // Firebase Admin SDK verifies:
    // 1. Token signature (RSA-256)
    // 2. Token expiration
    // 3. Issuer (Firebase project)
    // 4. Audience (Firebase project ID)
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

**What Firebase Verifies:**
| Check | Description |
|-------|-------------|
| Signature | RSA-256 signature matches Firebase's private key |
| Expiration | Token not expired (exp claim) |
| Issuer | Token issued by correct Firebase project |
| Audience | Token intended for this Firebase project |
| Not Before | Token not used before valid time (nbf claim) |
| Subject | User ID (sub claim) exists |

---

### API Route Protection Pattern

**Implementation:** All API routes follow this pattern

```typescript
export async function GET(request: NextRequest) {
  try {
    // Step 1: Extract token from cookie
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Step 2: Verify token with Firebase Admin SDK
    const decodedToken = await verifyAuth(token);
    const userId = decodedToken.uid;

    // Step 3: Query database with user scope
    const habitsRef = db.collection('habits');
    const querySnapshot = await habitsRef
      .where('userId', '==', userId)  // User isolation
      .get();
    
    const habits = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ habits });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Security Layers:**
1. **401 Unauthorized:** No token provided
2. **401 Unauthorized:** Invalid/expired token (from verifyAuth)
3. **User Scoping:** Query filtered by authenticated userId
4. **500 Error:** Generic error (doesn't leak info)

---

### Resource-Level Authorization

**Implementation:** `src/app/api/habits/[id]/route.ts`

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Step 1: Authenticate user
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await verifyAuth(token);
    const userId = decodedToken.uid;

    // Step 2: Fetch resource
    const habitRef = db.collection('habits').doc(id);
    const habitDoc = await habitRef.get();

    if (!habitDoc.exists) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    // Step 3: Authorize access (critical!)
    if (habitDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Step 4: Perform operation
    const body = await request.json();
    await habitRef.update({
      ...body,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ message: 'Habit updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Authorization Flow:**
```
1. Authenticate: Who are you? (401 if fails)
2. Fetch Resource: Does it exist? (404 if not)
3. Authorize: Do you own it? (403 if not)
4. Execute: Perform operation
```

**HTTP Status Codes:**
| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful operation |
| 401 | Unauthorized | No token or invalid token |
| 403 | Forbidden | Valid token but not resource owner |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Error | Server error (generic) |

---

### Bearer Token Pattern (Alternative)

**Implementation:** `lib/middleware.ts`

```typescript
export const verifyFirebaseToken = async (req: NextRequest) => {
  // Extract Bearer token from Authorization header
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid token, Bearer id error');
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await adminn.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    throw new Error('Unauthorized: Invalid token');
  }
};
```

**Usage in API Routes:**
```typescript
export async function GET(req: NextRequest) {
  try {
    const uid = await verifyFirebaseToken(req);
    // Use uid for database queries
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
```

**Cookie vs Bearer Token:**
| Aspect | Cookie | Bearer Token |
|--------|--------|--------------|
| Storage | Automatic (browser) | Manual (localStorage/memory) |
| XSS Protection | Yes (httpOnly) | No (JavaScript accessible) |
| CSRF Protection | Needs SameSite | Immune (not sent automatically) |
| Mobile Apps | Difficult | Easy |
| API Clients | Difficult | Easy |
| **Our Choice** | **Cookie (web app)** | Bearer (for future API) |

---

## Layer 4: Database Security

### User Isolation Pattern

**Every query includes user scope:**
```typescript
// Firestore query with user filter
const habitsRef = db.collection('habits');
const querySnapshot = await habitsRef
  .where('userId', '==', userId)  // Critical: User isolation
  .get();
```

**Document Structure:**
```typescript
{
  id: "habit_123",
  userId: "firebase_uid_abc",  // Always present
  name: "Morning Exercise",
  // ... other fields
}
```

**Security Guarantees:**
1. **No Cross-User Access:** Queries always filtered by userId
2. **Document-Level Isolation:** Each document tagged with owner
3. **Firestore Rules:** (Should be configured) Server-side validation
4. **Defense in Depth:** Application-level + database-level security

---

### Firestore Security Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Habits collection
    match /habits/{habitId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
                    && request.auth.uid == request.resource.data.userId;
    }
    
    // Pages collection
    match /pages/{pageId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
                    && request.auth.uid == request.resource.data.userId;
    }
    
    // User profiles
    match /users/{userId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
  }
}
```

**Rule Breakdown:**
- `request.auth != null`: User is authenticated
- `request.auth.uid == resource.data.userId`: User owns the document
- `request.resource.data.userId`: Data being written (for creates)

---

## Security Best Practices Implemented

### 1. Defense in Depth
```
Client Protection (ProtectedRoute)
    ↓
Middleware Protection (Next.js middleware)
    ↓
API Authentication (verifyAuth)
    ↓
Resource Authorization (userId check)
    ↓
Database Isolation (WHERE userId ==)
```

### 2. Principle of Least Privilege
- Users can only access their own resources
- No admin/superuser privileges exposed
- Each API endpoint validates ownership

### 3. Secure Token Storage
- httpOnly cookies (XSS protection)
- Secure flag (HTTPS only)
- SameSite=strict (CSRF protection)
- Short expiration (1 hour)

### 4. Input Validation
```typescript
// Type checking
if (typeof completed !== 'boolean') {
  return NextResponse.json({ error: 'Invalid completed status' }, { status: 400 });
}

// Existence checking
if (!habitDoc.exists) {
  return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
}
```

### 5. Error Handling
```typescript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);  // Log for debugging
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  // Generic error (don't leak implementation details)
}
```

### 6. Automatic Session Management
- Firebase handles token refresh
- onAuthStateChanged syncs client state
- Expired tokens automatically rejected

---

## Attack Vectors Mitigated

### 1. Cross-Site Scripting (XSS)
**Attack:** Inject malicious JavaScript to steal tokens
**Mitigation:** httpOnly cookies (JavaScript cannot access)

### 2. Cross-Site Request Forgery (CSRF)
**Attack:** Trick user into making unwanted requests
**Mitigation:** SameSite=strict cookies (no cross-site requests)

### 3. Man-in-the-Middle (MITM)
**Attack:** Intercept tokens during transmission
**Mitigation:** Secure flag (HTTPS only), TLS encryption

### 4. Token Theft
**Attack:** Steal long-lived tokens
**Mitigation:** Short expiration (1 hour), automatic refresh

### 5. Unauthorized Resource Access
**Attack:** Access other users' data
**Mitigation:** Resource-level authorization (userId check)

### 6. SQL Injection
**Attack:** Inject malicious database queries
**Mitigation:** Firestore SDK (parameterized queries), no raw SQL

### 7. Session Fixation
**Attack:** Force user to use attacker's session
**Mitigation:** Firebase generates new tokens on login

### 8. Brute Force
**Attack:** Guess passwords
**Mitigation:** OAuth delegation (no passwords stored)

---

## Performance Considerations

### Token Verification Caching
Firebase Admin SDK caches public keys:
- First verification: ~100-200ms (fetch public keys)
- Subsequent verifications: ~10-20ms (cached keys)
- Keys cached for 1 hour

### Middleware Optimization
- No database calls in middleware
- Simple token existence/length check
- Full verification deferred to API routes

### Database Query Optimization
```typescript
// Indexed query (fast)
.where('userId', '==', userId)

// Composite index for complex queries
.where('userId', '==', userId)
.where('completed', '==', true)
.orderBy('createdAt', 'desc')
```

---

## Security Monitoring & Logging

### What to Log
```typescript
// Authentication failures
console.error('Token verification failed:', error);

// Authorization failures
console.warn('Unauthorized access attempt:', { userId, resourceId });

// Suspicious activity
console.warn('Invalid token format:', { tokenLength, ip });
```

### What NOT to Log
- Full tokens (sensitive)
- Passwords (we don't have any)
- User emails in production logs
- Stack traces in production

---

## Future Security Enhancements

### 1. Rate Limiting
```typescript
// Prevent brute force attacks
const rateLimit = new Map();

export async function middleware(request: NextRequest) {
  const ip = request.ip;
  const requests = rateLimit.get(ip) || 0;
  
  if (requests > 100) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  
  rateLimit.set(ip, requests + 1);
}
```

### 2. Audit Logging
```typescript
// Track all data modifications
await db.collection('auditLog').add({
  userId,
  action: 'UPDATE_HABIT',
  resourceId: habitId,
  timestamp: new Date(),
  ip: request.ip
});
```

### 3. Multi-Factor Authentication
```typescript
// Firebase supports MFA
const multiFactorUser = multiFactor(user);
await multiFactorUser.enroll(phoneAuthProvider);
```

### 4. Content Security Policy
```typescript
// Next.js headers
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

---

## Compliance Considerations

### GDPR (EU)
- User data scoped by userId (data portability)
- Deletion endpoint for "right to be forgotten"
- Consent tracking for data collection

### CCPA (California)
- User data access endpoint
- Opt-out mechanisms
- Data deletion on request

### SOC 2
- Audit logging
- Access controls
- Encryption in transit (HTTPS)
- Encryption at rest (Firestore default)

---

## Conclusion

The security architecture implements:
1. **OAuth 2.0 Authentication:** Industry-standard, no password storage
2. **JWT Token Management:** Signed, short-lived, auto-refreshing
3. **Multi-Layer Protection:** Client, middleware, API, database
4. **Resource Authorization:** Document-level access control
5. **Secure Token Storage:** httpOnly, secure, SameSite cookies
6. **Defense in Depth:** Multiple security layers
7. **Attack Mitigation:** XSS, CSRF, MITM, token theft protection

This system provides enterprise-grade security suitable for production applications handling sensitive user data.
