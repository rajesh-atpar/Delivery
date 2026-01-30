-- ============================================
-- SUPABASE PERFORMANCE OPTIMIZATION INDEXES
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- to improve query performance
-- ============================================

-- Products table indexes
-- Index on is_active for faster filtering (already exists, but ensure it's there)
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Index on category for faster category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Composite index for common query pattern (active products by category)
CREATE INDEX IF NOT EXISTS idx_products_active_category ON products(is_active, category) WHERE is_active = true;

-- Index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Full-text search index for product names (for faster search)
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('english', name));

-- Categories table indexes
-- Index on is_active (already exists, but ensure it's there)
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Index on name for faster lookups (already exists, but ensure it's there)
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Verify indexes
SELECT 
  tablename, 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename IN ('products', 'categories')
ORDER BY tablename, indexname;
