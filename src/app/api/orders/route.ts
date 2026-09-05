import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderNumber = `LX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      ...body,
      id: orderNumber,
      orderNumber,
      trackingNumber: `TRK-ZA-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Order created successfully',
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to place order' }, { status: 400 });
  }
}
