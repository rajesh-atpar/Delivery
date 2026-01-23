# 📊 Delivery App - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     DELIVERY APP SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────┐         ┌─────────────────────────┐
│   FRONTEND (React + Vite)    │         │  BACKEND (Django REST)  │
│   http://localhost:5173      │         │ http://localhost:8000   │
├─────────────────────────────┤         ├─────────────────────────┤
│                             │  HTTP   │                         │
│  ├─ AuthContext             │◄───────►│  ├─ Users App           │
│  ├─ Login/Register          │   JWT   │  ├─ Orders App          │
│  ├─ ProtectedRoute          │   API   │  ├─ Products App        │
│  ├─ Profile                 │◄───────►│  ├─ Cart Management     │
│  ├─ Orders                  │         │  └─ Admin Panel         │
│  ├─ Cart                    │         │                         │
│  └─ API Service Layer       │         │  ├─ PostgreSQL DB       │
│                             │         │  └─ JWT Auth            │
└─────────────────────────────┘         └─────────────────────────┘
        │                                         │
        └─────────────────┬─────────────────────┘
                          │
                  localStorage
                  (Auth Token)
```

---

## Authentication Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION FLOW                         │
└──────────────────────────────────────────────────────────────┘

START: User Visits App
│
├─ App Loads
├─ AuthContext checks localStorage for token
│
├─ TOKEN FOUND?
│  ├─ YES → App Initializes with Auth ✅
│  └─ NO → User is Anonymous ❌
│
├─ User Clicks Profile Icon
│
├─ Is Authenticated?
│  ├─ YES → Show Profile Page ✅
│  └─ NO → Redirect to Login ❌
│
├─ User Enters Email/Password
├─ POST /api/auth/login
│
├─ Backend Validates Credentials
│  ├─ VALID → Return {token, user} ✅
│  └─ INVALID → Return Error ❌
│
├─ Frontend Receives Token
├─ Store in localStorage
├─ Update AuthContext
├─ Redirect to Profile
│
├─ All Future Requests
├─ Include: Authorization: Bearer {token}
├─ Backend Validates Token
│  ├─ VALID → Process Request ✅
│  └─ EXPIRED → Return 401 ❌
│
├─ User Clicks Logout
├─ Clear localStorage
├─ Clear AuthContext
├─ Redirect to Home
│
END: User is Anonymous Again
```

---

## Mobile vs Desktop Responsive Flow

```
┌─────────────────────────────────────────────────────────────┐
│            RESPONSIVE NAVIGATION LOGIC                      │
└─────────────────────────────────────────────────────────────┘

Viewport Width?

    < 768px (MOBILE)              ≥ 768px (DESKTOP)
    ├─ Bottom Nav: SHOW           ├─ Bottom Nav: HIDE
    ├─ Top Navbar: HIDE           ├─ Top Navbar: SHOW
    ├─ 4 Sections at bottom:      ├─ Menu in navbar:
    │  ├─ 🏠 Home                 │  ├─ Logo
    │  ├─ 📋 Orders (*)           │  ├─ Location
    │  ├─ 🛒 Cart                 │  ├─ Search/Menu
    │  └─ 👤 Profile (*)          │  └─ Profile Icon
    └─ Fixed at bottom            └─ Sticky at top

(*) = Protected Route
    Not logged in? → Redirect to /login
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE SCHEMA                            │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────────┐
│    CustomUser        │         │      Order              │
├──────────────────────┤         ├──────────────────────────┤
│ id (PK)              │◄────────│ id (PK)                 │
│ email (UNIQUE)       │ 1    ∞  │ user_id (FK)            │
│ password (HASHED)    │         │ order_number (UNIQUE)   │
│ first_name           │         │ status                  │
│ last_name            │         │ items (JSON)            │
│ phone                │         │ total_amount            │
│ address              │         │ tax                     │
│ address_lat/lng      │         │ delivery_fee            │
│ is_verified          │         │ delivery_address        │
│ created_at           │         │ delivery_lat/lng        │
│ updated_at           │         │ estimated_delivery      │
└──────────────────────┘         │ delivered_at            │
         △                        │ payment_method          │
         │                        │ payment_status          │
         │                        │ tracking_info (JSON)    │
         │                        │ notes                   │
    1:1 Extended                 │ created_at              │
    Relationship                 │ updated_at              │
         │                        └──────────────────────────┘
┌────────┴────────┐
│  UserProfile    │              ┌──────────────────────────┐
├─────────────────┤              │  OrderTracking          │
│ user_id (FK)    │              ├──────────────────────────┤
│ profile_picture │              │ id (PK)                 │
│ rating          │              │ order_id (FK)      ◄────┤
│ total_orders    │              │ status                  │
│ is_active       │              │ message                 │
│ addresses (JSON)│              │ location (JSON)         │
└─────────────────┘              │ timestamp               │
                                 └──────────────────────────┘
```

---

## API Request/Response Flow

```
┌─────────────────────────────────────────────────────────────┐
│              API COMMUNICATION DIAGRAM                      │
└─────────────────────────────────────────────────────────────┘

CLIENT (React)                    SERVER (Django)

1. LOGIN REQUEST
├─ POST /api/auth/login           ────────────────►
├─ Body: {email, password}        

                                  ◄──────────────────
                                  Response: {
                                    token: "jwt...",
                                    user: {...}
                                  }

2. AUTHENTICATED REQUEST
├─ GET /api/orders
├─ Header: Authorization: Bearer {token}  ────►

                                  ◄──────────────────
                                  Response: {
                                    orders: [...]
                                  }

3. PROTECTED ROUTE CHECK
├─ ProtectedRoute checks          ────────────────►
├─ isAuthenticated = true?
├─ token in localStorage?

                                  ◄──────────────────
                                  Allow / Redirect
```

---

## Component Hierarchy

```
┌──────────────────────────────────────────────────────────┐
│                        App.jsx                           │
│              (AuthProvider Wrapper)                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
├─► AuthContext (Global State)                            │
│   ├─ user                                               │
│   ├─ token                                              │
│   ├─ isAuthenticated                                    │
│   └─ login/logout functions                            │
│                                                          │
├─► Navbar (Desktop Only)                                 │
│   ├─ Logo                                               │
│   ├─ Location                                           │
│   └─ Profile Icon                                       │
│                                                          │
├─► Routes                                                │
│   ├─ / → Home                                           │
│   ├─ /login → Login                                     │
│   ├─ /products → Products                               │
│   ├─ /categories → Categories                           │
│   ├─ /cart → Cart                                       │
│   ├─ /orders → ProtectedRoute → Orders                  │
│   ├─ /profile → ProtectedRoute → Profile                │
│   │   ├─ EditProfile                                    │
│   │   ├─ ChangePassword                                 │
│   │   ├─ NotificationSettings                           │
│   │   └─ PrivacySettings                                │
│   ├─ /about → About                                     │
│   ├─ /contact → Contact                                 │
│   └─ /admin → Admin                                     │
│                                                          │
├─► BottomNavigation (Mobile Only)                        │
│   ├─ Home Link                                          │
│   ├─ Orders Link (Protected)                            │
│   ├─ Cart Link                                          │
│   └─ Profile Link (Protected)                           │
│                                                          │
└─► Footer                                                │
    └─ Links & Info                                       │
```

---

## User Journey Mapping

```
┌───────────────────────────────────────────────────────────────┐
│                    USER JOURNEY MAP                           │
└───────────────────────────────────────────────────────────────┘

SCENARIO 1: NEW USER JOURNEY
├─ Visit App (/) [Anonymous]
├─ Browse Products (GET /products)
├─ Click Profile Icon → Redirected to /login
├─ Register (POST /api/auth/register)
├─ Login (POST /api/auth/login)
├─ Redirect to /profile
├─ View Profile Details (GET /api/me)
├─ Create Order (POST /api/orders)
├─ View Orders (GET /api/orders)
├─ Track Order (GET /api/orders/{id})
└─ Logout (Clear Token)

SCENARIO 2: RETURNING USER JOURNEY
├─ Visit App (/)
├─ Token in localStorage? YES
├─ App Initializes with Auth
├─ Click Profile Icon → /profile
├─ View Profile & Orders
├─ Click Order → View Details
├─ Manage Account (Edit Profile, Change Password, etc.)
└─ Logout when done

SCENARIO 3: MOBILE DELIVERY
├─ Open App on Mobile (< 768px)
├─ Bottom Navigation Shows (🏠 📋 🛒 👤)
├─ Browse Home (/)
├─ Click Cart Icon → /cart
├─ Click Orders Icon → /orders (if authenticated)
├─ Click Profile Icon → /profile (if authenticated)
└─ All with fixed bottom nav always visible
```

---

## Error Handling Flow

```
┌──────────────────────────────────────────────────────────┐
│                   ERROR HANDLING FLOW                    │
└──────────────────────────────────────────────────────────┘

API Request Fails?
│
├─ 401 Unauthorized (Token Invalid/Expired)
│  ├─ Clear localStorage
│  ├─ Clear AuthContext
│  ├─ Redirect to /login
│  └─ Show error message
│
├─ 403 Forbidden (User Not Authorized)
│  ├─ Show "You don't have permission"
│  └─ Redirect to /
│
├─ 404 Not Found (Resource Missing)
│  ├─ Show "Order not found"
│  └─ Redirect to /orders
│
├─ 500 Server Error
│  ├─ Log error to console
│  ├─ Show "Server error, try again"
│  └─ Allow retry
│
└─ Network Error (No Internet)
   ├─ Show "No connection"
   └─ Allow offline browsing (if cached)
```

---

## State Management

```
┌──────────────────────────────────────────────────────┐
│            AUTH STATE MANAGEMENT                     │
└──────────────────────────────────────────────────────┘

AuthContext (Global)
├─ State
│  ├─ user: {
│  │  ├─ id
│  │  ├─ email
│  │  ├─ first_name
│  │  ├─ last_name
│  │  ├─ phone
│  │  ├─ address
│  │  └─ is_active
│  ├─ token: "jwt..."
│  ├─ isAuthenticated: boolean
│  └─ isLoading: boolean
│
└─ Functions
   ├─ login(user, token)
   │  ├─ Set user state
   │  ├─ Set token state
   │  ├─ Save to localStorage
   │  └─ Set isAuthenticated = true
   │
   ├─ logout()
   │  ├─ Clear user state
   │  ├─ Clear token
   │  ├─ Remove from localStorage
   │  └─ Set isAuthenticated = false
   │
   └─ updateUser(data)
      ├─ Update user state
      └─ Save to localStorage

localStorage
├─ authToken: "jwt..."
└─ userData: {user object}
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│              PRODUCTION DEPLOYMENT                     │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐
│   User Browser   │
│  (Vercel CDN)    │  ← Frontend (React)
└────────┬─────────┘
         │ HTTPS
         │
┌────────▼──────────────────────────────┐
│      API Gateway / Load Balancer      │
├───────────────────────────────────────┤
│   (AWS API Gateway / Nginx)           │
└────────┬──────────────────────────────┘
         │ HTTPS
         │
┌────────▼──────────────────────────────┐
│    Django REST Backend (Server Farm)  │
├───────────────────────────────────────┤
│  ├─ users app                         │
│  ├─ orders app                        │
│  └─ auth system                       │
└────────┬──────────────────────────────┘
         │ Internal
         │
┌────────▼──────────────────────────────┐
│    PostgreSQL Database Cluster        │
├───────────────────────────────────────┤
│  ├─ users table                       │
│  ├─ orders table                      │
│  ├─ tracking table                    │
│  └─ backups                           │
└───────────────────────────────────────┘

Deployment Platforms:
├─ Frontend: Vercel, Netlify, GitHub Pages
├─ Backend: Heroku, AWS, DigitalOcean, Railway
└─ Database: AWS RDS, Heroku Postgres, Cloud SQL
```

---

This comprehensive diagram set shows:
✅ System architecture
✅ Authentication flow
✅ Responsive design logic
✅ Database schema
✅ Component hierarchy
✅ User journeys
✅ Error handling
✅ State management
✅ Deployment setup
