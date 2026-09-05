import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const name = cleanEmail.split('@')[0] || 'Customer';

    const user = {
      id: `usr_${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: cleanEmail,
      role: cleanEmail.includes('admin') ? 'admin' : 'customer',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
    };

    const token = `mrbulk_jwt_${Buffer.from(cleanEmail).toString('base64')}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      user,
      token,
      message: 'Login successful',
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Login request failed' }, { status: 500 });
  }
}
