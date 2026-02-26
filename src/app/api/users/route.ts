import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify admin access
function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  console.log('Auth header present:', !!authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No valid auth header');
    return null;
  }

  try {
    const token = authHeader.substring(7);
    console.log('Token length:', token.length);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('Decoded token:', { userId: decoded.userId, email: decoded.email, role: decoded.role });
    return decoded;
  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

// GET all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin
    const user = verifyAdmin(request);
    console.log('GET /api/users - User verification result:', user);
    
    if (!user || user.role !== 'admin') {
      console.error('Admin verification failed. User:', user);
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    console.log('Admin verified successfully, fetching all users...');

    // Get all users with their order counts
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlist: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Fetched ${users.length} users`);

    // Transform data to include counts
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      joinedDate: user.createdAt.toISOString(),
      ordersCount: user._count.orders,
      reviewsCount: user._count.reviews,
      wishlistCount: user._count.wishlist,
    }));

    return NextResponse.json(transformedUsers, { status: 200 });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}

// Update user role (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    // Verify admin
    const user = verifyAdmin(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'userId and role are required' },
        { status: 400 }
      );
    }

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "user" or "admin"' },
        { status: 400 }
      );
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    console.log(`User ${updatedUser.email} role updated to ${role}`);

    return NextResponse.json({
      message: 'User role updated successfully',
      user: updatedUser
    }, { status: 200 });

  } catch (error: any) {
    console.error('Update user role error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update user role', details: error.message },
      { status: 500 }
    );
  }
}
