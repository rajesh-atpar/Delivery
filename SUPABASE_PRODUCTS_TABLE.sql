-- ============================================
-- SUPABASE PRODUCTS TABLE SETUP
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active products (for public product listing)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can view all products (including inactive)
CREATE POLICY "Authenticated users can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can insert products
-- Note: In production, you might want to restrict this to admin users only
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update products
CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete products
CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on product updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- OPTIONAL: Create admin_users table for admin-only access
-- ============================================
-- If you want to restrict product management to specific admin users only

-- CREATE TABLE IF NOT EXISTS admin_users (
--   id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
--   email TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
-- );

-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Admin users can view admin_users"
--   ON admin_users FOR SELECT
--   TO authenticated
--   USING (true);

-- Then update product policies to check admin_users:
-- DROP POLICY "Authenticated users can insert products" ON products;
-- CREATE POLICY "Only admins can insert products"
--   ON products FOR INSERT
--   TO authenticated
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM admin_users WHERE id = auth.uid()
--     )
--   );

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- INSERT INTO products (name, price, image, category, description, stock_quantity)
-- VALUES
--   ('Fresh Organic Apples', 99.00, 'https://plus.unsplash.com/premium_photo-1667049292983-d2524dd0ef08?q=80&w=1149&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Fruits', 'Fresh organic apples from local farms', 50),
--   ('Fresh Tomatoes', 69.00, 'https://plus.unsplash.com/premium_photo-1724849418331-97502da20f86?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAzfHZmcmVzaCUyMHRvbWF0b3xlbnwwfHwwfHx8MA%3D%3D', 'Vegetables', 'Fresh red tomatoes', 30),
--   ('Premium Rice 5kg', 259.00, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', 'Grains', 'Premium quality rice 5kg pack', 20);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the table was created correctly:

-- Check table structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'products';

-- Check policies
-- SELECT * FROM pg_policies WHERE tablename = 'products';

-- Check if trigger exists
-- SELECT * FROM pg_trigger WHERE tgname = 'update_products_updated_at';
