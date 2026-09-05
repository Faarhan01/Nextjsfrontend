import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const displayName = name || cleanEmail.split('@')[0] || 'Customer';

    const user = {
      id: `usr_${Date.now()}`,
      name: displayName,
      email: cleanEmail,
      role: 'customer',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
    };

    const token = `mrbulk_jwt_${Buffer.from(cleanEmail).toString('base64')}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      user,
      token,
      message: 'Account created successfully',
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Registration request failed' }, { status: 500 });
  }
}
