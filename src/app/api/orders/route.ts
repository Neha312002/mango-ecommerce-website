import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Create order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      shipping,
      subtotal,
      shippingCost,
      tax,
      total,
    } = body;

    console.log('Creating order with data:', { userId, items, shipping, subtotal, shippingCost, tax, total });

    // Validation
    if (!userId || !items || items.length === 0 || !shipping) {
      console.error('Validation failed:', { userId, itemsLength: items?.length, shipping });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify all products exist
    const productIds = items.map((item: any) => item.productId);
    const existingProducts = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
      },
    });

    const existingProductIds = existingProducts.map((p: { id: number }) => p.id);
    const missingProducts = productIds.filter((id: number) => !existingProductIds.includes(id));
    
    if (missingProducts.length > 0) {
      console.error('Products not found in database:', missingProducts);
      return NextResponse.json(
        { error: `Products not found: ${missingProducts.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = 'MF' + Date.now().toString();

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        fullName: shipping.fullName,
        email: shipping.email,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        zipCode: shipping.zipCode,
        country: shipping.country,
        subtotal,
        shipping: shippingCost,
        tax,
        total,
        status: 'processing',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create order error:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}

// Get orders for a user
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

    const orders = await prisma.order.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
