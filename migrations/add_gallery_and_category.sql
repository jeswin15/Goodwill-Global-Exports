-- =====================================================
-- Database Migration: Add Gallery and Category Columns
-- =====================================================
-- Target: Render PostgreSQL (export_em4r)
-- Purpose: Add missing columns to existing tables
-- =====================================================

-- Add gallery column to products table
-- This allows storing multiple product images
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS gallery text[];

-- Add category column to blogs table  
-- This categorizes blog posts (Industry Trends, Market Analysis, etc.)
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'General';

-- =====================================================
-- Verification Queries (run after migration)
-- =====================================================

-- Check products table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Check blogs table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'blogs'
ORDER BY ordinal_position;

-- Count existing records (should remain unchanged)
SELECT 
  (SELECT COUNT(*) FROM products) as product_count,
  (SELECT COUNT(*) FROM blogs) as blog_count;
