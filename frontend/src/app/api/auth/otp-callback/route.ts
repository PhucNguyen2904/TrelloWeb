import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for secure token handling
 * This route receives the JWT token from the frontend and sets it as an httpOnly cookie
 * 
 * Usage:
 * POST /api/auth/otp-callback
 * Body: { token: string, expires_in: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, expires_in } = body;

    if (!token || !expires_in) {
      return NextResponse.json(
        { error: 'Token and expires_in are required' },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      { success: true, message: 'Token set successfully' },
      { status: 200 }
    );

    // Set httpOnly cookie with secure flags
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'lax',
      maxAge: expires_in, // Cookie expires in the same time as the token
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in OTP callback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
