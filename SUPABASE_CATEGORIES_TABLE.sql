-- ============================================
-- SUPABASE CATEGORIES TABLE SETUP
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Create index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active categories (for public category listing)
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can view all categories (including inactive)
CREATE POLICY "Authenticated users can view all categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can insert categories
-- Note: In production, you might want to restrict this to admin users only
CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update categories
CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete categories
CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on category update
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- Insert default categories (or update if they exist)
INSERT INTO categories (name, image, is_active) VALUES
  ('Fruits', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop', true),
  ('Vegetables', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop', true),
  ('Non-Vegetables', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop', true),
  ('Cereal Grains & Pulses', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', true),
  ('Other Groceries', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400&h=400&fit=crop', true),
  ('Cleansing Products', 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400&h=400&fit=crop', true)
ON CONFLICT (name) DO UPDATE SET 
  image = EXCLUDED.image,
  is_active = EXCLUDED.is_active;

-- Update any existing categories with empty images to have default images
UPDATE categories 
SET image = CASE 
  WHEN name = 'Fruits' THEN 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop'
  WHEN name = 'Vegetables' THEN 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop'
  WHEN name = 'Non-Vegetables' THEN 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop'
  WHEN name = 'Cereal Grains & Pulses' THEN 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
  WHEN name = 'Other Groceries' THEN 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400&h=400&fit=crop'
  WHEN name = 'Cleansing Products' THEN 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400&h=400&fit=crop'
  ELSE 'https://via.placeholder.com/400?text=Category'
END
WHERE image IS NULL OR image = '';
