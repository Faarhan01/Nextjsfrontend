import { NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/data/presets';

export async function GET() {
  return NextResponse.json({
    success: true,
    stats: {
      totalProducts: MOCK_PRODUCTS.length,
      activeOrders: 142,
      totalRevenue: 284500.0,
      currency: 'ZAR',
      satisfactionRate: '99.2%',
    },
  });
}
