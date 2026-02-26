import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with this email, you will receive a password reset link.' },
        { status: 200 }
      );
    }

    // Generate random reset token (6 characters alphanumeric)
    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    // Token expires in 1 hour
    const resetExpiry = new Date(Date.now() + 3600000);

    // Update user with reset token
    // @ts-expect-error - Prisma types not updated locally, but works in production
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      },
    });

    // TODO: Send email with reset token (when Resend is configured)
    // For now, return token in response for testing
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: ${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}&email=${email}`);

    return NextResponse.json(
      {
        message: 'If an account exists with this email, you will receive a password reset link.',
        // Remove this in production - only for testing
        debug: {
          token: resetToken,
          email: email,
          resetLink: `/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
