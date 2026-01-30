-- ============================================
-- UPDATE CATEGORY IMAGES SCRIPT
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- to update existing categories with proper images
-- ============================================

-- Update categories with proper image URLs
UPDATE categories 
SET image = CASE 
  WHEN name = 'Fruits' THEN 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop'
  WHEN name = 'Vegetables' THEN 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop'
  WHEN name = 'Non-Vegetables' THEN 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop'
  WHEN name = 'Cereal Grains & Pulses' THEN 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
  WHEN name = 'Other Groceries' THEN 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400&h=400&fit=crop'
  WHEN name = 'Cleansing Products' THEN 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400&h=400&fit=crop'
  ELSE image
END
WHERE image IS NULL OR image = '' OR image IS NOT DISTINCT FROM '';

-- Verify the update
SELECT name, image, is_active FROM categories ORDER BY name;
