import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const wishlist = await prisma.wishlistItem.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ wishlist }, { status: 200 });
  } catch (error: any) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Item already in wishlist' },
        { status: 200 }
      );
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: parseInt(userId),
        productId: parseInt(productId),
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(
      { message: 'Added to wishlist', item: wishlistItem },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
      },
    });

    return NextResponse.json(
      { message: 'Removed from wishlist' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
