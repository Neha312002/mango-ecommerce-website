import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Create all tables by executing raw SQL based on the Prisma schema
    await prisma.$executeRawUnsafe(`
      -- Create User table
      CREATE TABLE IF NOT EXISTS "User" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "phone" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- Create Product table
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "description" TEXT NOT NULL,
        "details" TEXT NOT NULL,
        "image" TEXT NOT NULL,
        "weight" TEXT NOT NULL,
        "origin" TEXT NOT NULL,
        "season" TEXT NOT NULL,
        "nutritional" TEXT NOT NULL,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- Create Order table
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" SERIAL PRIMARY KEY,
        "orderNumber" TEXT NOT NULL UNIQUE,
        "userId" INTEGER NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'processing',
        "shippingFullName" TEXT NOT NULL,
        "shippingEmail" TEXT NOT NULL,
        "shippingPhone" TEXT NOT NULL,
        "shippingAddress" TEXT NOT NULL,
        "shippingCity" TEXT NOT NULL,
        "shippingState" TEXT NOT NULL,
        "shippingZipCode" TEXT NOT NULL,
        "shippingCountry" TEXT NOT NULL,
        "subtotal" DOUBLE PRECISION NOT NULL,
        "shipping" DOUBLE PRECISION NOT NULL,
        "tax" DOUBLE PRECISION NOT NULL,
        "total" DOUBLE PRECISION NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );

      -- Create OrderItem table
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        "id" SERIAL PRIMARY KEY,
        "orderId" INTEGER NOT NULL,
        "productId" INTEGER NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );

      -- Create Review table
      CREATE TABLE IF NOT EXISTS "Review" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "productId" INTEGER NOT NULL,
        "rating" INTEGER NOT NULL,
        "comment" TEXT NOT NULL,
        "orderNumber" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );

      -- Create WishlistItem table
      CREATE TABLE IF NOT EXISTS "WishlistItem" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "productId" INTEGER NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");
      CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
      CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "OrderItem"("productId");
      CREATE INDEX IF NOT EXISTS "Review_productId_idx" ON "Review"("productId");
      CREATE INDEX IF NOT EXISTS "Review_userId_idx" ON "Review"("userId");
      CREATE INDEX IF NOT EXISTS "WishlistItem_userId_idx" ON "WishlistItem"("userId");
      CREATE INDEX IF NOT EXISTS "WishlistItem_productId_idx" ON "WishlistItem"("productId");

      -- Create unique constraints
      CREATE UNIQUE INDEX IF NOT EXISTS "WishlistItem_userId_productId_key" ON "WishlistItem"("userId", "productId");
    `);

    return NextResponse.json(
      { message: 'Database tables created successfully!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
