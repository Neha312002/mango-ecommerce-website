import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        valid: false,
        error: 'No authorization header or invalid format',
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      return NextResponse.json({
        valid: true,
        decoded: {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          hasRole: !!decoded.role,
          isAdmin: decoded.role === 'admin',
        },
      });
    } catch (error: any) {
      return NextResponse.json({
        valid: false,
        error: 'Token verification failed',
        details: error.message,
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      valid: false,
      error: 'Unexpected error',
      details: error.message,
    });
  }
}
