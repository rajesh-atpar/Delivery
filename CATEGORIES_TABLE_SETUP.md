# 📦 Categories Table Setup Guide

This guide will help you set up the categories table in Supabase for managing product categories.

## Step 1: Create Categories Table in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click "New query"
4. Open the file `SUPABASE_CATEGORIES_TABLE.sql` from your project root
5. Copy and paste the entire SQL script into the SQL Editor
6. Click "Run" to execute the SQL
7. You should see "Success. No rows returned"

## Step 2: Verify Table Creation

1. Go to **Table Editor** in Supabase dashboard
2. You should see a new table called `categories`
3. The table should have the following columns:
   - `id` (UUID, Primary Key)
   - `name` (Text, Unique)
   - `image` (Text)
   - `is_active` (Boolean)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

## Step 3: Verify Default Categories

After running the SQL script, you should see 6 default categories:
- Fruits
- Vegetables
- Non-Vegetables
- Cereal Grains & Pulses
- Other Groceries
- Cleansing Products

## Step 4: Test Category Management

1. Log in to your admin panel
2. Click on the **Categories** tab
3. You should see all categories listed
4. Try adding a new category:
   - Click "Add Category"
   - Enter category name
   - Enter image URL
   - Check/uncheck "Active" checkbox
   - Click "Add Category"
5. Try editing a category:
   - Click the edit icon (pencil) next to any category
   - Modify the details
   - Click "Update Category"
6. Try deleting a category:
   - Click the delete icon (trash) next to any category
   - Confirm deletion

## Features

✅ **Add Categories**: Admins can add new categories with name and image
✅ **Edit Categories**: Update category name, image, and active status
✅ **Delete Categories**: Remove categories from the database
✅ **Active/Inactive Status**: Control which categories are visible to users
✅ **Automatic Updates**: Categories are automatically fetched and displayed on the frontend

## API Functions

The following API functions are available in `src/services/api.js`:

- `categoriesAPI.getAllCategories()` - Get all active categories (for public)
- `categoriesAPI.getAllCategoriesAdmin()` - Get all categories including inactive (for admin)
- `categoriesAPI.getCategoryById(id)` - Get a specific category
- `categoriesAPI.createCategory(data)` - Create a new category
- `categoriesAPI.updateCategory(id, data)` - Update an existing category
- `categoriesAPI.deleteCategory(id)` - Delete a category

## Security

- Row Level Security (RLS) is enabled
- Public users can only view active categories
- Authenticated users (admins) can view, create, update, and delete categories

## Troubleshooting

### Issue: "Table does not exist"
**Solution:** Make sure you ran the SQL script in Step 1

### Issue: "Permission denied"
**Solution:** Check that RLS policies are created correctly in the SQL script

### Issue: Categories not showing on frontend
**Solution:** 
- Check browser console for errors
- Verify categories are marked as `is_active = true`
- Check that the API is returning data correctly

### Issue: Cannot add/edit categories
**Solution:**
- Make sure you're logged in as admin
- Check that you have authentication token
- Verify RLS policies allow authenticated users to insert/update

---

**Need Help?** Check Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
