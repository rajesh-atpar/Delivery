# 📦 Products Table Setup Guide

This guide will help you create the products table in Supabase to store all your products.

## Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**

## Step 2: Run the SQL Script

1. Open the file `SUPABASE_PRODUCTS_TABLE.sql` in this project
2. Copy the entire SQL script
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

You should see: **Success. No rows returned**

## Step 3: Verify Table Creation

Run this query to verify:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products';
```

You should see all the columns:
- id (uuid)
- name (text)
- price (numeric)
- image (text)
- category (text)
- description (text)
- stock_quantity (integer)
- is_active (boolean)
- created_at (timestamp)
- updated_at (timestamp)

## Step 4: Test the Integration

1. Make sure your `.env` file has Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

3. Go to Admin page: `http://localhost:5173/admin/login`
4. Login as admin
5. Click "Add Product"
6. Fill in the form and save
7. Check Supabase Table Editor → **products** table
8. Your product should appear there!

## Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | Product name (required) |
| `price` | DECIMAL(10,2) | Product price (required) |
| `image` | TEXT | Product image URL (required) |
| `category` | TEXT | Product category (required) |
| `description` | TEXT | Product description (optional) |
| `stock_quantity` | INTEGER | Available stock (default: 0) |
| `is_active` | BOOLEAN | Whether product is active (default: true) |
| `created_at` | TIMESTAMP | When product was created (auto) |
| `updated_at` | TIMESTAMP | When product was last updated (auto) |

## Security Features

✅ **Row Level Security (RLS)** enabled
✅ **Public users** can only view active products
✅ **Authenticated users** can view all products
✅ **Authenticated users** can create, update, and delete products

## Optional: Restrict to Admin Users Only

If you want only specific admin users to manage products, uncomment and run the admin_users table section in the SQL file, then update the policies accordingly.

## Troubleshooting

### Error: "permission denied for table products"
- Make sure you ran the RLS policies in the SQL script
- Check that you're authenticated when accessing admin page

### Error: "relation 'products' does not exist"
- Make sure you ran the CREATE TABLE statement
- Check that you're in the correct database

### Products not showing in admin
- Check browser console for errors
- Verify Supabase credentials in `.env` file
- Make sure you're logged in as admin

---

**Need Help?** Check the SQL file comments for more details.
