# Admin Database Setup Guide

This guide will help you set up the admin user table in your Supabase database and configure password authentication.

## Step 1: Generate Password Hash

Before inserting the admin user, you need to generate a bcrypt hash for the password.

### Option 1: Using Online Tool (Easiest)
1. Go to https://bcrypt-generator.com/
2. Enter password: `admin123`
3. Set rounds: `10`
4. Click "Generate Hash"
5. Copy the generated hash

### Option 2: Using Node.js Script
1. Install bcryptjs: `npm install bcryptjs`
2. Run the script: `node CREATE_ADMIN_PASSWORD_HASH.js`
3. Copy the generated hash from the output

### Option 3: Using SQL (if pgcrypto extension is enabled)
```sql
SELECT crypt('admin123', gen_salt('bf', 10));
```

## Step 2: Create Admin Table

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New query**
4. Copy and paste the entire contents of `SUPABASE_ADMIN_TABLE.sql`
5. **IMPORTANT**: Replace the placeholder hash in the INSERT statement with your generated hash from Step 1
6. Click **Run** to execute the query

## Step 3: Verify Table Creation

Run this query to verify the table was created:

```sql
SELECT * FROM admin_users;
```

You should see the admin user with username "admin" and email "admin@puscart.com".

## Step 4: Test Admin Login

1. Go to `/admin/login` in your app
2. Use credentials:
   - Username: `admin`
   - Password: `admin123`
3. You should be able to log in successfully

## Step 5: Test Forgot Password

1. Click "Forgot Password?" on the admin login page
2. Enter the admin email: `admin@puscart.com`
3. The system will verify the email exists in the database
4. Enter a new password and confirm it
5. The password will be updated in the database

## Adding More Admin Users

To add additional admin users:

1. Generate a bcrypt hash for the new password
2. Run this SQL:

```sql
INSERT INTO admin_users (username, email, password_hash, is_active)
VALUES (
  'newadmin',
  'newadmin@puscart.com',
  'YOUR_BCRYPT_HASH_HERE',
  true
);
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Password Hashing**: Passwords are stored as bcrypt hashes, not plain text
2. **Production**: In production, password verification should be done server-side using Supabase Edge Functions
3. **RLS Policies**: The table has Row Level Security enabled. Adjust policies as needed for your use case
4. **Service Role**: For production, use Supabase service role key for admin operations (never expose in frontend)

## Troubleshooting

### Issue: "Invalid username or password"
- Check that the password hash in the database matches the password you're trying to use
- Verify the admin user exists: `SELECT * FROM admin_users WHERE username = 'admin';`
- Make sure `is_active` is `true`

### Issue: "Admin email not found" (Forgot Password)
- Verify the email exists: `SELECT * FROM admin_users WHERE email = 'your-email@example.com';`
- Check that `is_active` is `true`

### Issue: "Failed to reset password"
- Check that the email matches exactly (case-sensitive)
- Verify database connection
- Check browser console for detailed error messages

## Next Steps

- ✅ Admin table created
- ✅ Admin login connected to database
- ✅ Forgot password saves to database
- 🔄 Consider implementing Supabase Edge Function for secure password verification
- 🔄 Add email notifications for password resets
- 🔄 Add password strength requirements
