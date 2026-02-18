import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Use Prisma's internal migration by checking tables
    // If this runs without error, tables exist or will be created
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
      "id" SERIAL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "phone" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;

    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Product" (
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
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
    
    // Add updatedAt column if it doesn't exist
    await prisma.$executeRaw`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='Product' AND column_name='updatedAt') THEN
          ALTER TABLE "Product" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
        END IF;
      END $$;
    `;

    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Order" (
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
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;

    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "OrderItem" (
      "id" SERIAL PRIMARY KEY,
      "orderId" INTEGER NOT NULL,
      "productId" INTEGER NOT NULL,
      "quantity" INTEGER NOT NULL,
      "price" DOUBLE PRECISION NOT NULL
    )`;

    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Review" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL,
      "productId" INTEGER NOT NULL,
      "rating" INTEGER NOT NULL,
      "comment" TEXT NOT NULL,
      "orderNumber" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;

    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "WishlistItem" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL,
      "productId" INTEGER NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;

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
