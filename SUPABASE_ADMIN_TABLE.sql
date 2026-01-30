-- Create admin table for storing admin credentials
-- This table stores admin users with their login credentials

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access (for login verification)
CREATE POLICY "Allow read admin users"
  ON admin_users
  FOR SELECT
  USING (true);

-- Create policy to allow update (for password reset)
-- Note: In production, restrict this to specific conditions
CREATE POLICY "Allow update admin users"
  ON admin_users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy for insert (for creating new admin users)
CREATE POLICY "Allow insert admin users"
  ON admin_users
  FOR INSERT
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Insert default admin user (password: admin123)
-- IMPORTANT: Replace the password_hash below with a real bcrypt hash
-- 
-- To generate the hash:
-- 1. Use online tool: https://bcrypt-generator.com/ (rounds: 10, password: admin123)
-- 2. Or use Node.js script: node CREATE_ADMIN_PASSWORD_HASH.js
-- 3. Or use this SQL function (if pgcrypto extension is enabled):
--    SELECT crypt('admin123', gen_salt('bf', 10));
--
-- Example hash for "admin123" (bcrypt, 10 rounds):
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
--
INSERT INTO admin_users (username, email, password_hash, is_active)
VALUES (
  'admin',
  'admin@puscart.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Replace with your generated hash
  true
)
ON CONFLICT (username) DO UPDATE 
SET password_hash = EXCLUDED.password_hash,
    updated_at = TIMEZONE('utc'::text, NOW());

-- To add more admin users:
-- INSERT INTO admin_users (username, email, password_hash, is_active)
-- VALUES ('admin2', 'admin2@puscart.com', 'YOUR_BCRYPT_HASH_HERE', true);

COMMENT ON TABLE admin_users IS 'Stores admin user credentials for authentication';
COMMENT ON COLUMN admin_users.password_hash IS 'BCrypt hashed password';
COMMENT ON COLUMN admin_users.is_active IS 'Whether the admin account is active';
