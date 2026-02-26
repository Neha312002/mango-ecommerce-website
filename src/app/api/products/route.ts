import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify admin access
function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        featured: 'desc',
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Create product (Admin only)
export async function POST(request: NextRequest) {
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
    const { 
      name, 
      description, 
      price, 
      image, 
      stock, 
      weight, 
      origin, 
      season, 
      details, 
      nutritional, 
      featured 
    } = body;

    // Validation
    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields (name, description, price)' },
        { status: 400 }
      );
    }

    // Create product with all fields
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || '/images/placeholder.jpg',
        stock: stock !== undefined ? parseInt(stock) : 100,
        weight: weight || '1 kg',
        origin: origin || 'Local Farm',
        season: season || 'All Year',
        details: details || description,
        nutritional: nutritional || 'Rich in vitamins and minerals',
        featured: featured || false,
      },
    });

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}
