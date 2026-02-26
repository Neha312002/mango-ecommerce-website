import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint sets a user as admin
// SECURITY: In production, protect this with a master admin token or only allow first user
export async function POST(req: NextRequest) {
  try {
    const { email, masterPassword } = await req.json();

    // IMPORTANT: Set a secure master password in environment variables
    const MASTER_ADMIN_PASSWORD = process.env.MASTER_ADMIN_PASSWORD || 'changeme123';
    
    if (masterPassword !== MASTER_ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid master password' },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Update user role to admin
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: 'User promoted to admin successfully',
      user,
    });
  } catch (error: any) {
    console.error('Error promoting user to admin:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to promote user to admin' },
      { status: 500 }
    );
  }
}
