import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get user's addresses
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

    const addresses = await prisma.address.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ addresses }, { status: 200 });
  } catch (error: any) {
    console.error('Get addresses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

// Create new address
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, fullName, phone, address, city, state, zipCode, country, isDefault } = body;

    if (!userId || !fullName || !phone || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'All address fields are required' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: parseInt(userId),
        },
        data: {
          isDefault: false,
        },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: parseInt(userId),
        fullName,
        phone,
        address,
        city,
        state,
        zipCode,
        country: country || 'USA',
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(
      { message: 'Address created successfully', address: newAddress },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create address error:', error);
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    );
  }
}

// Update address
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, fullName, phone, address, city, state, zipCode, country, isDefault } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: parseInt(userId),
          id: {
            not: parseInt(id),
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: {
        id: parseInt(id),
      },
      data: {
        fullName,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        isDefault,
      },
    });

    return NextResponse.json(
      { message: 'Address updated successfully', address: updatedAddress },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update address error:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// Delete address
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      );
    }

    await prisma.address.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(
      { message: 'Address deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete address error:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
