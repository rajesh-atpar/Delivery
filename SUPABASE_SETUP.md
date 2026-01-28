# 🚀 Supabase Setup Guide

This guide will help you set up Supabase for user authentication and data storage.

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: delivery-app (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be created (takes 1-2 minutes)

## Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Create Environment File

1. In your project root (`d:\Client Project\Delivery`), create a file named `.env`
2. Add the following content:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from Step 2.

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Create Profiles Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Paste the following SQL:

```sql
-- Create profiles table to store user details
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, address)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call function on new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned"

## Step 5: Create Orders Table (Optional - for order history)

If you want to store orders in Supabase, run this SQL:

```sql
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'in_transit', 'delivered', 'cancelled')),
  items JSONB NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own orders
CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own orders
CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);
```

## Step 6: Restart Development Server

1. Stop your current dev server (Ctrl+C)
2. Restart it:

```bash
npm run dev
```

## Step 7: Test the Integration

1. Open your app: `http://localhost:5173`
2. Click on Profile icon → Should redirect to Login
3. Click "Sign up" link
4. Fill in the registration form:
   - First Name
   - Last Name
   - Email
   - Phone (optional)
   - Address (optional)
   - Password
   - Confirm Password
5. Click "Sign Up"
6. You should be automatically logged in and redirected to Profile page
7. Your user data should be displayed

## Verification

### Check in Supabase Dashboard:

1. Go to **Authentication** → **Users**
   - You should see your registered user

2. Go to **Table Editor** → **profiles**
   - You should see your user profile with all details

## Troubleshooting

### Issue: "Supabase URL and Anon Key are required"

**Solution:** Make sure your `.env` file exists in the project root and contains:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Issue: "Invalid API key"

**Solution:** 
- Double-check your API keys in `.env` file
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing `.env`

### Issue: "Profile not found" error

**Solution:**
- Make sure you ran the SQL script to create the profiles table
- Check that the trigger function was created successfully
- Try registering a new user (the trigger should create profile automatically)

### Issue: "Row Level Security policy violation"

**Solution:**
- Make sure you created all the RLS policies in Step 4
- Check that the user is authenticated before accessing data

## Security Notes

✅ **Row Level Security (RLS)** is enabled - users can only access their own data
✅ **API keys** are safe to use in frontend (anon key is public by design)
✅ **User passwords** are hashed and stored securely by Supabase
✅ **Sessions** are managed automatically by Supabase

## Next Steps

- ✅ User registration and login working
- ✅ User profile data stored in Supabase
- ✅ Profile page displays user details
- 🔄 Add order history functionality
- 🔄 Add email verification (optional)
- 🔄 Add password reset functionality

---

**Need Help?** Check Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
