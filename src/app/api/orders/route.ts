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
      paymentMethod = 'razorpay',
      paymentScreenshot,
      status,
    } = body;

    // Normalize userId to a number (Prisma expects Int)
    const userIdInt = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    console.log('Creating order with data:', { userId: userIdInt, items, shipping, subtotal, shippingCost, tax, total, paymentMethod, status });

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

    // Determine order status based on payment method
    const orderStatus = status || (paymentMethod === 'upi' ? 'pending_payment' : 'processing');

    // Create order with items
    const order: any = await (prisma.order.create as any)({
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
        status: orderStatus,
        paymentMethod,
        paymentScreenshot,
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
    console.log('🔍 Email check - shipping.email:', shipping.email);
    console.log('🔍 Email check - GMAIL_USER exists:', !!process.env.GMAIL_USER);
    console.log('🔍 Email check - GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD);
    console.log('🔍 Email check - ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
    
    if (shipping.email && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      console.log('✅ Starting email sending process...');
      // Dynamic import to avoid build-time initialization
      import('@/lib/email')
        .then(async ({ sendOrderConfirmationEmail, sendAdminOrderNotification }) => {
          console.log('📧 Email module loaded successfully');
          
          // Send customer confirmation
          try {
            console.log('📨 Sending customer confirmation to:', shipping.email);
            const customerResult = await sendOrderConfirmationEmail(
              shipping.email,
              {
                orderNumber,
                customerName: shipping.fullName,
                items: order.items.map((item: any) => ({
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
            console.log('✅ Customer email result:', customerResult);
          } catch (error) {
            console.error('❌ Failed to send customer confirmation email:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
          }

          // Send admin notification
          if (process.env.ADMIN_EMAIL) {
            try {
              console.log('📨 Sending admin notification to:', process.env.ADMIN_EMAIL);
              const adminResult = await sendAdminOrderNotification({
                orderNumber,
                customerName: shipping.fullName,
                customerEmail: shipping.email,
                items: order.items.map((item: any) => ({
                  name: item.product.name,
                  quantity: item.quantity,
                  price: item.price,
                })),
                total,
                shippingAddress: {
                  fullName: shipping.fullName,
                  address: shipping.address,
                  city: shipping.city,
                  state: shipping.state,
                  zipCode: shipping.zipCode,
                  country: shipping.country,
                },
              });
              console.log('✅ Admin email result:', adminResult);
            } catch (error) {
              console.error('❌ Failed to send admin notification email:', error);
              console.error('Error details:', JSON.stringify(error, null, 2));
            }
          } else {
            console.warn('⚠️ ADMIN_EMAIL not configured, skipping admin notification');
          }
        })
        .catch((error) => {
          console.error('❌ Failed to load email module:', error);
          console.error('Module error details:', JSON.stringify(error, null, 2));
        });
    } else {
      console.warn('⚠️ Email sending skipped - Missing shipping.email or RESEND_API_KEY');
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
        console.error('Unauthorized access to all orders. User:', user);
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required to view all orders' },
          { status: 401 }
        );
      }
      
      console.log('Admin verified successfully, fetching all orders...');
    }

    console.log('Querying orders with whereClause:', whereClause);

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
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

    console.log(`Successfully fetched ${orders.length} orders`);
    
    // Transform to ensure all fields are present
    const transformedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: item.product || { id: 0, name: 'Deleted Product', price: 0, image: '/images/placeholder.jpg' },
      })),
    }));

    return NextResponse.json(transformedOrders, { status: 200 });
  } catch (error: any) {
    console.error('Get orders error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message, code: error.code },
      { status: 500 }
    );
  }
}
