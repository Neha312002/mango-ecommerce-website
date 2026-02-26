-- Add role column to User table with default value 'user'
-- This migration adds role-based access control

-- Add the role column
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'user';

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");

-- Optional: If you want to make an existing user an admin, uncomment and modify:
-- UPDATE "User" SET "role" = 'admin' WHERE "email" = 'your-admin-email@example.com';
