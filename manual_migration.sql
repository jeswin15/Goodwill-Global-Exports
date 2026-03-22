-- Manual Database Migration Script
-- Run this SQL directly in your Render PostgreSQL database dashboard

-- Add gallery column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS gallery text[];

-- Add category column to blogs table  
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'General';

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name IN ('products', 'blogs')
ORDER BY table_name, ordinal_position;
