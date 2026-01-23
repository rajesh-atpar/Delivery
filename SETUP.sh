#!/bin/bash
# Delivery App - Complete Setup Script

echo "========================================="
echo "  Delivery App Setup"
echo "========================================="

# Frontend Setup
echo ""
echo "1. Installing Frontend Dependencies..."
cd deliveryapp
npm install
echo "✓ Frontend dependencies installed"

# Backend Setup
echo ""
echo "2. Creating Backend Directory..."
mkdir -p ../delivery_backend
cd ../delivery_backend

echo ""
echo "3. Creating Python Virtual Environment..."
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

echo ""
echo "4. Installing Backend Dependencies..."
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt python-dotenv psycopg2-binary pillow

echo ""
echo "5. Creating Django Project..."
django-admin startproject delivery_backend .
python manage.py startapp users
python manage.py startapp orders

echo ""
echo "6. Creating Database (PostgreSQL)..."
echo "   Note: Make sure PostgreSQL is installed and running"
createdb delivery_db

echo ""
echo "7. Running Migrations..."
python manage.py migrate

echo ""
echo "8. Creating Superuser..."
python manage.py createsuperuser

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "Frontend: npm run dev (from deliveryapp/)"
echo "Backend:  python manage.py runserver"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000"
echo "API:      http://localhost:8000/api"
echo "Admin:    http://localhost:8000/admin"
echo ""
