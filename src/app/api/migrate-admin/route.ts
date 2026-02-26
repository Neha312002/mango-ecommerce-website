import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ONE-TIME MIGRATION ENDPOINT
// This adds the role column and sets a user as admin
// DELETE THIS FILE AFTER RUNNING ONCE!

export async function POST(req: NextRequest) {
  try {
    const { email, secret } = await req.json();

    // Simple protection - set this in your environment
    if (secret !== process.env.MIGRATION_SECRET && secret !== 'migrate123') {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Step 1: Add role column using raw SQL
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'user'
    `;

    console.log('✅ Role column added');

    // Step 2: Create index
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role")
    `;

    console.log('✅ Index created');

    // Step 3: Set the specified user as admin
    await prisma.$executeRaw`
      UPDATE "User" 
      SET "role" = 'admin' 
      WHERE "email" = ${email}
    `;

    console.log('✅ User promoted to admin');

    // Step 4: Verify the user
    const user = await prisma.$queryRaw`
      SELECT id, name, email, role 
      FROM "User" 
      WHERE "email" = ${email}
    ` as any[];

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found. Please sign up first!' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '🎉 Migration completed successfully!',
      user: user[0],
      instructions: 'Now login with this account and go to /admin',
    });

  } catch (error: any) {
    console.error('Migration error:', error);
    
    return NextResponse.json(
      { 
        error: 'Migration failed', 
        details: error.message,
        hint: 'The column might already exist, or user not found'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Migration Endpoint',
    instructions: [
      '1. Make sure you have a user account (sign up first)',
      '2. Send POST request with: { "email": "your-email@example.com", "secret": "migrate123" }',
      '3. This will add role column and make you admin',
      '4. DELETE THIS FILE after running once!',
    ],
  });
}
