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
      paymentId,
    } = body;

    // Normalize userId to a number (Prisma expects Int)
    const userIdInt = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    console.log('Creating order with data:', { userId: userIdInt, items, shipping, subtotal, shippingCost, tax, total });

    // Validation
    if (!userIdInt || !items || items.length === 0 || !shipping) {
      console.error('Validation failed:', { userId: userIdInt, itemsLength: items?.length, shipping });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Normalize item productIds to numbers for safety
    const normalizedItems = items.map((item: any) => ({
      productId: typeof item.productId === 'string' ? parseInt(item.productId, 10) : item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    // Generate order number
    const orderNumber = 'MF' + Date.now().toString();

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userIdInt,
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
          create: normalizedItems,
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

    // Send order confirmation email (don't block response if email fails)
    if (shipping.email && process.env.RESEND_API_KEY) {
      // Dynamic import to avoid build-time initialization
      import('@/lib/email')
        .then(({ sendOrderConfirmationEmail }) => {
          return sendOrderConfirmationEmail(
            shipping.email,
            {
              orderNumber,
              customerName: shipping.fullName,
              items: order.items.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
              })),
              subtotal,
              shipping: shippingCost,
              tax,
              total,
              shippingAddress: {
                fullName: shipping.fullName,
                address: shipping.address,
                city: shipping.city,
                state: shipping.state,
                zipCode: shipping.zipCode,
                country: shipping.country,
              },
            }
          );
        })
        .catch((error) => {
          console.error('Failed to send order confirmation email:', error);
          // Don't throw - email failure shouldn't fail the order
        });
    }

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

// Get orders (all orders for admin, or specific user's orders)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // If userId is provided, get orders for that user (normal user request)
    // If not provided, verify admin and return all orders
    let whereClause = {};
    
    if (userId) {
      whereClause = { userId: parseInt(userId) };
    } else {
      // No userId means admin is requesting all orders - verify admin
      const user = verifyAdmin(request);
      console.log('GET /api/orders - Admin verification:', user);
      
      if (!user || user.role !== 'admin') {
        console.error('Unauthorized access to all orders');
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required to view all orders' },
          { status: 401 }
        );
      }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Returning ${orders.length} orders`);
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}
