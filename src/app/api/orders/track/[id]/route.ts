import { NextRequest, NextResponse } from 'next/server';

const MOCK_ORDER_DATABASE: Record<string, any> = {
  'LX-9402': {
    orderNumber: 'LX-9402',
    date: '24 May 2026',
    status: 'In Transit',
    trackingNumber: 'TRK-ZA-8829104',
    carrier: 'Courier Guy Express South Africa',
    estimatedDelivery: '27 May 2026 (by 16:00)',
    currentLocation: 'Johannesburg Central Distribution Hub (Gauteng)',
    deliveryAddress: '14 Sandton Dr, Sandhurst, Sandton, 2196, South Africa',
    customerName: 'Sipho Ndlovu',
    items: [
      { name: 'Aurora Pure Linen Sheet Set (King)', quantity: 1, price: 'R 3,450.00' },
      { name: 'Minimalist Matte Ceramic Planter Duo', quantity: 2, price: 'R 1,180.00' },
    ],
  },
  'LX-9401': {
    orderNumber: 'LX-9401',
    date: '20 May 2026',
    status: 'Delivered',
    trackingNumber: 'TRK-ZA-7718290',
    carrier: 'Fastway Couriers SA',
    estimatedDelivery: '22 May 2026',
    currentLocation: 'Delivered — Left with Reception',
    deliveryAddress: '45 Kloof St, Gardens, Cape Town, 8001, South Africa',
    customerName: 'Elena Rostova',
    items: [
      { name: 'Monolith Solid Brass Table Lamp', quantity: 1, price: 'R 2,890.00' },
    ],
  },
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cleanId = decodeURIComponent(id).trim().toUpperCase();

  const found = MOCK_ORDER_DATABASE[cleanId] || {
    orderNumber: cleanId,
    date: 'Recent',
    status: 'Order Confirmed',
    trackingNumber: `TRK-ZA-${Math.floor(100000 + Math.random() * 900000)}`,
    carrier: 'The Courier Guy Express South Africa',
    estimatedDelivery: 'Estimated 2–4 business days',
    currentLocation: 'Johannesburg Fulfillment Centre',
    deliveryAddress: 'Direct Address on File, South Africa',
    customerName: 'Verified Mrbulk Shopper',
    items: [
      { name: 'Mrbulk Catalog Order Item', quantity: 1, price: 'Confirmed' },
    ],
  };

  return NextResponse.json({
    success: true,
    order: found,
  });
}
