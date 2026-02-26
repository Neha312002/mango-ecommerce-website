-- Update Product table to use TEXT type for large content fields
-- This allows storing base64 images and long descriptions

-- Note: In PostgreSQL, TEXT and VARCHAR are virtually identical in performance
-- but TEXT can store unlimited length, which is better for base64 images

-- No actual migration needed as PostgreSQL String already maps to TEXT
-- This is just documentation that the schema now explicitly uses @db.Text

-- If you want to ensure the columns are TEXT type, you can run:
-- ALTER TABLE "Product" ALTER COLUMN "description" TYPE TEXT;
-- ALTER TABLE "Product" ALTER COLUMN "details" TYPE TEXT;
-- ALTER TABLE "Product" ALTER COLUMN "image" TYPE TEXT;
-- ALTER TABLE "Product" ALTER COLUMN "nutritional" TYPE TEXT;

-- But these changes should have no effect as they're already TEXT type by default
