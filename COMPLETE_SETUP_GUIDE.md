# 🚀 Delivery App - Complete Setup Guide

## Windows Users - Step by Step Guide

---

## Part 1: Frontend Setup (React + Vite)

### Step 1: Navigate to Project
```bash
cd "d:\Client Project\deliveryapp"
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```
This will install:
- React 19
- React Router v7
- React Icons
- Vite
- Tailwind CSS
- ESLint

### Step 3: Start Frontend Development Server
```bash
npm run dev
```

Your frontend will be available at: **http://localhost:5173**

---

## Part 2: Backend Setup (Django + PostgreSQL)

### Step 1: Install PostgreSQL (if not already installed)
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer and remember the password for `postgres` user
3. Add PostgreSQL to PATH (installer does this automatically)

Verify installation:
```bash
psql --version
```

### Step 2: Create Backend Folder
```bash
cd "d:\Client Project"
mkdir delivery_backend
cd delivery_backend
```

### Step 3: Create Virtual Environment
```bash
python -m venv venv
```

### Step 4: Activate Virtual Environment
```bash
venv\Scripts\activate
```

You should see `(venv)` in your terminal now.

### Step 5: Install Backend Dependencies
```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt python-dotenv psycopg2-binary pillow
```

### Step 6: Create Django Project
```bash
django-admin startproject delivery_backend .
python manage.py startapp users
python manage.py startapp orders
```

### Step 7: Create Database
Open PostgreSQL Command Line (pgAdmin or psql):
```sql
CREATE DATABASE delivery_db;
```

Or via command line:
```bash
psql -U postgres -c "CREATE DATABASE delivery_db;"
```

### Step 8: Configure Django Settings
Edit `delivery_backend/settings.py`:

```python
# Add to INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    'users',
    'orders',
]

# Add middleware (order matters)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Database Configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'delivery_db',
        'USER': 'postgres',
        'PASSWORD': 'your_postgres_password_here',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Set Custom User Model
AUTH_USER_MODEL = 'users.CustomUser'

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}
```

### Step 9: Create Models
Replace the content of `users/models.py` with models from `DJANGO_MODELS.md`
Replace the content of `orders/models.py` with models from `DJANGO_MODELS.md`

### Step 10: Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 11: Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### Step 12: Create Serializers
Create `users/serializers.py`:
```python
from rest_framework import serializers
from django.contrib.auth import get_user_model
from orders.models import Order

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'address', 'username', 'is_active']
        read_only_fields = ['id']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'status', 'items', 'total_amount', 'delivery_address', 'created_at', 'tracking_info']
        read_only_fields = ['id', 'order_number', 'created_at']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'phone']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
```

### Step 13: Create Views
Create `users/views.py`:
```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import UserSerializer, LoginSerializer, RegisterSerializer
from orders.models import Order
from orders.serializers import OrderSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user details"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Login user"""
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            username=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        
        if not user:
            return Response(
                {'detail': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Register new user"""
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Logout user (client should delete token)"""
        return Response({'detail': 'Logout successful'})
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_orders(self, request):
        """Get current user's orders"""
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response({'orders': serializer.data})
```

Create `orders/views.py`:
```python
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own orders"""
        return Order.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Create order for current user"""
        serializer.save(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        """List user's orders"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({'orders': serializer.data})
```

### Step 14: Create URLs
Edit `users/urls.py`:
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('login', UserViewSet.as_view({'post': 'login'}), name='login'),
    path('register', UserViewSet.as_view({'post': 'register'}), name='register'),
    path('me', UserViewSet.as_view({'get': 'me'}), name='me'),
    path('logout', UserViewSet.as_view({'post': 'logout'}), name='logout'),
]
```

Edit `orders/urls.py`:
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]
```

Edit `delivery_backend/urls.py`:
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('orders.urls')),
]
```

### Step 15: Run Backend Server
```bash
python manage.py runserver
```

Backend will run at: **http://localhost:8000**
API will be at: **http://localhost:8000/api/**
Admin panel: **http://localhost:8000/admin**

---

## Testing the Setup

### Test 1: Register New User
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"first_name\":\"John\",\"last_name\":\"Doe\",\"phone\":\"+1234567890\"}"
```

### Test 2: Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

Save the token from the response.

### Test 3: Get User Profile
```bash
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Running Both Servers

**Terminal 1 - Frontend:**
```bash
cd "d:\Client Project\deliveryapp"
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd "d:\Client Project\delivery_backend"
venv\Scripts\activate
python manage.py runserver
```

Now open: **http://localhost:5173**

---

## 🎉 You're All Set!

Your delivery app is now running with:
- ✅ React frontend with mobile & desktop views
- ✅ Django REST API with JWT authentication
- ✅ PostgreSQL database
- ✅ User authentication flow
- ✅ Protected routes (Profile, Orders)
- ✅ Bottom navigation on mobile
- ✅ Top navbar on desktop

### Next Steps:
1. Test login/register
2. Create test orders
3. Check mobile responsiveness
4. Deploy to production

Good luck! 🚀
