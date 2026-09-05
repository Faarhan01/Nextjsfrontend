import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || 'customer@mrbulk.co.za';

  const userOrders = [
    {
      id: 'LX-9402',
      orderNumber: 'LX-9402',
      date: '24 May 2026',
      status: 'In Transit',
      total: 4630.00,
      currency: 'ZAR',
      itemsCount: 3,
      trackingNumber: 'TRK-ZA-8829104',
      email,
    },
    {
      id: 'LX-9401',
      orderNumber: 'LX-9401',
      date: '20 May 2026',
      status: 'Delivered',
      total: 2890.00,
      currency: 'ZAR',
      itemsCount: 1,
      trackingNumber: 'TRK-ZA-7718290',
      email,
    },
  ];

  return NextResponse.json({
    success: true,
    count: userOrders.length,
    orders: userOrders,
  });
}
